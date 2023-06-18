import { NgModule } from '@angular/core';
import { AuthGuard } from '../auth/auth.guard';
import { ShoppingListsComponent } from './components/shopping-lists/shopping-lists.component';
import { RouterModule, Routes } from '@angular/router';
import { CreateShoppingListComponent } from './components/create-shopping-list/create-shopping-list.component';
import { ShoppingListDetailsComponent } from './components/shopping-list-details/shopping-list-details.component';


const routes: Routes = [
  { path: 'shopping-lists', component: ShoppingListsComponent, canActivate: [AuthGuard] },
  { path: 'shopping-list/new', component: CreateShoppingListComponent, canActivate: [AuthGuard] },
  { path: 'shopping-list/:id', component: ShoppingListDetailsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingListsRoutingModule { }
