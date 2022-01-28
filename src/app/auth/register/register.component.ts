import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public formSubmitted = false;

  public regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i

  public registerForm = this.fb.group({
    nombre: ['Juan Jose', Validators.required],
    email: ['test100@gmail.com', [Validators.required, Validators.pattern(this.regex)] ],
    password: ['123456', Validators.required],
    password2: ['123456', Validators.required],
    terminos: [true, Validators.required]
  }, {
    validators: this.passwordsIguales('password','password2')
  });

  constructor(private fb: FormBuilder, private usuarioSvc: UsuarioService, private router: Router) { }

  ngOnInit(): void {
  }

  crearUsuario():void{
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if(this.registerForm.invalid){
      return;
    }

    // Realizar la creacion
    this.usuarioSvc.crearUsuario(this.registerForm.value).subscribe(res => {
      // Navegar al Dashboard
      this.router.navigateByUrl('/');
    },err => {
      // Si sucede un error
      Swal.fire('Error',err.error.msg,'error');
    });

  }

  campoNoValido(campo: string):boolean{
    if(this.registerForm.get(campo)?.invalid && this.formSubmitted){
      return true;
    }else{
      return false;
    }
  }

  contrasenasNoValidas():boolean{
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;

    if((pass1 !== pass2) && this.formSubmitted){
      return true;
    }else{
      return false;
    }

  }

  aceptaTerminos():boolean{
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  }

  passwordsIguales(pass1Name:string,pass2Name:string){
    return (fg: FormGroup) => {
      const pass1Control = fg.get(pass1Name);
      const pass2Control = fg.get(pass2Name);

      if(pass1Control?.value === pass2Control?.value){
        pass2Control?.setErrors(null);
      }else{
        pass2Control?.setErrors({
          noEsIgual: true
        });
      }

    }
  }

}
