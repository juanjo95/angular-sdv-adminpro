import { Component, NgZone, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public usuario!:Usuario;

  constructor(private usuarioSvc: UsuarioService) {
    this.usuario = this.usuarioSvc.usuario;
  }

  ngOnInit(): void {
  }

  logout(){
    this.usuarioSvc.logout();
  }

}
