import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SharedShoppingListDto, SharedShoppingListItemDto, ShoppingListsSharingService } from "../../services/shared-shopping-lists-service";
import { ProgressService } from 'src/app/product-categories/services/product-categories.service';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-import-shared-list',
  templateUrl: './import-shared-list.component.html',
  styleUrls: ['./import-shared-list.component.scss'],
  providers: [ProgressService]
})
export class ImportSharedListComponent implements OnInit {
  public listId: string | null = '';
  public details?: SharedShoppingListDto;

  constructor (private route: ActivatedRoute,
    private router: Router,
    public progressService: ProgressService,
    private snackBar: MatSnackBar,
    private sharedListService: ShoppingListsSharingService) {
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
  
  public get importButtonEnabled() {
    return this.listId;
  }

  public onImportCancelledClicked() {
    this.router.navigate(['shopping-lists'])
  }

  public onImportButtonClicked() {
    if(this.listId === undefined || this.listId === null)
      return;

    this.progressService.executeWithProgress(() => {
      return of(this.sharedListService.importSharedList(this.listId!)
      .subscribe(createdListId => {
        this.snackBar.open('Shopping list was imported', undefined, {
          duration: 2000
        });
        this.router.navigate([`shopping-list/${createdListId}`])
      }))
    })
  }
}
