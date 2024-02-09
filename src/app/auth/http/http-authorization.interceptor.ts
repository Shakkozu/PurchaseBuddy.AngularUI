import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Store } from '@ngxs/store';
import { AuthorizationState } from '../store/authorization.state';
import { Logout } from '../store/authorization.actions';

@Injectable()
export class HttpAuthorizationInterceptor implements HttpInterceptor {

	constructor (private store: Store) {
	 }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const sessionId = this.store.selectSnapshot(AuthorizationState.userSessionId);
		const isAuthenticated = this.store.selectSnapshot(AuthorizationState.isAuthenticated);

		if (isAuthenticated) {
			req = req.clone({
				setHeaders: {
					Authorization: `${ sessionId }`
				}
			});
		}

		return next.handle(req).pipe(
			catchError((error) => {
				if (error.status === 401) {
					this.store.dispatch(new Logout());
				}
				return throwError(error);
			})
		);
	}
}
