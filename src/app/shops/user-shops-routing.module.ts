import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserShopsListComponent } from './components/user-shops-list/user-shops-list.component';
import { UserShopDetailsComponent } from './components/user-shop-details/user-shop-details.component';
import { AuthGuard } from '../auth/auth.guard';


const routes: Routes = [
  { path: 'user-shops', component: UserShopsListComponent, canActivate: [AuthGuard] },
  { path: 'user-shop-details/new', component: UserShopDetailsComponent, canActivate: [AuthGuard] },
  { path: 'user-shop-details/:id', component: UserShopDetailsComponent, canActivate: [AuthGuard] },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserShopsRoutingModule { }
