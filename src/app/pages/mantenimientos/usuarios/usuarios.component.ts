import { Component, OnInit, OnDestroy } from '@angular/core';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CargarUsuario } from '../../../interfaces/cargar-usuarios.interface';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay, Subscription } from 'rxjs';
import { Usuario } from '../../../models/usuario.model';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios:number = 0;
  public usuarios:Usuario[] = [];
  public usuariosTemp:Usuario[] = [];

  public imgSub!:Subscription;
  public desde:number= 0;
  public cargando:boolean = true;

  constructor(private usuarioSvc: UsuarioService, private busquedaSvc: BusquedasService, private modalImgSvc: ModalImagenService) { }

  ngOnDestroy(): void {
    this.imgSub.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSub = this.modalImgSvc.nuevaImagen
                    .pipe( delay(100) )
                    .subscribe(img => this.cargarUsuarios());
  }

  cargarUsuarios(){
    this.cargando = true;
    this.usuarioSvc.cargarUsuarios(this.desde).subscribe((resp:CargarUsuario) => {
      this.totalUsuarios = resp.total;
      this.usuarios = resp.usuarios;
      this.usuariosTemp = resp.usuarios;
      this.cargando = false;
    });
  }

  cambiarPagina(valor:number){
    this.desde += valor;
    if(this.desde < 0){
      this.desde = 0;
    }else if(this.desde >= this.totalUsuarios){
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar(termino:string):any{

    if(termino.length === 0){
      return this.usuarios = this.usuariosTemp;
    }
    this.busquedaSvc.buscar('usuarios',termino).subscribe((res:any) => {
      this.usuarios = res;
    });
  }

  eliminarUsuario(usuario: Usuario):any{

    if(usuario.uid === this.usuarioSvc.uid){
      return Swal.fire('Error!','No puede borrarse a si mismo','error');
    }

    Swal.fire({
      title: 'Borrar usuario?',
      text: `Esta a punto de eliminar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioSvc.eliminarUsuario(usuario).subscribe(res => {
          this.cargarUsuarios();
          Swal.fire(
            'Eliminado!',
            `${usuario.nombre} ha sido eliminado correctamente`,
            'success'
          );
        });
      }
    });
  }

  cambiarRole(usuario:Usuario){
    this.usuarioSvc.guardarUsuario(usuario).subscribe(res => {
      console.log(res);
    })
  }

  abrirModal(usuario:Usuario){
    if(usuario.uid){
      this.modalImgSvc.abrirModal('usuarios',usuario.uid, usuario.img);
    }
  }

}
