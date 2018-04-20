import { Component } from '@angular/core';
import {  NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import * as WC from 'woocommerce-api';

/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  WooCommerce: any;
  newOrder :any;
  paymentMethods : any[];
  paymentMethod: any;
  billing_shipping_same: boolean;
  userInfo : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage:Storage, public alertCtrl : AlertController, public payPal: PayPal) {
  this.newOrder = {};
  this.newOrder.billing_address = {};
  this.newOrder.shipping_address = {};
  this.billing_shipping_same = false;

  this.paymentMethods = [
      { method_id: "bacs", method_title: "Direct Bank Transfer" },
      { method_id: "cheque", method_title: "Cheque Payment" },
      { method_id: "cod", method_title: "Cash on Delivery" },
      { method_id: "paypal", method_title: "PayPal" }
  ];

  this.WooCommerce = WC({
      url: "https://hkspices.co.za/",
      consumerKey: "ck_7bc3ddf9f2f9aef00cea83d2b6736656beb4d612",
      consumerSecret: "cs_bbc7ed7b3b3c2e78d54f27da50f4de0d03152e12"
    });

    this.storage.get("userLoginInfo").then( (userLoginInfo) => {

      this.userInfo = userLoginInfo.user;

      let email = userLoginInfo.user.email;

      this.WooCommerce.getAsync("customers/email/"+email).then( (data) => {

        this.newOrder = JSON.parse(data.body).customer;

      })

    })

}

setBillingToShipping(){
    this.billing_shipping_same = !this.billing_shipping_same;

    if(this.billing_shipping_same)
    {
      this.newOrder.shipping_address = this.newOrder.billing_address;
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }

placeOrder(){

  let orderItems: any[] = [];
  let data: any = {};
  let paymentData: any = {};

  this.paymentMethods.forEach( (element, index) => {
    if (element.method_id == this.paymentMethod){
      paymentData = element;

    }
   });

  data = {
    payment_details :{
      method_id: paymentData.method_id,
      method_title: paymentData.method_title,
      paid: true
    },
    billing_address: this.newOrder.billing_address,
    shipping_address: this.newOrder.shipping_address,
    customer_id: this.userInfo.id || '',
    line_items : orderItems,
  };

  if(paymentData.method_id == "paypal"){
        this.payPal.init({
          PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
          PayPalEnvironmentSandbox: 'Aee17wrR-wBavZO7e_bPR6IRFEs_fBoEAkAeFMAleRTfqepoQ7CGPRw4ol0_Q_azjUtKfsfYIG2LixUy'
        }).then(() => {
          // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
          this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
            // Only needed if you get an "Internal Service Error" after PayPal login!
            //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
          })).then(() => {
            this.storage.get("cart").then((cart) =>{              
              let total =0.00;              
              cart.forEach((element, index) =>{
                orderItems.push({ product_id: element.product_id, quantity: element.qty});
                total = total + (element.product.price * element.qty);
              });

               let payment = new PayPalPayment(total.toString(), 'USD', 'This is wooionic3', 'sale');
              this.payPal.renderSinglePaymentUI(payment).then((response) => {
              // Successfully paid
              alert(JSON.stringify(response));

              data.line_items = orderItems;

              let orderData: any= {};

              orderData.order = data;

              this.WooCommerce.postAsync('orders', orderData, (data)=>{
                alert ("order placed successfully!")

                let response = (JSON.parse(data.body).order);

                this.alertCtrl.create({
                  title: "Order Placed Successfully",
                  message: "Your order has been placed successfully. Your order number is " + response.order_number,
                  buttons: [{
                    text: "OK",
                    handler: () =>{
                      this.navCtrl.setRoot(HomePage)
                    }
                  }]

                }).present()

              })

             
            })

           
            }, () => {
              // Error or render dialog closed without being successful
            });
          }, () => {
            // Error in configuration
          });
        }, () => {
          // Error in initialization, maybe PayPal isn't supported or something else
        });




  } else {
    this.storage.get("cart").then( (cart) => {
      cart.forEach((element, index) =>{
        orderItems.push({
          product_id : element.product.id,
          quantity: element.qty,

        });
      });
    data.line_items = orderItems;

    let orderData: any = {};

    orderData.order = data;

    this.WooCommerce.postAsync("orders", orderData).then ((data)=>{

      let response = (JSON.parse(data.body).order);

      this.alertCtrl.create({
        title: "Order Placed Successfully",
        message: "Your order has been placed successfully. Your order number is " + response.order_number,
        buttons: [{
          text: "OK",
          handler: () =>{
            this.navCtrl.setRoot(HomePage)
          }
        }]

      }).present()
    })


    })
  }


}

}
