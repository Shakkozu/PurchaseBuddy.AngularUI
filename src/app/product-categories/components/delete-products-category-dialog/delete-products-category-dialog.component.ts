import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from 'src/app/products/store/user-products.state';
import { ProductCategoriesService, ProductCategory } from '../../services/product-categories.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ProductCategoryNode, ProductCategoryFlatNode, ExampleFlatNode } from '../../product-categories.model';
import { InitializeUserProductCategories } from '../../store/product-categories.actions';
import { takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-delete-products-category-dialog',
  templateUrl: './delete-products-category-dialog.component.html',
  styleUrls: ['./delete-products-category-dialog.component.scss']
})
export class DeleteProductsCategoryDialogComponent { 
  public header: string = 'Delete products category';
  public products: Product[];
  public dataSource!: MatTreeFlatDataSource<ProductCategoryNode, ProductCategoryFlatNode>;
  public dataForm!: FormGroup;
  private selectedNodeGuid!: string;
  public saveInProgress: boolean = false;

  constructor (
    public dialogRef: MatDialogRef<DeleteProductsCategoryDialogComponent>,
    private store: Store,
    private productCategoriesService: ProductCategoriesService,
    @Inject(MAT_DIALOG_DATA) public data: {
      products: Product[],
      removedProductCategory: {name: string, guid: string},
      productCategories: ProductCategory[],
    }
  ) {
    this.products = data.products;
    this.header = `Products count equals: ${ data?.products?.length }`;
    this.data = data;
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource.data = data.productCategories;
    this.dataForm = new FormGroup({
      substituteCategory: new FormControl({ value: '', disabled: true }, []),
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

  onNodeSelect(node: ProductCategoryNode) {
    this.dataForm.get('substituteCategory')?.setValue(node.name);
    this.selectedNodeGuid = node.guid;
    this.treeControl.collapseAll();
  }

  isNodeBeingRemoved(node: ProductCategoryNode): any {
    return node.guid === this.data.removedProductCategory.guid;
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public confirm() {
    const substituteCategoryGuid = this.selectedNodeGuid;
    this.saveInProgress = true;
    this.productCategoriesService.deleteProductCategory(this.data.removedProductCategory.guid, substituteCategoryGuid)
      .subscribe(() => {
        this.store.dispatch(new InitializeUserProductCategories()).subscribe(() => this.closeDialog());
      });

  }


  public hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
