import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IErrorResponse } from '../shared/error-handling/model';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor (private snackBar: MatSnackBar) { }

	private errorDialogDurationInSeconds = 3;
	
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			catchError((error: HttpErrorResponse) => {
				let errorMessage = '';
				const errorResponse = error.error as IErrorResponse;
				if (errorResponse) {
					errorMessage = `Error: ${ error.error.errorMessage }`;
				} else {
					errorMessage = `Error Code: ${ error.status }\nMessage: ${ error.message }`;
				}

				console.error(error);				
				this.openSnackBar(errorMessage);
				return throwError(errorMessage);
			})
			);
	}
	
	openSnackBar(message: string) {
		this.snackBar.open(message, 'Close', {
			duration: this.errorDialogDurationInSeconds * 1000,
		});
	}
}



