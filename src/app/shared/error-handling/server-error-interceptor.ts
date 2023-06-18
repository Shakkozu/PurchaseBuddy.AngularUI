import { Injectable } from '@angular/core';
import {
	HttpEvent, HttpRequest, HttpHandler,
	HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Logout } from 'src/app/auth/store/authorization.actions';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

	constructor (private notificationService: NotificationService, private router: Router,
		private route: ActivatedRoute,
		private store: Store) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		this.notificationService.closeSnackBar();

		return next.handle(request).pipe(
			catchError((error: HttpErrorResponse) => {
				const errorResponse = error.error as string;
				if (errorResponse) {
					this.notificationService.showError(errorResponse);
				}

				if (error.status === 401) {
					this.store.dispatch(new Logout());
					this.notificationService.showError('User not authorized');
					this.router.navigate(['/login'],
						{ queryParams: { returnUrl: this.route.snapshot.root.firstChild?.url[0].path } });
				}

				return throwError(error);
			})
		);
	}
}