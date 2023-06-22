import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/products/store/user-products.state';
import { ShoppingListsService } from '../../services/shopping-lists.service';
import { ShoppingListDto as ShoppingList, ShoppingListDto, ShoppingListItemDto } from '../../model';
import { UserShopDto } from 'src/app/shops/model';
import { ListItemsOrganizerComponent } from '../list-items-organizer/list-items-organizer.component';

@Component({
  selector: 'app-shopping-list-details',
  templateUrl: './shopping-list-details.component.html',
  styleUrls: ['./shopping-list-details.component.scss']
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

  constructor (private router: Router,
    private route: ActivatedRoute,
    private shoppingService: ShoppingListsService) {
  }

  public get canUpdateList(): boolean {
    return this.organizer.isValid();
  }

  public get shoppingCompleted() : boolean {
    return this.notPurchased.length < 1; 
  }
  
  public ngOnInit(): void {
    this.listId = this.route.snapshot.paramMap.get('id');
    this.shoppingService.getShoppingListDetails(this.listId)
      .subscribe(shoppingList => {
        this.shoppingListDetails = shoppingList
        this.allListItems = this.shoppingListDetails.shoppingListItems;
        this.assignedShopName = this.getShopName(shoppingList.assignedShop);
        this.notPurchased = shoppingList.shoppingListItems.filter(listItem => !listItem.purchased);
        this.purchased = shoppingList.shoppingListItems.filter(listItem => listItem.purchased);
      });
  }

  private refresh() {
    this.shoppingService.getShoppingListDetails(this.listId)
      .subscribe(shoppingList => {
        this.shoppingListDetails = shoppingList
        this.allListItems = this.shoppingListDetails.shoppingListItems;
        this.assignedShopName = this.getShopName(shoppingList.assignedShop);
        this.notPurchased = shoppingList.shoppingListItems.filter(listItem => !listItem.purchased);
        this.purchased = shoppingList.shoppingListItems.filter(listItem => listItem.purchased);
      });
  }

  public onEditButtonClicked() {
    this.isInEditMode = !this.isInEditMode;
    this.organizer?.addItems(this.allListItems.map(item => item.productDto.guid));
  }

  public onUpdateListButtonClicked() {
    const selectedProductsGuids = this.organizer.getSelectedProducts().map(product => product.guid);
    this.shoppingService.updateItemsOnList(this.listId, selectedProductsGuids).subscribe(() => {
      this.refresh();
      this.isInEditMode = !this.isInEditMode;
    });
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
    this.shoppingService.markAsPurchased(this.listId, listItem.productDto.guid)
      .subscribe(res => this.productPurchased(listItem));
  }

  public markAsNotPurchased(listItem: ShoppingListItemDto) {
    this.shoppingService.markAsNotPurchased(this.listId, listItem.productDto.guid)
      .subscribe(res => this.productPurchaseReverted(listItem));
  }

  private productPurchased(listItem: ShoppingListItemDto) { 
    this.notPurchased = this.notPurchased.filter(item => item.productDto.guid !== listItem.productDto.guid);
    this.purchased.push(listItem);
  }

  private productPurchaseReverted(listItem: ShoppingListItemDto) { 
    this.purchased = this.purchased.filter(item => item.productDto.guid !== listItem.productDto.guid);
    this.notPurchased.push(listItem);
  }

  returnToList() {
    this.router.navigate(['shopping-lists'])
  }

}