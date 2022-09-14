
   
import { Host, Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { HOST } from './host-name';

import { SearchUtility } from './search-utility';
import { Companydesp } from './companydesp';
import { Latestprice } from './latestprice';
import { Companypeers } from './companypeers';
import { News } from './news';
import  {Historydata} from './historydata';
import {SocialSentiment} from './socialsentiment';
import {RecommentdationDate} from './recommentdationdata';
import {Companyearnings} from './companyearnings'

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  //private searchutilPre = HOST + 'api/v1.0.0/searchutil';




  constructor(private http: HttpClient) {}

  fetchSearchutil(ticker: string): Observable<SearchUtility[]> {
    //const searchutilUrl = `http://0.0.0.0:4200/api/v1.0.0/searchutil/${ticker}`;
    const searchutilUrl = HOST+`/api/v1.0.0/searchutil/${ticker}`;
    return this.http.get<SearchUtility[]>(searchutilUrl).pipe(
      catchError(this.handleError('fetchSearchutil', [])) // then handle the error
    );
  }

  fetchCompanydesp(ticker: string): Observable<Companydesp> {
    const CompanydespUrl = HOST+`/api/v1.0.0/companydesp/${ticker}`;
    return this.http.get<Companydesp>(CompanydespUrl);
  }

  fetchLatestPrice(ticker: string): Observable<Latestprice> {
    const latestPriceUrl = HOST+`/api/v1.0.0/latestprice/${ticker}`;
    return this.http.get<Latestprice>(latestPriceUrl);
    
  }

  fetchCompanyPeer(ticker: string): Observable<Companypeers> {
    const companyPeersUrl = HOST+`/api/v1.0.0/companypeersdata/${ticker}`;
    return this.http.get<Companypeers>(companyPeersUrl);  
  }

  fetchNews(ticker: string): Observable<News> {
    const newsUrl = HOST+`/api/v1.0.0/news/${ticker}`;
    return this.http.get<News>(newsUrl);  
  }

  fetchHistorydata(ticker: string, from_unix:number, to_unix:number): Observable<Historydata> {
    const hisUrl = HOST+`/api/v1.0.0/histdata/${ticker}/${from_unix}/${to_unix}`;
    return this.http.get<Historydata>(hisUrl);  
  }

  fetchHistorydata2(ticker: string): Observable<Historydata> {
    const hisUrl2 = HOST+`/api/v1.0.0/histdata2/${ticker}`;
    return this.http.get<Historydata>(hisUrl2);  
  }

  fetchSocialSentiment(ticker: string): Observable<SocialSentiment> {
    const ssUrl = HOST+`/api/v1.0.0/socialsentimentdata/${ticker}`;
    return this.http.get<SocialSentiment>(ssUrl);  
  }
  fetchRecommentdation(ticker: string): Observable<RecommentdationDate> {
    const ddUrl = HOST+`/api/v1.0.0/recommendationdata/${ticker}`;
    return this.http.get<RecommentdationDate>(ddUrl);  
  }

  fetchCompanyearnings(ticker: string): Observable<Companyearnings> {
    const Url = HOST+`/api/v1.0.0/companyearningsdata/${ticker}`;
    return this.http.get<Companyearnings>(Url);  
  }













  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

