import { Component, OnInit, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ItemSliding, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { Dish } from '../../shared/dish';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications'
/**
 * Generated class for the FavoritesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage implements OnInit {

  favorites: Dish[];
  errMess: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,private loadingCtrl: LoadingController,
    private favoriteservice: FavoriteProvider, private toastCtrl : ToastController,
    private alertCtrl:AlertController,private storage: Storage, @Inject('BaseURL') private BaseURL) {
  }

  ngOnInit() {
    this.favoriteservice.getFavorites()
      .subscribe(favorites => this.favorites = favorites,
        errmess => this.errMess = errmess);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritesPage');
  }

  deleteFavorite(item: ItemSliding, id: number) {
    console.log('delete', id);

    let alert = this.alertCtrl.create({
      title: 'Confirm Title',
      message : 'Do you want to delete favorite' + id,
      buttons : [
        {
          text: 'Cancel',
          role: 'cancel',
          handler:() => {
            console.log('Delete Canceled');
          }
        },
        {
          text: 'Cancel',
          handler:() => {
            let loading = this.loadingCtrl.create({
              content : "Deleting . . ."
            });
            let toast = this.toastCtrl.create({
              message: 'Dish' + id + 'Deleted successfuly',
              duration: 3000
            })
            loading.present();
            this.favoriteservice.deleteFavorite(id)
              .subscribe(favorites => { this.favorites = favorites; loading.dismiss(); toast.present();},
                errmess => { this.errMess = errmess; loading.dismiss();});
          }
        }
      ]
    });
    
    alert.present();
    item.close();

  }

}
