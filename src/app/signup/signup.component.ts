import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from '../api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  profileForm:any;
  constructor(private api:ApiService,private auth:AngularFireAuth, private spinner: NgxSpinnerService, private router:Router) { }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      firstname: new FormControl('',Validators.required),
      lastname: new FormControl('',Validators.required),
      email: new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl('',Validators.required)
  });
  }
  onFormSubmit(){
    if(!this.profileForm.valid){
      this.profileForm.markAllAsTouched();
      return;
    }
    console.log(this.profileForm.value);
    let formOutput= this.profileForm.value
    let email=formOutput.email
    let password=formOutput.password
    this.auth.createUserWithEmailAndPassword(email, password)
    .then(res => {
      console.log('You are Successfully signed up!', res);
      })
      .catch(error => {
      console.log('Something is wrong:', error.message);
      window.alert(error.message)
      });
    this.spinner.show();
    this.api.setUserData(this.profileForm.value).subscribe(
      (resp:any)=> {
        console.log(resp)
        this.spinner.hide();
        this.router.navigate(['/home'])
      },
      (err:any)=> {
        console.error(err)
        this.spinner.hide();
        alert("Error");
      }
    );
  }
}