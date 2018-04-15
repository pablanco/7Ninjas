import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { PlanetAddComponent } from '../components/planet/planet-add.component';
import { PlanetComponent } from '../components/planet/planet.component';
import { CommentComponent } from '../components/comment/comment.component';

const routes: Routes = [
    { path: 'planet', component: PlanetAddComponent },
    { path: 'login', component: LoginComponent },
    { path: 'planets', component: PlanetComponent },
    { path: 'comment/:planetID', component: CommentComponent },
    { path: '', component: LoginComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRouting { }
