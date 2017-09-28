import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { OrderService } from '../../services/order-service';
import { ModalOrderPage } from "../modal-order/modal-order";
import { RestaurantService } from "../../services/restaurant-service";

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  orders: any;
  restaurantId: any;

  constructor(public nav: NavController, public orderService: OrderService, public modalCtrl: ModalController,
              public restaurantService: RestaurantService) {
    this.restaurantId = restaurantService.getId();
    // get data from firebase
    this.orders = orderService.getAll();
  }

  // show order modal
  viewOrder(order) {
    let modal = this.modalCtrl.create(ModalOrderPage, {order: order});
    modal.present();
  }
}
