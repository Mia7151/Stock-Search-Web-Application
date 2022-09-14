import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { switchMap, debounceTime, tap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { SearchUtility } from '../search-utility';
import { interval, Subject, Subscription, timer } from 'rxjs';


@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})


export class SearchFormComponent implements OnInit {
  filteredCompanies: SearchUtility[] = [];
  // add config doc to fix it
  searchForm: FormGroup;
  isLoading = false;
  symbol: string;
  valid: string;

  noinputMessage = '';
  private _noinputAlertMessage = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private backService: BackendService
  ) {}

  

  ngOnInit():void{
    this.searchForm = this.formBuilder.group({ tickerInput: '' });
    console.log("search-form");
    // add config doc to fix it
    this.searchForm
      .get('tickerInput')
      .valueChanges.pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap((value) =>
          this.backService
            .fetchSearchutil(value)
            .pipe(finalize(() => (this.isLoading = false)))
        )
      )
      .subscribe((companies) => (this.filteredCompanies = companies));

      this._noinputAlertMessage.subscribe(
        (message) => (this.noinputMessage = message)
       );
       this._noinputAlertMessage
        .pipe(debounceTime(5000))
        .subscribe(() => (this.noinputMessage = ''));
  }
  
  //change ticker to symbol ortherwise http://localhost:4200/details/A has mistake like http://localhost:4200/details%njnfobject%jjkj
  onSubmit(tickerData) {
    if (tickerData.tickerInput.symbol) {
      this.symbol = tickerData.tickerInput.symbol.toUpperCase();
      this.router.navigateByUrl('/search/' + this.symbol);
      //console.log('111',this.symbol)
    } else {
      this.symbol = tickerData.tickerInput.toUpperCase();
      console.log('112',typeof this.symbol)
      if (this.symbol.length === 0){
        console.log('113',typeof this.symbol)
        this._noinputAlertMessage.next("Message successfully changed.")
        this.router.navigateByUrl('/search');
      }else{
        console.log('114',typeof this.symbol)
        //
        this.router.navigateByUrl('/search/' + this.symbol);
      }
    }

    console.log('ticker in form: ', this.symbol);
    //this.searchForm.reset();

    
    
  }

  displayFn(company: SearchUtility) {
    if (company) {
      return company.symbol;
    }
  }
}
