import { ProductCategory } from "../services/product-categories.service";

export class InitializeUserProductCategories {
	static readonly type = '[UserProductCategories] InitializeUserProductCategories';
	constructor () { }
}

export class AddNewUserProductCategory {
	static readonly type = '[UserProductCategories] AddNewUserProductCategory';
	constructor (public request: CreateProductCategoryRequest, public addNext: boolean) { }
}

export class AddNewUserProductCategorySuccess {
	static readonly type = '[UserProductCategories] AddNewUserProductCategorySuccess';
	constructor (public addNext: boolean) { }
}

export class ResetAddCategoryComponent {
	static readonly type = '[UserProductCategories] Rest add new category component';
	constructor () { }
}

export interface CreateProductCategoryRequest {
	name: string;
	description: string;
	parentId?: string;
}
