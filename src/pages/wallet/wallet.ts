import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController,InfiniteScroll, Refresher } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../providers/server/account';
import { Storage } from '@ionic/storage';
import { DepositPage } from '../deposit/deposit';
import { WithdrawPage } from '../withdraw/withdraw';
import { ExchangePage } from '../exchange/exchange';
/**
 * Generated class for the WalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {
	currency : any;
	amount : any;
	amount_usd : any;
	customer_id : any;
	history : any;
	count_history = 0;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public platform: Platform,
		public loadingCtrl: LoadingController,
		public storage: Storage,
		public AccountServer : AccountProvider) {
	}

	ionViewDidLoad() {
		this.currency = this.navParams.get("currency");
		this.amount = this.navParams.get("amount");
		this.amount_usd = this.navParams.get("amount_usd");
		this.customer_id = this.navParams.get("customer_id");
		let loading = this.loadingCtrl.create({
	    content: 'Please wait...'
	  	});
	  	loading.present();

		
		this.AccountServer.GetHisroryWallet(this.customer_id,this.currency,0,10)
        .subscribe((data) => {
        	loading.dismiss();
			if (data)
			{
		  		this.history =  data;
		  		this.count_history = data.length;
			}
        })
			


				

	}

	ionViewWillEnter() {
		this.reload_balance();
		let elements = document.querySelectorAll(".tabbar.show-tabbar");
		if (elements != null) {
	        Object.keys(elements).map((key) => {
	            elements[key].style.display = 'none';
	        });
	    }
   	}
  	ionViewWillLeave() {
  		let elements = document.querySelectorAll(".tabbar.show-tabbar");
		if (elements != null) {
	        Object.keys(elements).map((key) => {
	            elements[key].style.display = 'flex';
	        });
	    }
  	}

  	goback() {
		this.navCtrl.pop();
	}

	ViewDeposit() {
		this.navCtrl.push(DepositPage ,{'currency' : this.currency});
	}

	ViewExchange() {
		this.navCtrl.push(ExchangePage ,{'currency' : this.currency});
	}

	ViewWithdraw() {
		this.navCtrl.push(WithdrawPage ,{'currency' : this.currency,'balance' : this.amount});
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
  	doInfinite(infiniteScroll : InfiniteScroll) {
  		
	  	this.AccountServer.GetHisroryWallet(this.customer_id,this.currency,this.history.length,5)
        .subscribe((data) => {
        	
			
	  		if (data.length > 0)
			{
				for(let item of data) {
				  	this.history.push({
				  		"username" : item.username,
				        "status" : item.status,
				        "amount" : item.amount,
				        "txt_id" : item.txt_id,
				        "address" : item.address,
				        "date_added" : item.date_added,
				        "type" : item.type,
				        "currency" : item.currency,
				        "confirmations" : item.confirmations,
				        "amount_usd" : item.amount_usd,
				        "price" : item.price

				  	})
				}
			}
			infiniteScroll.complete();
			
			
        })
	}

	doRefresh(refresher: Refresher) {

		this.AccountServer.GetInfomationUser(this.customer_id)
        .subscribe((data) => {
        		
			if (data.status == 'complete')
			{
				if (this.currency == 'BTC')
					this.amount = (parseFloat(data.balance.bitcoin.available)/100000000).toFixed(8);
				if (this.currency == 'ETH')
					this.amount = (parseFloat(data.balance.ethereum.available)/100000000).toFixed(8);
				if (this.currency == 'LTC')
					this.amount = (parseFloat(data.balance.litecoin.available)/100000000).toFixed(8);
				if (this.currency == 'DASH')
					this.amount = (parseFloat(data.balance.dash.available)/100000000).toFixed(8);
				if (this.currency == 'EOS')
					this.amount = (parseFloat(data.balance.eos.available)/100000000).toFixed(8);
				if (this.currency == 'USDT')
					this.amount = (parseFloat(data.balance.tether.available)/100000000).toFixed(8);
				if (this.currency == 'XRP')
					this.amount = (parseFloat(data.balance.ripple.available)/100000000).toFixed(8);
				if (this.currency == 'ASIC')
					this.amount = (parseFloat(data.balance.coin.available)/100000000).toFixed(8);
			}
			
			this.AccountServer.GetPriceAltcoin()
	        .subscribe((data) => {
				if (data.status == 'complete')
				{ 
					if (this.currency == 'BTC')
						this.amount_usd = (parseFloat(this.amount)*data.btc_usd).toFixed(2);
					if (this.currency == 'ETH')
						this.amount_usd = (parseFloat(this.amount)*data.eth_usd).toFixed(2);
					if (this.currency == 'LTC')
						this.amount_usd = (parseFloat(this.amount)*data.ltc_usd).toFixed(2);
					if (this.currency == 'DASH')
						this.amount_usd = (parseFloat(this.amount)*data.dash_usd).toFixed(2);
					if (this.currency == 'EOS')
						this.amount_usd = (parseFloat(this.amount)*data.eos_usd).toFixed(2);
					if (this.currency == 'USDT')
						this.amount_usd = (parseFloat(this.amount)*data.usdt_usd).toFixed(2);
					if (this.currency == 'XRP')
						this.amount_usd = (parseFloat(this.amount)*data.xrp_usd).toFixed(2);
					if (this.currency == 'ASIC')
						this.amount_usd = (parseFloat(this.amount)*data.coin_usd).toFixed(2);
				
				}
				this.AccountServer.GetHisroryWallet(this.customer_id,this.currency,0,10)
		        .subscribe((data) => {
		        	setTimeout(function() {
		        		refresher.complete()
		        	}, 1000);
		        	
					if (data)
					{
				  		this.history =  data;
				  		this.count_history = data.length;
					}
		        })
	        })

	        

        })

		
  	}

  	reload_balance(){
  		this.AccountServer.GetInfomationUser(this.customer_id)
        .subscribe((data) => {
        		
			if (data.status == 'complete')
			{
				if (this.currency == 'BTC')
					this.amount = (parseFloat(data.balance.bitcoin.available)/100000000).toFixed(8);
				if (this.currency == 'ETH')
					this.amount = (parseFloat(data.balance.ethereum.available)/100000000).toFixed(8);
				if (this.currency == 'LTC')
					this.amount = (parseFloat(data.balance.litecoin.available)/100000000).toFixed(8);
				if (this.currency == 'DASH')
					this.amount = (parseFloat(data.balance.dash.available)/100000000).toFixed(8);
				if (this.currency == 'EOS')
					this.amount = (parseFloat(data.balance.eos.available)/100000000).toFixed(8);
				if (this.currency == 'USDT')
					this.amount = (parseFloat(data.balance.tether.available)/100000000).toFixed(8);
				if (this.currency == 'XRP')
					this.amount = (parseFloat(data.balance.ripple.available)/100000000).toFixed(8);
				if (this.currency == 'ASIC')
					this.amount = (parseFloat(data.balance.coin.available)/100000000).toFixed(8);
			}
			
			this.AccountServer.GetPriceAltcoin()
	        .subscribe((data) => {
				if (data.status == 'complete')
				{ 
					if (this.currency == 'BTC')
						this.amount_usd = (parseFloat(this.amount)*data.btc_usd).toFixed(2);
					if (this.currency == 'ETH')
						this.amount_usd = (parseFloat(this.amount)*data.eth_usd).toFixed(2);
					if (this.currency == 'LTC')
						this.amount_usd = (parseFloat(this.amount)*data.ltc_usd).toFixed(2);
					if (this.currency == 'DASH')
						this.amount_usd = (parseFloat(this.amount)*data.dash_usd).toFixed(2);
					if (this.currency == 'EOS')
						this.amount_usd = (parseFloat(this.amount)*data.eos_usd).toFixed(2);
					if (this.currency == 'USDT')
						this.amount_usd = (parseFloat(this.amount)*data.usdt_usd).toFixed(2);
					if (this.currency == 'XRP')
						this.amount_usd = (parseFloat(this.amount)*data.xrp_usd).toFixed(2);
					if (this.currency == 'ASIC')
						this.amount_usd = (parseFloat(this.amount)*data.coin_usd).toFixed(2);
				
				}
				
	        })

        })
  	}

  
}
