import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Observable } from "rxjs";
import { ProductsService } from "../services/products-service";
import { GetUserProducts, AddNewUserProduct, UpdateUserProduct } from "./user-products.actions";

export interface UserProductsStateModel {
	  products: Product[];
}

export interface Product {
	guid: string;
	name: string;
	categoryId?: string;
	categoryName?: string;
}

const defaultState: UserProductsStateModel = {
	products: []
}

@Injectable()
@State<UserProductsStateModel>({
	name: 'userProducts',
	defaults: defaultState
})
export class UserProductsState {
	constructor (private productsService: ProductsService,
		private router: Router
	) {
	}

	@Selector()
	public static products(state: UserProductsStateModel): Product[] {
		return state.products;
	}

	@Action(GetUserProducts)
	public getUserProducts(ctx: StateContext<UserProductsStateModel>) {
		return this.productsService.getUserProducts().subscribe(products => {
			ctx.patchState({
				products: products
			});
		});
	}

	@Action(AddNewUserProduct)
	public addNewUserProduct(ctx: StateContext<UserProductsStateModel>, action: AddNewUserProduct) {
		return this.productsService.addNewUserProduct({name: action.name, categoryId: action.categoryGuid})
			.subscribe(() => {
				ctx.dispatch(new GetUserProducts());
				if (!action.addNext)
					this.router.navigate(['user-products']);					
			});
	}

	@Action(UpdateUserProduct)
	public updateUserProduct(ctx: StateContext<UserProductsStateModel>, action: UpdateUserProduct) {
		return this.productsService.updateUserProduct(action.id, {name: action.name, categoryId: action.categoryGuid})
			.subscribe(() => {
				ctx.dispatch(new GetUserProducts());
				this.router.navigate(['user-products']);
			});
	}
}
