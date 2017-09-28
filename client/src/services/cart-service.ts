import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import { TaxService } from "./tax-service";

@Injectable()
export class CartService {
  cart = {
    restaurants: {},
    total: 0
  };

  constructor(public storage: Storage, public taxService: TaxService) {
  }

  // get cart from storage
  getCart() {
    return this.storage.get('cart');
  }

  // store cart
  setCart() {
    return this.storage.set('cart', this.cart);
  }

  // add a restaurant to cart
  addRestaurant(id, name) {
    if (!this.cart.restaurants[id]) {
      this.cart.restaurants[id] = {
        id: id,
        name: name,
        subtotal: 0,
        items: []
      };
    }

    return this.cart.restaurants[id];
  }

  // add item to card
  addItem(item, restaurant, qty, callback) {
    this.getCart().then(cart => {
      console.log(cart, this.cart);
      if (cart) {
        console.log(cart);
        this.cart = cart;
      }

      let rest = this.addRestaurant(restaurant.$key, restaurant.name);

      // calculate item
      let record = {
        item_id: item.$key,
        name: item.name,
        thumb: item.thumb,
        price: item.price,
        options: [],
        option_names: [],
        taxes: item.taxes ? item.taxes : {},
        size: item.size ? item.sizes[item.size] : null,
        quantity: parseInt(qty),
        subtotal: 0
      };

      record.subtotal = parseFloat(record.size ? record.size.price : record.price);

      if (item.options) {
        for (let i = 0; i < item.options.length; i++) {
          if (item.options[i].checked) {
            record.options.push(item.options[i]);
            record.option_names.push(item.options[i].name);
            record.subtotal += parseFloat(item.options[i].price);
          }
        }
      }

      // if item with the size and options already exist => change the qty only
      let itemIndex = -1;
      for (let i = 0; i < rest.items.length; i++) {
        let item = rest.items[i];
        if ((item.item_id == record.item_id) &&
          (item.size == record.size) &&
          (JSON.stringify(item.options) == JSON.stringify(record.options))) {
          itemIndex = i;
        }
      }

      if (itemIndex == -1) {
        this.cart.restaurants[rest.id].items.push(record);
      } else {
        this.cart.restaurants[rest.id].items[itemIndex].quantity += record.quantity;
        this.cart.restaurants[rest.id].items[itemIndex].subtotal += record.subtotal;
      }

      // update cart total price
      this.calculateTotalPrice();
      this.setCart().then(callback(this.cart));
    });
  }

  // remote item from cart
  removeItem(restId, index) {
    // remote from array
    this.cart.restaurants[restId].items.splice(index, 1);
    // calculate price
    this.calculateTotalPrice();
    this.setCart();

    return this.cart;
  }

  // change item qty
  changeQty(cart) {
    // save to storage
    this.cart = cart;
    this.calculateTotalPrice();
    this.setCart();
  }

  // apply tax to items
  applyTax(cart) {
    this.cart = cart;

    return this.taxService.getAll().take(1).subscribe(taxes => {
      // check each restaurant
      Object.keys(this.cart.restaurants).forEach((key) => {
        // set default tax_objects for each item
        this.cart.restaurants[key].items.map(item => {
          item.tax_objects = [];
        });

        // if this restaurant has taxes
        if (taxes[key]) {
          // check each tax
          Object.keys(taxes[key]).forEach((taxIndex) => {
            let tax = taxes[key][taxIndex];
            // if this tax is enable
            if (tax.enable) {
              // apply tax to each item
              this.cart.restaurants[key].items.map(item => {
                if (tax.apply_items && (tax.apply_items.indexOf(item.item_id) > -1)) {
                  item.tax_objects.push(tax);
                }
              });
            }
          });
        }
      });
    });
  }

  // calculate total price
  calculateTotalPrice() {
    let total = 0;
    let subtotal = 0;
    let itemSubtotal = 0;

    // calculate price
    Object.keys(this.cart.restaurants).forEach((key) => {
      subtotal = 0;
      this.cart.restaurants[key].items.forEach(item => {
        itemSubtotal = item.subtotal * item.quantity;
        subtotal += itemSubtotal;

        if (item.tax_objects) {
          item.tax_objects.forEach(tax => {
            subtotal += itemSubtotal * tax.rate / 100;
          });
        }
      });
      total += subtotal;
      this.cart.restaurants[key].subtotal = parseFloat(subtotal.toFixed(2));
    });

    this.cart.total = parseFloat(total.toFixed(2));

    return this.cart;
  }

  // clear cart
  clearCart() {
    return this.storage.set('cart', this.cart);
  }
}
