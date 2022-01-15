import { Component, OnInit, Input } from '@angular/core';
import { ChartData, ChartType} from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styleUrls: ['./dona.component.css']
})
export class DonaComponent implements OnInit {

  @Input() title:string = "Sin titulo";

  // Doughnut
  @Input('labels') doughnutChartLabels: string[] = [ 'Label1', 'Label2', 'Label3' ];

  @Input('data') dat:any = {
    data: [ 350, 450, 100 ],
    backgroundColor: ['#6857E6','#009FEE','#F02059']
  };

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [this.dat],
  };
  public doughnutChartType: ChartType = 'doughnut';

  constructor() {

  }

  ngOnInit(): void {
    this.doughnutChartData.labels = this.doughnutChartLabels;
    this.doughnutChartData.datasets.push(this.dat);
    this.doughnutChartData.datasets.shift();
  }


}
