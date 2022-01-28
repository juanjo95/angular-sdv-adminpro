import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formSubmitted = false;
  public auth2:any;

  public regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.pattern(this.regex)] ],
    password: ['', Validators.required],
    remember: [localStorage.getItem('email') ? true : false]
  });

  constructor(private fb: FormBuilder, private router: Router, private usuarioSvc: UsuarioService, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.renderButton();
  }

  login(){
    this.usuarioSvc.login(this.loginForm.value).subscribe(res => {

      if ( this.loginForm.get('remember')?.value ){
        localStorage.setItem('email', this.loginForm.get('email')?.value );
      } else {
        localStorage.removeItem('email');
      }

      // Navegar al Dashboard
      this.router.navigateByUrl('/');

    }, (err) => {
      // Si sucede un error
      Swal.fire('Error',err.error.msg,'error');
    });
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark'
    });
    this.startApp();
  }

  async startApp(){
    await this.usuarioSvc.googleInit();
    this.auth2 = this.usuarioSvc.auth2;

    this.attachSignin(document.getElementById('my-signin2'));

  };

  attachSignin(element:any) {
    this.auth2.attachClickHandler(element, {},
        (googleUser:any) => {
          const id_token = googleUser.getAuthResponse().id_token;
          this.usuarioSvc.loginGoogle(id_token).subscribe( res => {
            // Navegar al Dashboard
            this.ngZone.run( () => {
              this.router.navigateByUrl('/');
            });
          });


        },(error:any) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}
