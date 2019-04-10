import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController,InfiniteScroll,Refresher } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';

import { Storage } from '@ionic/storage';
import { WalletPage } from '../../wallet/wallet';
import { ListNotificationPage } from '../../notification/list-notification/list-notification';
import { LoginPage } from '../../login/login';
@IonicPage()
@Component({
  selector: 'page-assets',
  templateUrl: 'assets.html',
})
export class AssetsPage {
	price_coin = {};
	balance = {};
	total_usd :any;
	customer_id : any;
	list_notification : any;
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

				this.AccountServer.GetInfomationUser(this.customer_id)
		        .subscribe((data) => {
		        	loading.dismiss();	
					if (data.status == 'complete')
					{
						this.balance['coin'] = data.balance.coin.available;
						this.balance['bitcoin'] = data.balance.bitcoin.available;
						this.balance['dash'] = data.balance.dash.available;
						this.balance['eos'] = data.balance.eos.available;
						this.balance['ethereum'] = data.balance.ethereum.available;
						this.balance['litecoin'] = data.balance.litecoin.available;
						this.balance['ripple'] = data.balance.ripple.available;
						this.balance['tether'] = data.balance.tether.available;
						this.balance['bitcoincash'] = data.balance.bitcoincash.available;
						this.balance['dogecoin'] = data.balance.dogecoin.available;
					}
					else
					{
						this.AlertToast(data.message,'error_form');
					}


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

							this.total_usd = ((parseFloat(this.balance['coin'])*parseFloat(this.price_coin['coin'])/100000000)+(parseFloat(this.balance['bitcoin'])*parseFloat(this.price_coin['bitcoin'])/100000000)+(parseFloat(this.balance['dash'])*parseFloat(this.price_coin['dash'])/100000000)+(parseFloat(this.balance['eos'])*parseFloat(this.price_coin['eos'])/100000000)+(parseFloat(this.balance['ethereum'])*parseFloat(this.price_coin['ethereum'])/100000000)+(parseFloat(this.balance['litecoin'])*parseFloat(this.price_coin['litecoin'])/100000000)+(parseFloat(this.balance['ethereum'])*parseFloat(this.price_coin['ethereum'])/100000000)+(parseFloat(this.balance['ripple'])*parseFloat(this.price_coin['ripple'])/100000000)+(parseFloat(this.balance['tether'])*parseFloat(this.price_coin['tether'])/100000000)+(parseFloat(this.balance['dogecoin'])*parseFloat(this.price_coin['dogecoin'])/100000000)+(parseFloat(this.balance['bitcoincash'])*parseFloat(this.price_coin['bitcoincash'])/100000000)).toFixed(2);
						}
						else
						{
							this.AlertToast(data.message,'error_form');
						}
			        })

			        this.AccountServer.GetListNotification(this.customer_id,0,10)
			        .subscribe((data) => {
			        	this.list_notification = data;
			        })


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


	ionViewWillEnter() {
		document.querySelector(".currency_div")['style'].height = this.platform.height()-190+'px'; 
   	}
  	

	ViewWallet(currency,amount,amount_usd){
		this.navCtrl.push(WalletPage,{'customer_id' : this.customer_id, 'currency' : currency,'amount' : amount,'amount_usd' : amount_usd});
	}

	onScroll(event){
		//console.log('onScroll');
	}


	ViewListNotification(){
		this.navCtrl.push(ListNotificationPage);
	}

	doInfinite(infiniteScroll : InfiniteScroll) {
	  	
        infiniteScroll.complete();
	}

	doRefresh(refresher: Refresher) {
		this.AccountServer.GetInfomationUser(this.customer_id)
        .subscribe((data) => {
        	
			if (data.status == 'complete')
			{
				this.balance['coin'] = data.balance.coin.available;
				this.balance['bitcoin'] = data.balance.bitcoin.available;
				this.balance['dash'] = data.balance.dash.available;
				this.balance['eos'] = data.balance.eos.available;
				this.balance['ethereum'] = data.balance.ethereum.available;
				this.balance['litecoin'] = data.balance.litecoin.available;
				this.balance['ripple'] = data.balance.ripple.available;
				this.balance['tether'] = data.balance.tether.available;
				this.balance['bitcoincash'] = data.balance.bitcoincash.available;
				this.balance['dogecoin'] = data.balance.dogecoin.available;
			}
			


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


					this.total_usd = ((parseFloat(this.balance['coin'])*parseFloat(this.price_coin['coin'])/100000000)+(parseFloat(this.balance['bitcoin'])*parseFloat(this.price_coin['bitcoin'])/100000000)+(parseFloat(this.balance['dash'])*parseFloat(this.price_coin['dash'])/100000000)+(parseFloat(this.balance['eos'])*parseFloat(this.price_coin['eos'])/100000000)+(parseFloat(this.balance['ethereum'])*parseFloat(this.price_coin['ethereum'])/100000000)+(parseFloat(this.balance['litecoin'])*parseFloat(this.price_coin['litecoin'])/100000000)+(parseFloat(this.balance['ethereum'])*parseFloat(this.price_coin['ethereum'])/100000000)+(parseFloat(this.balance['ripple'])*parseFloat(this.price_coin['ripple'])/100000000)+(parseFloat(this.balance['tether'])*parseFloat(this.price_coin['tether'])/100000000)+(parseFloat(this.balance['dogecoin'])*parseFloat(this.price_coin['dogecoin'])/100000000)+(parseFloat(this.balance['bitcoincash'])*parseFloat(this.price_coin['bitcoincash'])/100000000)).toFixed(2);
				}
				
				refresher.complete();
	        })



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
