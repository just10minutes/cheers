import { Component } from '@angular/core';
import {  NavController, NavParams , ViewController, App, ToastController} from 'ionic-angular';

import { Storage } from '@ionic/storage';
//import { CheckoutPage } from '../checkout/checkout';
//import { LoginPage } from '../login/login';

/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  cartItems: any[] = [];
  total: any;
  showEmptyCartMessage : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public viewCtrl: ViewController, public appCtrl: App, public toastCtrl : ToastController) {
    
    this.total = 0.0;
    this.storage.ready().then(()=>{
      this.storage.get("cart").then( (data)=>{
        this.cartItems = data;
        console.log(this.cartItems);

        if (this.cartItems && this.cartItems.length > 0){
          this.cartItems.forEach( (item, index) =>{
            this.total = this.total + (item.product.price * item.qty);
          })
        } else {
          this.showEmptyCartMessage = true;
        }
      })
    })
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
  }

  removeFromCart(item, i){

    let price = item.product.price;
    let qty = item.qty;

    this.cartItems.splice(i, 1);

    this.storage.set("cart", this.cartItems).then( ()=> {

      this.total = this.total - (price * qty);

    });

    if(this.cartItems.length == 0){
      this.showEmptyCartMessage = true;
    }
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }

  checkout(){
     this.storage.get("userLoginInfo").then( (data) => {
      if(data != null){
        this.navCtrl.push('CheckoutPage');         
      } else {
        this.navCtrl.push('LoginPage', {next: 'CheckoutPage'})
      }
      /*if(data != null){
        this.viewCtrl.dismiss();
        this.appCtrl.getRootNavs()[0].push('CheckoutPage');
      } else {
        this.viewCtrl.dismiss();
        this.appCtrl.getRootNavs()[0].push('LoginPage', { next: 'CheckoutPage', navCtrl: this.navCtrl });
      }*/
    })
  }

  changeQty(item, i, change){

    let price = 0;
    let qty = 0;

    price = parseFloat(item.product.price);
    qty = item.qty;

    if(change < 0 && item.qty == 1){
      return;
    }

    qty = qty + change;
    item.qty = qty;
    item.amount = qty * price;

    this.cartItems[i] = item;

    this.storage.set("cart", this.cartItems).then( ()=> {

      this.toastCtrl.create({
        message: "Cart Updated.",
        duration: 2000,
        showCloseButton: true
      }).present();

    });

    this.total = (parseFloat(this.total.toString()) + (parseFloat(price.toString()) * change));
  }
}
