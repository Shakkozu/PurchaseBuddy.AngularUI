import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { Login } from '../../store/authorization.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [],
})
export class LoginComponent implements OnInit, OnDestroy {
  public hide: boolean = false;
  public loginForm!: FormGroup;
  private destroy$ = new Subject();

  constructor (private formBuilder: FormBuilder,
    private store: Store) {
  }

  public ngOnInit(): void {
    this.initForm();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(0);
  }

  private initForm(): void {
    this.loginForm = this.formBuilder.group({
      login: ["username"],
      password: ["zaq1@WSX"]
    });
  }

  public save(): void {
    this.store.dispatch(new Login(this.loginForm.value.login, this.loginForm.value.password))
      .pipe(takeUntil(this.destroy$));
  }
}

export interface IUserLoginRequest {
  login: string;
  password: string;
}