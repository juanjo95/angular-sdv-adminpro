import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public perfilForm!:FormGroup;
  public regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
  public usuario!:Usuario;
  public imagenSubir!:File;
  public imgTemp:any;

  constructor(private fb:FormBuilder, private usuarioSvc:UsuarioService, private fileUploadSvc: FileUploadService) {
    this.usuario = this.usuarioSvc.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.pattern(this.regex)]]
    });
  }

  actualizarPerfil(){
    this.usuarioSvc.actualizarPerfil(this.perfilForm.value).subscribe(() => {
      const {nombre, email} = this.perfilForm.value;
      this.usuario.nombre = nombre;
      this.usuario.email = email;
      Swal.fire('Guardado','Los cambios fueron guardados','success');
    },error => {
      Swal.fire('Error',error.error.msg,'error');
    });
  }

  cambiarImagen(event:any):any{
    this.imagenSubir = event.target.files[0];

    if(!this.imagenSubir){
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.imagenSubir);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }

  }

  subirImagen(){
    if(this.usuario.uid){
      this.fileUploadSvc.actualizarFoto(this.imagenSubir,'usuarios',this.usuario.uid)
                          .then( img => {
                            this.usuario.img = img
                            Swal.fire('Guardado','Imagen de usuario actualizada','success');
                          })
                          .catch(err => Swal.fire('Error','No se pudo subir la imagen','error'));
    }
  }

}
