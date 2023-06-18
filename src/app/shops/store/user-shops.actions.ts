import { UserShopDto } from "../model";

export class GetUserShops {
	static readonly type = '[UserShops] Get user shops';
}

export class AddNewUserShop {
	static readonly type = '[UserShops] Add new user shop';
	constructor (public request: UserShopDto) {
	}
}

export class UpdateUserShop {
	static readonly type = '[UserShops] Update user shop';
	constructor (public id: string, public request: UserShopDto) {
	}
}

export class UserShopSavedSuccessfully {
	static readonly type = '[UserShops] User shop saved successfully';
}

export class DeleteUserShop {
	static readonly type = '[UserShops] Delete user shop';
	constructor (public id: string) {
	}
}

export class InitializeConfigurator {
	static readonly type = '[UserShops] Initialize user shop configurator';
	constructor (public categoriesMap: Array<string>) {
	}
}