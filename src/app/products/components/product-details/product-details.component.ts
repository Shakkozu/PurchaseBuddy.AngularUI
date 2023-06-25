import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngxs/store';
import { ExampleFlatNode, ProductCategoryFlatNode, ProductCategoryNode } from 'src/app/product-categories/product-categories.model';
import { ProductCategoriesService, ProgressService } from 'src/app/product-categories/services/product-categories.service';
import { FormErrorHandler } from 'src/app/shared/error-handling/form-error-handler';
import { AddNewUserProduct, UpdateUserProduct } from '../../store/user-products.actions';
import { OnInit, OnDestroy, Inject, Optional } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { ProductsService } from '../../services/products-service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-product-details',
  templateUrl: 'product-details.component.html',
  styleUrls: ['product-details.component.scss'],
})
export class UserProductDetailsComponent implements OnInit, OnDestroy {
  @Output('productAdded')
  public productAdded: EventEmitter<string> = new EventEmitter<string>();
  checklistSelection = new SelectionModel<ProductCategoryNode>(true);
  dataForm!: FormGroup;
  public selectedNode!: ProductCategoryNode;
  public selectedCategoryGuid: string = '';
  public saveOccured: boolean = false;
  private routeParamsSubscription!: Subscription;
  private header = 'New Product';
  private productId!: string;
  public containerStyles: any;
  public filteredOptions!: string[];
  public userProductsNames: string[] = [];
  private customErrors = [{
    code: "notUniqueProductName",
    message: "Product with this name already exists"
  }];

  public dataSource!: MatTreeFlatDataSource<ProductCategoryNode, ProductCategoryFlatNode>;

  constructor (private productCategoriesService: ProductCategoriesService,
    private productService: ProductsService,
    private formBuilder: FormBuilder,
    private formErrorHandler: FormErrorHandler,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) @Optional() public data: {
      navigateToListAfterSave: boolean
    },
    public progressService: ProgressService,
    private activatedRoute: ActivatedRoute) {
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.productCategoriesService
      .getCategories()
      .subscribe(categories => this.dataSource.data = categories);
    this.productService.getUserProducts().subscribe(
      products => this.userProductsNames = products.map(p => p.name))
    this.containerStyles = {
      margin: this.isOpenedInDialog ? '20px' : '',
      backgroundColor: 'rgb(255, 252, 248) '
    };
  }

  private get isOpenedInDialog(): boolean {
    return this.data !== undefined && this.data !== null;
  }

  public expandAll() {
    this.treeControl.expandAll();
  }

  public collapseAll() {
    this.treeControl.collapseAll();
  }

  private get navigateToListAfterSave() {
    if (this.data)
      return this.data.navigateToListAfterSave;

    return true;
  }

  ngOnInit(): void {
    this.saveOccured = false;
    this.initForm();
    this.routeParamsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.productId = params['id'];
        this.header = 'Edit Product';

        this.productService.getUserProducts().subscribe((products) => {
          const product = products.find((p) => p.guid === this.productId);
          this.dataForm.get('productName')?.setValue(product?.name);
          this.dataForm.get('productCategory')?.setValue(product?.categoryName);
          this.selectedCategoryGuid = product?.categoryId ?? '';
        });
      }
    });
  }

  public get isInEditMode(): boolean {
    return this.productId !== null && this.productId !== undefined;
  }
  ngOnDestroy(): void {
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
  }

  private initForm(): void {
    this.dataForm = this.formBuilder.group({
      productName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      productCategory: new FormControl({value: '', disabled: true}, []),
    });
    this.dataForm.get('productName')?.valueChanges.subscribe(value => {
      this.filteredOptions = this._filter(value);
      if (this.userProductsNames && this.userProductsNames.map(pn => pn.trim().toLowerCase()).includes(value.trim().toLowerCase())) {
        this.dataForm.get('productName')?.setErrors({
          notUniqueProductName: true
        });
      }
    });
  }

  public getCategoriesTreeClass() {
    if (this.isOpenedInDialog) {
      return 'scroll';
    }
    return '';
  }

  onNodeSelect(node: ProductCategoryNode) {
    this.selectedCategoryGuid = node.guid;
    this.dataForm.get('productCategory')?.setValue(node.name);
    this.treeControl.collapseAll();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (value.length < 3) return [];

    return this.userProductsNames.filter(productName => productName.toLowerCase().includes(filterValue));
  }

  private _transformer = (node: ProductCategoryNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      guid: node.guid,
      level: level,
    };
  };

  private treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  public treeControl = new FlatTreeControl<ProductCategoryFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  save() {
    if (this.dataForm.invalid || this.saveOccured) {
      return;
    }

    this.saveOccured = true;
    const productName = this.dataForm.get('productName')?.value;
    if (this.productId) {
      this.progressService.executeWithProgress(
        () => this.store.dispatch(new UpdateUserProduct(this.productId, productName, this.selectedCategoryGuid)));
    } else {
      this.progressService.executeWithProgress(() =>
        this.store.dispatch(new AddNewUserProduct(productName, this.selectedCategoryGuid, this.navigateToListAfterSave)));

      this.productAdded.emit();
    }
  }

  public saveAndAddNext() {
    if (this.dataForm.invalid || this.saveOccured) {
      return;
    }

    this.saveOccured = true;
    const productName = this.dataForm.get('productName')?.value;
    this.progressService.executeWithProgress(
      () => this.store.dispatch(new AddNewUserProduct(productName, this.selectedCategoryGuid, false))
        .pipe(
          tap(() => {
            this.ngOnInit();
          })
        )
    );
  }

  public getErrorMessage(formControlName: string): string {
    const notUniqueProductNameError = this.dataForm.get(formControlName)?.getError(this.customErrors[0].code);
    if (notUniqueProductNameError)
      return this.customErrors[0].message;

    return this.formErrorHandler.handleError(this.dataForm, formControlName);
  }

  public getHeader() {
    return this.header;
  }
}
