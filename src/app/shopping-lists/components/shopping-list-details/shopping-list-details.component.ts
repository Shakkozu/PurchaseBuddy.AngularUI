import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/products/store/user-products.state';
import { ShoppingListsService } from '../../services/shopping-lists.service';
import { ShoppingListDto as ShoppingList, ShoppingListItemDto } from '../../model';
import { UserShopDto } from 'src/app/shops/model';

@Component({
  selector: 'app-shopping-list-details',
  templateUrl: './shopping-list-details.component.html',
  styleUrls: ['./shopping-list-details.component.scss']
})
export class ShoppingListDetailsComponent implements OnInit {
  notPurchased: Array<ShoppingListItemDto> = [];
  purchased: Array<ShoppingListItemDto> = [];
  listId: any;
  assignedShopName: string = '';
  public shoppingListDetails!: ShoppingList;

  constructor (private router: Router,
    private route: ActivatedRoute,
    private shoppingService: ShoppingListsService) {
  }

  
  public get shoppingCompleted() : boolean {
    return this.notPurchased.length < 1; 
  }
  
  public ngOnInit(): void {
    this.listId = this.route.snapshot.paramMap.get('id');
    this.shoppingService.getShoppingListDetails(this.listId)
      .subscribe(shoppingList => {
        this.shoppingListDetails = shoppingList
        this.assignedShopName = this.getShopName(shoppingList.assignedShop);
        this.notPurchased = shoppingList.shoppingListItems.filter(listItem => !listItem.purchased);
        this.purchased = shoppingList.shoppingListItems.filter(listItem => listItem.purchased);
      });
  }

  public getShopName(shop: UserShopDto) {
    if (!shop) return '';
    console.log(shop);
    
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

  folders: Section[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    },
  ];
  notes: Section[] = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    },
  ];
}



export interface Section {
  name: string;
  updated: Date;
}

export class ListSectionsExample {
  folders: Section[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    },
  ];
  notes: Section[] = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    },
  ];
}