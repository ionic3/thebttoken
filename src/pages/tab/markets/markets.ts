import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController,Refresher } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../../login/login';
@IonicPage()
@Component({
  selector: 'page-markets',
  templateUrl: 'markets.html',
})
export class MarketsPage {
	customer_id : any;
	price_coin = {};
	change_coin = {};
	timeout : any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public platform: Platform,
		public loadingCtrl: LoadingController,
		public storage: Storage,
		public AccountServer : AccountProvider
		) {
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
		let loading = this.loadingCtrl.create({
	    	content: 'Please wait...'
	  	});
	  	loading.present();
	  	
		this.storage.get('customer_id')
		.then((customer_id) => {
			if (customer_id) 
			{
				this.customer_id = customer_id;

				this.AccountServer.GetPriceAltcoin()
		        .subscribe((data) => {
		        	loading.dismiss();	
					if (data.status == 'complete')
					{ 
						this.price_coin['coin'] = data.coin_usd;
						this.price_coin['bitcoin'] = data.btc_usd;
						this.price_coin['dash'] = data.dash_usd;
						this.price_coin['eos'] = data.eos_usd;
						this.price_coin['ethereum'] = data.eth_usd;
						this.price_coin['litecoin'] = data.ltc_usd;
						this.price_coin['ripple'] = data.xrp_usd;
						this.price_coin['tether'] = data.usdt_usd;
						this.price_coin['bitcoincash'] = data.bch_usd;
						this.price_coin['dogecoin'] = data.doge_usd;

						this.change_coin['coin'] = data.coin_change;
						this.change_coin['bitcoin'] = data.btc_change;
						this.change_coin['dash'] = data.dash_change;
						this.change_coin['eos'] = data.eos_change;
						this.change_coin['ethereum'] = data.eth_change;
						this.change_coin['litecoin'] = data.ltc_change;
						this.change_coin['ripple'] = data.xrp_change;
						this.change_coin['tether'] = data.usdt_change;
						this.change_coin['bitcoincash'] = data.bch_change;
						this.change_coin['dogecoin'] = data.doge_change;

						

					}
					else
					{
						this.AlertToast(data.message,'error_form');
					}
		        },
		        (err) => {
		        	loading.dismiss();
		        	if (err)
		        	{
		        		this.SeverNotLogin();
		        	}
		        })
			}
		})
	}

	doRefresh(refresher: Refresher) {
		
		this.AccountServer.GetPriceAltcoin()
        .subscribe((data) => {
        	
			if (data.status == 'complete')
			{ 
				this.price_coin['coin'] = data.coin_usd;
				this.price_coin['bitcoin'] = data.btc_usd;
				this.price_coin['dash'] = data.dash_usd;
				this.price_coin['eos'] = data.eos_usd;
				this.price_coin['ethereum'] = data.eth_usd;
				this.price_coin['litecoin'] = data.ltc_usd;
				this.price_coin['ripple'] = data.xrp_usd;
				this.price_coin['tether'] = data.usdt_usd;
				this.price_coin['bitcoincash'] = data.bch_usd;
				this.price_coin['dogecoin'] = data.doge_usd;

				this.change_coin['coin'] = data.coin_change;
				this.change_coin['bitcoin'] = data.btc_change;
				this.change_coin['dash'] = data.dash_change;
				this.change_coin['eos'] = data.eos_change;
				this.change_coin['ethereum'] = data.eth_change;
				this.change_coin['litecoin'] = data.ltc_change;
				this.change_coin['ripple'] = data.xrp_change;
				this.change_coin['tether'] = data.usdt_change;
				this.change_coin['bitcoincash'] = data.bch_change;
				this.change_coin['dogecoin'] = data.doge_change;

				

			}
			
			refresher.complete();
        })

  		
  	}

	AlertToast(message,class_customer) {
	    let toast = this.toastCtrl.create({
	      message: message,
	      position: 'bottom',
	      duration : 2000,
	      cssClass : class_customer
	    });
	    toast.present();
  	}

  	SeverNotLogin(){
  		const confirm = this.alertCtrl.create({
		title: 'System maintenance',
		message: 'The system is updating. Please come back after a few minutes',
		buttons: [
		{
		  text: 'Cancel',
		  handler: () => {
		    
		  }
		},
		{
		  text: 'Exit',
		  handler: () => {
		   	this.platform.exitApp();
		  }
		}
		]
		});
		confirm.present();
  	}
}
