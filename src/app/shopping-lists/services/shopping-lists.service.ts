import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ShoppingListDto } from "../model";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class ShoppingListsService {
	private readonly baseUrl = environment.apiUrl + 'shopping-lists/';
	
	constructor (private http: HttpClient) {
	}
	
	public getAllShoppingLists() {
		return this.http.get<ShoppingListDto[]>(this.baseUrl)
	}

	public createNew(listItems: string[], assignedShop: string) {
		let request: CreateShoppingListRequest = {
			listItems: listItems,
		};
		if (assignedShop)
			request.assignedShop = assignedShop;
			
		console.log(request);

		return this.http.post(this.baseUrl, request);
	}

	getShoppingListDetails(listId: any) {
		return this.http.get<ShoppingListDto>(this.baseUrl + listId )
	}

	markAsPurchased(listId: string, listItemId: string) {
		return this.http.put(this.baseUrl + `${ listId }/list-items/${ listItemId }/mark-as-purchased`, null);
	}

	markAsNotPurchased(listId: string, productId: string) {
		return this.http.put(this.baseUrl + `${ listId}/list-items/${productId}/mark-as-not-purchased`, null);
	}
	
	
	addNewListItem(listId: string, request: AddNewListItemRequest) {
		return this.http.post(this.baseUrl + `${ listId }/list-items`, request);
	}
	
	removeListItem(listId: string, listItemId: string) {
		return this.http.delete(this.baseUrl + `${ listId }/list-items/${listItemId}`);
	}
}

@Injectable({
	providedIn: 'root'
})
export class ShoppingListsSharingService {
	private readonly baseUrl = environment.apiUrl + 'shared-shopping-lists/';
	
	constructor (private http: HttpClient) {
	}
	
	public shareShoppingList(listId: string): Observable<string> {
		return this.http.put<string>(this.baseUrl + `${ listId }/share`, null);
	}
	
	public getDetails(listId: string): Observable<SharedShoppingListDto> {
		return this.http.get<SharedShoppingListDto>(this.baseUrl + `${ listId }`);
	}
}

export interface SharedShoppingListDto {
	createdAt: Date;
	creatorId: string;
	sourceId: string;
	guid: string;
	items: SharedShoppingListItemDto[];
}
export interface SharedShoppingListItemDto {
	productName: string;
	productCategory?: string;
}

export interface CreateShoppingListRequest {
	listItems: string[];
	assignedShop?: string | null;
}


export interface AddNewListItemRequest {
	listItemGuid: string;
	productGuid?: string;
	productName?: string;
	productCategoryName?: string;
	quantity?: number;
}

export interface UpdateShoppingListProductsRequest {
	listItems: string[];
}