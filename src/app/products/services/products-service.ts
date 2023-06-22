import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../store/user-products.state";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: 'root'
})
export class ProductsService {
	private urlBase = environment.apiUrl + 'products/';
	constructor (private http: HttpClient) { }
	
	addNewUserProduct(request: AddNewUserProductRequest) {
	var body: AddNewUserProductRequest = {
		name: request.name,
	}
	if (request.categoryId)
		body['categoryId'] = request.categoryId;
		
		console.log(body);
		return this.http.post(this.urlBase, body);
	}
		
	updateUserProduct(guid: string, request: UpdateUserProductRequest) {
		var body: UpdateUserProductRequest = {
			name: request.name,
		}

		if (request.categoryId)
			body['categoryId'] = request.categoryId;

		return this.http.put(this.urlBase + guid, body);
	}

	getUserProducts(): Observable<Product[]> {
		return this.http.get<Product[]>(this.urlBase);
	}

	getProductsAttachedToCategory(categoryId: string): Observable<Product[]> {
		return this.http.get<Product[]>(this.urlBase + `with-category/${categoryId}`);
	} 
}

export interface AddNewUserProductRequest {
	name: string;
	categoryId?: string;
}

export interface UpdateUserProductRequest {
	name: string;
	categoryId?: string;
}