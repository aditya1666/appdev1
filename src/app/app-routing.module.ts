import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { TodoComponent } from './todo/todo.component';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';

const routes: Routes = [
  {
    path:'',
    component:HeaderComponent,
    children:[
      {
        path:'home',
        component:HomeComponent
      },
      {
        path:'form',
        component:FormComponent
      },
      {
        path:'signin',
        component:SigninComponent
      },
      {
        path:'signup',
        component:SignupComponent,
        
      },
      {
        path:'todo',
        component:TodoComponent,
        canActivate:[AngularFireAuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }