import { Component, OnInit } from '@angular/core';
import { Subject, Subscription, timer, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { Latestprice } from '../latestprice';
import { Companydesp } from '../companydesp';

let mockInfoArr = [
  {
    ticker: 'AAPL',
    name: 'Apple company',
    last: 122.5,
    change: 23.4,
    changePercent: 2.34,
    timestamp: '125456',
  },
  {
    ticker: 'AAA',
    name: 'AAA Cor',
    last: 121.34,
    change: -2.4,
    changePercent: -0.34,
    timestamp: '125456',
  },
  {
    ticker: 'ADDDY',
    name: 'Adidas Cor',
    last: 227.12,
    change: -44.4,
    changePercent: -1.54,
    timestamp: '125456',
  },
  {
    ticker: 'PUMA',
    name: 'PUMA Sports',
    last: 11.34,
    change: 2.4,
    changePercent: 1.34,
    timestamp: '125456',
  },
];

function addLocalStorage() {
  let watchedItems = [
    { ticker: 'AAPL', name: 'Apple company' },
    { ticker: 'TSLA', name: 'TSLA Cor' },
    { ticker: 'MSFT', name: 'MSFT Cor' },
  ];
  localStorage.setItem('Watchlist', JSON.stringify(watchedItems));
}

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  isEmpty;
  fetchFinish = false
  watchlistArr
  fetchSubscribe: Subscription;
  tickerInfoArr
  tickerInfoArr1
  infoArr1
  basicinfo1
  

  constructor(private backendService: BackendService, private router: Router) { }

  checkEmpty(){
    this.watchlistArr = localStorage.getItem('Watchlist')
      ? JSON.parse(localStorage.getItem('Watchlist'))
      : [];
    if (this.watchlistArr.length) {
      this.isEmpty = false;
    } else {
      this.isEmpty = true;
    }
  }
  fetchAllTicker() {
    this.fetchSubscribe = timer(0, 15000).subscribe(() => {
      this.checkEmpty();
      let callArr = [];
      this.watchlistArr.forEach((item) => {
        callArr.push(this.backendService.fetchLatestPrice(item.ticker));
      });
      console.log("888",callArr[1])
      forkJoin(callArr).subscribe((responses) => {
        let infoArr = [];
        responses.forEach((res: Latestprice) => {
          
          let info = {
            last: res.c,
            change: res.d,
            changePercent: res.dp,
            
          };
          infoArr.push(info);
        });

        this.tickerInfoArr1 = infoArr;
        console.log("000",this.tickerInfoArr1[1]);
        let final = []
        for(var i=0; i<this.tickerInfoArr1.length; i++){
        final.push(Object.assign(this.tickerInfoArr1[i],this.watchlistArr[i]))
        }
        this.tickerInfoArr = final
        console.log("111",this.tickerInfoArr);
        console.log("222",this.watchlistArr);
        this.fetchFinish = true;  
      });
    });
  }


  public removeFromWatchlist(tickerItem) {
    this.tickerInfoArr.splice(this.tickerInfoArr.indexOf(tickerItem), 1);
    let watchlistArrOld = JSON.parse(localStorage.getItem('Watchlist'));
    let watchlistArrNew = watchlistArrOld.filter(
      (data) => data.ticker != tickerItem.ticker.toUpperCase()
    );
    localStorage.setItem('Watchlist', JSON.stringify(watchlistArrNew));
    this.checkEmpty();
  }

  public linkToDetails(ticker) {
    this.router.navigateByUrl('/search/' + ticker);
  }


  ngOnInit(): void {
    this.fetchAllTicker();
    //addLocalStorage();
  }
  ngOnDestroy() {
    this.fetchSubscribe.unsubscribe();
    console.log('Exist from Watchlist');
  }

}
