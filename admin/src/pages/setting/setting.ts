import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { RestaurantService } from "../../services/restaurant-service";


/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  restaurant: any = {};

  constructor(public nav: NavController, public restaurantService: RestaurantService, public toastCtrl: ToastController) {
    this.restaurantService.getCurrent().take(1).subscribe(snapshot => {
      this.restaurant = snapshot;
    });
  }

  // save form
  save() {
    this.restaurantService.update(this.restaurant.name, this.restaurant.address);
    let toast = this.toastCtrl.create({
      message: 'Settings have been saved',
      duration: 3000,
      position: 'middle'
    });
    toast.present();
  }
}
