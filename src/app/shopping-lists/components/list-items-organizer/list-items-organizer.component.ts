import { Component, Input, OnDestroy, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { startWith, map, Observable, takeUntil, Subject, of } from 'rxjs';
import { ProgressService } from 'src/app/product-categories/services/product-categories.service';
import { Product, UserProductsState } from 'src/app/products/store/user-products.state';
import { AddNewListItemRequest, ShoppingListsService } from '../../services/shopping-lists.service';
import { ShoppingListItemDto } from '../../model';
import { v4 as uuidv4 } from 'uuid';
import { SorterHelper } from 'src/app/shared/utils/sorter';

@Component({
  selector: 'app-list-items-organizer',
  templateUrl: './list-items-organizer.component.html',
  styleUrls: ['./list-items-organizer.component.scss'],
  providers: [ProgressService]
})
export class ListItemsOrganizerComponent implements OnDestroy {
  @Input('items')
  public selectedItems: Product[] = [];
  public selectedListItems: ShoppingListItemDto[] = [];
  public products: Product[] = [];
  public notAddedProducts: Product[] = [];
  public search: string = '';
  public touched: boolean = false;
  myControl = new FormControl('');
  filteredOptions: Observable<Product[]> | undefined;
  listId: any;
  private destroy$: Subject<void> = new Subject<void>();

  constructor (private store: Store,
    private shoppingListService: ShoppingListsService,
    public progressService: ProgressService) {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private _filter(value: string): Product[] {
    const filterValue = value.toLowerCase();

    return this.products.filter(product => product.name.toLowerCase()
      .includes(filterValue));
  }

  public lastItemLeft() {
    return this.selectedListItems.length <= 1;
  }

  ngOnInit() {
    this.store.select(UserProductsState.products).subscribe(products => {
      this.products = products;
      this.notAddedProducts = SorterHelper.sort(products, 'name');
    });
    this.progressService.resetProgressBar();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  public updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    this.notAddedProducts = this.products.filter(function (d: any) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.notAddedProducts = SorterHelper.sort(this.notAddedProducts, 'name');
  }

  private refreshAvailableProductsList() {
    const val = this.search.toLowerCase();
    this.notAddedProducts = this.products.filter(function (d: any) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.notAddedProducts = SorterHelper.sort(this.notAddedProducts, 'name');
  }

  public isSelected(product: Product) {
    return this.selectedItems.find(s => s.guid === product.guid) !== undefined;
  }

  public isSelectedListItem(listItem: ShoppingListItemDto) {
    return this.selectedListItems.find(item => item.guid === listItem.guid) !== undefined;
  }

  public onSelectionChange(event: any) {
    const selectedElement = event.options[0];
    if (selectedElement._selected) {
      this.addNewListItem(selectedElement._value);
    } else {
      const index = this.selectedItems.indexOf(selectedElement._value);
      if (index >= 0) {
        this.selectedItems.splice(index, 1);
      }
    }
  }

  public isValid(): boolean {
    return this.selectedItems.length > 0;
  }
  
  public getNotAddedProducts() {
    return [...this.products];
  }
  
  public addListItems(listItems: Array<ShoppingListItemDto>) {
    this.selectedListItems.push(...listItems);
  }

  private refreshProducts() {
    const productsOnList = this.selectedListItems.map(items => items.productDto);
    const productsOnListGuids = productsOnList.map(p => p.guid);
    this.notAddedProducts = this.products.filter(product => !productsOnListGuids.some(guid => product.guid === guid));
  }

  initialize(listItems: ShoppingListItemDto[], listId: any) {
    this.selectedListItems = [...listItems];
    this.listId = listId;
    this.refreshProducts();
    this.touched = false;
  }

  public removeListItem(listItem: ShoppingListItemDto) {
    this.touched = true;
    this.progressService.executeWithProgress(() => {
      return of(this.shoppingListService.removeListItem(this.listId, listItem.guid)
        .pipe(
          takeUntil(this.destroy$)).subscribe(_ => {
            this.selectedListItems = this.selectedListItems.filter(item => item.guid !== listItem.guid);
            this.refreshAvailableProductsList();
            this.refreshProducts();
          }))
    });
  }
  
  public addNewListItem(product: Product) {
    this.touched = true;
    const listItem: ShoppingListItemDto = {
      guid: uuidv4(),
      productDto: {
        guid: product.guid,
        name: product.name,
        categoryName: product.categoryName,
        categoryId: product.categoryId
      },
      purchased: false,
      quantity: 1,
      unavailable: false
    };
    const request: AddNewListItemRequest = {
      listItemGuid: listItem.guid,
      productGuid: product.guid,
    };
    this.progressService.executeWithProgress(() => {
      return of(this.shoppingListService.addNewListItem(this.listId, request)
        .pipe(
          takeUntil(this.destroy$)).subscribe(_ => {
            this.selectedListItems.push(listItem);
            this.refreshAvailableProductsList();
            this.refreshProducts();
          }))
    });
  }
}
