import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Companydesp } from './companydesp';
import {Companyearnings} from './companyearnings'
import {Companypeers} from './companypeers'
import {Historydata} from './historydata';
import { Latestprice } from './latestprice';
import { News } from './news';
import {RecommentdationDate} from './recommentdationdata';

import {SocialSentiment} from './socialsentiment';




@Injectable({
  providedIn: 'root'
})
export class StoreService {
  items: Companydesp[]=[]; 
  tickerStore =[];
  companyearningsSrore:Companyearnings[] = []
  companypeersStore:Companypeers[] = []
  newsStore: News[] = []
  recommendationStore: RecommentdationDate[] = []
  socialsentimentStore: SocialSentiment[]=[]
  


  //searchUtility



  //socialsentiment
  addToSocialsentiment(socialSentiment: SocialSentiment){
    if(this.socialsentimentStore.length === 0 ){
      this.socialsentimentStore.push(socialSentiment)
    }else{
      this.socialsentimentStore[0] = socialSentiment
    }
    
  }
  getSocialsentiment(){
    return this.socialsentimentStore
  }
  clearSocialsentiment(){
    this.socialsentimentStore= [];
    return this.socialsentimentStore;
  }

  //recommendation
  addToRecommendation(recommentdationDate: RecommentdationDate){
    if(this.recommendationStore.length === 0 ){
      this.recommendationStore.push(recommentdationDate)
    }else{
      this.recommendationStore[0] = recommentdationDate
    }
    
  }
  getRecommendation(){
    return this.recommendationStore
  }
  clearRecommendation(){
    this.recommendationStore = [];
    return this.recommendationStore;
  }


  //news
  addToNews(news: News){
    if(this.newsStore.length === 0 ){
      this.newsStore.push(news)
    }else{
      this.newsStore[0] = news
    }
    
  }
  getNews(){
    return this.newsStore
  }
  clearNews(){
    this.newsStore = [];
    return this.newsStore;
  }





  //Companypeers
  addToCompanypeers(companypeers: Companypeers){
    if(this.companypeersStore.length === 0 ){
      this.companypeersStore.push(companypeers)
    }else{
      this.companypeersStore[0] = companypeers
    }
    
  }
  getCompanypeers(){
    return this.companypeersStore
  }
  clearCompanypeers(){
    this.companyearningsSrore = [];
    return this.companyearningsSrore;
  }


  //Companyearnings
  addToCompanyearnings(companyearnings: Companyearnings){
    if(this.companyearningsSrore.length === 0 ){
      this.companyearningsSrore.push(companyearnings)
    }else{
      this.companyearningsSrore[0] = companyearnings
    }
    
  }
  getCompanyearnings(){
    return this.companyearningsSrore
  }
  clearCompanyearningsSrore(){
    this.companyearningsSrore = [];
    return this.companyearningsSrore;
  }

  //Companydesp
  addToStore(companydesp: Companydesp){
    if(this.items.length === 0 ){
      this.items.push(companydesp)
    }else{
      this.items[0] = companydesp
    }
    
  }
  getItems(){
    return this.items
  }
  clearItem(){
    this.items = [];
    return this.items;
  }
  //ticker
  addToTicker(ticker){
    if(this.tickerStore.length === 0 ){
      this.tickerStore.push(ticker)
    }else{
      this.tickerStore[0] = ticker
    }

  }
  getTicker(){
    return this.tickerStore
  }
  clearTicker(){
    this.tickerStore = [];
    return this.tickerStore
  }
  




  constructor(
    
  ) { }
}
