import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';

import * as WC from 'woocommerce-api';

import { ProductDetailsPage } from '../product-details/product-details';

/**
 * Generated class for the ProductsByCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategoryPage {

  WooCommerce: any;
  products: any[];
  page: number;
  category: any; 

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.page = 2;
    this.category = this.navParams.get("category")

    this.WooCommerce = WC({
      url: "https://hkspices.co.za/",
      consumerKey: "ck_7bc3ddf9f2f9aef00cea83d2b6736656beb4d612",
      consumerSecret: "cs_bbc7ed7b3b3c2e78d54f27da50f4de0d03152e12"
    });

this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug).then( (data) => {
      console.log(JSON.parse(data.body));
      this.products = JSON.parse(data.body).products;
    }, (err) => {
      console.log(err)
    } )

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
  }

    loadMoreProducts(event) {
    this.page++;
    console.log("Getting page " + this.page);
    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug + "&page=" + this.page).then((data) => {
      let temp = (JSON.parse(data.body).products);

      this.products = this.products.concat(JSON.parse(data.body).products)
      console.log(this.products);
      event.complete();

      if (temp.length < 10)
        event.enable(false);
    })
  }

  openProductPage(product){
    this.navCtrl.push(ProductDetailsPage, {"product": product} );
  }

}
