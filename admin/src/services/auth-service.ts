import { Injectable } from "@angular/core";
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from "rxjs";
import { RestaurantService } from "./restaurant-service";
import { DEFAULT_AVATAR } from "./constants";

@Injectable()
export class AuthService {
  user: any;
  defaultAvatar = 'https://freeiconshop.com/wp-content/uploads/edd/person-outline-filled.png';

  constructor(public afAuth: AngularFireAuth, public db: AngularFireDatabase, public restaurantService: RestaurantService) {
  }

  // get current user data from firebase
  getUserData() {
    return this.afAuth.auth.currentUser;
  }

  login(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  register(email, password, restaurantName) {
    return Observable.create(observer => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((authData: any) => {
        // set up initial data
        this.restaurantService.create(restaurantName).then((rest) => {
          this.updateUserProfile(authData);
          this.attachRestaurant(rest.key, authData.uid);
        });
        observer.next();
      }).catch((error: any) => {
        if (error) {
          observer.error(error);
        }
      });
    });
  }

  // update user display name and photo
  updateUserProfile(user) {
    let name = user.name ? user.name : user.email;
    let photoUrl = user.photoURL ? user.photoURL : DEFAULT_AVATAR;

    this.getUserData().updateProfile({
      displayName: name,
      photoURL: photoUrl
    });

    // create or update passenger
    this.db.object('admins/' + user.uid).update({
      name: name,
      photoURL: photoUrl,
      email: user.email,
    })
  }

  // attach restaurant to user
  attachRestaurant(restId, uid) {
    this.db.object('admins/' + uid).update({
      'restaurantId': restId
    });
  }

  // get admin user
  getAdmin() {
    let user = this.getUserData();
    return this.db.object('admins/' + user.uid);
  }
}
