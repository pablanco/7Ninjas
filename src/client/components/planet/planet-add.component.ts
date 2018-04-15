import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PlanetService } from '../../services/planet.service';
import { ModalService } from '../../services/modal.service';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { Planet } from '../../models/planet.model';

@Component({
  selector: 'app-planet-add',
  templateUrl: './planet-add.component.html',
  styleUrls: ['./planet-add.component.css']
})
export class PlanetAddComponent implements OnInit, OnChanges {

  private resultsChanged: Subscription;
  private username: string;
  private showSpinner: boolean = false;
  private planetName: string;
  private planets: Planet[];

  displayedColumns = ['id', 'rotation_period', 'orbital_period', 'diameter', 'climate', 'gravity'];
  dataSource = new MatTableDataSource();

  constructor(
    private router: Router,
    private userService: UserService,
    private planetService: PlanetService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
      // Check if user logged in
      if (!this.userService.IsLogged()) {
          this.router.navigate(['../']);
      } else {
          // Get user data
          this.username = this.userService.GetUserName();
          // Subscribe to data changes
          this.resultsChanged = this.planetService.onResultsChanged.subscribe(
              results => {
                    this.LoadResultsData(results);
              }
          );
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

  LoadResultsData(planets: any) {
      if (planets && planets.length > 0) {
        this.planets = [];
        this.dataSource.data = planets.map(
          (planet: Planet) => {
            this.planets.push(planet);
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

  DoSearch(): void {
        if (this.planetName && isNaN(Number(this.planetName))) {
              this.showSpinner = true;
              this.planetService.DoSearch(this.planetName).subscribe(
                result => {
                  if (!result) {
                    this.modalService.openModal('Warning', 'Data not found.');
                    this.showSpinner = false;
                  }
                },
                error => {
                  this.modalService.openModal('Error', 'There is a problem connecting to the server');
                  this.showSpinner = false;
                }
              );
        } else {
              this.modalService.openModal('Warning', 'Please provide a name')
                .subscribe(
                res => {
                  console.log(res);
              });
        }
  }

}
