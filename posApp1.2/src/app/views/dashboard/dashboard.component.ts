import { Component, OnInit } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";

import { DashboardChartsData, IChartProps } from "./dashboard-charts-data";
import { ApiService } from "../../services/navigation/api.service";
import { Injectable } from "@angular/core";
import { getStyle, hexToRgba } from "@coreui/utils/src";
 import { Location } from "@angular/common";
declare var $: any;

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: "dashboard.component.html",
  styleUrls: ["dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  label = "Monthly Sales";
  currentDate: Date = new Date();
  year = this.currentDate.getFullYear();
  month = this.currentDate.getMonth() + 1;
  constructor(private apiService: ApiService,private location:Location) {}
  label2 = "";
  isDataAvailable = false;
  isDataAvailable2 = false;
  filterByYear: any;
  isLoading = false;
  chartData = {
    salesArray: {
      yearly: [],
      monthly: [],
      weekly: [],
    },
    receivingsArray: {
      yearly: [],
      monthly: [],
      weekly: [],
    },
    expensesArray: {
      yearly: [],
      monthly: [],
      weekly: [],
    },
  };

  public users: IUser[] = [
    {
      name: "Yiorgos Avraamu",
      state: "New",
      registered: "Jan 1, 2021",
      country: "Us",
      usage: 50,
      period: "Jun 11, 2021 - Jul 10, 2021",
      payment: "Mastercard",
      activity: "10 sec ago",
      avatar: "./assets/img/avatars/1.jpg",
      status: "success",
      color: "success",
    },
    {
      name: "Avram Tarasios",
      state: "Recurring ",
      registered: "Jan 1, 2021",
      country: "Br",
      usage: 10,
      period: "Jun 11, 2021 - Jul 10, 2021",
      payment: "Visa",
      activity: "5 minutes ago",
      avatar: "./assets/img/avatars/2.jpg",
      status: "danger",
      color: "info",
    },
    {
      name: "Quintin Ed",
      state: "New",
      registered: "Jan 1, 2021",
      country: "In",
      usage: 74,
      period: "Jun 11, 2021 - Jul 10, 2021",
      payment: "Stripe",
      activity: "1 hour ago",
      avatar: "./assets/img/avatars/3.jpg",
      status: "warning",
      color: "warning",
    },
    {
      name: "Enéas Kwadwo",
      state: "Sleep",
      registered: "Jan 1, 2021",
      country: "Fr",
      usage: 98,
      period: "Jun 11, 2021 - Jul 10, 2021",
      payment: "Paypal",
      activity: "Last month",
      avatar: "./assets/img/avatars/4.jpg",
      status: "secondary",
      color: "danger",
    },
    {
      name: "Agapetus Tadeáš",
      state: "New",
      registered: "Jan 1, 2021",
      country: "Es",
      usage: 22,
      period: "Jun 11, 2021 - Jul 10, 2021",
      payment: "ApplePay",
      activity: "Last week",
      avatar: "./assets/img/avatars/5.jpg",
      status: "success",
      color: "primary",
    },
    {
      name: "Friderik Dávid",
      state: "New",
      registered: "Jan 1, 2021",
      country: "Pl",
      usage: 43,
      period: "Jun 11, 2021 - Jul 10, 2021",
      payment: "Amex",
      activity: "Yesterday",
      avatar: "./assets/img/avatars/6.jpg",
      status: "info",
      color: "dark",
    },
  ];
  public mainChart: IChartProps = {};
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new UntypedFormGroup({
    trafficRadio: new UntypedFormControl("Month"),
  });

  chartPieData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#F66384",
          "#72BEF1",
          "#FBCD56",
          "#4BC0C0",
          "#36A2EB",
          "#9561FF",
        ],
        hoverBackgroundColor: [
          "#D74F6D",
          "#56A3D6",
          "#EFBD3C",
          "#37A6A6",
          "#1884CD",
          "#7D44EF",
        ],
      },
    ],
  };
  ngOnInit(): void {
   
    this.location.go("/dashboard");
    console.log("Year = " + this.year + " Month = " + this.month);
    this.getChartData(this.year, this.month);
    this.getChartPieData();
  }

  getChartPieData() {
    this.apiService.topProducts().subscribe((response) => {
      console.log("Top Products", response);
      if (response != null && response != undefined) {
        if (response.productList!=null)
          for (let i = 0; i < response.productList.length; i++) {
            this.chartPieData.labels[i] = response.productList[i].name;
            this.chartPieData.datasets[0].data[i] =
              response.productList[i].stockOut;
          }
        this.isDataAvailable2 = true;
      }
    });
  }

  getChartData(year, month) {
    this.isLoading = true;
    this.apiService.getAllAnalysis(year, month).subscribe(
      (yearData) => {
        console.log("Yeary List Data:", yearData);
        if (yearData != null && yearData != undefined) {
          try {
            this.chartData.salesArray.yearly = [...yearData.salesArray.yearly ];
            this.chartData.salesArray.monthly = [
              ...yearData.salesArray.monthly,
            ];
            this.chartData.salesArray.weekly = [...yearData.salesArray.weekly];

            // this.chartData.salesArray.yearly = [1000,2000,3000,4000,3800];
            // this.chartData.salesArray.monthly = [1230,2045,3020,2340,1800,4220,1330,3660,3250,3234,4535,4324];
            // this.chartData.salesArray.weekly = [1000,2000,3000,4000];

            this.chartData.receivingsArray.yearly = [
              ...yearData.receivingsArray.yearly,
            ];
            this.chartData.receivingsArray.monthly = [
              ...yearData.receivingsArray.monthly,
            ];
            this.chartData.receivingsArray.weekly = [
              ...yearData.receivingsArray.weekly,
            ];

            // this.chartData.receivingsArray.yearly = [1000,2000,3000,4000,3800];
            // this.chartData.receivingsArray.monthly = [4000,1000,3000,4000,3802,1220,1000,4600,4200,1234,4535,4324];
            // this.chartData.receivingsArray.weekly = [1000,2000,1000,1000];

            this.chartData.expensesArray.yearly = [
              ...yearData.expensesArray.yearly,
            ];
            this.chartData.expensesArray.monthly = [
              ...yearData.expensesArray.monthly,
            ];
            this.chartData.expensesArray.weekly = [
              ...yearData.expensesArray.weekly,
            ];

            // this.chartData.expensesArray.yearly = [1000,2000,3000,4000,3800];
            // this.chartData.expensesArray.monthly = [444,140,3400,4500,3832,1220,4000,4600,4200,1234,4535,4324];
            // this.chartData.expensesArray.weekly = [1000,2000,1000,1000];

            this.initCharts("Month", this.chartData);
            this.isDataAvailable = true;
            console.log(yearData);
            this.isLoading = false;
          } catch {}
        } else {
          this.isLoading = false;
        }
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }

  initCharts(period: string, data: any) {
    // this.mainChart = this.chartsData;
    const brandSuccess = getStyle("--cui-success") ?? "#4dbd74";
    const brandInfo = getStyle("--cui-info") ?? "#20a8d8";
    const brandInfoBg = hexToRgba(getStyle("--cui-info"), 10) ?? "#20a8d8";
    const brandDanger = getStyle("--cui-danger") || "#f86c6b";

    // mainChart
    // mainChart
    // this.mainChart['elements'] = period === 'Month' ? 12 : 27;

    try {
    } catch (error) {
      console.log("Error in yearly sales api", error);
    }

    let labels: string[] = [];
    if (period === "Month") {
      this.label2 = "Year : " + this.year;
      labels = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      this.mainChart["Data1"] = [...data.salesArray.monthly];
      this.mainChart["Data2"] = [...data.receivingsArray.monthly];
      this.mainChart["Data3"] = [...data.expensesArray.monthly];
    } else if (period === "Year") {
      // this.mainChart['Data1'] = await this.getSalesByYear();
      this.label2 = "5 Years Sales";
      const yearArr = [];

      for (
        let i = new Date().getFullYear() - 4;
        i <= new Date().getFullYear();
        i++
      ) {
        yearArr.push(i.toString());
      }

      labels = [...yearArr];

      this.mainChart["Data1"] = [...data.salesArray.yearly].reverse();
      this.mainChart["Data2"] = [...data.receivingsArray.yearly].reverse();
      this.mainChart["Data3"] = [...data.expensesArray.yearly].reverse();
    } else {
      /* tslint:disable:max-line-length */
      const monthsInText = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      this.label2 = monthsInText[this.month - 1] + " " + this.year;
      const week = ["week1", "week2", "week3", "week4"];
      labels = week;

      this.mainChart["Data1"] = [...data.salesArray.weekly];
      this.mainChart["Data2"] = [...data.receivingsArray.weekly];
      this.mainChart["Data3"] = [...data.expensesArray.weekly];
    }

    const colors = [
      {
        // brandInfo
        backgroundColor: "#50BA70",
        borderColor: "#50BA70",
        pointHoverBackgroundColor: "#50BA70",
        borderWidth: 0,
      },
      {
        // brandSuccess
        backgroundColor: "#50ACD1",
        borderColor: "#50ACD1",
        pointHoverBackgroundColor: "#50ACD1",
        borderWidth: 0,
        padding:2,
      },
      {
        // brandDanger
        backgroundColor: "#EE4F3F",
        borderColor: "#EE4F3F",
        pointHoverBackgroundColor: "#EE4F3F",
        borderWidth: 0,
        marginBottom:"4rem",
      },
    ];

    const datasets = [
      {
        data: this.mainChart["Data1"],
        label: "Sales",
        ...colors[0],
      },
      {
        data: this.mainChart["Data2"],
        label: "Receiving",
        ...colors[1],
      },
      {
        data: this.mainChart["Data3"],
        label: "Expenses",
        ...colors[2],
      },
    ];

    const plugins = {
      legend: {
        display: true,
      },
      tooltip: {
        shared:true,
        callbacks: {
          labelColor: function (context: any) {
            return {
              backgroundColor: context.dataset.backgroundColor,
            };
          },
        },
      },
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins,

      // scales: {
      //   x: {
      //     grid: {
      //       drawOnChartArea: false
      //     }
      //   },
      //   y: {
      //     beginAtZero: true,
      //     max: 250,
      //     ticks: {
      //       maxTicksLimit: 5,
      //       stepSize: Math.ceil(250 / 10)
      //     }
      //   }
      // },
      elements: {
        line: {
          tension: 0.4,
        },
        point: {
          radius: 7,
          hitRadius: 10,
          hoverRadius: 9,
          hoverBorderWidth: 9,
        },
      },
    };

    this.mainChart.type = "bar";
    this.mainChart.options = options;
    this.mainChart.data = {
      datasets,
      labels,
    };
  }

  setTrafficPeriod(value: string): void {
    this.label = value + "ly Sales";
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.initCharts(value, this.chartData);
  }

  userInput() {
    $.confirm({
      title: "Enter:",
      content:
        "" +
        '<form action="" class="formName">' +
        '<div class="form-group">' +
        "<label>Enter Year</label>" +
        '<input type="number" min="2019" max="2022" placeholder="Select Year" class="name form-control" required value="2023"/>' +
        "<label>Enter Month</label>" +
        '<input type="month" placeholder="Select month" class="name form-control" required  min="2018-03"/>' +
        "</div>" +
        "</form>",
      buttons: {
        formSubmit: {
          text: "Submit",
          btnClass: "btn-blue",
          action: function () {},
        },
        cancel: function () {
          //close
        },
      },
    });
  }
}
