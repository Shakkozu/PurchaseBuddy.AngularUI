import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { InvitationDto, ShoppingListsInvitationsService } from '../../invitations/services/shopping-list-invitations.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateTimeParser } from 'src/app/shared/utils/DateTimeParser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-pending-invitations',
  templateUrl: './view-pending-invitations.component.html',
  styleUrls: ['./view-pending-invitations.component.scss']
})
export class ViewPendingInvitationsComponent {
  @Output('invitationAccepted')
  public invitationAccepted: EventEmitter<string> = new EventEmitter<string>();
  @Output('invitationRejected')
  public invitationRejected: EventEmitter<string> = new EventEmitter<string>();

  public invitations: InvitationDto[] = [];
  
  constructor (private invitationsService: ShoppingListsInvitationsService,
    private dialogRef: MatDialogRef<ViewPendingInvitationsComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) data: {
      invitations: InvitationDto[]
    }
  ) {
    this.invitations = data.invitations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  ngOnInit(): void {
    
  }

  public reject(dto: InvitationDto) {
    this.invitationsService.rejectAnInvite(dto.listId).subscribe(_ => {
      this.snackBar.open(`Invitation from user ${ dto.listCreatorName } rejected`, 'Dismiss', {
        duration: 1500,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      })
      this.invitationRejected.emit(dto.listId);
      this.dialogRef.close()
    });
  }
  
  public accept(dto: InvitationDto) {
    this.invitationsService.acceptAnInvite(dto.listId).subscribe(_ => {
      this.snackBar.open(`Invitation from user ${ dto.listCreatorName } accepted`, 'Dismiss', {
        duration: 1500,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      })
      this.invitationAccepted.emit(dto.listId);
      this.dialogRef.close()
    });
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public getTimeElapsed(dateTime: any) {
    return DateTimeParser.getTimeElapsed(dateTime);
  }

}
