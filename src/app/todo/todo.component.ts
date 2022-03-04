import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl,Validators} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { AngularFireAuth} from '@angular/fire/compat/auth';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  profileForm:any;
  urs:any;
  data:any;
  datas:any[]=[];
  task:any;
  updates:any;

  constructor(private api:ApiService, private spinner:NgxSpinnerService, private router:Router, private auth:AngularFireAuth) { }

  ngOnInit(): void {
    this.api.getuser().subscribe((res:any)=>{
      this.urs=res
      console.log(res)
    }
    );
    this.spinner.show()
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 3000);
    this.profileForm= new FormGroup({
      task: new FormControl('',Validators.required),
    });
    
    this.api.getlist().subscribe((res: any)=>{
      this.data=res
      
      console.log(res)
      
    });
    

  }
  onFormSubmit(){
    if(!this.profileForm.valid){
      this.profileForm.markAllAsTouched();
      return;
    }
    
    this.spinner.show()
    console.log(this.profileForm.value);
    this.api.tasks(this.profileForm.value).subscribe(
      (resp:any)=>{
        console.log(resp)
        this.spinner.hide();
        this.router.navigate(['/todo'])
        
      },
      (err:any)=>{
        console.error(err)
        this.spinner.hide();
        alert("Error");
      
      }
    );
    this.profileForm.reset()
    window.location.reload()

  }

  onDelete(task: any){
    this.api.deletes({task:task}).subscribe((res:any)=>{
      console.log(res)
      window.location.reload()
    })
  }
  onUpdate(task:any,uts:any){
    this.api.updates({task:task,updates:uts}).subscribe((res:any)=>{
      console.log(res)
      window.location.reload()
    })

  }
  logsout(){
    this.auth.signOut().then(()=>{
    localStorage.removeItem('user')
    this.router.navigate(['/signin'])
    });
  }
  Refresh(){
    window.location.reload()
  }
  

}