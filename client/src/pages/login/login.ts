import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { RegisterPage } from "../register/register";
import { LocationPage } from "../location/location";
import { AuthService } from "../../services/auth-service";


/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  email: any;
  password: any;

  constructor(public nav: NavController, public authService: AuthService, public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
  }

  // go to register page
  register() {
    this.nav.setRoot(RegisterPage);
  }

  // login and go to location page
  login() {
    if (!this.email || !this.password) {
      let alert = this.alertCtrl.create({
        message: 'Please provide email and password',
        buttons: ['OK']
      });
      return alert.present();
    }

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.authService.login(this.email, this.password).then(authData => {
      loading.dismiss();
      this.nav.setRoot(LocationPage);
    }, error => {
      loading.dismiss();
      let alert = this.alertCtrl.create({
        message: error.message,
        buttons: ['OK']
      });
      alert.present();
    });
    //this.nav.setRoot(HomePage);
  }

  // login with facebook
  loginWithFacebook() {
    this.authService.loginWithFacebook();
  }
//
  // login with google
  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
