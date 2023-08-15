import { Component, OnInit, ViewChild } from '@angular/core';
import { of, share } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingListsService } from '../../services/shopping-lists.service';
import { ShoppingListsSharingService } from "../../services/shared-shopping-lists-service";
import { ShoppingListDto as ShoppingList, ShoppingListItemDto } from '../../model';
import { UserShopDto } from 'src/app/shops/model';
import { ListItemsOrganizerComponent } from '../list-items-organizer/list-items-organizer.component';
import { ProgressService } from 'src/app/product-categories/services/product-categories.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InviteUsersToEditComponent } from '../invite-users-to-edit/invite-users-to-edit.component';
import { Store } from '@ngxs/store';
import { AuthorizationState } from 'src/app/auth/store/authorization.state';

@Component({
  selector: 'app-shopping-list-details',
  templateUrl: './shopping-list-details.component.html',
  styleUrls: ['./shopping-list-details.component.scss'],
  providers: [ProgressService]
})
export class ShoppingListDetailsComponent implements OnInit {
  @ViewChild(ListItemsOrganizerComponent)
  public organizer!: ListItemsOrganizerComponent;
  notPurchased: Array<ShoppingListItemDto> = [];
  purchased: Array<ShoppingListItemDto> = [];
  listId: any;
  assignedShopName: string = '';
  public shoppingListDetails!: ShoppingList;
  public isInEditMode: boolean = false;
  private allListItems: Array<ShoppingListItemDto> = [];
  private userId: string = '';

  constructor (private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private shoppingService: ShoppingListsService,
    private shoppingListSharingService: ShoppingListsSharingService,
    private snackBar: MatSnackBar,
    private store: Store,
    public progressService: ProgressService) {
  }

  public get canUpdateList(): boolean {
    return this.organizer.isValid();
  }

  public get shoppingCompleted() : boolean {
    return this.notPurchased.length < 1; 
  }
  
  public get userIsCreator(): boolean {
    return this.userId === this.shoppingListDetails?.creatorId;
  }
  
  public ngOnInit(): void {
    this.listId = this.route.snapshot.paramMap.get('id');
    this.refresh();
    this.store.select(AuthorizationState.userId)
      .subscribe(userId => {
        this.userId = userId ?? '';
        console.log(userId);
      });
  }

  public onEditModeEntered() {
    this.isInEditMode = !this.isInEditMode;
    this.organizer?.initialize(this.allListItems, this.listId);
  }
  
  public onShareButtonClicked() {
    this.progressService.executeWithProgress(() => {
      return of(this.shoppingListSharingService.shareShoppingList(this.listId)
        .subscribe(sharedResourceId => {
          console.log(sharedResourceId);
          const contentToCopy = window.location.origin + `/shopping-lists/import-shared/${sharedResourceId}`;
          navigator.clipboard.writeText(contentToCopy)
            .then(() => {
              this.snackBar.open("Link to sharing shopping list was copied to clipboard", undefined, {
                duration: 2000
              });
            })
            .catch((error) => {
              console.error('Failed to copy content:', error);
            });
        }))
    });
  }

  public onAllowOtherUsersToEditButtonClicked() {
    this.dialog.open(InviteUsersToEditComponent, {
      data: {
        listId: this.listId,
      }
    });
  }
  
  public onEditCompleted() {
    this.isInEditMode = !this.isInEditMode;
    if (!this.organizer?.touched)
      return;
    
    this.refresh();
  }

  public getShopName(shop: UserShopDto) {
    if (!shop) return '';
    
    if (shop.address?.city) {
      if (shop.address.street)
        return `${ shop.name } [${ shop.address.city }, ${ shop.address.street }]`;

      return `${ shop.name } [${ shop.address.city }]`;
    }
    
    return `${shop.name}`;
  }

  public getListItemDescription(listItem: ShoppingListItemDto) {
    return `${ listItem?.productDto?.categoryName ?? '' }`;
  }

  public getListItemName(listItem: ShoppingListItemDto) {
    return `${ listItem.productDto.name }`;
  }
  

  public markAsPurchased(listItem: ShoppingListItemDto) {
    this.shoppingService.markAsPurchased(this.listId, listItem.guid)
      .subscribe(res => this.productPurchased(listItem));
  }

  public markAsNotPurchased(listItem: ShoppingListItemDto) {
    this.shoppingService.markAsNotPurchased(this.listId, listItem.guid)
      .subscribe(res => this.productPurchaseReverted(listItem));
  }

  private productPurchased(listItem: ShoppingListItemDto) { 
    this.notPurchased = this.notPurchased.filter(item => item.guid !== listItem.guid);
    this.purchased.push(listItem);
  }

  private productPurchaseReverted(listItem: ShoppingListItemDto) { 
    this.purchased = this.purchased.filter(item => item.guid !== listItem.guid);
    this.notPurchased.push(listItem);
  }

  private refresh() {
    this.progressService.executeWithProgress(() => {
      return of(this.shoppingService.getShoppingListDetails(this.listId)
        .subscribe(shoppingList => {
          this.shoppingListDetails = shoppingList
          this.allListItems = this.shoppingListDetails.shoppingListItems;
          this.assignedShopName = this.getShopName(shoppingList.assignedShop);
          this.notPurchased = shoppingList.shoppingListItems.filter(listItem => !listItem.purchased);
          this.purchased = shoppingList.shoppingListItems.filter(listItem => listItem.purchased);
        }))
    });
  }

  returnToList() {
    this.router.navigate(['shopping-lists'])
  }

}