import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// import service
import { AuthService } from '../services/auth-service';

// import pages
import { HomePage } from '../pages/home/home';
// import {CategoriesPage} from '../pages/categories/categories';
// import {FavoritePage} from '../pages/favorite/favorite';
import { CartPage } from '../pages/cart/cart';
// import {OfferPage} from '../pages/offer/offer';
import { UserPage } from '../pages/user/user';
import { SettingPage } from '../pages/setting/setting';
import { NewsPage } from '../pages/news/news';
import { AboutPage } from '../pages/about/about';
import { LoginPage } from '../pages/login/login';
import { ChatsPage } from '../pages/chats/chats';
import { OrderService } from "../services/order-service";
import { NotificationService } from "../services/notification-service";
import { OrdersPage } from '../pages/orders/orders';
import { OrderDetailPage } from '../pages/order-detail/order-detail';
import { AngularFireAuth } from "angularfire2/auth/auth";

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

  public user = {};

  public pages = [
    {
      title: 'Home',
      icon: 'ios-home-outline',
      count: 0,
      component: HomePage
    },
    /*
     {
     title: 'Categories',
     icon: 'apps',
     count: 0,
     component: CategoriesPage
     },

     {
     title: 'Favorite',
     icon: 'star-outline',
     count: 0,
     component: FavoritePage
     },
     */
    {
      title: 'My Cart',
      icon: 'ios-cart-outline',
      count: 0,
      component: CartPage
    },
    {
      title: 'Orders',
      icon: 'ios-time-outline',
      count: 0,
      component: OrdersPage
    },
    /*
     {
     title: 'Offer',
     icon: 'ios-pricetag-outline',
     count: 0,
     component: OfferPage
     },
     */
    {
      title: 'Setting',
      icon: 'ios-settings-outline',
      count: 0,
      component: SettingPage
    },

    {
      title: 'News',
      icon: 'ios-paper-outline',
      count: 0,
      component: NewsPage
    },

    {
      title: 'About us',
      icon: 'ios-information-circle-outline',
      count: 0,
      component: AboutPage
    },

    {
      title: 'Supports',
      icon: 'ios-help-circle-outline',
      count: 0,
      component: ChatsPage
    },

    // import menu
  ];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authService: AuthService, public notificationService: NotificationService,
              public alertCtrl: AlertController, public orderService: OrderService, public afAuth: AngularFireAuth) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // check for login stage, then redirect
      afAuth.authState.subscribe(authData => {
        if (authData) {
          this.nav.setRoot(HomePage);

          this.user = authService.getUserData();
        } else {
          this.nav.setRoot(LoginPage);
        }
      });

      // notification subscribe
      afAuth.authState.take(1).subscribe(authData => {
        if (authData) {
          let isShowing = false;

          this.notificationService.getAll().subscribe(records => {
            if (records.length && !isShowing) {
              // show the last notifications
              let lastRecord = records[records.length - 1];
              if (lastRecord.object_type == 'order') {
                let alert = this.alertCtrl.create({
                  title: 'Order updated',
                  subTitle: 'Your order has been updated',
                  buttons: [
                    {
                      text: 'View',
                      handler: data => {
                        // find order object by id
                        this.orderService.getRecord(lastRecord.order_id).take(1).subscribe(data => {
                          this.nav.push(OrderDetailPage, {order: data});
                        });
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
                isShowing = true;
                alert.present();
              }
            }
          });
        }
      });
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  // view my profile
  viewMyProfile() {
    this.nav.setRoot(UserPage);
  }

  // logout
  logout() {
    this.authService.logout().then(() => {
      this.nav.setRoot(LoginPage);
    });
  }
}
