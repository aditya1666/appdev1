import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth} from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  profileForm:any;

  constructor(private auth:AngularFireAuth, private router:Router, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      
      email: new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl('',[Validators.required])
    });
  }
  onFormSubmit(){
    
    if(!this.profileForm.valid){
      this.profileForm.markAllAsTouched();
      return;
    }
    this.spinner.show()
    if(this.profileForm.valid){
      let formOutput=this.profileForm.value
      let email=formOutput.email
      let password=formOutput.password
      this.auth.signInWithEmailAndPassword(
        email,password
      ).then((user)=>{
        this.spinner.hide()
        localStorage.setItem("user",JSON.stringify(user.user))
        this.router.navigate(['/todo'])
      },(resp)=>{
        this.spinner.hide()
        window.alert("Invalid Credentials")
      })
    }
    console.log(this.profileForm.value);
  }

}