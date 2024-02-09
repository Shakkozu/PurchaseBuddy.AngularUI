import { Injectable } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Action, State, StateContext, Selector } from "@ngxs/store";
import { AuthorizationService } from "../service/authorization.service";
import { OnLoginSuccess, Login, Register, Logout, OnLogoutSuccess } from "./authorization.actions";


export interface UserSessionStateModel {
	username?: string;
	userId?: string;
	sessionId?: string;
	timestamp?: number;
}

const defaultState: UserSessionStateModel = {
	username: undefined,
	userId: undefined,
	sessionId: undefined,
	timestamp: undefined
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
	private static sessionLifetimeInMinutes = 45;

	constructor (private authorizationService: AuthorizationService,
		private router: Router) {
	}

	@Action(OnLoginSuccess)
	public createUserSession({ patchState }: StateContext<UserSessionStateModel>,
		{ username, sessionId, userId }: OnLoginSuccess) {
		patchState({
			username: username,
			userId: userId,
			sessionId: sessionId,
			timestamp: Date.now(),
		});
		this.router.navigate(['/user-products']);
	}

	@Action(Login)
	public login(ctx: StateContext<UserSessionStateModel>,
		{ username, password }: Login) {
		this.authorizationService.login(username, password)
			.subscribe(response => ctx.dispatch(new OnLoginSuccess(username, response.sessionId, response.userId)));
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
		return !!state.username && !this.isTimestampOlderThan60Minutes(state.timestamp);
	}

	@Selector()
	static userSessionId(state: UserSessionStateModel) {
		return state.sessionId;
	}

	@Selector()
	static userId(state: UserSessionStateModel) {
		return state.userId;
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

	private static isTimestampOlderThan60Minutes(timestamp: number | undefined): boolean {
		if (!timestamp)
			return false;

		const now = Date.now();
		const millisecondsInOneMinute = 60000;

		const differenceInMilliseconds = now - timestamp;
		const differenceInMinutes = differenceInMilliseconds / millisecondsInOneMinute;
		return differenceInMinutes > this.sessionLifetimeInMinutes;
	}
}