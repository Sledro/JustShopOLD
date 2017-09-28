import { Component } from '@angular/core';
import { LoadingController, NavController, ToastController } from 'ionic-angular';
import { AuthService } from "../../services/auth-service";
import * as firebase from 'firebase';


/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {
  user: any = {};
  uid: any;

  constructor(public nav: NavController, public authService: AuthService, public toastCtrl: ToastController,
              public loadingCtrl: LoadingController) {
    let user = authService.getUserData();
    this.uid = user.uid;
    authService.getUser(this.uid).take(1).subscribe(snapshot => {
      this.user = snapshot;
    });
  }

  // save user info
  submit() {
    this.authService.updateUserProfile(this.uid, this.user);

    let toast = this.toastCtrl.create({
      message: 'User updated',
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  // choose file for upload
  chooseFile() {
    document.getElementById('avatar').click();
  }

  // upload thumb for item
  upload() {
    // Create a root reference
    let storageRef = firebase.storage().ref();
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    for (let selectedFile of [(<HTMLInputElement>document.getElementById('avatar')).files[0]]) {
      let path = '/users/' + Date.now() + `${selectedFile.name}`;
      let iRef = storageRef.child(path);
      iRef.put(selectedFile).then((snapshot) => {
        loading.dismiss();
        this.user.photoURL = snapshot.downloadURL;
      });
    }
  }
}
