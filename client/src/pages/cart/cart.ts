import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CartService } from '../../services/cart-service';
import { CheckoutPage } from "../checkout/checkout";
import { Storage } from '@ionic/storage';
import { TaxService } from "../../services/tax-service";

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
  // cart data
  cart = {
    restaurants: {},
    total: 0
  };
  // restaurants array
  rests = [];

  constructor(public nav: NavController, public cartService: CartService, public storage: Storage,
              public taxService: TaxService) {
    cartService.getCart().then((data) => {
      if (data) {
        cartService.applyTax(data).add(() => {
          this.cart = cartService.calculateTotalPrice();
          console.log(this.cart);

          // convert restaurants to array
          Object.keys(this.cart.restaurants).forEach(restId => {
            this.rests.push(this.cart.restaurants[restId]);
          });
        })
      }
    });
  }

  // plus quantity
  plusQty(item) {
    item.quantity++;
    this.cartService.changeQty(this.cart);
  }

  // minus quantity
  minusQty(item) {
    if (item.quantity > 1) {
      item.quantity--;
    }
    this.cartService.changeQty(this.cart);
  }

  // remove item from cart
  remove(restId, index) {
    this.cartService.removeItem(restId, index);
  }

  // click buy button
  buy() {
    this.nav.push(CheckoutPage, {cart: this.cart});
  }
}

