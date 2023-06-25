import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { startWith, map, Observable } from 'rxjs';
import { Product, UserProductsState } from 'src/app/products/store/user-products.state';

@Component({
  selector: 'app-list-items-organizer',
  templateUrl: './list-items-organizer.component.html',
  styleUrls: ['./list-items-organizer.component.scss']
})
export class ListItemsOrganizerComponent {

  @Input('items')
  public selectedItems: Product[] = [];
  public products: Product[] = [];
  public rows: Product[] = [];
  public search: string = '';
  myControl = new FormControl('');
  filteredOptions: Observable<Product[]> | undefined;

  constructor (private store: Store) {
  }

  private _filter(value: string): Product[] {
    const filterValue = value.toLowerCase();

    return this.products.filter(product => product.name.toLowerCase()
      .includes(filterValue));
  }

  ngOnInit() {
    this.store.select(UserProductsState.products).subscribe(products => {
      this.products = products;
      this.rows = products;
    });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
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

  public getSelectedProducts() {
    return [...this.selectedItems];
  }
  
  public getNotAddedProducts() {
    return [...this.products];
  }

  public addItems(productsGuids: Array<string>) {
    const productsToAdd = this.products.filter(product => productsGuids.some(guid => product.guid == guid));
    productsToAdd.forEach(product => this.addNewListItem(product));
  }

  public remove(product: Product) {
    this.products.push(product);
    this.selectedItems = this.selectedItems.filter(item => item.guid !== product.guid);
    this.refreshAvailableProductsList();
  }

  public addNewListItem(product: Product) {
    this.selectedItems.push(product);
    this.products = this.products.filter(p => p.guid !== product.guid);
    this.refreshAvailableProductsList();
  }
}
