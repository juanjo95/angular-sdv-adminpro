import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styleUrls: ['./promesas.component.css']
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.getUsuarios()
          .then(res => console.log(res));

    /* const promesa = new Promise((resolve,reject) => {
      if(false){
        resolve('hola mundo');
      }else{
        reject('Algo salio mal');
      }
    });

    promesa.then(mensaje => console.log(mensaje))
            .catch(err => console.log(err));

    console.log('fin del init'); */

  }

  getUsuarios(){
    return new Promise((resolve,reject) => {
      fetch('https://reqres.in/api/users')
          .then(resp => resp.json())
            .then(resp2 => resolve(resp2.data));
    });
  }

}
