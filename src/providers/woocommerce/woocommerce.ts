import { Injectable } from '@angular/core';
import * as WC from 'woocommerce-api';

@Injectable()
export class WoocommerceProvider {
  WooCommerce: any;
  constructor() {
     this.WooCommerce = WC({
      url: "https://hkspices.co.za/",
      consumerKey: "ck_7bc3ddf9f2f9aef00cea83d2b6736656beb4d612",
      consumerSecret: "cs_bbc7ed7b3b3c2e78d54f27da50f4de0d03152e12"
    });
  }

init(){
  return this.WooCommerce;
}

}
