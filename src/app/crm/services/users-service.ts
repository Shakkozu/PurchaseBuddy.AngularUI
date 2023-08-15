import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: 'root'
})
export class UsersService {
	constructor (private http: HttpClient) { }
	private readonly baseUrl = environment.apiUrl + 'crm';

	getAllUsers(): Observable<UserDto[]> {
		return this.http.get<UserDto[]>(`${ this.baseUrl }/users`);
	}
}

export interface UserDto {
	name: string;
	guid: string;
}