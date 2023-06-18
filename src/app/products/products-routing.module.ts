import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProductsListComponent } from './components/user-products-list.component';
import { UserProductDetailsComponent } from './components/product-details/product-details.component';
import { AuthGuard } from '../auth/auth.guard';


const routes: Routes = [
  { path: 'user-products', component: UserProductsListComponent, canActivate: [AuthGuard] },
  { path: 'user-product-details/new', component: UserProductDetailsComponent, canActivate: [AuthGuard] },
  { path: 'user-product-details/:id', component: UserProductDetailsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
