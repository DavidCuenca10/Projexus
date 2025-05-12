import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { NavbarUserComponent } from './components/navbar-user/navbar-user.component';
import { ProyectoDetallesComponent } from './components/proyecto-detalles/proyecto-detalles.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CrearProyectoComponent } from './components/crear-proyecto/crear-proyecto.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { PerfilProyectosComponent } from './components/perfil-proyectos/perfil-proyectos.component';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    WelcomeComponent,
    NavbarUserComponent,
    ProyectoDetallesComponent,
    CrearProyectoComponent,
    PerfilComponent,
    PerfilProyectosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
