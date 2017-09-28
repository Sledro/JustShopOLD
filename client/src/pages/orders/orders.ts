import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OrderService } from '../../services/order-service';
import { OrderDetailPage } from "../order-detail/order-detail";

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {
  public orders: any;

  constructor(public nav: NavController, public orderService: OrderService) {
    // get list orders from firebase
    this.orders = orderService.getAll();
  }

  // view order detail
  viewOrder(order) {
    this.nav.push(OrderDetailPage, {order: order});
  }
}
