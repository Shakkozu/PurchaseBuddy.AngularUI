import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ShoppingListDto } from "../model";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: 'root'
})
export class ShoppingListsService {
	constructor (private http: HttpClient) {
	}

	public getNotCompletedLists() {
		return this.http.get<ShoppingListDto[]>(environment.apiUrl + 'shopping-lists')
	}

	public createNew(listItems: string[], assignedShop: string) {
		const request: CreateShoppingListRequest = {
			listItems: listItems,
			assignedShop: assignedShop
		};
		return this.http.post(environment.apiUrl + 'shopping-lists', request);
	}

	getShoppingListDetails(listId: any) {
		return this.http.get<ShoppingListDto>(environment.apiUrl + 'shopping-lists/' + listId )
	}

	markAsPurchased(listId: string, productId: string) {
		return this.http.put(environment.apiUrl + 'shopping-lists/' + listId + '/products/' + productId + '/mark-as-purchased', null);
	}

	markAsNotPurchased(listId: string, productId: string) {
		return this.http.put(environment.apiUrl + 'shopping-lists/' + listId + '/products/' + productId + '/mark-as-not-purchased', null);
	}
}

export interface CreateShoppingListRequest {
	listItems: string[];
	assignedShop?: string;
}