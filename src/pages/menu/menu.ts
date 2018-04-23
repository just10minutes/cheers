import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
//import { HomePage } from '../home/home';
import * as WC from 'woocommerce-api';

//import {ProductsByCategoryPage} from '../products-by-category/products-by-category';
//import { SignupPage } from '../signup/signup';
//import { LoginPage } from '../login/login';
import { CartPage } from '../cart/cart';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({})
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  homePage: any;
  WooCommerce: any;
  categories : any[];
  @ViewChild('content') childNavCtrl: NavController;

  loggedIn: boolean;
  user: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage:Storage, public modalCtrl: ModalController) {
    this.homePage = 'HomePage';
    this.categories = [];
    this.user = {};

    this.WooCommerce = WC({
      url: "https://hkspices.co.za/",
      consumerKey: "ck_7bc3ddf9f2f9aef00cea83d2b6736656beb4d612",
      consumerSecret: "cs_bbc7ed7b3b3c2e78d54f27da50f4de0d03152e12"
    });

    this.WooCommerce.getAsync("products/categories").then( (data) => {
      console.log(JSON.parse(data.body).product_categories);

      let temp : any[] = JSON.parse(data.body).product_categories;
      //Get only Parent/root category
      for(let i = 0; i < temp.length; i ++){
        if(temp[i].parent == 0){
            if (temp[i].slug == "spices"){
              temp[i].icon = "shirt"

            }
            else
            {temp[i].icon = "images"}

        this.categories.push(temp[i]);
        }
      }
      
    }, (err) => {
      console.log(err)
    } )
  }

  ionViewDidEnter() {
    this.storage.ready().then( () =>{
      this.storage.get("userLoginInfo").then((userLoginInfo) => {
          if(userLoginInfo != null){
            console.log("User Logged in...");
            this.user = userLoginInfo.user;
            console.log(this.user);
            this.loggedIn = true;            
          }
          else {
            console.log("No user found.");
            this.user = {};
            this.loggedIn = false;

          }
      })

    })

  }

  openCategoryPage(category){
    this.childNavCtrl.setRoot('ProductsByCategoryPage', {"category" : category} );
  }

  openPage(pageName: string){
    if(pageName == "signup"){
      this.navCtrl.push('SignupPage');
    }
    if(pageName == "login"){
      this.navCtrl.push('LoginPage');
    }

    if(pageName == 'logout'){
      this.storage.remove("userLoginInfo").then( () => {
        this.user = {};
        this.loggedIn = false;
      })
    }
    if(pageName == 'cart'){
      let modal = this.modalCtrl.create(CartPage);
      modal.present();
    }

  }

}
