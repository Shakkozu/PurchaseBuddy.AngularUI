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
	private readonly baseUrl = environment.apiUrl + 'shops';

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
		return this.http.put(this.baseUrl + `/${id}`, body);
	}

	getUserShops(): Observable<UserShop[]> {
		return this.http.get<UserShop[]>(`${ this.baseUrl}`);
	}
	
	getUserShop(id: string): Observable<UserShop> {
		return this.http.get<UserShop>(`${ this.baseUrl}/${id}`);
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
		return this.http.post(`${ this.baseUrl }`, body);
	}
	
	deleteUserShop(id: string) {
		return this.http.delete(`${ this.baseUrl }/${id}`);
	}
}

