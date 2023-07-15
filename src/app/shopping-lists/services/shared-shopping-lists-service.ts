import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";


@Injectable({
	providedIn: 'root'
})
export class ShoppingListsSharingService {
	private readonly baseUrl = environment.apiUrl + 'shared-shopping-lists/';

	constructor(private http: HttpClient) {
	}

	public shareShoppingList(listId: string): Observable<string> {
		return this.http.put<string>(this.baseUrl + `${listId}/share`, null);
	}

	public getDetails(listId: string): Observable<SharedShoppingListDto> {
		return this.http.get<SharedShoppingListDto>(this.baseUrl + `${listId}`);
	}

	public importSharedList(listId: string): Observable<string> {
		return this.http.put<string>(this.baseUrl + `${listId}/import`, null);
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