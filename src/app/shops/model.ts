export interface UserShop {
	guid?: string;
	name: string;
	description: string;
	address: ShopAddressDto;
	categoriesMap: Array<string>;
}

export interface ShopAddressDto {
	city: string;
	street: string;
	localNumber: string;
}
export interface UserShopDto {
	address?: ShopAddressDto;
	name: string;
	description: string;
	city: string;
	street: string;
	localNumber: string;
	categoriesMap: Array<string>;
}

export interface UpdateUserShopRequest {
	name: string;
	categoryId?: string;
}