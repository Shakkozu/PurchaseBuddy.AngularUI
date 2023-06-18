import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { UserShop } from '../../model';
import { GetUserShops } from '../../store/user-shops.actions';
import { UserShopsState } from '../../store/user-shops.state';

@Component({
  selector: 'app-user-shops-list',
  templateUrl: './user-shops-list.component.html',
  styleUrls: ['./user-shops-list.component.scss']
})
export class UserShopsListComponent {

  public shops: UserShop[] = [];
  public rows: any = [];
  public columns = [{ prop: 'name' }, { prop: 'address', name: 'Address' }, {prop: 'description'}];

  @ViewChild(DatatableComponent)
  public table: DatatableComponent | undefined;
  public ColumnMode = ColumnMode;

  constructor (private router: Router,
    private store: Store) { 
    this.store.dispatch(new GetUserShops());
    this.store.select(UserShopsState.shops).subscribe(shops => {
      this.shops = [...shops];
      this.rows = shops;
    });
  }

  public addNew(): void {
    this.router.navigate(['user-shop-details/new']);
  }

  public updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    this.rows = this.shops.filter(function (d: any) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // Whenever the filter changes, always go back to the first page
    if(this.table)
      this.table.offset = 0;
  }

  public getAddressDescription(row: UserShop): string {
    return `${row.address.city} ${row.address.street} ${row.address.localNumber}`;
  }
}

