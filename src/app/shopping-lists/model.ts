import { Product } from "../products/store/user-products.state";
import { UserShopDto } from "../shops/model";

export interface ShoppingListDto {
	userId: string;
	guid: string;
	assignedShop: UserShopDto,
	completed: boolean;
	completedAt: Date;
	createdAt: Date;
	shoppingListItems: Array<ShoppingListItemDto>;
}

export interface ShoppingListItemDto {
	quantity: number;
	productDto: Product
	purchased: boolean;
	unavailable: boolean;
}