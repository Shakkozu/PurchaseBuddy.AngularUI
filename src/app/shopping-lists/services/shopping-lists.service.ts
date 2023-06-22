import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ShoppingListDto } from "../model";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: 'root'
})
export class ShoppingListsService {
	private readonly baseUrl = environment.apiUrl + 'shopping-lists/';

	constructor (private http: HttpClient) {
	}


	public getNotCompletedLists() {
		return this.http.get<ShoppingListDto[]>(this.baseUrl)
	}

	public createNew(listItems: string[], assignedShop: string) {
		const request: CreateShoppingListRequest = {
			listItems: listItems,
		};

		return this.http.post(this.baseUrl, request);
	}

	getShoppingListDetails(listId: any) {
		return this.http.get<ShoppingListDto>(this.baseUrl + listId )
	}

	markAsPurchased(listId: string, productId: string) {
		return this.http.put(this.baseUrl + `${ listId }/products/${ productId }/mark-as-purchased`, null);
	}

	markAsNotPurchased(listId: string, productId: string) {
		return this.http.put(this.baseUrl + `${ listId}/products/${productId}/mark-as-not-purchased`, null);
	}

	removeItemFromList(listId: any, productId: string) {
		return this.http.delete(this.baseUrl + `${ listId }/products/${ productId }`);
	}
}

export interface CreateShoppingListRequest {
	listItems: string[];
	assignedShop?: string | null;
}