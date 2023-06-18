import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { ProductCategoryNode, ProductCategoryFlatNode, ExampleFlatNode, MicroProductCategory } from '../../product-categories.model';
import { UserProductCategoriesState } from '../../store/product-categories-state';
import { InitializeUserProductCategories } from '../../store/product-categories.actions';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-product-categories-tree',
  templateUrl: './product-categories-tree.component.html',
  styleUrls: ['./product-categories-tree.component.scss']
})
  
export class ProductCategoriesTreeComponent {
  public dataForm!: FormGroup;
  public dataSource!: MatTreeFlatDataSource<ProductCategoryNode, ProductCategoryFlatNode>;
  public selection = new SelectionModel<ProductCategoryNode>(true, []);
  private destroy$ = new Subject();
  @Output() categorySelected = new EventEmitter<MicroProductCategory>();
  @Output() categoriesInitialized = new EventEmitter<Array<MicroProductCategory>>();
  @Output() categoryDeselected = new EventEmitter<MicroProductCategory>();

  constructor (private store: Store) {
    this.ngOnInit();
  }

  public toggleSelection(event: MatCheckboxChange, node: ProductCategoryFlatNode) {
    const category: MicroProductCategory = {
      name: node.name,
      guid: node.guid
    };
    if (event.checked)
      this.categorySelected.emit(category);
    else
      this.categoryDeselected.emit(category);
  }

  public initializeSelection(selectedCategoriesGuids: string[]) {
    const flattenCategories = this.treeFlattener.flattenNodes(this.dataSource.data);
    selectedCategoriesGuids.forEach(guid => {
      const selectionEntry = flattenCategories.find(entry => entry.guid === guid);
      if (selectionEntry)
        this.selection.select(selectionEntry);
    })
    this.treeControl.expandAll();
  }

  public isSelected(node: ProductCategoryFlatNode): boolean {
    return this.selection.selected.find(entry => entry.guid === node.guid) !== undefined;
  }

  public ngOnInit(): void {
    this.store.dispatch(new InitializeUserProductCategories()).pipe(takeUntil(this.destroy$));

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.store.select(UserProductCategoriesState.productCategories).subscribe((data) => {
      this.dataSource.data = data;
      this.treeControl.expandAll();
    });
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

  public hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
