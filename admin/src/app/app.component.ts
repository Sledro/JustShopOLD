///<reference path="../pages/login/login.ts"/>
import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// import pages
import { CategoriesPage } from '../pages/categories/categories';
import { OrderPage } from '../pages/order/order';
import { HomePage } from '../pages/home/home';
import { LoginPage } from "../pages/login/login";
import { AuthService } from "../services/auth-service";
import { NotificationService } from "../services/notification-service";
import { TaxesPage } from '../pages/taxes/taxes';
import { AngularFireAuth } from "angularfire2/auth/auth";
import { RestaurantService } from "../services/restaurant-service";
import { SettingPage } from '../pages/setting/setting';
// end import pages

@Component({
  templateUrl: 'app.html',
  queries: {
    nav: new ViewChild('content')
  }
})
export class MyApp {

  public rootPage: any;

  public nav: any;
  public notiSubcriber: any;

  public user = {};

  public pages = [
    {
      title: 'Home',
      icon: 'ios-home-outline',
      count: 0,
      component: HomePage
    },
    {
      title: 'Categories',
      icon: 'ios-home-outline',
      count: 0,
      component: CategoriesPage
    },
    {
      title: 'Order',
      icon: 'ios-home-outline',
      count: 0,
      component: OrderPage
    },
    {
      title: 'Taxes',
      icon: 'ios-home-outline',
      count: 0,
      component: TaxesPage
    },
    {
      title: 'Settings',
      icon: 'ios-home-outline',
      count: 0,
      component: SettingPage
    },
    // import menu
  ];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authService: AuthService,
              public notificationService: NotificationService, public alertCtrl: AlertController,
              public afAuth: AngularFireAuth, public restaurantService: RestaurantService) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // check for login stage, then redirect
      afAuth.authState.subscribe(authData => {
        if (authData) {
          // check user role
          // need to have admin role to continue
          this.authService.getAdmin().take(1).subscribe(admin => {
            if (admin) {
              this.nav.setRoot(HomePage);
              this.restaurantService.setId(admin.restaurantId);
              this.user = admin;
              this.subscribeNotification();
            } else {
              let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: "You don't have permission to access this app",
                buttons: ['OK']
              });
              alert.present();

              this.logout();
            }
          });
        } else {
          if (this.notiSubcriber) {
            this.notiSubcriber.unsubcribe();
          }
          this.nav.setRoot(LoginPage);
        }
      });
    });
  }

  // subscribe for notifications
  subscribeNotification() {
    let isShowing = false;
    // subscribe to notifications
    this.notiSubcriber = this.notificationService.getAll().subscribe(records => {
      if (records.length && !isShowing) {
        isShowing = true;
        // show the last notifications
        let lastRecord = records[records.length - 1];
        if (lastRecord.object_type == 'order') {
          let alert = this.alertCtrl.create({
            title: 'New order',
            subTitle: 'New order has been created.',
            buttons: [
              {
                text: 'View',
                handler: data => {
                  this.nav.setRoot(OrderPage);
                  // remove this notifications
                  this.notificationService.remove(lastRecord.$key);
                  isShowing = false;
                }
              },
              {
                text: 'Close',
                handler: data => {
                  this.notificationService.remove(lastRecord.$key);
                  isShowing = false;
                }
              }
            ]
          });
          alert.present();
        }
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  // logout
  logout() {
    this.authService.logout().then(() => {
      this.user = {};
      this.notiSubcriber.unsubscribe();
      this.nav.setRoot(LoginPage);
    });
  }
}
