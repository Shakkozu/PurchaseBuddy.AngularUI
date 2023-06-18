import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewProductCategoryComponent } from '../components/add-new-product-category/add-new-product-category.component';
import { ProductCategoriesRoutingModule } from './product-categories.routing.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { UserProductCategoriesState } from '../store/product-categories-state';
import { ProductCategoriesListComponent } from '../components/product-categories-list/product-categories-list.component';
import { DeleteProductsCategoryDialogComponent } from '../components/delete-products-category-dialog/delete-products-category-dialog.component';
import { ProductCategoriesTreeComponent } from '../components/product-categories-tree/product-categories-tree.component';



@NgModule({
  declarations: [
    AddNewProductCategoryComponent,
    ProductCategoriesListComponent,
    DeleteProductsCategoryDialogComponent,
    ProductCategoriesTreeComponent,
  ],
  imports: [
    ProductCategoriesRoutingModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxsModule.forFeature([UserProductCategoriesState]),
  ],
  exports: [
    ProductCategoriesTreeComponent,
  ]
})
export class ProductCategoriesModule { }



