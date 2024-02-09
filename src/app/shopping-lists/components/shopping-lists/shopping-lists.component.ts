import { Component, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ShoppingListsService } from '../../services/shopping-lists.service';
import { ShoppingListDto } from '../../model';
import { Router } from '@angular/router';
import { InvitationDto, ShoppingListsInvitationsService } from '../../invitations/services/shopping-list-invitations.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewPendingInvitationsComponent } from '../view-pending-invitations/view-pending-invitations.component';
import { DateTimeParser } from 'src/app/shared/utils/DateTimeParser';
import { AuthorizationState } from 'src/app/auth/store/authorization.state';
import { Store } from '@ngxs/store';

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
  public invitations: InvitationDto[] = [];
  private userName: string = '';

  constructor (private shoppingListsService: ShoppingListsService,
    invitationsService: ShoppingListsInvitationsService,
    private dialog: MatDialog,
    store: Store,
    private router: Router) {
    store.select(AuthorizationState.username).subscribe(data => {
      this.userName = data!;
    });
    this.refreshAvailableShoppingLists();
    invitationsService.getAllPendingInvitations()
      .subscribe(invitations => {
        this.invitations = invitations;
      })
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
    this.router.navigate(['shopping-lists/new']);
  }

  public viewPendingInvitations() {
    const dialogRef = this.dialog.open(ViewPendingInvitationsComponent, {
      data: {
        invitations: this.invitations
      }
    });
    dialogRef.componentInstance.invitationRejected.subscribe(assignedListId => this.invitations = this.invitations.filter(x => x.listId !== assignedListId));
    dialogRef.componentInstance.invitationAccepted.subscribe(assignedListId => {
      this.invitations = this.invitations.filter(x => x.listId !== assignedListId);
      this.refreshAvailableShoppingLists();

    });
  }

  private refreshAvailableShoppingLists() {
    this.shoppingListsService.getAllShoppingLists()
      .subscribe(lists => {
        const sorted = lists.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.completedAt).getTime());
        this.shoppingLists = sorted;
      });
  }

  public getAssignedShopName(list: ShoppingListDto) {
    return list.assignedShop?.name;
  }

  public getCreatorName(creatorName: string) {
    return this.userName === creatorName ? 'You' : creatorName;
  }

   getTimeElapsed(dateString: string): string {
     return DateTimeParser.getTimeElapsed(dateString);
  }
}
