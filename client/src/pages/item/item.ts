import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { ItemService } from '../../services/item-service';
import { CartPage } from "../cart/cart";
import { CartService } from "../../services/cart-service";

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-item',
  templateUrl: 'item.html'
})
export class ItemPage {
  // item object
  item: any;
  restaurant: any;

  constructor(public nav: NavController, public itemService: ItemService, public alertController: AlertController,
              public navParams: NavParams, public cartService: CartService) {
    this.item = navParams.get('item');
    this.restaurant = navParams.get('restaurant');
  }

  // toggle favorite
  toggleFav(item) {
    item.faved = !item.faved;
  }

  // add item to cart
  addCart() {
    let prompt = this.alertController.create({
      title: 'Quantity',
      message: "",
      inputs: [
        {
          name: 'quantity',
          value: '1'
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
            // add item to cart
            this.cartService.addItem(this.item, this.restaurant, data.quantity, (cart) => {
              // then alert to user
              let alert = this.alertController.create({
                title: 'Info',
                message: 'Item added to cart',
                buttons: [
                  {
                    text: 'Cart',
                    handler: data => {
                      this.nav.push(CartPage);
                    }
                  },
                  {
                    text: 'Close'
                  }
                ]
              });

              alert.present();
            });
          }
        }
      ]
    });

    prompt.present();
  }
}
