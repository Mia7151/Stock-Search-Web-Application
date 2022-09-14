import { Component, Host, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { interval, Subject, Subscription, timer } from 'rxjs';
import { switchMap, debounceTime, takeWhile } from 'rxjs/operators';
import { HOST } from '../host-name';
import {Router} from '@angular/router';


import { BackendService } from '../backend.service';
import { Companydesp } from '../companydesp';
import { Latestprice } from '../latestprice';
import { News } from '../news';
import { NewsDetailComponent } from '../news-detail/news-detail.component';
import {Historydata} from '../historydata';
import {SocialSentiment} from '../socialsentiment';
import {RecommentdationDate} from '../recommentdationdata';
import {Companyearnings} from '../companyearnings';


import * as Highcharts from 'highcharts/highstock';
import { Options } from 'highcharts';
declare var require: any;
require('highcharts/indicators/indicators')(Highcharts); 
require('highcharts/indicators/volume-by-price')(Highcharts); 

import { Chart } from 'angular-highcharts';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { TransactionButtonComponent } from '../transaction-button/transaction-button.component';



import * as moment from 'moment';
import 'moment-timezone';
import { newArray } from '@angular/compiler/src/util';

//for store
import {StoreService} from '../store.service'

//

function LATimezonOffset(timestamp) {
  var zone = 'America/Los_Angeles',
    timezoneOffset = -moment.tz(timestamp, zone).utcOffset();

  return timezoneOffset;
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  companydesp;
  ticker: string = '';
  tickerExist = true;
  latestprice;
  fetchSubscribe;
  change: number;
  dailyPriceColor;
  changePercent: number;
  lasttimestamp;
  localcurrenttimestamp;
  openstatus = false;
  companypeers;
  allnews;
  historydata;
  from_unix;
  to_unix;
  dailyChartsColor;
  lastWorkingDate;
  historydata2;

  //for insights
  socialsentiment;
  r_mention;
  r_pmention;
  r_nmention;
  t_mention;
  t_pmention;
  t_nmention;

  recommentdation;
  companyearnings;



  // for highchart
  histChartsFinish2 = false;
  histChartsFinish = false;
  isHighcharts = typeof Highcharts === 'object';
  chartConstructor = 'stockChart';
  Highcharts: typeof Highcharts = Highcharts; 

  histChartOptions2: Options;
  histChartOptions: Options;
  recommdationOptions: Options;
  CompanyearningsOptions:Options;

  //watchlist
  starSuccessMessage = ''
  private _StarAlertSuccess = new Subject<string>();
  inWatchlist = false
  //porfolio
  inPortfolio = false

  //transcation
  buySuccessMessage = '';
  private _buyAlertSuccess = new Subject<string>();
  sellSuccessMessage = '';
  private _sellAlertSuccess = new Subject<string>();

  noinputMessage = '';
  private _noinputMessage = new Subject<string>();

  //store
  storeTicker: String
  state = 0


  
  createHistoryCharts(){
    let historyClose = [], datalength = this.historydata.t.length;
    let i, intTimestamp;
    for (i = 0; i < datalength; i += 1) {
      intTimestamp = this.historydata.t[i];
      historyClose.push([intTimestamp*1000, this.historydata.c[i]]);
    }
    
    //historyClose = [[1647542100000, 159.59], [1647542400000, 159.79], [1647542700000, 159.74], [1647543000000, 159.67], [1647543300000, 159.901], [1647543600000, 160.04], [1647543900000, 159.73], [1647544200000, 159.52], [1647544500000, 159.67], [1647544800000, 159.55], [1647545100000, 159.77], [1647545400000, 159.83], [1647545700000, 159.87], [1647546000000, 160.38], [1647546300000, 160.189], [1647546600000, 160.19], [1647546900000, 160.99], [1647547200000, 160.38], [1647547500000, 160.37], [1647547800000, 160.37], [1647548100000, 160.46], [1647548400000, 160.35], [1647548700000, 160.12], [1647549000000, 160.09], [1647549300000, 159.85], [1647549600000, 159.7], [1647549900000, 160.05], [1647550200000, 159.91], [1647550500000, 159.93], [1647550800000, 159.9], [1647551100000, 159.94], [1647551400000, 159.95], [1647551700000, 160], [1647552000000, 159.96], [1647552300000, 160], [1647552600000, 160], [1647552900000, 160], [1647553200000, 160], [1647553500000, 160], [1647553800000, 159.99], [1647554400000, 160.05], [1647554700000, 159.91], [1647555000000, 159.8], [1647555300000, 159.8], [1647555600000, 159.86], [1647555900000, 159.85], [1647556200000, 159.9], [1647556500000, 159.82], [1647556800000, 159.73], [1647557100000, 159.8], [1647557400000, 159.76], [1647557700000, 159.8], [1647558000000, 159.85], [1647558300000, 159.7], [1647558600000, 159.74], [1647558900000, 159.82], [1647559200000, 159.79], [1647559500000, 159.75], [1647559800000, 159.74], [1647560100000, 159.85], [1647560400000, 159.77], [1647560700000, 159.72], [1647561000000, 159.76], [1647561300000, 159.82]] 


    this.histChartOptions = {
      series: [
        {
          data: historyClose,
          color: this.dailyPriceColor,
          showInNavigator: true,
          name: this.ticker.toUpperCase(),
          type: 'line',
          tooltip: {
            valueDecimals: 2,
          },
        },
      ],
      title: { text: this.ticker.toUpperCase() + ' Hourly Price Variation' },
      rangeSelector: {
        enabled: false,
      },
      navigator: {
          enabled: false,   
      },
      time: {
        getTimezoneOffset: LATimezonOffset,
      },
      
    }; 
  }
  
  createHistCharts2(){
    let groupingUnits = [
      [
        'week', // unit name
        [1], // allowed multiples
      ],
      ['month', [1, 2, 3, 4, 6]],
    ];
    let i, intTimestamp;
    let ohlc = [], volume=[],l=this.historydata2.t.length
    for (i=0; i<l;i++){
      intTimestamp = this.historydata2.t[i]*1000
      ohlc.push(
        [intTimestamp,
        this.historydata2.o[i],
        this.historydata2.h[i],
        this.historydata2.l[i],
        this.historydata2.c[i]]
      )
      volume.push([intTimestamp,this.historydata2.v[i]])
    }
    
    this.histChartOptions2 = {
      series: [
        {
          type: 'candlestick',
          name: this.ticker.toUpperCase(),
          id: this.ticker,
          zIndex: 2,
          data: ohlc,
        },
        {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: volume,
          yAxis: 1,
        },
        {
          type: 'vbp',
          linkedTo: this.ticker,
          params: {
            volumeSeriesID: 'volume',
          },
          dataLabels: {
            enabled: false,
          },
          zoneLines: {
            enabled: false,
          },
        },
        {
          type: 'sma',
          linkedTo: this.ticker,
          zIndex: 1,
          marker: {
            enabled: false,
          },
        },
      ],
      title: { text: this.ticker.toUpperCase() + ' Historical' },
      subtitle: {
        text: 'With SMA and Volume by Price technical indicators',
      },
      yAxis: [
        {
          startOnTick: false,
          endOnTick: false,
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'OHLC',
          },
          height: '60%',
          lineWidth: 2,
          resize: {
            enabled: true,
          },
        },
        {
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'Volume',
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2,
        },
      ],
      tooltip: {
        split: true,
      },
      plotOptions: {
        
      },
      rangeSelector: {
        buttons: [
          {
            type: 'month',
            count: 1,
            text: '1m',
          },
          {
            type: 'month',
            count: 3,
            text: '3m',
          },
          {
            type: 'month',
            count: 6,
            text: '6m',
          },
          {
            type: 'ytd',
            text: 'YTD',
          },
          {
            type: 'year',
            count: 1,
            text: '1y',
          },
          {
            type: 'all',
            text: 'All',
          },
        ],
        selected: 2,
      },
      time: {
        getTimezoneOffset: LATimezonOffset,
      },
    };}

  createCommentTable(){
    //let r = this.socialsentiment.reddit
    let rl = this.socialsentiment.reddit.length
    this.r_mention = 0
    this.r_pmention = 0
    this.r_nmention = 0
    for (var i=0; i<rl;i++){
      this.r_mention += this.socialsentiment.reddit[i].mention
      this.r_pmention += this.socialsentiment.reddit[i].positiveMention
      this.r_nmention += this.socialsentiment.reddit[i].negativeMention
    }

    //let t = this.socialsentiment.twitter
    let tl = this.socialsentiment.twitter.length
    this.t_mention = 0
    this.t_pmention = 0
    this.t_nmention = 0
    for (var j=0; j<tl;j++){
      this.t_mention += this.socialsentiment.twitter[j].mention
      this.t_pmention += this.socialsentiment.twitter[j].positiveMention
      this.t_nmention += this.socialsentiment.twitter[j].negativeMention
    }
    //console.log("999"+this.t_mention)


  }

  createRecommentdationChart(){
    let strongbuy = [], buy=[], hold=[], sell=[], strongsell=[]
    let x = []
    let t
    for (var i =0;i<4;i++){
      strongbuy.push(this.recommentdation[i].strongBuy)
      buy.push(this.recommentdation[i].buy)
      hold.push(this.recommentdation[i].hold)
      sell.push(this.recommentdation[i].sell)
      strongsell.push(this.recommentdation[i].strongSell)
      t = this.recommentdation[i].period.slice(0,7)
      x.push(t)
    }
    
    this.recommdationOptions={
      
        chart: {
            type: 'column'
        },
        title: {
            text: 'Recommendation Trends'
        },
        xAxis: {
            categories: x
        },
        yAxis: {
            min: 0,
            title: {
                text: '#Analysis'
            },
            stackLabels: {
                enabled: false,
                style: {
                    fontWeight: 'bold',
                    color: ( // theme
                        Highcharts.defaultOptions.title.style &&
                        Highcharts.defaultOptions.title.style.color
                    ) || 'gray'
                }
            }
        },
        legend: {
            align: 'center',
            x: -30,
            verticalAlign: 'bottom',
            y: 0,
            floating: false,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || 'white',
            borderColor: '#CCC',
            borderWidth: 0,
            shadow: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
                
            }
        },
        series: [{
            name: 'Strong Buy',
            type: undefined,
            data: strongbuy,color:'#186f37'
        }, {
            name: 'Buy',
            type: undefined,
            data: buy,color:'#1cb955'
        }, {
            name: 'Hold',
            type: undefined,
            data: hold,color:'#b88b1d'
        },
        {
            name: 'Sell',
            type: undefined,
            data: sell,color:'#f45b5a'
        },
        {
            name: 'Strong Sell',
            type: undefined,
            data: strongsell,color:'#813131'
        }] 
    }
  }

  createCompanyearningsChart() {
    let actual = [],estimate = []
    let l = this.companyearnings.length
    let x = [],x1
    for (var i=0; i<l; i++){
      actual.push([this.companyearnings[i].period,this.companyearnings[i].actual])
      estimate.push([this.companyearnings[i].period,this.companyearnings[i].estimate])
      x1 = this.companyearnings[i].period +" Suprise: " + this.companyearnings[i].surprise
      x.push(x1)
    }
    //console.log('888'+x)
    let d = [1,2,3,4]

    this.CompanyearningsOptions ={
      chart: {
        type: 'spline',
        inverted: false
    },
    title: {
        text: 'Historical EPS Surprises'
    },
    
    xAxis: {
        reversed: false,
        title: {
            //enabled: true,
            text: ''
        },
        labels: {
            format: '' 
        },
        categories: x
      ,
        
        maxPadding: 0.05,
        showLastLabel: true
    },

    yAxis: {
        title: {
            text: 'Quarterly EPS'
        },
        labels: {
            format: '{value}'
        },
        
        lineWidth: 0
    },
    legend: {
        enabled: true,
        borderColor: '#95b8f0',
        borderWidth: 0,
    },
    tooltip: {
        shared: true
    },
    plotOptions: {
        spline: {
            marker: {
                enabled: true
            }
        }
    },
    series: [{
        name: 'Actual',
        type:undefined,
        data: actual
    },{
        name: 'Estimate',
        type:undefined ,
        data: estimate
    
    }]
    } 
  }


  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private backendService: BackendService,
    private newsModalService: NgbModal,
    private transModalService: NgbModal, 

    //for store
    private storeService: StoreService,
    //
  ) { this.router.routeReuseStrategy.shouldReuseRoute=() => false;}

  fetchCompanydesp() {
    
    if (this.storeService.getTicker().length === 0){
     this.state = 1
    this.backendService.fetchCompanydesp(this.ticker).subscribe((companydesp) => {
      this.companydesp = companydesp;
      //for store
      this.storeService.addToStore(this.companydesp)
      //console.log('1111',this.storeService.getTicker())
      //console.log('2222',this.ticker.toUpperCase())
      //console.log("567",this.storeService.getItems())
      this.storeService.addToTicker(this.companydesp.ticker)
      //console.log("5678",this.storeService.getTicker())
    
      if (this.companydesp.ticker) {
        this.tickerExist = true;
      } else {
        this.tickerExist = false;
      }
      console.log('Companydesp fetched ' + Date());
      // console.log(this.metadata);
    });}else if (this.storeService.getTicker().length !== 0 && this.storeService.getItems()[0].ticker !== this.ticker){
      this.state = 2
      this.backendService.fetchCompanydesp(this.ticker).subscribe((companydesp) => {
        this.companydesp = companydesp;
        //for store
        this.storeService.addToStore(this.companydesp)
        this.storeService.addToTicker(this.companydesp.ticker)
        //console.log("5678",this.storeService.getItems()[0])
      
        if (this.companydesp.ticker) {
          this.tickerExist = true;
        } else {
          this.tickerExist = false;
        }
    })}else{
      this.state = 3
      this.companydesp = this.storeService.getItems()[0]
      //console.log("56789",this.storeService.getItems()[0].ticker)
      if (this.companydesp.ticker) {
        this.tickerExist = true;
      } else {
        this.tickerExist = false;
      }
    }
    
  }

  fetchLatestPriceNDaily(){
    //console.log('LatestPriceNDaily Start: ' + Date());

    this.fetchSubscribe = timer(0, 15000).subscribe(() => {
      console.log('Real LatestPriceNDailyCharts Start: ' + Date());
      this.backendService
        .fetchLatestPrice(this.ticker)
        .subscribe((latestprice) => {
          this.latestprice = latestprice;
          if (this.latestprice.c) {
            this.tickerExist = true;
            this.change = this.latestprice.d;
            if (this.change > 0) {
              this.dailyPriceColor = '#008000';
            } else if (this.change < 0) {
              this.dailyPriceColor = '#FF0000';
            } else {
              this.dailyPriceColor = '#000000';
            }
            this.changePercent = latestprice.dp;
              
            this.lasttimestamp = new Date(this.latestprice.t*1000);
            this.localcurrenttimestamp = Date.now(); //like 1647046048982 
  
            let timeDifference = this.localcurrenttimestamp - this.lasttimestamp;
            //console.log('Time difference:' + timeDifference / 1000 + 's');

            if (timeDifference < 60 * 1000) {
              this.openstatus = true;
            } else {
              this.openstatus = false;
            }

            // last working day can be achieve from last timestamp
            this.lastWorkingDate = this.latestprice.t;
            console.log('Last working date: ' + this.lastWorkingDate);

            if (this.openstatus == true){
              this.to_unix = Math.floor(Date.now() / 1000)
              this.from_unix = this.to_unix - 6*60*60
            }else{
              this.to_unix = this.lastWorkingDate;
              this.from_unix = this.to_unix - 6*60*60;
              //console.log('111Last working date: ' + this.lastWorkingDate);
            }
            //console.log('222 ' + this.to_unix);
            //console.log('333 ' + this.from_unix);
            this.backendService.fetchHistorydata(this.ticker,this.from_unix,this.to_unix).subscribe((historydata) => {
              this.historydata = historydata;
              //console.log('111Historydata fetched ' + Object.keys(historydata).length);
              //console.log('111Historydata fetched ' + historydata['error']);
              this.histChartsFinish = false;
              this.createHistoryCharts()
              this.histChartsFinish = true;
              console.log('histCharts created ' + Date())
            });    
 
          } else {
            this.tickerExist = false; 
            this.historydata = { detail: 'Not found.' }
          }

          //console.log('LatestPrice fetched ' + Date());
        });
    });
  }

  fetchCompanyPeers(){
    if (this.state === 1 || this.state == 2){
      this.backendService.fetchCompanyPeer(this.ticker).subscribe((companypeers) => {
        this.companypeers = companypeers;
        this.storeService.addToCompanypeers(this.companypeers )
        //console.log('Companypeers fetched1 ' , this.companypeers);
      });
    }
    else if (this.state === 3){
      this.companypeers = this.storeService.getCompanypeers()[0]
      //console.log('Companypeers fetched2 ' , this.companypeers);
    }
   

  }

  fetchNews() {
    if (this.state === 1 || this.state == 2){
    this.backendService.fetchNews(this.ticker).subscribe((allnews) => {
      this.allnews = allnews;
      this.storeService.addToNews(this.allnews)
      //console.log('News fetched1 ',this.state,this.allnews);
    });}else if (this.state === 3){
      this.allnews = this.storeService.getNews()[0]
      //console.log('News fetched2 ',this.allnews);

    }
  }

  openNewsDetail(news: News) {
    const newsModalRef = this.newsModalService.open(NewsDetailComponent);
    newsModalRef.componentInstance.news = news;
  }


  fetchHistorydata(){
    this.backendService.fetchHistorydata2(this.ticker).subscribe((historydata2) => {
      this.historydata2 = historydata2;
      //console.log('historydata2 fetched ' + Date());
      //console.log('historydata2 fetched ' + this.historydata2.length);
      this.histChartsFinish2 = false;
      this.createHistCharts2();
      this.histChartsFinish2 = true;
    });
  }

  fetchSocialSentiment(){
    if (this.state === 1 || this.state == 2){
    this.backendService.fetchSocialSentiment(this.ticker).subscribe((socialsentiment) => {
      this.socialsentiment = socialsentiment;
      this.storeService.addToSocialsentiment(this.socialsentiment)
      console.log('1socialsentimentdata fetched ',this.state,this.socialsentiment);
      this.createCommentTable();
    })}else if(this.state === 3){
      this.socialsentiment = this.storeService.getSocialsentiment()[0]
      this.createCommentTable();
      console.log('2socialsentimentdata fetched ',this.state,this.socialsentiment);
    }
  }

  fetchRecommentdation(){
    if (this.state === 1 || this.state == 2){
    this.backendService.fetchRecommentdation(this.ticker).subscribe((recommentdation) => {
      this.recommentdation = recommentdation;
      this.storeService.addToRecommendation(this.recommentdation)
      //console.log('1Recommentdation data fetched ',this.state,this.recommentdation);
      this.createRecommentdationChart() 
    })}else if (this.state === 3){
      this.recommentdation = this.storeService.getRecommendation()[0]
      this.createRecommentdationChart() 
      //console.log('2Recommentdation data fetched ',this.state,this.recommentdation);
    }
  }

  fetchCompanyearnings(){
    if (this.state === 1 ||this.state === 2){
      //console.log("443",this.storeService.getCompanyearnings[0])
    this.backendService.fetchCompanyearnings(this.ticker).subscribe((companyearnings) => {
      this.companyearnings = companyearnings;
      this.storeService.addToCompanyearnings(this.companyearnings )
      //console.log('444Companyearnings data fetched ', this.storeService.getCompanyearnings());
      //console.log("4431",this.storeService.getCompanyearnings[0])
      this.createCompanyearningsChart() 
    })}else if (this.state === 3){
      this.companyearnings = this.storeService.getCompanyearnings()[0]
      this.createCompanyearningsChart()
      //console.log('446Companyearnings data fetched ' + this.storeService.getCompanyearnings());
    }
  }

  checkWatchlist(){
    let watchlistArr = localStorage.getItem('Watchlist')
      ? JSON.parse(localStorage.getItem('Watchlist'))
      : [];
    let result = watchlistArr.filter(
      (data) => data.ticker === this.ticker.toUpperCase()
    );
    if (result.length) {
      this.inWatchlist = true;
    } else {
      this.inWatchlist = false;
    }
  }

  checkPortfolio(){
    let portfolioArr = localStorage.getItem('Portfolio')
      ? JSON.parse(localStorage.getItem('Portfolio'))
      : [];
    let result = portfolioArr.filter(
      (data) => data.ticker === this.ticker.toUpperCase()
    );
    if (result.length) {
      this.inPortfolio = true;
    } else {
      this.inPortfolio = false;
    }
    //console.log("I am checking inportforlio now")
  }

  public onClickStar() {
    this.inWatchlist = !this.inWatchlist;
    let watchlistArr, watchlistArrNew;

    watchlistArr = localStorage.getItem('Watchlist')
      ? JSON.parse(localStorage.getItem('Watchlist'))
      : [];
    if (this.inWatchlist) {
      let watchlistItemNew = {
        ticker: this.ticker.toUpperCase(),
        name: this.companydesp.name,
      };
      watchlistArr.push(watchlistItemNew);
      localStorage.setItem('Watchlist', JSON.stringify(watchlistArr));
    } else {
      
      watchlistArrNew = watchlistArr.filter(
        (data) => data.ticker != this.ticker.toUpperCase()
      );
      localStorage.setItem('Watchlist', JSON.stringify(watchlistArrNew));
    }
    this._StarAlertSuccess.next('Message successfully changed.');
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
        this.checkPortfolio()
        //console.log("check res",this.inPortfolio)
        // trigger opt alert
        //console.log("12345",recItem);
        // for buy alert
        if (typeof recItem !== 'string'){
        this._buyAlertSuccess.next('Message successfully changed.');}
      });
    }else{
    transModalRef.result.then((recItem) => {
      this.checkPortfolio()
      //console.log("check res",this.inPortfolio)
      // trigger opt alert
      //console.log("123456",typeof recItem);
      // for buy alert
      if (typeof recItem !== 'string'){
      this._sellAlertSuccess.next('Message successfully changed.');}
    });}  
  }





  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.ticker = params.get('ticker');
      console.log('ticker name in details: ' + this.ticker);
    });
    this.fetchCompanydesp();
    this.fetchLatestPriceNDaily();
    this.fetchCompanyPeers()
    this.fetchNews()
    this.fetchHistorydata()
    this.fetchSocialSentiment()
    this.fetchRecommentdation()
    this.fetchCompanyearnings()
    // watchlist star click
    this.checkWatchlist();
    //
    this.checkPortfolio();

    this._StarAlertSuccess.subscribe(
      (message) => (this.starSuccessMessage = message)
    );
    this._StarAlertSuccess
      .pipe(debounceTime(5000))
      .subscribe(() => (this.starSuccessMessage = ''));

   //transcation
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
  

  this._noinputMessage.subscribe(
    (message) => (this.noinputMessage = message)
   );
   this._noinputMessage
    .pipe(debounceTime(5000))
    .subscribe(() => (this.noinputMessage  = ''));
  }
  

  ngOnDestroy() {
    this.fetchSubscribe.unsubscribe();
    console.log(`Exist from Details/${this.ticker}`);
  }

}
