import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { MaterialModule } from '../shared/material.module';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import { AuthorizationState } from './store/authorization.state';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxsModule.forFeature([
      AuthorizationState,
    ]),
    NgxsStoragePluginModule.forRoot({
      key: [AuthorizationState]
    }),
    HttpClientModule,
  ],
  exports: [
    LoginComponent,
    RegisterComponent
  ],
  providers: [
  ]
})
export class AuthModule { }
