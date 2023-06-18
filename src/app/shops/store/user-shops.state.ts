import { UserShop } from "../model";
import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { ShopService } from "../services/shop-service";
import { AddNewUserShop, DeleteUserShop, GetUserShops, InitializeConfigurator, UpdateUserShop, UserShopSavedSuccessfully } from "./user-shops.actions";
import { Router } from "@angular/router";

export interface UserShopsStateModel {
	shops: UserShop[];
	currentStoreConfiguration: Array<string>;
}

const defaultState: UserShopsStateModel = {
	shops: [],
	currentStoreConfiguration: []
}

@Injectable()
@State<UserShopsStateModel>({
	name: 'userShops',
	defaults: defaultState
})
export class UserShopsState {
	constructor (private shopsService: ShopService,
	private router: Router) {
	}

	@Selector()
	public static shops(state: UserShopsStateModel): UserShop[] {
		return state.shops;
	}

	@Selector()
	public static shop(state: UserShopsStateModel) {
		return (id: string) => state.shops.find(s => s.guid === id);
	}
	
	@Selector()
	public static currentStoreConfig(state: UserShopsStateModel) {
		return state.currentStoreConfiguration;
	}

	@Action(GetUserShops)
	public getUserShops(ctx: StateContext<UserShopsStateModel>) {
		return this.shopsService.getUserShops().subscribe(shops => {
			console.log(shops);
			ctx.patchState({
				shops: shops
			});
		});
	}

	@Action(AddNewUserShop)
	public addNewUserShop(ctx: StateContext<UserShopsStateModel>, action: AddNewUserShop) {
		return this.shopsService.addNewUserShop(action.request).subscribe(response => {
			ctx.dispatch(new UserShopSavedSuccessfully());
		});
	}

	@Action(UpdateUserShop)
	public updateUserShop(ctx: StateContext<UserShopsStateModel>, action: UpdateUserShop) {
		return this.shopsService.updateUserShop(action.id, action.request).subscribe(() => {
			ctx.dispatch(new UserShopSavedSuccessfully());
		});
	}

	@Action(UserShopSavedSuccessfully)
	public userShopSavedSuccessfully(ctx: StateContext<UserShopsStateModel>) {
		ctx.dispatch(new GetUserShops()).subscribe(() =>
			this.router.navigate(['/user-shops'])
		);
	}

	@Action(InitializeConfigurator)
	public initializeConfigurator(ctx: StateContext<UserShopsStateModel>, action: InitializeConfigurator) {
		ctx.patchState({
			currentStoreConfiguration: action.categoriesMap
		});
	}
	
	@Action(DeleteUserShop)
	public deleteUserShop(ctx: StateContext<UserShopsStateModel>, action: DeleteUserShop) {
		return this.shopsService.deleteUserShop(action.id).subscribe(() => {
			ctx.dispatch(new GetUserShops());
			this.router.navigate(['/user-shops']);
		});
	}
}




