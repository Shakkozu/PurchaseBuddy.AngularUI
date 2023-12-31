import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListsComponent } from './components/shopping-lists/shopping-lists.component';
import { ShoppingListsRoutingModule } from './shopping-lists-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaterialModule } from '../shared/material.module';
import { CreateShoppingListComponent } from './components/create-shopping-list/create-shopping-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShoppingListDetailsComponent } from './components/shopping-list-details/shopping-list-details.component';
import { ListItemsOrganizerComponent } from './components/list-items-organizer/list-items-organizer.component';
import { ImportSharedListComponent } from './components/import-shared-list/import-shared-list.component';
import { InviteUsersToEditComponent } from './components/invite-users-to-edit/invite-users-to-edit.component';
import { ViewPendingInvitationsComponent } from './components/view-pending-invitations/view-pending-invitations.component';



@NgModule({
  declarations: [
    ShoppingListsComponent,
    CreateShoppingListComponent,
    ShoppingListDetailsComponent,
    ListItemsOrganizerComponent,
    ImportSharedListComponent,
    InviteUsersToEditComponent,
    ViewPendingInvitationsComponent
  ],
  imports: [
    ShoppingListsRoutingModule,
    CommonModule,
    NgxDatatableModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ShoppingListsModule { }
