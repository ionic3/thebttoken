import { Component } from '@angular/core';

import { AssetsPage } from '../tab/assets/assets';
import { MarketsPage } from '../tab/markets/markets';

import { ProfilePage } from '../tab/profile/profile';
import { TransactionPage } from '../tab/transaction/transaction';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = AssetsPage;
  tab2Root = MarketsPage;
  tab3Root = TransactionPage;
  tab4Root = ProfilePage;
  
  constructor() {

  }
}
