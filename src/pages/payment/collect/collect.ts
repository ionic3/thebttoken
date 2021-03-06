import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';
import { Screenshot } from '@ionic-native/screenshot';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../../login/login';
@IonicPage()
@Component({
  selector: 'page-collect',
  templateUrl: 'collect.html',
})
export class CollectPage {
	customer_id : any;
	address : any;
	currency : any;
	form = {};
	selectOptions : any;
	price_coin : any;
	price_altcoin : any;
	amount : any;
	viewspecyfy : any;
	timeout : any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public platform: Platform,
		public loadingCtrl: LoadingController,
		public storage: Storage,
		public AccountServer : AccountProvider,
		private screenshot: Screenshot
	) {
		this.selectOptions = {
		  title: 'Currency',
		  cssClass : 'select-customer'
		};
	}

	ionViewDidEnter(){
		this.timeout = setTimeout(function() {
			this.navCtrl.setRoot(LoginPage);
		}.bind(this), 300000);
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
				this.currency  = 'BTC';
				this.amount = 0;
				this.viewspecyfy = false;
				this.AccountServer.GetAddressUser(this.customer_id,this.currency)
		        .subscribe((data) => {
		        	loading.dismiss();
					if (data)
					{
				  		this.address =  data.address;
					}

					this.AccountServer.GetPriceAltcoin()
			        .subscribe((data) => {
						if (data.status == 'complete')
						{ 
							this.price_altcoin = data;
							if (this.currency == 'BTC')
								this.price_coin = data.btc_usd;
							if (this.currency == 'ETH')
								this.price_coin = data.eth_usd;
							if (this.currency == 'LTC')
								this.price_coin = data.ltc_usd;
							if (this.currency == 'EOS')
								this.price_coin = data.eos_usd;
							if (this.currency == 'USDT')
								this.price_coin = data.usdt_usd;
							if (this.currency == 'DASH')
								this.price_coin = data.dash_usd;
							if (this.currency == 'TBT')
								this.price_coin = data.coin_usd;
							if (this.currency == 'XRP')
								this.price_coin = data.xrp_usd;
							
						}
						
			        })

		        })
			}
		})
				
	}

	ionViewWillEnter() {
		
		let elements = document.querySelectorAll(".tabbar.show-tabbar");
		if (elements != null) {
	        Object.keys(elements).map((key) => {
	            elements[key].style.display = 'none';
	        });
	    }
   	}
  	ionViewWillLeave() {
  		clearTimeout(this.timeout);
  		let elements = document.querySelectorAll(".tabbar.show-tabbar");
		if (elements != null) {
	        Object.keys(elements).map((key) => {
	            elements[key].style.display = 'flex';
	        });
	    }
  	}


  	onChangeSelect(value){
		this.currency  = value; 
		this.AccountServer.GetAddressUser(this.customer_id,this.currency)
        .subscribe((data) => {
        	
			if (data)
			{
		  		this.address =  data.address;
			}
        })

        if (this.currency == 'BTC')
			this.price_coin = this.price_altcoin.btc_usd;
		if (this.currency == 'ETH')
			this.price_coin = this.price_altcoin.eth_usd;
		if (this.currency == 'LTC')
			this.price_coin = this.price_altcoin.ltc_usd;
		if (this.currency == 'EOS')
			this.price_coin = this.price_altcoin.eos_usd;
		if (this.currency == 'USDT')
			this.price_coin = this.price_altcoin.usdt_usd;
		if (this.currency == 'DASH')
			this.price_coin = this.price_altcoin.dash_usd;
		if (this.currency == 'TBT')
			this.price_coin = this.price_altcoin.coin_usd;
		if (this.currency == 'XRP')
			this.price_coin = this.price_altcoin.xrp_usd;

		if (this.form['amount_usd'] != '')
		{
			this.form['amount_currency'] = (parseFloat(this.form['amount_usd'])/parseFloat(this.price_coin)).toFixed(8);
		}

	}

	onChangeInputUSD(value){
		this.form['amount_currency'] = (parseFloat(value)/parseFloat(this.price_coin)).toFixed(8);
	}
	onChangeInputCOIN(value){

	}
	
	Confirmreceipt(){
		if (this.form['amount_usd'] == '' || this.form['amount_usd'] == undefined)
		{
			this.AlertToast('Please enter a amount USD.','error_form');
		}
		else
		{
			this.amount = this.form['amount_currency'];
			this.viewspecyfy = false;
		}
		
	}
	SpecyfyAmount() {
		this.viewspecyfy = true;
	}


	Screenshot(){
		this.screenshot.save('jpg', 80, 'myscreenshot.jpg').then(success=>{
			this.AlertToast('Save img success','success_form');
		},
		onError=>{
			this.AlertToast('Save img error','error_form');
		});
		
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

  	goback() {
		this.navCtrl.pop();
	}
	goback_() {
		this.viewspecyfy = false;
	}

	


	
}
