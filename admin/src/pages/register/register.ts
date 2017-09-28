import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController } from 'ionic-angular';
import { AuthService } from "../../services/auth-service";
import { HomePage } from "../home/home";
import { LoginPage } from "../login/login";


/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  restaurantName: any;
  email: any;
  password: any;
  confirmPassword: any;

  constructor(public nav: NavController, public authService: AuthService, public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
  }

  // register and go to home page
  register() {
    if (!this.restaurantName || !this.email || !this.password) {
      let alert = this.alertCtrl.create({
        message: 'Please provide restaurant\'s name, email and password',
        buttons: ['OK']
      });
      return alert.present();
    }

    if (this.password != this.confirmPassword) {
      let alert = this.alertCtrl.create({
        message: 'Confirm password does not match',
        buttons: ['OK']
      });
      return alert.present();
    }

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.authService.register(this.email, this.password, this.restaurantName).subscribe(authData => {
      loading.dismiss();
      this.nav.setRoot(HomePage);
    }, error => {
      loading.dismiss();
      let alert = this.alertCtrl.create({
        message: error.message,
        buttons: ['OK']
      });
      alert.present();
    });
  }

  // go to login page
  login() {
    this.nav.setRoot(LoginPage);
  }
}
