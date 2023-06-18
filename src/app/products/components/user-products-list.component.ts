import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { GetUserProducts } from '../store/user-products.actions';
import { Product, UserProductsState } from '../store/user-products.state';

@Component({
  selector: 'app-user-products-list',
  templateUrl: './user-products-list.component.html',
  styleUrls: ['./user-products-list.component.scss'],
})
export class UserProductsListComponent {
  public products: Product[] = [];
  public rows: any = [];
  public columns = [{ prop: 'name' }, { prop: 'categoryName', name: 'Category' }];
  @ViewChild(DatatableComponent)
  public table: DatatableComponent | undefined;
  public ColumnMode = ColumnMode;
  

  public addNew(): void {
    this.router.navigate(['user-product-details/new']);
  }

  constructor (private store: Store,
    private router: Router) {
    this.store.dispatch(new GetUserProducts());
    this.store.select(UserProductsState.products).subscribe(products => {
      this.products = [...products];
      this.rows = products;
    });
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    const temp = this.products.filter(function (d: any) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    if(this.table)
      this.table.offset = 0;
  }
}
