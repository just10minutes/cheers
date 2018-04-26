import { Injectable } from '@angular/core';
import * as WC from 'woocommerce-api';

@Injectable()
export class WoocommerceProvider {
  WooCommerce: any;
  constructor() {
     this.WooCommerce = WC({
      url: "http://www.olifant.co.za/test/",
      consumerKey: "ck_8693327a7ccde7bb6b78ab4f57c6a64fb5d93378",
      consumerSecret: "cs_6ce9d88724d2e15391ef7b7d3738b8776537232b"
    });
  }

init(){
  return this.WooCommerce;
}

}
