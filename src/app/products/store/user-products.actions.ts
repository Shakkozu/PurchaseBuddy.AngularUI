export class GetUserProducts {
	static readonly type = '[UserProducts] Get user products';
	constructor () { }
}

export class AddNewUserProduct {
	static readonly type = '[UserProducts] Save user product';
	constructor (public name: string, public categoryGuid: string, public addNext: boolean = false) { }
}

export class UpdateUserProduct {
	static readonly type = '[UserProducts] Update user product';
	constructor (public id: string, public name: string, public categoryGuid: string) { }
}