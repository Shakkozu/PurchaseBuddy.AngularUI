import { Component, OnDestroy, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { ProgressService } from 'src/app/product-categories/services/product-categories.service';
import { FormErrorHandler } from 'src/app/shared/error-handling/form-error-handler';
import { UserShop, UserShopDto } from '../../model';
import { AddNewUserShop, DeleteUserShop, InitializeConfigurator, UpdateUserShop } from '../../store/user-shops.actions';
import { UserShopsState } from '../../store/user-shops.state';
import { CategoriesConfiguratorComponent } from '../categories-configurator/categories-configurator.component';
import { ShopService } from '../../services/shop-service';

@Component({
  selector: 'app-user-shop-details',
  templateUrl: './user-shop-details.component.html',
  styleUrls: ['./user-shop-details.component.scss'],
  providers: [ProgressService]
})
export class UserShopDetailsComponent implements AfterViewInit, OnDestroy {
  public header: string = 'New Shop';
  public dataForm!: FormGroup;
  private destroy$ = new Subject();
  private shop: UserShop | undefined;
  private shopId: string | null = null;
  @ViewChild(CategoriesConfiguratorComponent)
  public categoriesConfigurator!: CategoriesConfiguratorComponent;

  constructor (private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private formErrorHandler: FormErrorHandler,
    private store: Store,
    private shopService: ShopService,
    public progressService: ProgressService) { }

  public ngOnDestroy(): void {
    this.destroy$.next(0);
    this.destroy$.complete();
  }

  public getErrorMessage(formControlName: string): string {
    return this.formErrorHandler.handleError(this.dataForm, formControlName);
  }

  public deleteShop() {
    if (this.shopId) {
      this.store.dispatch(new DeleteUserShop(this.shopId)).pipe(takeUntil(this.destroy$))
        .subscribe(() => this.router.navigate(['/user-shops']));
    }
  }

  public save() {
    this.dataForm.markAllAsTouched();
    if (!this.dataForm.valid)
      return;
    const categories = this.categoriesConfigurator.categories;

    const request: UserShopDto = {
      name: this.dataForm.get('name')?.value,
      description: this.dataForm.get('description')?.value,
      city: this.dataForm.get('city')?.value,
      street: this.dataForm.get('street')?.value,
      localNumber: this.dataForm.get('localNumber')?.value,
      categoriesMap: this.categoriesConfigurator.categories.map(c => c.guid),
    }

    if (this.shopId)
      this.store.dispatch(new UpdateUserShop(this.shopId, request))
        .pipe(takeUntil(this.destroy$));
    else
      this.store.dispatch(new AddNewUserShop(request)).pipe(takeUntil(this.destroy$))
        .pipe(takeUntil(this.destroy$));
  }

  public ngOnInit(): void {
    this.initForm();
    this.shopId = this.route.snapshot.paramMap.get('id');
    if (this.isInEditMode()) {
      this.header = 'Edit Shop';
      this.shopService.getUserShop(this.shopId as string)
        .subscribe(shop => {
          this.shop = shop;
          this.refreshForm();
          this.initializeConfigurator(this.shop?.categoriesMap);
        })

      this.store.select(UserShopsState.shops).subscribe(shops => {
        this.shop = shops.find((_shop) => _shop.guid === this.shopId);
        if (this.shop) {
          this.refreshForm();
          this.initializeConfigurator(this.shop?.categoriesMap);
        }
      })
    } else {
      this.initializeConfigurator([]);
    }
  }

  public ngAfterViewInit(): void {

  }

  public isInEditMode() {
    return this.shopId !== undefined && this.shopId !== null;
  }

  private initializeConfigurator(categoriesMap: Array<string> | undefined) {
    if (!categoriesMap) return;
    this.store.dispatch(new InitializeConfigurator(categoriesMap))
  }

  private refreshForm() {
    if (!this.shop)
      return;

    this.dataForm.get('name')?.setValue(this.shop.name);
    this.dataForm.get('description')?.setValue(this.shop.description);
    this.dataForm.get('city')?.setValue(this.shop.address.city);
    this.dataForm.get('street')?.setValue(this.shop.address.street);
    this.dataForm.get('localNumber')?.setValue(this.shop.address.localNumber);
  }

  private initForm() {
    this.dataForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      city: [''],
      street: [''],
      localNumber: [''],
    });
  }
}
