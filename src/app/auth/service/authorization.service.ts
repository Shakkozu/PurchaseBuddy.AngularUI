import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IUserDto } from "..";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: 'root'
})
export class AuthorizationService {
	constructor (private httpClient: HttpClient) {	
	}

	public login(username: string, password: string): Observable<string> {
		const body = {
			login: username,
			password: password
		};

		return this.httpClient.post<string>(environment.apiUrl + '/authorization/login', body);
	}

	public register(userDto: IUserDto): Observable<string> {
		return this.httpClient.post<string>(environment.apiUrl + '/authorization/' + 'register', userDto);
	}
	
	public logout(sessionId: string) {
		return this.httpClient.post<string>(environment.apiUrl + '/authorization/' + 'logout', sessionId);
	}
}