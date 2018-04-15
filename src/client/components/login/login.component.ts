import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  showSpinner: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private modalService: ModalService
  ) {
  }

  ngOnInit() {
  }


  Login(): void {
    if (this.username && this.password) {
      this.showSpinner = true;
      this.userService.Login(this.username, this.password).subscribe(
        result => {
          if (result) {
            this.router.navigate(['planet']);
          } else {
            this.modalService.openModal('Error', 'Your user or password are wrong.')
              .subscribe(
              res => {
                console.log(res);
                this.showSpinner = false;
              });
          }
        },
        error => {
          this.modalService.openModal('Algo salió mal', 'There is a problem connecting to the server')
            .subscribe(
            res => {
              console.log(res);
              this.showSpinner = false;
            });
        }
      );
    } else {
      this.modalService.openModal('Warning', 'Please provide user and password')
        .subscribe(
        res => {
          console.log(res);
          this.showSpinner = false;
        });
    }

  }
}
