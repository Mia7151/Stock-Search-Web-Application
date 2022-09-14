import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TopBarComponent } from './top-bar/top-bar.component';
//import { SearchBarComponent } from './search-bar/search-bar.component';


import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SearchFormComponent } from './search-form/search-form.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DetailsComponent } from './details/details.component';
import { FooterComponent } from './footer/footer.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule } from '@angular/material/tabs';
import { NewsDetailComponent } from './news-detail/news-detail.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartModule } from 'angular-highcharts';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { TransactionButtonComponent } from './transaction-button/transaction-button.component';



@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    TopBarComponent,
    //SearchBarComponent,
    SearchFormComponent,
    DetailsComponent,
    FooterComponent,
    NewsDetailComponent,
    ModalComponent,
    WatchlistComponent,
    PortfolioComponent,
    TransactionButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatTabsModule,
    NgbModule,
    HighchartsChartModule,
    ChartModule
    
    
  ],
  providers: [NgbActiveModal,],
  bootstrap: [AppComponent]
})
export class AppModule { }
