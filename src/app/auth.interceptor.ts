import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable,of,from} from 'rxjs';
import { switchMap,take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private afAuth:AngularFireAuth) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authTokenCall=this.getToken();
    return authTokenCall.pipe(take(1),
    switchMap(authToken =>{
      request=request.clone({
        setHeaders:{
          'Authorization': `Bearer ${authToken}`,
        },
      })
    
    return next.handle(request);
    }));
  }
  getToken(){
    return this.afAuth.authState.pipe(
      switchMap((user)=>{
        if(user){
          return from(user.getIdToken())
        }
        return of(null);
      })
    )
  }
}