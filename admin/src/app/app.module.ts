import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

// Import chart module
import { ChartsModule } from 'ng2-charts';

// import services
import { CategoryService } from '../services/category-service';
import { ItemService } from '../services/item-service';
import { UserService } from '../services/user-service';
import { OrderService } from '../services/order-service';
import { ReportService } from '../services/report-service';
import { TaxService } from '../services/tax-service';
import { RestaurantService } from '../services/restaurant-service';
// end import services

// import pages
import { ItemsPage } from '../pages/items/items';
import { ItemDetailPage } from '../pages/item-detail/item-detail';
import { CategoriesPage } from '../pages/categories/categories';
import { OrderPage } from '../pages/order/order';
import { HomePage } from '../pages/home/home';
import { CategoryDetailPage } from '../pages/category-detail/category-detail';
import { KeysPipe } from "../pipes/keys";
import { ModalOrderPage } from '../pages/modal-order/modal-order';
import { AuthService } from "../services/auth-service";
import { NotificationService } from "../services/notification-service";
import { LoginPage } from "../pages/login/login";
import { UsersPage } from '../pages/users/users';
import { TaxesPage } from '../pages/taxes/taxes';
import { ModalTaxPage } from '../pages/modal-tax/modal-tax';
import { RegisterPage } from '../pages/register/register';
import { SettingPage } from '../pages/setting/setting';
// end import pages

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyCSe1cjodOoop5KDMIwK0tQ0XyJpyzyzMc",
  authDomain: "ionic-restaurant-multi.firebaseapp.com",
  databaseURL: "https://ionic-restaurant-multi.firebaseio.com",
  projectId: "ionic-restaurant-multi",
  storageBucket: "ionic-restaurant-multi.appspot.com",
  messagingSenderId: "370957142335"
};

@NgModule({
  declarations: [
    MyApp,
    KeysPipe,
    ItemsPage,
    ItemDetailPage,
    CategoriesPage,
    OrderPage,
    HomePage,
    CategoryDetailPage,
    ModalOrderPage,
    LoginPage,
    UsersPage,
    TaxesPage,
    ModalTaxPage,
    RegisterPage,
    SettingPage,
    /* import pages */
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ChartsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ItemsPage,
    ItemDetailPage,
    CategoriesPage,
    OrderPage,
    HomePage,
    CategoryDetailPage,
    ModalOrderPage,
    LoginPage,
    UsersPage,
    TaxesPage,
    ModalTaxPage,
    RegisterPage,
    SettingPage,
    /* import pages */
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CategoryService,
    ItemService,
    UserService,
    OrderService,
    AuthService,
    NotificationService,
    ReportService,
    TaxService,
    RestaurantService,
    /* import services */
  ]
})
export class AppModule {
}
