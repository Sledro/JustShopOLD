import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OrderService } from '../../services/order-service';

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {
  public order: any;

  constructor(public nav: NavController, public orderService: OrderService, public navParams: NavParams) {
    this.order = navParams.get('order');
    this.order.rests = [];
    // convert to array
    Object.keys(this.order.restaurants).forEach(restId => {
      this.order.rests.push(this.order.restaurants[restId]);
    });
  }
}
