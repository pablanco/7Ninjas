import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth } from 'angular2-jwt';

import { AppComponent } from './app.component';
import { LoginComponent } from '../components/login/login.component';
import { PlanetComponent } from '../components/planet/planet.component';
import { PlanetAddComponent } from '../components/planet/planet-add.component';
import { ModalComponent } from '../components/modal/modal.component';
import { CommentComponent } from '../components/comment/comment.component';

import { CustomMaterialModule } from './material.module';
import { AppRouting } from './app.routing';

import { UserService } from '../services/user.service';
import { PlanetService } from '../services/planet.service';
import { CommentService } from '../services/comment.service';
import { ModalService } from '../services/modal.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PlanetComponent,
    ModalComponent,
    PlanetAddComponent,
    CommentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    AppRouting,
    HttpModule
  ],
  providers: [
    UserService,
    PlanetService,
    ModalService,
    CommentService,
    AuthHttp,
        provideAuth({
            headerName: 'Authorization',
            headerPrefix: 'bearer',
            tokenName: 'token',
            tokenGetter: (() => localStorage.getItem('Session')),
            globalHeaders: [{ 'Content-Type': 'application/json' }],
            noJwtError: true
        })
  ],
  entryComponents: [ModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
