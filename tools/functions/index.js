'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const STATUS_PENDING = 'pending';
const STATUS_COMPLETE = 'complete';

// init app
admin.initializeApp(functions.config().firebase);

// listen for new order created then calculate order value
exports.calculateOrder = functions.database.ref('/orders/{userId}/{orderId}').onWrite(function (event) {
  // Exit when the data is deleted.
  if (!event.data.exists()) {
    return;
  }

  // Grab the current value of what was written to the Realtime Database
  const original = event.data.val();

  // if order is created
  if (!event.data.previous.exists()) {

    // log record detail
    console.log('Received order', event.params.userId, event.params.orderId, original);

    // set status to pending
    event.data.ref.child('status').set(STATUS_PENDING);

    // set order number
    admin.database().ref('settings/last_order_number').once('value').then(function (snapshot) {
      let val = snapshot.val() ? snapshot.val() : 2017000;
      event.data.ref.child('number').set(val + 1);
      admin.database().ref('settings/last_order_number').set(val + 1);
    });

    // set user
    admin.auth().getUser(event.params.userId).then(function (snapshot) {
      event.data.ref.child('user').set({
        email: snapshot.email,
        name: snapshot.displayName
      });
    });

    // set created_at
    event.data.ref.child('created_at').set(Date.now());

    // set update_at
    event.data.ref.child('updated_at').set(Date.now());

    // calculate order data
    var item;
    var total = 0,
      subtotal = 0;

    // apply tax to items
    admin.database().ref('/taxes').once('value').then(function (snapshot) {
      var taxes = snapshot.val();

      Object.keys(original.restaurants).forEach(function (restId) {
        var rest = original.restaurants[restId];
        var restSubtotal = 0;

        for (var i = 0; i < rest.items.length; i++) {
          item = rest.items[i];
          item.taxes = [];
          // subtotal = size.price + sum(option.price)

          subtotal = parseFloat(item.size ? item.size.price : item.price);
          if (item.options) {
            for (let j = 0; j < item.options.length; j++) {
              if (item.options[j].checked) {
                subtotal += parseFloat(item.options[j].price);
              }
            }
          }

          // total = SUM (subtotal * quantity + tax)
          restSubtotal += subtotal * item.quantity;

          if (taxes[restId]) {
            // tax = tax_rate * quantity * subtotal / 100
            Object.keys(taxes[restId]).forEach(function (taxId) {
              var tax = taxes[restId][taxId];
              if (tax.enable && tax.apply_items && (tax.apply_items.indexOf(item.item_id) > -1)) {
                console.log('Tax ok', item.name);
                var itemTax = tax.rate * subtotal * item.quantity / 100;
                restSubtotal += itemTax;

                item.taxes.push({
                  name: tax.name,
                  rate: tax.rate,
                  value: itemTax
                });
              }
            });
          }

          // write subtotal to firebase
          event.data.ref.child('restaurants/' + restId + '/items/' + i + '/subtotal').set(subtotal);
          if (item.taxes) {
            event.data.ref.child('restaurants/' + restId + '/items/' + i + '/taxes').set(item.taxes);
          }
        }

        // update total
        total += restSubtotal;

        // default status is pending
        event.data.ref.child('restaurants/' + restId + '/status').set(STATUS_PENDING);
        event.data.ref.child('restaurants/' + restId + '/subtotal').set(restSubtotal.toFixed(2));
        admin.database().ref('reports/' + restId + '/order/pending').once('value').then(function (snapshot) {
          let val = snapshot.val() ? snapshot.val() : 0;
          admin.database().ref('reports/' + restId + '/order/pending').set(parseInt(val) + 1);
        });

        // notify to admin
        admin.database().ref('notifications/' + restId).push({
          object_type: 'order'
        });
      });

      // write total to firebase
      // should convert total to float
      event.data.ref.child('total').set(total.toFixed(2) / 1);
    });

  }
});

