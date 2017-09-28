import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { HomePage } from "../home/home";
import { OrderService } from "../../services/order-service";
import { CartService } from "../../services/cart-service";

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html'
})
export class CheckoutPage {
  cart: any;
  isEditing = false;
  address: any;

  constructor(public nav: NavController, public alertController: AlertController, public navParasm: NavParams,
              public orderService: OrderService, public cartService: CartService) {
    this.cart = navParasm.get('cart');
  }

  // edit address
  editAddress() {
    let prompt = this.alertController.create({
      title: 'Address',
      message: "",
      inputs: [
        {
          name: 'address',
          value: ''
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });

    prompt.present();
  }

  // place order button click
  buy() {
    // need to validate the address
    if (!this.address || (this.address.length < 10)) {
      // show alert
      let alert = this.alertController.create({
        title: 'Info',
        subTitle: 'Please enter valid address',
        buttons: ['OK']
      });
      alert.present();
      return false;
    }

    this.orderService.addRecord(this.cart.restaurants, this.address);

    // show alert
    let alert = this.alertController.create({
      title: 'Info',
      subTitle: 'Your order has been sent.',
      buttons: [
        {
          text: 'OK',
          handler: data => {
            // create cart
            // this.cartService.clearCart();
            // back to home page
            this.nav.setRoot(HomePage);
          }
        }
      ]
    });

    alert.present();
  }

  // enable editing info
  enableEditing() {
    this.isEditing = true;
  }
}
