import { Component } from '@angular/core';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent {

  months = ['7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM'];

  // chartBarData = {
  //   labels: [...this.months].slice(0, 7),
  //   datasets: [
  //     {
  //       label: 'GitHub Commits',
  //       backgroundColor: '#f87979',
  //       data: [40, 20, 12, 39, 17, 42, 79]
  //     }
  //   ]
  // };

  // chartBarOptions = {
  //   maintainAspectRatio: false,
  // };

  chartLineData = {
    // labels: [...this.months].slice(0, 12),
    labels: [...this.months],
    datasets: [
      {
        label: 'Timeline',
        backgroundColor: 'rgba(220, 220, 220, 0.2)',
        borderColor: 'rgba(220, 220, 220, 1)',
        pointBackgroundColor: 'rgba(220, 220, 220, 1)',
        pointBorderColor: '#fff',
        data: [0, 11, 25, 35, 45, 49, 28, 20, 35, 70, 80, 85, 90]
      }
      // ,
      // {
      //   label: 'My Second dataset',
      //   backgroundColor: 'rgba(151, 187, 205, 0.2)',
      //   borderColor: 'rgba(151, 187, 205, 1)',
      //   pointBackgroundColor: 'rgba(151, 187, 205, 1)',
      //   pointBorderColor: '#fff',
      //   data: [this.randomData, this.randomData, this.randomData, this.randomData, this.randomData, this.randomData, this.randomData]
      // }
    ]
  };

  chartLineOptions = {
    maintainAspectRatio: false,
  };

  // chartDoughnutData = {
  //   labels: ['VueJs', 'EmberJs', 'ReactJs', 'Angular'],
  //   datasets: [
  //     {
  //       backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
  //       data: [40, 20, 80, 10]
  //     }
  //   ]
  // };

  // chartDoughnutOptions = {
  //   aspectRatio: 1,
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   radius: '100%'
  // };

  chartPieData = {
    labels: ['Indian', 'Ukraine', 'Russia', 'Pakistan', 'England', 'China'],
    datasets: [
      {
        data: [20, 30, 60, 50, 40, 10],
        backgroundColor: ['#F66384', '#72BEF1', '#FBCD56', '#4BC0C0', '#36A2EB', '#9561FF'],
        hoverBackgroundColor: ['#F66384', '#72BEF1', '#FBCD56', '#4BC0C0', '#36A2EB', '#9561FF']
      }
    ]
  };

  // chartPieOptions = {
  //   aspectRatio: 1,
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   radius: '100%'
  // };

  // chartPolarAreaData = {
  //   labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
  //   datasets: [
  //     {
  //       data: [11, 16, 7, 3, 14],
  //       backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB']
  //     }
  //   ]
  // };

  // chartRadarData = {
  //   labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
  //   datasets: [
  //     {
  //       label: '2020',
  //       backgroundColor: 'rgba(179,181,198,0.2)',
  //       borderColor: 'rgba(179,181,198,1)',
  //       pointBackgroundColor: 'rgba(179,181,198,1)',
  //       pointBorderColor: '#fff',
  //       pointHoverBackgroundColor: '#fff',
  //       pointHoverBorderColor: 'rgba(179,181,198,1)',
  //       tooltipLabelColor: 'rgba(179,181,198,1)',
  //       data: [65, 59, 90, 81, 56, 55, 40]
  //     },
  //     {
  //       label: '2021',
  //       backgroundColor: 'rgba(255,99,132,0.2)',
  //       borderColor: 'rgba(255,99,132,1)',
  //       pointBackgroundColor: 'rgba(255,99,132,1)',
  //       pointBorderColor: '#fff',
  //       pointHoverBackgroundColor: '#fff',
  //       pointHoverBorderColor: 'rgba(255,99,132,1)',
  //       tooltipLabelColor: 'rgba(255,99,132,1)',
  //       data: [this.randomData, this.randomData, this.randomData, this.randomData, this.randomData, this.randomData, this.randomData]
  //     }
  //   ]
  // };

  // chartRadarOptions = {
  //   aspectRatio: 1.5,
  //   responsive: true,
  //   maintainAspectRatio: false,
  // };

  // get randomData() {
  //   return Math.round(Math.random() * 100);
  // }

}
