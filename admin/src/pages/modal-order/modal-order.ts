import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, AlertController } from 'ionic-angular';
import { OrderService } from "../../services/order-service";
import { RestaurantService } from "../../services/restaurant-service";


/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modal-order',
  templateUrl: 'modal-order.html',
})
export class ModalOrderPage {
  originOrder: any;
  order: any;

  constructor(public nav: NavController, public viewCtrl: ViewController, public navParams: NavParams,
              public orderService: OrderService, public alertCtrl: AlertController,
              public restaurantService: RestaurantService) {
    const restaurantId = restaurantService.getId();
    let order = navParams.get('order');
    this.originOrder = order;
    this.order = order.restaurants[restaurantId];
  }

  // dismiss modal
  dismiss() {
    this.viewCtrl.dismiss();
  }

  // change status to serving
  serve() {
    this.orderService.updateStatus(this.originOrder, 'serving');
    this.dismiss();
  }

  // change status to complete
  complete() {
    this.orderService.updateStatus(this.originOrder, 'complete');
    this.dismiss();
  }

  // cancel order
  cancel() {
    let alert = this.alertCtrl.create({
      message: 'Are you sure to cancel this order?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.orderService.updateStatus(this.originOrder, 'cancelled');
            this.dismiss();
          }
        }
      ]
    });
    alert.present();
  }
}
