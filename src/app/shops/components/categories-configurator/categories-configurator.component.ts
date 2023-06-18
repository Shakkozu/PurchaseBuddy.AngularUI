import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ProductCategoriesTreeComponent } from 'src/app/product-categories/components/product-categories-tree/product-categories-tree.component';
import { UserShopsState } from '../../store/user-shops.state';
import { UserProductCategoriesState } from 'src/app/product-categories/store/product-categories-state';
import { InitializeUserProductCategories } from 'src/app/product-categories/store/product-categories.actions';

@Component({
  selector: 'app-categories-configurator',
  templateUrl: './categories-configurator.component.html',
  styleUrls: ['./categories-configurator.component.scss']
})
export class CategoriesConfiguratorComponent implements AfterViewInit, OnInit {
  @ViewChild(ProductCategoriesTreeComponent)
  public productTree!: ProductCategoriesTreeComponent;
  public currentStoreConfig: string[] = [];
  constructor (private store: Store) {
    this.store.dispatch(new InitializeUserProductCategories());
  }

  
  public categories: ShopProductCategory[] = [];

  public onCategorySelected(category: ShopProductCategory) {
    this.categories.push(category);
  }
  
  public onCategoryDeselected(category: ShopProductCategory) {
    this.categories = this.categories.filter(c => c.guid !== category.guid);
  }
  
  public onCategoriesInitialized(categories: Array<ShopProductCategory>) {
  }

  public drop(event: CdkDragDrop<ShopProductCategory[]>) {
    if (event.previousContainer !== event.container) return;
    
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }

  ngAfterViewInit(): void {
    this.productTree.initializeSelection(this.categories.map(category => category.guid));
  }

  ngOnInit(): void {
    this.currentStoreConfig = this.store.selectSnapshot(UserShopsState.currentStoreConfig);
    console.log(this.currentStoreConfig);
    this.store.select(UserProductCategoriesState.productCategoriesFlat)
      .subscribe(categories => {
        const result: Array<ShopProductCategory> = [];
        this.currentStoreConfig.forEach(configEntry => {
          const _category = categories.find(x => x.guid === configEntry);
          if (_category)
            result.push(_category);
        });
        this.categories = result;
      });
  }
}

export interface ShopProductCategory {
  guid: string;
  name: string;
}
