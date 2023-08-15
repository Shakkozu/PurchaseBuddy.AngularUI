import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: 'root'
})
export class ShoppingListsInvitationsService {
	private readonly baseUrl = environment.apiUrl + 'purchase-sharing/';
	
	constructor (private http: HttpClient) {
	}
	
	public getAllPendingInvitations() {
		return this.http.get<InvitationDto[]>(this.baseUrl + 'pending-invitations')
	}
	
	public inviteUserToPurchase(listId: string, invitedUserId: string) {
		const route = `${this.baseUrl}shopping-lists/${listId}/invitations`;
		let request: InviteUserToModyfingListRequest = {
			invitedUserId: invitedUserId
		};
		return this.http.post<InviteUserToModyfingListRequest>(route, request)
	}

	public acceptAnInvite(listId: string) {
		const route = `${ this.baseUrl }shopping-lists/${ listId }/accept-invite`;
		return this.http.post(route, {});
	}

	public rejectAnInvite(listId: string) {
		const route = `${ this.baseUrl }shopping-lists/${ listId }/reject-invite`;
		return this.http.post(route, {});
	}
}


export interface InviteUserToModyfingListRequest {
	invitedUserId: string;
}
export interface InvitationDto {
	listId: string;
	listCreatorId: string;
	listCreatorName: string;
	userId: string;
	createdAt: Date;
}