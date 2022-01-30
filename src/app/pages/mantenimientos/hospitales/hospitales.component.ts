import { Hospital } from './../../../models/hospital.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HospitalesService } from 'src/app/services/hospitales.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay, Subscription } from 'rxjs';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales:Hospital[] = [];
  public cargando:boolean = true;
  private imgSub!:Subscription;

  constructor(private hospitalSvc: HospitalesService, private modalImgSvc: ModalImagenService, private busquedaSvc: BusquedasService) { }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSub = this.modalImgSvc.nuevaImagen
                    .pipe( delay(100) )
                    .subscribe(img => this.cargarHospitales());
  }

  ngOnDestroy(): void {
    this.imgSub.unsubscribe();
  }

  cargarHospitales(){
    this.cargando = true;
    this.hospitalSvc.cargarHospitales().subscribe(resp => {
      this.hospitales = resp;
      this.cargando = false;
    })
  }

  guardarCambios(hospital: Hospital){
    if(hospital._id){
      this.hospitalSvc.actualizarHospital(hospital._id,hospital.nombre).subscribe(resp => {
        Swal.fire('Actualizado',hospital.nombre,'success');
      });
    }
  }

  eliminarHospital(hospital: Hospital){
    if(hospital._id){
      this.hospitalSvc.borrarHospital(hospital._id).subscribe(resp => {
        this.cargarHospitales();
        Swal.fire('Eliminado',hospital.nombre,'success');
      });
    }
  }

  async abrirSweetAlert(){
    const {value = ''} = await Swal.fire<any>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    })

    if(value.trim().length > 0){
      this.hospitalSvc.crearHospital(value).subscribe((resp:any) => {
        /* this.cargarHospitales(); */
        this.hospitales.push(resp.hospital);
      });
    }

  }

  abrirModal(hospital: Hospital){
    if(hospital._id){
      this.modalImgSvc.abrirModal('hospitales',hospital._id, hospital.img);
    }
  }

  buscar(termino:string):any{

    if(termino.length === 0){
      return this.cargarHospitales();
    }
    this.busquedaSvc.buscar('hospitales',termino).subscribe(res => {
      this.hospitales = res;
    });
  }

}
