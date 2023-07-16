import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ShoppingListsService } from '../../services/shopping-lists.service';
import { ShoppingListDto } from '../../model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-lists',
  templateUrl: './shopping-lists.component.html',
  styleUrls: ['./shopping-lists.component.scss']
})
export class ShoppingListsComponent {

  @ViewChild(DatatableComponent)
  public table: DatatableComponent | undefined;
  public columns = [{ prop: 'Created at' }, { prop: 'Assigned shop', name: 'AssignedShop' }];
  public ColumnMode = ColumnMode;
  public shoppingLists: ShoppingListDto[] = [];
  private showOnlyActiveLists = true;

  constructor (shoppingListsService: ShoppingListsService,
    private router: Router) {
    shoppingListsService.getAllShoppingLists()
      .subscribe(lists => {
        const sorted = lists.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.completedAt).getTime());
        this.shoppingLists = sorted;
      });
  }

  public get filteredShoppingLists(): ShoppingListDto[] {
    if (!this.showOnlyActiveLists)
      return this.shoppingLists;

    return this.shoppingLists.filter(list => list.completedAt === null)

  }

  public onChipSelectionChange(chip: any) {
    this.showOnlyActiveLists = chip.value === 'Active';
  }

  public addNew() {
    this.router.navigate(['shopping-list/new']);
  }

  public getAssignedShopName(list: ShoppingListDto) {
    return list.assignedShop?.name;
  }

  getTimeElapsed(dateString: string): string {
    const date = new Date(dateString);
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return 'Invalid date';
    }

    const now = new Date(Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate(),
      new Date().getUTCHours(),
      new Date().getUTCMinutes(),
      new Date().getUTCSeconds(),
      new Date().getUTCMilliseconds()
    ));

    const diff = now.getTime() - date.getTime();
    const elapsedSeconds = Math.round(diff / (1000));
    const elapsedMinutes = Math.round(diff / (1000 * 60));
    const elapsedHours = Math.round(diff / (1000 * 60 * 60));
    const elapsedDays = Math.round(diff / (1000 * 60 * 60 * 24));
    const elapsedMonths = Math.round(diff / (1000 * 60 * 60 * 24 * 30));
    const elapsedYears = Math.round(diff / (1000 * 60 * 60 * 24 * 365));

    if (elapsedSeconds < 60)
      return `${ elapsedSeconds } seconds ago`;
    if (elapsedMinutes < 60) {
      return `${ elapsedMinutes } mins ago`;
    } else if (elapsedHours < 24) {
      return `${ elapsedHours } hours ago`;
    } else if (elapsedDays < 30) {
      return `${ elapsedDays } days ago`;
    } else if (elapsedMonths < 12) {
      return `${ elapsedMonths } months ago`;
    } else {
      return `${ elapsedYears } years ago`;
    }
  }

}
