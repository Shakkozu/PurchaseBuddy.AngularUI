import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { ProductCategoriesService, ProductCategory, ProductCategoryFlat } from "../services/product-categories.service";
import { AddNewUserProductCategory, AddNewUserProductCategorySuccess, InitializeUserProductCategories, ResetAddCategoryComponent } from "./product-categories.actions";

export interface UserProductCategoriesStateModel {
	productCategories: ProductCategory[];
}

const defaultState: UserProductCategoriesStateModel = {
	productCategories: []
}

@Injectable()
@State<UserProductCategoriesStateModel>({
	name: 'userProductCategories',
	defaults: defaultState,
})
export class UserProductCategoriesState {
	constructor (private productCategoriesService: ProductCategoriesService,
		private router: Router) {
	}

	@Selector()
	public static productCategories(state: UserProductCategoriesStateModel): ProductCategory[] {
		return state.productCategories;
	}

	@Selector()
	public static productCategoriesFlat(state: UserProductCategoriesStateModel): ProductCategoryFlat[] {
		return this.flattenCategories(state.productCategories);
	}

	@Action(InitializeUserProductCategories)
	public initializeUserProductCategories(ctx: StateContext<UserProductCategoriesStateModel>) {
		return this.productCategoriesService.getCategories().subscribe(productCategories => {
			ctx.patchState({
				productCategories: productCategories
			});
		});
	}

	@Action(AddNewUserProductCategory)
	public addNewUserProductCategory(ctx: StateContext<UserProductCategoriesStateModel>, action: AddNewUserProductCategory) {
		return this.productCategoriesService.addNewUserProductCategory(action.request)
			.subscribe(response => ctx.dispatch(new AddNewUserProductCategorySuccess(action.addNext)));
	}

	@Action(AddNewUserProductCategorySuccess)
	public addNewUserProductCategorySuccess(ctx: StateContext<UserProductCategoriesStateModel>, { addNext }: AddNewUserProductCategory) {
		ctx.dispatch(new InitializeUserProductCategories());
		this.initializeUserProductCategories
		if (addNext)
			ctx.dispatch(new ResetAddCategoryComponent());
		else
			this.router.navigate(['user-product-categories']);
	}

	@Action(ResetAddCategoryComponent)
	public resetAddCategoryComponent(ctx: StateContext<UserProductCategoriesStateModel>) {
		ctx.patchState(defaultState);
	}

	private static flattenCategories(categories: ProductCategory[], result: ProductCategory[] = []): ProductCategory[] {
		categories.forEach(category => {
			if (!result.some(item => item.guid === category.guid)) {
				result.push(category);
				if (category.children && category.children.length > 0) {
					this.flattenCategories(category.children, result);
				}
			}
		});
		return result;
	}
}