// listen for order updated and build report
exports.buildOrderReport = functions.database.ref('/orders/{userId}/{orderId}/restaurants/{restaurantId}').onWrite(function (event) {
  // Exit when the data is deleted.
  if (!event.data.exists()) {
    return;
  }

  // Grab the current value of what was written to the Realtime Database
  const original = event.data.val();

  // if order is created
  if (!event.data.previous.exists()) {
    return;
  }

  // send notification if order changed value
  var statusSnapshot = event.data.child('status');
  if (statusSnapshot.changed() && (statusSnapshot.val() != STATUS_PENDING)) {
    // notify to user
    admin.database().ref('notifications/' + event.params.userId).push({
      object_type: 'order',
      order_id: event.params.orderId
    });
  }

  // update report by order status
  if (statusSnapshot.changed()) {
    var oldStatus = statusSnapshot.previous.val();
    var total = parseFloat(original.subtotal);
    var reportPath = 'reports/' + event.params.restaurantId + '/order/';
    var salePath = 'reports/' + event.params.restaurantId + '/sale/';

    console.log(oldStatus, statusSnapshot.val());

    // minus previous status
    if (statusSnapshot.previous.exists()) {
      admin.database().ref(reportPath + oldStatus).once('value').then(function (snapshot) {
        if (snapshot.val() > 0) {
          admin.database().ref(reportPath + oldStatus).set(snapshot.val() - 1);
        }
      });
    }

    // plus new status
    admin.database().ref(reportPath + statusSnapshot.val()).once('value').then(function (snapshot) {
      console.log('status');
      console.log(snapshot.val());
      admin.database().ref(reportPath + statusSnapshot.val()).set(snapshot.val() + 1);
    });

    // if order is complete, calculate order data
    if (statusSnapshot.val() == STATUS_COMPLETE) {
      var date = new Date();

      // total sale
      admin.database().ref(salePath + '/total').once('value').then(function (snapshot) {
        var snapshotVal = snapshot.val() ? parseFloat(snapshot.val()) : 0;
        admin.database().ref(salePath + 'total').set(parseFloat(snapshotVal) + total);
      });

      // by year
      var yearPath = salePath + '/' + date.getFullYear();
      admin.database().ref(yearPath + '/total').once('value').then(function (snapshot) {
        var snapshotVal = snapshot.val() ? parseFloat(snapshot.val()) : 0;
        admin.database().ref(yearPath + '/total').set(parseFloat(snapshotVal) + total);
      });

      // by month
      var monthPath = yearPath + '/' + (date.getMonth() + 1);
      admin.database().ref(monthPath + '/total').once('value').then(function (snapshot) {
        console.log(snapshot.val(), total);
        var snapshotVal = snapshot.val() ? parseFloat(snapshot.val()) : 0;
        admin.database().ref(monthPath + '/total').set(parseFloat(snapshotVal) + total);
      });

      // by date
      var datePath = monthPath + '/' + date.getDate();
      admin.database().ref(datePath + '/total').once('value').then(function (snapshot) {
        var snapshotVal = snapshot.val() ? parseFloat(snapshot.val()) : 0;
        admin.database().ref(datePath + '/total').set(parseFloat(snapshotVal) + total);
      });

      // report by items
      original.items.forEach(function (item) {
        // by items
        admin.database().ref(salePath + '/items/' + item.item_id).push(item.quantity);

        // by cateogories
        admin.database().ref('items/' + event.params.restaurantId + '/' + item.item_id + '/category_id').once('value').then(function (catId) {
          admin.database().ref(salePath + '/categories/' + catId.val()).push(item.quantity)
        });
      });
    }

    // update parent order status
    admin.database().ref('orders/' + event.params.userId + '/' + event.params.orderId).once('value').then(function (snapshot) {
      let status = '';
      let isSame = true;
      let rest;

      Object.keys(snapshot.val().restaurants).forEach(function (restId) {
        rest = snapshot.val().restaurants[restId];
        if (status) {
          isSame = rest.status == status;
        } else {
          status = rest.status;
        }
      });

      // if all child orders has same status and parent has difference status
      if (isSame && (snapshot.val().status != status)) {
        admin.database().ref('orders/' + event.params.userId + '/' + event.params.orderId + '/status').set(status);
      }
    });
  }
});

// add/remove item ID to at /taxes/taxId/apply_items
exports.appyItemTaxSetting = functions.database.ref('/items/{restId}/{itemId}').onWrite(function (event) {
  // Exit when the data is deleted.
  if (!event.data.exists()) {
    return;
  }

  // Grab the current value of what was written to the Realtime Database
  const original = event.data.val();
  const itemId = event.params.itemId;

  if (original.taxes) {

    Object.keys(original.taxes).forEach(function (taxId) {
      var taxPath = '/taxes/' + event.params.restId + '/' + taxId + '/apply_items';

      admin.database().ref(taxPath).once('value').then(function (snapshot) {
        var items = snapshot.val();
        // if list of apply_items is not empty
        if (items) {
          // find itemId in array of apply_items
          var index = items.indexOf(itemId)
          // if this item enables this tax
          if (original.taxes[taxId]) {
            // push itemId to apply_items if not in array
            if (index == -1) {
              items.push(itemId);
            }
          } else { // disable this tax
            if (index != -1) {
              items.splice(index, 1);
            }
          }
        } else {
          // if this item enables this tax
          if (original.taxes[taxId]) {
            items = [itemId];
          }
        }

        admin.database().ref(taxPath).set(items);
      });
    });
  }
});
