import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../components/modal/modal.component';

@Injectable()
export class ModalService {


  constructor(private dialog: MatDialog) { }

  public openModal(title: string, message: string): Observable<boolean> {

      let dialogRef: MatDialogRef<ModalComponent>;

      dialogRef = this.dialog.open(ModalComponent, {
        width: '25%'
      });
      dialogRef.componentInstance.title = title;
      dialogRef.componentInstance.message = message;

      return dialogRef.afterClosed();
  }
}
