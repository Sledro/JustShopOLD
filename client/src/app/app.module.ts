import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

// import services
import { CategoryService } from '../services/category-service';
import { ItemService } from '../services/item-service';
import { CartService } from '../services/cart-service';
import { PostService } from '../services/post-service';
import { ChatService } from '../services/chat-service';
import { NotificationService } from '../services/notification-service';
import { TaxService } from "../services/tax-service";
import { RestaurantService } from '../services/restaurant-service';
// end import services

// import pages
import { AboutPage } from '../pages/about/about';
import { AddressPage } from '../pages/address/address';
import { CartPage } from '../pages/cart/cart';
import { CategoriesPage } from '../pages/categories/categories';
import { CategoryPage } from '../pages/category/category';
import { ChatDetailPage } from '../pages/chat-detail/chat-detail';
import { ChatsPage } from '../pages/chats/chats';
import { CheckoutPage } from '../pages/checkout/checkout';
import { FavoritePage } from '../pages/favorite/favorite';
import { HomePage } from '../pages/home/home';
import { ItemPage } from '../pages/item/item';
import { LoginPage } from '../pages/login/login';
import { NewsPage } from '../pages/news/news';
import { OfferPage } from '../pages/offer/offer';
import { RegisterPage } from '../pages/register/register';
import { SettingPage } from '../pages/setting/setting';
import { UserPage } from '../pages/user/user';
import { OrderService } from "../services/order-service";
import { AuthService } from "../services/auth-service";
import { OrdersPage } from '../pages/orders/orders';
import { OrderDetailPage } from '../pages/order-detail/order-detail';
// end import pages

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyCTZfPdJzClaREiX7mzg-uaDbxbQWfF_n8",
  authDomain: "instashop-17.firebaseapp.com",
  databaseURL: "https://instashop-17.firebaseio.com",
  projectId: "instashop-17",
  storageBucket: "instashop-17.appspot.com",
  messagingSenderId: "332928630494"
};

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    AddressPage,
    CartPage,
    CategoriesPage,
    CategoryPage,
    ChatDetailPage,
    ChatsPage,
    CheckoutPage,
    FavoritePage,
    HomePage,
    ItemPage,
    LoginPage,
    NewsPage,
    OfferPage,
    RegisterPage,
    SettingPage,
    UserPage,
    OrdersPage,
    OrderDetailPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    AddressPage,
    CartPage,
    CategoriesPage,
    CategoryPage,
    ChatDetailPage,
    ChatsPage,
    CheckoutPage,
    FavoritePage,
    HomePage,
    ItemPage,
    LoginPage,
    NewsPage,
    OfferPage,
    RegisterPage,
    SettingPage,
    UserPage,
    OrdersPage,
    OrderDetailPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CategoryService,
    ItemService,
    CartService,
    PostService,
    ChatService,
    OrderService,
    AuthService,
    NotificationService,
    TaxService,
    RestaurantService,
    /* import services */
  ]
})
export class AppModule {
}
