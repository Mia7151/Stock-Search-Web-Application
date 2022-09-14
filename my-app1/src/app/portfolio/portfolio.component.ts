import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription, timer, forkJoin } from 'rxjs';
import { TransactionButtonComponent } from '../transaction-button/transaction-button.component';
import { BackendService } from '../backend.service';
import { Latestprice } from '../latestprice';
import { switchMap, debounceTime, takeWhile } from 'rxjs/operators';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  portfolioArr;
  isEmpty;
  tickerInfoArr; 
  tickerInfoArr1; 
  fetchFinish = false;
  fetchSubscribe: Subscription;
  moneyinwallet; 
  tickerinalert


  buySuccessMessage = '';
  private _buyAlertSuccess = new Subject<string>();
  sellSuccessMessage = '';
  private _sellAlertSuccess = new Subject<string>();
  

  constructor(private backendService: BackendService,private transModalService: NgbModal) { }

  checkEmpty() {
    this.portfolioArr = localStorage.getItem('Portfolio')
      ? JSON.parse(localStorage.getItem('Portfolio'))
      : [];
    if (this.portfolioArr.length) {
      this.isEmpty = false;
    } else {
      this.isEmpty = true;
    }
  }

  fetchmoneyinwallet(){
    this.moneyinwallet = parseFloat(localStorage.getItem('moneyinwallet'))
    console.log('111',this.moneyinwallet )
  }

  fetchAllTicker() {
    
    this.fetchSubscribe = timer(0, 15000).subscribe(() => {
      console.log('Start fetch ' + Date());
      this.checkEmpty();
      let callArr = [];
      this.portfolioArr.forEach((item) => {
        callArr.push(this.backendService.fetchLatestPrice(item.ticker));
      });
      forkJoin(callArr).subscribe((responses) => {
        let infoArr = [];
        responses.forEach((res: Latestprice,i) => {
          let tmpItem = this.portfolioArr[i]
          let avgcst = tmpItem.totalCost / tmpItem.quantity;
          let info = {
            ticker: tmpItem.ticker,
            name: tmpItem.name,
            quantity: tmpItem.quantity,
            totalCost: tmpItem.totalCost,
            avgCost: avgcst, // totalCost / quantity
            change: avgcst - res.c, // totalCost / quantity - latestprice.last
            currentPrice: res.c, // latestprice.last
            marketValue: res.c* tmpItem.quantity, // latestprice.last * quantity
          };
          infoArr.push(info);
        });
        //console.log("1234",this.portfolioArr);
        this.tickerInfoArr = infoArr;
        this.fetchFinish = true;
        console.log("1234"+this.tickerInfoArr);
      });
    });
  }

  



  public removeFromPortfolio(tickerItem) {
    let portfolioArrOld = JSON.parse(localStorage.getItem('Portfolio'));
    let portfolioArrNew = portfolioArrOld.filter(
      (data) => data.ticker != tickerItem.ticker.toUpperCase()
    );
    localStorage.setItem('Portfolio', JSON.stringify(portfolioArrNew));
    this.checkEmpty();
  }

  removeFromTickerInfoArr(tickerItem) {
    let tickerInfoArrNew = this.tickerInfoArr.filter(
      (data) => data.ticker != tickerItem.ticker
    );
    this.tickerInfoArr = tickerInfoArrNew;
  }

  openTransectionButton(ticker, name, currentPrice, opt) {
    const transModalRef = this.transModalService.open(
      TransactionButtonComponent
    );
    transModalRef.componentInstance.ticker = ticker;
    transModalRef.componentInstance.name = name;
    transModalRef.componentInstance.currentPrice = currentPrice;
    transModalRef.componentInstance.opt = opt;

    if (opt === "Buy"){
      transModalRef.result.then((recItem) => {
        this.moneyinwallet = parseFloat(localStorage.getItem('moneyinwallet'))
        if (recItem) {
          console.log(recItem);
          if (recItem.quantity === 0) {
            // remove from this.portfolioArr and update
            this.removeFromPortfolio(recItem);
            this.removeFromTickerInfoArr(recItem);
          } else {
            // modify this.portfolioArr & this.tickerInforArr
            this.checkEmpty();  // update this.portfolioArr from localStorage
            this.tickerInfoArr.forEach((item, i) => {
              if (item.ticker == recItem.ticker) {
                this.tickerInfoArr[i].quantity = recItem.quantity;
                this.tickerInfoArr[i].totalCost = recItem.totalCost;
                this.tickerInfoArr[i].avgCost =
                  recItem.totalCost / recItem.quantity;
                this.tickerInfoArr[i].marketValue =
                  recItem.quantity * this.tickerInfoArr[i].currentPrice;
                this.tickerInfoArr[i].change =
                  this.tickerInfoArr[i].currentPrice -
                  recItem.totalCost / recItem.quantity;
              }
            });
          }
          if (typeof recItem !== 'string'){
            this.tickerinalert = recItem.ticker
            console.log('tickerinalet:',this.tickerinalert)
            this._buyAlertSuccess.next('Message successfully changed.');}
        }
      }
      )}
    else{
    transModalRef.result.then((recItem) => {
      this.moneyinwallet = parseFloat(localStorage.getItem('moneyinwallet'))
      if (recItem) {
        console.log(recItem);
        if (recItem.quantity === 0) {
          // remove from this.portfolioArr and update
          this.removeFromPortfolio(recItem);
          this.removeFromTickerInfoArr(recItem);
        } else {
          // modify this.portfolioArr & this.tickerInforArr
          this.checkEmpty();  // update this.portfolioArr from localStorage
          this.tickerInfoArr.forEach((item, i) => {
            if (item.ticker == recItem.ticker) {
              this.tickerInfoArr[i].quantity = recItem.quantity;
              this.tickerInfoArr[i].totalCost = recItem.totalCost;
              this.tickerInfoArr[i].avgCost =
                recItem.totalCost / recItem.quantity;
              this.tickerInfoArr[i].marketValue =
                recItem.quantity * this.tickerInfoArr[i].currentPrice;
              this.tickerInfoArr[i].change =
                this.tickerInfoArr[i].currentPrice -
                recItem.totalCost / recItem.quantity;
            }
          });
        }
        if (typeof recItem !== 'string'){
          this.tickerinalert = recItem.ticker
          console.log('tickerinalet:',this.tickerinalert)
          this._sellAlertSuccess.next('Message successfully changed.');}
      }
    })}
    ;
  }





  ngOnInit(): void {
    this.fetchAllTicker();
    this.fetchmoneyinwallet()
    
    this._buyAlertSuccess.subscribe(
      (message) => (this.buySuccessMessage = message)
     );
     this._buyAlertSuccess
      .pipe(debounceTime(5000))
      .subscribe(() => (this.buySuccessMessage = ''));
    
    this._sellAlertSuccess.subscribe(
      (message) => (this.sellSuccessMessage = message)
     );
     this._sellAlertSuccess
      .pipe(debounceTime(5000))
      .subscribe(() => (this.sellSuccessMessage = ''));
    
 


    //addLocalStorage();
    //this.checkEmpty();
    //this.tickerInfoArr = mockInfoArr;
    //this.fetchFinish = true;
  }

  ngOnDestroy(): void {
    this.fetchSubscribe.unsubscribe();  
    console.log('Exist from Portfolio');
  }

}
