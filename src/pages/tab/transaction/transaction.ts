import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../../login/login';
/**
 * Generated class for the TransactionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transaction',
  templateUrl: 'transaction.html',
})
export class TransactionPage {
	timeout : any;
	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidEnter(){
		this.timeout = setTimeout(function() {
			this.navCtrl.setRoot(LoginPage);
		}.bind(this), 300000);
	}
	ionViewWillLeave(){
		clearTimeout(this.timeout);
	}
	ionViewDidLoad() {
	console.log('ionViewDidLoad TransactionPage');
	}

}
