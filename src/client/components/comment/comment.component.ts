import { Component, OnInit, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommentService } from '../../services/comment.service';
import { ModalService } from '../../services/modal.service';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { Comment } from '../../models/comment.model';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnChanges {

  private resultsChanged: Subscription;
  private username: string;
  private showSpinner: boolean = false;
  private planetName: string;
  private comment: string;
  private comments: Comment[];

  displayedColumns = ['id', 'rotation_period', 'orbital_period', 'diameter', 'climate', 'gravity'];
  dataSource = new MatTableDataSource();

  constructor(
    private router: Router,
    private userService: UserService,
    private commentService: CommentService,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

      this.planetName = this.activatedRoute.snapshot.params['planetID'];

      // Check if user logged in
      if (!this.userService.IsLogged() /*|| this.planetName*/) {
          this.router.navigate(['../']);
      } else {
          // Get user data
          this.username = this.userService.GetUserName();
          // Subscribe to data changes
          this.resultsChanged = this.commentService.onCommentsChanged.subscribe(
              results => {
                    this.LoadResultsData(results);
              }
          );
          // Inicia la lista
          this.GetComments();
      }
  }

  ngOnChanges() {
      // Check if user logged in
      if (!this.userService.IsLogged()) {
        this.router.navigate(['../']);
      }
  }

  Logout(): void {
       this.userService.Logout();
  }

  LoadResultsData(comments: any) {
      if (comments && comments.length > 0) {
        this.comments = [];
        this.dataSource.data = comments.map(
          (comment: Comment) => {
            this.comments.push(comment);
        });
      }
      this.showSpinner = false;
  }

  applyFilter(filterValue: string) {
      // Filter to tables
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase();
      this.dataSource.filter = filterValue;
  }

  GetComments(): void {
      this.showSpinner = true;
      this.commentService.GetComments().subscribe(
          result => {},
          error => {
                this.modalService.openModal('Error', 'There is a problem connecting to the server');
                this.showSpinner = false;
          }
      );
  }

  Comment(): void {
        if (this.planetName && this.comment) {
              this.showSpinner = true;
              this.commentService.SaveComment(this.planetName, this.comment).subscribe(
                result => {
                  if (!result) {
                    this.modalService.openModal('Warning', 'Data not found.');
                    this.showSpinner = false;
                  } else {
                    this.GetComments();
                  }
                },
                error => {
                  this.modalService.openModal('Error', 'There is a problem connecting to the server');
                  this.showSpinner = false;
                }
              );
        } else {
              this.modalService.openModal('Warning', 'Please provide a text for your comment')
                .subscribe(
                res => {
                  console.log(res);
              });
        }
  }

}
