import { Injectable } from "@angular/core";
import { Action, State, StateContext } from "@ngxs/store";
import { InitializeState } from "./app.actions";
import { InitializeUserProductCategories } from "../product-categories/store/product-categories.actions";
import { GetUserProducts } from "../products/store/user-products.actions";
import { GetUserShops } from "../shops/store/user-shops.actions";

export interface IAppStateModel {
}

@Injectable()
@State<IAppStateModel>({
	name: 'appState'
})
export class AppState {

	@Action(InitializeState)
	public initializeState(ctx: StateContext<IAppStateModel>) {
		ctx.dispatch(new InitializeUserProductCategories());
		ctx.dispatch(new GetUserProducts());
		ctx.dispatch(new GetUserShops());
	}
}