import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { IUserDto } from '../..';
import { Register } from '../../store/authorization.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  public hide: boolean = true;
  public hide_confirmation: boolean = true;
  public form!: FormGroup;
  private destroy$: Subject<void> = new Subject();
  passwordMatchValidator: any;

  constructor (private formBuilder: FormBuilder,
    private store: Store) {
  }

  public ngOnInit(): void {
    this.passwordMatchValidator = (formGroup: FormGroup) => {
      const { value: password } = formGroup.get('password')!;
      const { value: confirmPassword } = formGroup.get('confirmPassword')!;
      return password === confirmPassword ? null : { passwordNotMatch: true };
    };
    this.initForm();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      login: ['username', [Validators.required, Validators.minLength(6)]],
      email: ['test@example.com', [Validators.required, Validators.email]],
      password: ['zaq1@WSX', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]+$')]],
      confirmPassword: ['zaq1@WSX', {validator: this.passwordMatchValidator}],
    }, {
      validator: this.passwordMatchValidator 
    });
  }

  public onSubmit(): void {
  }

  public save(): void {
    const body: IUserDto = {
      login: this.form.value.login,
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.store.dispatch(new Register(body)).pipe(takeUntil(this.destroy$));
  }
}

