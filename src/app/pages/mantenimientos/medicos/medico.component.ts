import { MedicoService } from './../../../services/medico.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalesService } from '../../../services/hospitales.service';
import { Medico } from 'src/app/models/medico.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  public medicoForm!:FormGroup;
  public hospitales: Hospital[] = [];

  public medicoSeleccionado?: Medico;
  public hospitalSeleccionado?: Hospital;

  constructor(private fb: FormBuilder, private hospitalSvc: HospitalesService, private medicoSvc: MedicoService, private router:Router, private aRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.aRoute.params.subscribe(({id}) => this.cargarMedico(id));

    this.cargarHospitales();

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    });

    this.medicoForm.get('hospital')?.valueChanges.subscribe(hospitalId => {
      this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId);
    });
  }

  cargarMedico(id:string){
    if(id === 'nuevo'){
      return;
    }

    this.medicoSvc.obtenerMedico(id)
      .pipe(delay(100))
      .subscribe(resp => {
      if(!resp){
        this.router.navigateByUrl(`/dashboard/medicos`);
      }else{
        const {nombre, hospital: {_id} } = resp;
        this.medicoSeleccionado = resp;
        this.medicoForm.setValue({nombre,hospital: _id});
      }
    },err => {
      this.router.navigateByUrl(`/dashboard/medicos`);
    });
  }

  cargarHospitales(){
    this.hospitalSvc.cargarHospitales().subscribe(hospitales => {
      this.hospitales = hospitales;
    })
  }

  guardarMedico(){
    const {nombre} = this.medicoForm.value;

    if(this.medicoSeleccionado){
      // Actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoSvc.actualizarMedico(data).subscribe(resp => {
        Swal.fire('Medico Actualizado',`${nombre} actualizado correctamente.`,'success');
      });
    }else{
      // Crear
      this.medicoSvc.crearMedico(this.medicoForm.value).subscribe((resp:any) => {
        Swal.fire('Medico creado',`${nombre} creado correctamente.`,'success');
        this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
      });
    }
  }

}
