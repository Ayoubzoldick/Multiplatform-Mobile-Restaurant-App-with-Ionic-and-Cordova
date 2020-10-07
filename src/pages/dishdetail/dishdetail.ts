import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController , ViewController, ActionSheetController   } from 'ionic-angular';
import { Dish } from '../../shared/dish';
// import { Comment } from '../../shared/comment';
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { CommentPage } from '../../pages/comment/comment';
import { SocialSharingOriginal } from '@ionic-native/social-sharing';
// import { SocialSharing } from '@ionic-native/social-sharing/ngx';


/**
 * Generated class for the DishdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {

  dish: Dish;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public actionSheetController: ActionSheetController,
              private favoriteService: FavoriteProvider,
              private toastCtrl: ToastController,
              public modalCtrl: ModalController,
              public viewCtrl: ViewController,
              private socialSharing: SocialSharingOriginal,
              @Inject('BaseURL') private BaseURL) {
    this.dish = navParams.get('dish');
    this.favorite = this.favoriteService.isFavorite(this.dish.id);
    this.numcomments = this.dish.comments.length;

    let total = 0;
    this.dish.comments.forEach(comment => total += comment.rating);
    this.avgstars = (total/this.numcomments).toFixed(2);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }

  addToFavorites(){
    console.log("Adding to Favorites", this.dish.id);
    this.favorite = this.favoriteService.addFavorite(this.dish.id);
    this.toastCtrl.create({
      message: 'Dish' + this.dish.id + 'added as a favorite successfully',
      position: 'middle',
      duration: 3000
    }).present();
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetController.create({
      title: 'Select Actions',
      buttons: [
      
        {
          text: 'Add to Favorites',
          handler: () =>{
          
          this.addToFavorites();
          }
           
        },
        {
          text: 'Share via Facebook',
          handler: () => {
            this.socialSharing.shareViaFacebook(this.dish.name + ' -- ' + this.dish.description, this.BaseURL + this.dish.image, '')
              .then(() => console.log('Posted successfully to Facebook'))
              .catch(() => console.log('Failed to post to Facebook'));
          }
        },
        {
          text: 'Share via Twitter',
          handler: () => {
            this.socialSharing.shareViaTwitter(this.dish.name + ' -- ' + this.dish.description, this.BaseURL + this.dish.image, '')
              .then(() => console.log('Posted successfully to Twitter'))
              .catch(() => console.log('Failed to post to Twitter'));
          }
        },

       {
        text: 'Add Comment',
        handler: () =>{
          
            let modal = this.modalCtrl.create(CommentPage);
            modal.present();
      }
    }
      ]
    });
 
    actionSheet.present();
  }
}
