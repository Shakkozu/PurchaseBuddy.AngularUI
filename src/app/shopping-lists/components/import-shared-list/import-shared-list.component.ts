import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { SharedShoppingListDto, SharedShoppingListItemDto, ShoppingListsSharingService } from '../../services/shopping-lists.service';

@Component({
  selector: 'app-import-shared-list',
  templateUrl: './import-shared-list.component.html',
  styleUrls: ['./import-shared-list.component.scss']
})
export class ImportSharedListComponent implements OnInit {
  public listId: string | null = '';
  public details?: SharedShoppingListDto;

  constructor (private route: ActivatedRoute,
    private sharedListService: ShoppingListsSharingService) {
  }

  public getDescription(listItem: SharedShoppingListItemDto) {
    if (listItem.productCategory)
      return `[${ listItem.productCategory }] ${ listItem.productName }`;
    
    return `${ listItem.productName }`;
  }

  public ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('id');
    if (!this.listId)
      return;

    this.sharedListService.getDetails(this.listId).subscribe(details => {
      console.log(details);
      this.details = details
    });
  }


}
