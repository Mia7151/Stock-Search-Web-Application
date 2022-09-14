import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetailsComponent } from "./details/details.component";
import { SearchFormComponent } from "./search-form/search-form.component";
import { WatchlistComponent } from "./watchlist/watchlist.component";
import { PortfolioComponent } from "./portfolio/portfolio.component";

const routes: Routes = [
  { path: '', redirectTo:'search',pathMatch:'full'},
  { path: 'search', component: SearchFormComponent,children:[{path:':ticker',component: DetailsComponent}] },
  //{ path: 'search/:ticker', component: SearchFormComponent },
  { path: 'watchlist', component: WatchlistComponent },
  { path: 'portfolio', component: PortfolioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
