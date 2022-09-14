import { Component, OnInit } from '@angular/core';
import {StoreService} from '../store.service'
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router'

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  tickerStored;
  tickerStored1;

  initializemoney(){
    if (localStorage.getItem('moneyinwallet')==null){
      localStorage.setItem('moneyinwallet', JSON.stringify(25000))
    }
    console.log("moneyinwallet",localStorage.getItem('moneyinwallet'))
  }

  reloadnew(){
    this.tickerStored = this.storeService.getTicker()
    console.log('1122',this.tickerStored)
    if(this.tickerStored.length == 0){
      this.router.navigateByUrl('/search')
    } else{
      console.log('1122',this.tickerStored[0])
      this.tickerStored1 = this.tickerStored[0]
      this.router.navigateByUrl('/search/' + this.tickerStored[0])
    }
  }



  constructor(
    private storeService: StoreService,
    private router:Router,
  ) { }

  ngOnInit(): void {
    this.initializemoney()
  }


}
