import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styleUrls: ['./modal-imagen.component.css']
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir!:File;
  public imgTemp:any;

  constructor(public modalImgSvc: ModalImagenService, public fileUploadSvc: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    this.imgTemp = null;
    this.modalImgSvc.cerrarModal();
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

    const id = this.modalImgSvc.id;
    const tipo = this.modalImgSvc.tipo;

    if(id){
      this.fileUploadSvc.actualizarFoto(this.imagenSubir,tipo,id)
                          .then( img => {
                            Swal.fire('Guardado','Imagen de usuario actualizada','success');
                            this.modalImgSvc.nuevaImagen.emit(img);
                            this.cerrarModal();
                          })
                          .catch(err => Swal.fire('Error','No se pudo subir la imagen','error'));
    }
  }

}
