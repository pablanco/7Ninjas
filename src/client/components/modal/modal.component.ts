import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  public title: string;
  public message: string;
  public showButtons: boolean = false;

  constructor(public dialogRef: MatDialogRef<ModalComponent>) {
  }

  ngOnInit() {
  }

  onCloseConfirm() {
    this.dialogRef.close('Confirm');
  }

}

