import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Observable, map, startWith, tap } from 'rxjs';
import { Product, UserProductsState } from 'src/app/products/store/user-products.state';
import { ShoppingListsService } from '../../services/shopping-lists.service';
import { ProgressService } from 'src/app/product-categories/services/product-categories.service';
import { Router } from '@angular/router';
import { UserShopsState } from 'src/app/shops/store/user-shops.state';
import { UserShop } from 'src/app/shops/model';



interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-create-shopping-list',
  templateUrl: './create-shopping-list.component.html',
  styleUrls: ['./create-shopping-list.component.scss']
})
export class CreateShoppingListComponent {
  constructor (private store: Store,
    private formBuilder: FormBuilder,
    public progressService: ProgressService,
    private router: Router,
    private shoppingListService: ShoppingListsService) {
    }
    
  public shops: UserShop[] = [];
  public dataForm!: FormGroup;
  public products: Product[] = [];
  public rows: Product[] = [];
  myControl = new FormControl('');
  selectedProduct = new FormControl('');
  quantity = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<Product[]> | undefined;
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  selectedItems: Product[] = [];
  public search: string = '';

  public foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      assignedShop: new FormControl(''),
    });

    this.store.select(UserProductsState.products).subscribe(products => {
      this.products = products;
      this.rows = products;
    });

    this.store.select(UserShopsState.shops)
      .subscribe(shops => {
        console.log(shops);
        this.shops = shops
      });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.selectedProduct.valueChanges.subscribe(v => console.log(v));
  }

  private _filter(value: string): Product[] {
    const filterValue = value.toLowerCase();

    return this.products.filter(product => product.name.toLowerCase()
      .includes(filterValue));
  }

  public updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    this.rows = this.products.filter(function (d: any) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
  }

  private refreshAvailableProductsList() {
    const val = this.search.toLowerCase();
    this.rows = this.products.filter(function (d: any) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
  }

  public isSelected(product: Product) {
    return this.selectedItems.find(s => s.guid === product.guid) !== undefined;
  }

  onSelectionChange(event: any) {
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

  public remove(product: Product) {
    this.products.push(product);
    this.selectedItems = this.selectedItems.filter(item => item.guid !== product.guid);
    this.refreshAvailableProductsList();
  }

  private addNewListItem(product: Product) {
    this.selectedItems.push(product);
    this.products = this.products.filter(p => p.guid !== product.guid);
    this.refreshAvailableProductsList();
  }

  public save() {
    const listItems = this.selectedItems.map(item => item.guid);
    if (!this.isValid()) {
      return;
    }
    const assignedShopId = this.dataForm.get('assignedShop')?.value ?? '';
    this.progressService.executeWithProgress(() => this.shoppingListService.createNew(listItems, assignedShopId)
      .pipe(
        tap(() => this.router.navigate(['shopping-lists'])
        )));
  }

  public isValid() {
    const listItems = this.selectedItems.map(item => item.guid);
    return listItems.length > 0;
  }
}
