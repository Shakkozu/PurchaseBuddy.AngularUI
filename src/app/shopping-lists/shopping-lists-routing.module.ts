import { NgModule } from '@angular/core';
import { AuthGuard } from '../auth/auth.guard';
import { ShoppingListsComponent } from './components/shopping-lists/shopping-lists.component';
import { RouterModule, Routes } from '@angular/router';
import { CreateShoppingListComponent } from './components/create-shopping-list/create-shopping-list.component';
import { ShoppingListDetailsComponent } from './components/shopping-list-details/shopping-list-details.component';
import { ImportSharedListComponent } from './components/import-shared-list/import-shared-list.component';


const routes: Routes = [
  { path: 'shopping-lists', component: ShoppingListsComponent, canActivate: [AuthGuard] },
  { path: 'shopping-lists/new', component: CreateShoppingListComponent, canActivate: [AuthGuard] },
  { path: 'shopping-lists/:id', component: ShoppingListDetailsComponent, canActivate: [AuthGuard] },
  { path: 'shopping-lists/import-shared/:id', component: ImportSharedListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingListsRoutingModule { }
