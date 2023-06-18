import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root'
})
export class NotificationService {

	constructor (public snackBar: MatSnackBar) { }
	private errorDialogDurationInSeconds = 4;
	private snackRef: MatSnackBarRef<any> | undefined;

	showError(message: string): void {
		this.snackRef = this.snackBar.open(message, 'X', { panelClass: ['error'] });
	}

	openSnackBar(message: string) {
		this.snackBar.open(message, 'Close', {
			duration: this.errorDialogDurationInSeconds * 1000,
		});
	}

	closeSnackBar(): void {
		if (this.snackRef) {
			this.snackRef.dismiss();
		}
	}
}