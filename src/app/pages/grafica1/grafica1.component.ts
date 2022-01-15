import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component implements OnInit {

  public labels1:string[] = ['Helado','Perros','Pizza' ];
  public data1 = {
    data: [ 10, 15, 40 ],
    backgroundColor: ['#6857E6','#009FEE','#F02059']
  }

  constructor() { }

  ngOnInit(): void {
  }

}
