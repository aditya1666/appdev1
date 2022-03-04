import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  BASE_URL= environment.BASE_URL;

  constructor(private http: HttpClient) { }
  setUserData(user:any):any{
    return this.http.post(`${this.BASE_URL}/api/user`,user);
  }
  tasks(task:any):any{
    return this.http.post(`${this.BASE_URL}/api/tasks`,task);
  }
  getlist():any{
    return this.http.get(`${this.BASE_URL}/api/list`);
  }
  deletes(its:any):any{
    return this.http.post(`${this.BASE_URL}/api/delete`,its);
  }
  updates(uts:any):any{
    return this.http.post(`${this.BASE_URL}/api/updates`,uts);
  }
  getuser():any{
    return this.http.get(`${this.BASE_URL}/api/user_info`);
  }
}