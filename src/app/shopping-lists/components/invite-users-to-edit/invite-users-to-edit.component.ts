import { Component, Optional, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserDto, UsersService } from 'src/app/crm/services/users-service';
import { ShoppingListsInvitationsService } from '../../invitations/services/shopping-list-invitations.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-invite-users-to-edit',
  templateUrl: './invite-users-to-edit.component.html',
  styleUrls: ['./invite-users-to-edit.component.scss']
})
  
export class InviteUsersToEditComponent {
  public users: UserDto[] = [];
  public dataForm!: FormGroup;
  constructor (
    public dialogRef: MatDialogRef<InviteUsersToEditComponent>,
    private usersService: UsersService,
    private inviteService: ShoppingListsInvitationsService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data: {
      listId: string
    },
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      selectedUser: new FormControl(''),
    });
    this.usersService.getAllUsers().subscribe(users => this.users = users);

  }

  public get userSelected(): boolean {
    return this.dataForm.controls['selectedUser'].value.length > 0;
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public confirm(): void {
    const selectedUserId = this.dataForm.controls['selectedUser'].value;
    const selectedUserName = this.users.find(u => u.guid === selectedUserId)?.name;
     this.inviteService.inviteUserToPurchase(this.data.listId, selectedUserId)
       .subscribe(_ => {
         this.snackBar.open(`User ${ selectedUserName } was invited to sharing list`, 'Dismiss', {
           duration: 1500,
           horizontalPosition: 'center',
           verticalPosition: 'bottom'
         })
         this.dialogRef.close()
       });
  }
}

