import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserShopDto, UserShop } from "../model";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: 'root'
})
export class ShopService {
	constructor (private http: HttpClient) { }

	updateUserShop(id: string, request: UserShopDto): Observable<any> {
		const body: UserShop = {
			name: request.name,
			description: request.description,
			address: {
				city: request.city,
				street: request.street,
				localNumber: request.localNumber
			},
			categoriesMap: request.categoriesMap
		}
		return this.http.put(environment.apiUrl + `shops/${id}`, body);
	}

	getUserShops(): Observable<UserShop[]> {
		return this.http.get<UserShop[]>(`${ environment.apiUrl}shops`);
	}
	
	getUserShop(id: string): Observable<UserShop> {
		return this.http.get<UserShop>(`${ environment.apiUrl}shops/${id}`);
	}

	addNewUserShop(request: UserShopDto) {
		const body: UserShop = {
			name: request.name,
			description: request.description,
			address: {
				city: request.city,
				street: request.street,
				localNumber: request.localNumber
			},
			categoriesMap: request.categoriesMap
		}
		return this.http.post(`${ environment.apiUrl }shops`, body);
	}
	
	deleteUserShop(id: string) {
		return this.http.delete(`${ environment.apiUrl }shops/${id}`);
	}
}

