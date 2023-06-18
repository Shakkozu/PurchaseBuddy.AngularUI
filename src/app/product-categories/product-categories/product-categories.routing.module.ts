import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { AddNewProductCategoryComponent } from '../components/add-new-product-category/add-new-product-category.component';
import { ProductCategoriesListComponent } from '../components/product-categories-list/product-categories-list.component';

export const routes = [
  { path: 'user-product-categories', component: ProductCategoriesListComponent, canActivate: [AuthGuard] },
  { path: 'user-product-categories/add', component: AddNewProductCategoryComponent, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductCategoriesRoutingModule {
}
