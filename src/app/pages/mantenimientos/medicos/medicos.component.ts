import { Component, OnInit, OnDestroy } from '@angular/core';
import { MedicoService } from 'src/app/services/medico.service';
import { Medico } from '../../../models/medico.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay, Subscription } from 'rxjs';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public cargando:boolean = true;
  private imgSub!:Subscription;

  constructor(private medicoSvc:MedicoService, private modalImgSvc: ModalImagenService, private busquedaSvc: BusquedasService) { }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSub = this.modalImgSvc.nuevaImagen
                    .pipe( delay(100) )
                    .subscribe(img => this.cargarMedicos());
  }

  ngOnDestroy(): void {
    this.imgSub.unsubscribe();
  }

  abrirModal(medico: Medico){
    if(medico._id){
      this.modalImgSvc.abrirModal('medicos',medico._id, medico.img);
    }
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicoSvc.cargarMedicos().subscribe((res:Medico[]) => {
      this.cargando = false;
      this.medicos = res;
    });
  }

  buscar(termino:string):any{

    if(termino.length === 0){
      return this.cargarMedicos();
    }
    this.busquedaSvc.buscar('medicos',termino).subscribe(res => {
      this.medicos = res;
    });
  }

  borrarMedico(medico: Medico){
    Swal.fire({
      title: 'Borrar medico?',
      text: `Esta a punto de eliminar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed && medico._id) {

        this.medicoSvc.borrarMedico(medico._id).subscribe(res => {
          this.cargarMedicos();
          Swal.fire(
            'Medico eliminado!',
            `${medico.nombre} ha sido eliminado correctamente`,
            'success'
          );
        });
      }
    });
  }


}
