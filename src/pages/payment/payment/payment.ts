import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform ,AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/server/account';
import { Storage } from '@ionic/storage';
import { CollectPage } from '../collect/collect';
import { TransanctionsPage } from '../transanctions/transanctions';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
	customer_id : any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public platform: Platform,
		public loadingCtrl: LoadingController,
		public storage: Storage,
		public AccountServer : AccountProvider,
		private barcodeScanner: BarcodeScanner
		) {
  	}

	ionViewDidLoad() {
		//this.PaymentSubmit('35k7m2fgn6tY1crs7qb7eLgofQKKBsmAhG','BTC',0.1);
		this.storage.get('customer_id')
		.then((customer_id) => {
			if (customer_id) 
			{
				this.customer_id = customer_id;
			}
		})
		//this.PaymentSubmit('address','currency',1000);
	}


	ViewCollect() {
		this.navCtrl.push(CollectPage);
	} 

	ViewTransanction() {
		this.navCtrl.push(TransanctionsPage);
	} 

	scanCode() {
	    this.barcodeScanner.scan({
	      preferFrontCamera : false,
	      showFlipCameraButton : true,
	      showTorchButton : true,
	      disableSuccessBeep : true,
	      prompt : ''
	    }).then(barcodeData => {
	      
	      let string = barcodeData.text;
	      if (string)
	      {
	      	
	      	let string_split = string.split("_");
	      	let address = string_split[0];
	      	let currency = string_split[1];
	      	let amount = string_split[2];
	      	
	      	this.PaymentSubmit(address,currency,amount);
	      	//alert(address+' '+currency+' '+amount);
	      }
	      else
	      {
	      	this.AlertToast('Error','error_form');
	      }
	    }, (err) => {
	    	
	        this.AlertToast('Error','error_form');
	    });
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
  		let elements = document.querySelectorAll(".tabbar.show-tabbar");
		if (elements != null) {
	        Object.keys(elements).map((key) => {
	            elements[key].style.display = 'flex';
	        });
	    }
  	}
  	goback(){
		this.navCtrl.pop();
	}

	PaymentSubmit(address,currency,amount) {
	
	  let alert = this.alertCtrl.create({
	    title: 'Confirm the payment '+currency,
	    cssClass:'prompt_alert_customer customs',
	    enableBackdropDismiss : false,

	    message: '<div class"contentpaymentpopup">' +
  			'<div class="item"><span class="left">Address</span><span class="right">'+address+'</span></div>' +
  		'</div>',       
	    inputs: [
	    	{
				name: 'amount',
				placeholder: 'Please input amount',
				type: 'number',
				value : amount
			},
			{
				name: 'password_transaction',
				placeholder: 'Please input the transaction password',
				type: 'password'
			}
	    ],
	    buttons: [
	      {
	        text: 'Cancel',
	        role: 'cancel',
	        handler: data => {
	          
	        }
	      },
	      {
	        text: 'OK',
	        handler: data => {
	        	if (data.amount == '' || data.amount == undefined)
	        	{
	        		this.AlertToast('Please enter a amount','error_form');
	        		return false;
	        	}
	        	else
	        	{
	        		if (data.password_transaction == '' || data.password_transaction == undefined)
		        	{
		        		this.AlertToast('Please enter a password transaction','error_form');
		        		return false;
		        	}
		        	else
		        	{
		        		let loading = this.loadingCtrl.create({
					    content: 'Please wait...'
					  	});

					  	loading.present();

					  	this.AccountServer.SubmitPayment(this.customer_id,currency,address,data.amount,data.password_transaction)
				        .subscribe((data) => {
				        	loading.dismiss();
							if (data.status == 'complete')
							{
								this.AlertToast(data.message,'success_form');
								
								return true;

							}
							else
							{
								this.AlertToast(data.message,'error_form');
								
								return false;
							}
				        },
				        (err) => {
				        	loading.dismiss();
				        	if (err)
				        	{
				        		this.SeverNotLogin();
				        		return false;
				        	}
				        })

		        	}
		        }
	        	
	        }
	      }
	    ]
	  });
	  alert.present();
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
