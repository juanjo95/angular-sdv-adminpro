import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { tap, map, Observable,of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from './../interfaces/login-form.interface';

const base_url = environment.base_url;

declare const gapi:any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2:any;

  constructor(private http: HttpClient, private router:Router, private ngZone: NgZone) {
    this.googleInit();
  }

  googleInit(){

    return new Promise(resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '902338480798-mqte4uhub3n2fbqbvi0epqdndmp2t62l.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin'
        });
        resolve(true);
      });

    });

  }

  logout(){
    localStorage.removeItem('token');

    this.auth2.signOut().then(() => {
      this.ngZone.run(()=> {
        this.router.navigateByUrl('/login');
      })
    });
  }

  validarToken():Observable<boolean>{
    const token = localStorage.getItem('token');

    if(token){
      return this.http.get(`${base_url}/login/renew`,{
        headers: {
          'x-token':token
        }
      }).pipe(
          tap( (resp: any) => {
            localStorage.setItem('token', resp.token );
          }),
          map( resp => true)
        )
    }else{
      return of(false);
    }

  }

  crearUsuario(formData: RegisterForm){
    return this.http.post(`${base_url}/usuarios`,formData)
                      .pipe(
                        tap( (resp: any) => {
                          localStorage.setItem('token', resp.token)
                        })
                      );
  }

  login(formData: LoginForm){
    return this.http.post(`${base_url}/login`,formData)
                      .pipe(
                        tap( (resp: any) => {
                          localStorage.setItem('token', resp.token)
                        })
                      );
  }

  loginGoogle(token:string){
    return this.http.post(`${base_url}/login/google`, {token})
                      .pipe(
                        tap( (resp: any) => {
                          localStorage.setItem('token', resp.token)
                        })
                      );
  }

}