import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IUserDto } from "..";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: 'root'
})
export class AuthorizationService {
	private readonly baseUrl = environment.apiUrl + 'authorization/'
	constructor (private httpClient: HttpClient) {	
	}

	public login(username: string, password: string): Observable<LoginResponse> {
		const body = {
			login: username,
			password: password
		};

		return this.httpClient.post<LoginResponse>(this.baseUrl + 'login', body);
	}

	public register(userDto: IUserDto): Observable<string> {
		return this.httpClient.post<string>(this.baseUrl + 'register', userDto);
	}
	
	public logout(sessionId: string) {
		return this.httpClient.post<string>(this.baseUrl + 'logout', sessionId);
	}
}

export interface LoginResponse {
	sessionId: string;
	userId: string;
}