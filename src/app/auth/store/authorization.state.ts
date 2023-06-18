import { Injectable } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Action, State, StateContext, Selector } from "@ngxs/store";
import { AuthorizationService } from "../service/authorization.service";
import { OnLoginSuccess, Login, Register, Logout, OnLogoutSuccess } from "./authorization.actions";


export interface UserSessionStateModel {
	username?: string;
	sessionId?: string;
}

const defaultState: UserSessionStateModel = {
	username: undefined,
	sessionId: undefined
}

@Injectable({
	providedIn: 'root'
})
export class testService {

}

@Injectable()
@State<UserSessionStateModel>({
	name: 'userSession',
	defaults: defaultState
})

export class AuthorizationState {
	constructor (private authorizationService: AuthorizationService,
		private router: Router) {
	}

	@Action(OnLoginSuccess)
	public createUserSession({ patchState }: StateContext<UserSessionStateModel>,
		{ username, sessionId }: OnLoginSuccess) {
		patchState({
			username: username,
			sessionId: sessionId,
		});
		this.router.navigate(['/user-products']);
	}
	
	@Action(Login)
	public login(ctx: StateContext<UserSessionStateModel>,
		{ username, password }: Login) {
		this.authorizationService.login(username, password)
			.subscribe(sessionId => ctx.dispatch(new OnLoginSuccess(username, sessionId)));
	}
	
	@Action(Register)
	public register(ctx: StateContext<UserSessionStateModel>, { userDto }: Register) {
		this.authorizationService.register(userDto).subscribe(() =>
			ctx.dispatch(new Login(userDto.login, userDto.password))
		);
	}
	
	@Action(Logout)
	public logout(ctx: StateContext<UserSessionStateModel>) {
		const state = ctx.getState();
		if (!state.sessionId)
			return;

		this.authorizationService.logout(state.sessionId)
			.subscribe(() => ctx.dispatch(new OnLogoutSuccess()));
	}

	@Action(OnLogoutSuccess)
	public onLogoutSuccess(ctx: StateContext<UserSessionStateModel>) {
		ctx.patchState(defaultState);
		this.redirect();
	}
	
	@Selector()
	public static isAuthenticated(state: UserSessionStateModel) {
		return !!state.username;
	}

	@Selector()
	static userSessionId(state: UserSessionStateModel) {
	  return state.sessionId;
	}
	
	@Selector()
	static username(state: UserSessionStateModel) {
	  return state.username;
	}

	private redirect(): void {
		// temporary disabled redirect, because it doesn't work with user-products component.
		// Filtering on products table doesnt work.

		this.router.navigate(['/']);
	}
}