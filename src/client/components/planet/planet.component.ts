import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PlanetService } from '../../services/planet.service';
import { ModalService } from '../../services/modal.service';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { Planet } from '../../models/planet.model';



@Component({
  selector: 'app-planet',
  templateUrl: './planet.component.html',
  styleUrls: ['./planet.component.css']
})
export class PlanetComponent implements OnInit, OnChanges {

  private resultsChanged: Subscription;
  private showSpinner: boolean = false;
  private timeout: number;
  private username: string;

  displayedColumns = ['id', 'rotation_period', 'orbital_period', 'diameter', 'climate', 'gravity', 'delete'];
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
        // Se suscribe a cambios de datos
        this.resultsChanged = this.planetService.onSearchChanged.subscribe(
          results => {
            this.LoadResultsData(results);
          }
        );
        // Get user data
        this.username = this.userService.GetUserName();
        // Inicia la lista
        this.DoSearch();
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
    this.dataSource.data = [];
    if (planets && planets.length > 0) {
          this.dataSource.data = planets.map(
              (planet: Planet) => {
                  return planet;
              }
          );
    }
    this.showSpinner = false;
  }

  applyFilter(filterValue: string) {
    // Filtro de la tabla
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  Delete(planetID: string) {
    this.showSpinner = true;
    this.planetService.DeletePlanet(planetID).subscribe(
      result => {
        this.DoSearch();
      },
      error => {
        this.modalService.openModal('Error', 'There is a problem connecting to the server');
        this.showSpinner = false;
      }
    );
  }

  DoSearch(): void {
    this.showSpinner = true;
    this.planetService.GetPlanets().subscribe(
      result => {},
      error => {
        this.modalService.openModal('Error', 'There is a problem connecting to the server');
        this.showSpinner = false;
      }
    );
  }
}
