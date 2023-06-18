import { Component } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FormGroup } from '@angular/forms';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { Store } from '@ngxs/store';
import { Subject, firstValueFrom, takeUntil } from 'rxjs';
import { ProductCategoryNode, ExampleFlatNode, ProductCategoryFlatNode } from '../../product-categories.model';
import { UserProductCategoriesState } from '../../store/product-categories-state';
import { InitializeUserProductCategories } from '../../store/product-categories.actions';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProductsCategoryDialogComponent } from '../delete-products-category-dialog/delete-products-category-dialog.component';
import { ProductsService } from 'src/app/products/services/products-service';
import { ProductCategoriesService, ProductCategory } from '../../services/product-categories.service';

@Component({
  selector: 'app-product-categories-list',
  templateUrl: './product-categories-list.component.html',
  styleUrls: ['./product-categories-list.component.scss']
})
export class ProductCategoriesListComponent implements OnInit {

  public dataForm!: FormGroup;
  public dataSource!: MatTreeFlatDataSource<ProductCategoryNode, ProductCategoryFlatNode>;
  private destroy$ = new Subject();
  private productCategories: ProductCategory[] = [];

  constructor (private store: Store,
    private dialog: MatDialog,
    private productsService: ProductsService,
    private productsCategoriesService: ProductCategoriesService,
  private router: Router) {
    this.ngOnInit();
  }

  public ngOnInit():void {
    this.store.dispatch(new InitializeUserProductCategories()).pipe(takeUntil(this.destroy$));

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.store.select(UserProductCategoriesState.productCategories).subscribe((data) => {
      this.productCategories = data;
      this.dataSource.data = data;
      this.treeControl.expandAll();
    });
  }

  private _transformer = (node: ProductCategoryNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      guid: node.guid,
      level: level,
    };
  };

  private treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  public treeControl = new FlatTreeControl<ProductCategoryFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  public hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  public addNewCategory(): void {
    this.router.navigate(['user-product-categories/add']);
  }

  async remove(node: ProductCategoryNode) {
    const products = await firstValueFrom(this.productsService.getProductsAttachedToCategory(node.guid));
    if (products.length > 0) {
      this.dialog.open(DeleteProductsCategoryDialogComponent, {
        data: {
          products: products,
          productCategories: this.productCategories,
          removedProductCategory: { name: node.name, guid: node.guid },
        }
      });

      return;
    }
    this.productsCategoriesService
      .deleteProductCategory(node.guid, '')
      .subscribe(() => this.store.dispatch(new InitializeUserProductCategories()));
  }
}
