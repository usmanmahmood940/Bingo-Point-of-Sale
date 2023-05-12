import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { catchError, filter, map, switchMap, tap, mergeMap, toArray } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ApiService } from '../services/navigation/api.service';
import { UrlMappings } from '../services/navigation/url.mappings';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  userClinics: any = [];

  public dataME = [];
  public exportdata = [];
  isPrev = true;
  isNext = true;

  selectOption: any;

  site = 1;
  pageNum = 0;
  MaxPage = 0;
  pageOf = 1;
  expMaxPage = 1;
  isLoading = false;
  errorMsg;
  startDate = '2022/11/02';
  endDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
  // startDate;
  // endDate;
  constructor(private http: HttpClient, private apiService: ApiService,private router: Router) {
    try {
      // this.site = parseInt(localStorage.getItem('siteId'));

    } catch { }
  }

  ngOnInit(): void {
    // if (!localStorage.getItem('isAuthtokenValid') ) {
    //   console.log('going to login......');
    //    this.router.navigate(['/login']);
    // }
    this.errorMsg = '';
    console.log(localStorage.getItem('authtoken'), localStorage.getItem('isAuthentication'))
    
    this.startDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');//'2022-11-02';
    this.endDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  }
  onStartDateChange(event) {
    console.log(event.value);
    if (event.value != '')
      this.startDate = event.value;
    else
      this.startDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    
  }
  onEndDateChange(event) {
    if (event.value != '')
      this.endDate = event.value;
    else
      this.endDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  }


  generateReport(){
    this.pageNum = 0;
    this.pageOf = 1;
    this.MaxPage = 0;
    this.dataME = [];
    this.errorMsg = '';
    try{
      if (formatDate(this.startDate, 'yyyy/MM/dd', 'en') > formatDate(this.endDate, 'yyyy/MM/dd', 'en')) {
        this.errorMsg = "Unable to retrieve processed applications data. Reason: Start day should be less or equal to the End day";
        this.isLoading = false;
        return;
      } else if (formatDate(this.startDate, 'yyyy/MM/dd', 'en') > formatDate(new Date, 'yyyy/MM/dd', 'en') || formatDate(this.endDate, 'yyyy/MM/dd', 'en') > formatDate(new Date, 'yyyy/MM/dd', 'en')) {
        this.errorMsg = "Unable to retrieve processed applications data. Reason: Start day and End day cannot be grater than the current day.";
        this.isLoading = false;
        return;
      }
    }catch{

    }
    this.LoadData();
  }

  LoadData() {
    this.errorMsg = '';
    this.dataME = [];
    try {
      this.isLoading = true;
      
      


      let body = { "fromDate": this.startDate, "toDate": this.endDate, "siteId": this.site, "pageNumber": this.pageNum, "pageSize": 100 };

     
      let token = localStorage.getItem('authtoken');

      let headers1 = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      });
      const headers = { 'Content-Type': 'application/json', 'Authorization': token };
      

      console.log("Authorization", token);


      var self = this;
      

   

    } catch {
      this.isLoading = false;
    }
  }

  previous() {
    console.log('previous');
    if (this.pageNum > 0) {
      this.pageNum = this.pageNum - 1;
      this.pageOf = this.pageOf - 1;
      if (this.pageNum == 0)
        this.isPrev = true;
      else
        this.isPrev = false;

      // this.isNext = false;
      this.LoadData();

    }

  }
  next() {
    if (this.pageNum < this.MaxPage) {
      this.pageNum = this.pageNum + 1;
      this.pageOf = this.pageOf + 1;

      this.isPrev = false;


      this.LoadData();
    }
    else

      console.log('previous');
  }

  exportCsv() {
    this.isLoading = true;
    this.exportdata = [];
    this.loadexportdata(0);
  }

  loadexportdata(currentPage) {

    if (currentPage == this.expMaxPage) {
      // this.isLoading = false;
      this.apiService.exportToCsv('Product_Reports' + formatDate(new Date, 'dd/MM/yyyy', 'en'), this.exportdata)
      this.isLoading = false;
      return;
    }
    // this.errorMsg = '';
    // try {
    this.isLoading = true;
    if (formatDate(this.startDate, 'yyyy/MM/dd', 'en') > formatDate(this.endDate, 'yyyy/MM/dd', 'en')) {
      this.errorMsg = "Unable to retrieve processed applications data. Reason: Start day should be less or equal to the End day.";
      this.isLoading = false;
      return;
    } else if (formatDate(this.startDate, 'yyyy/MM/dd', 'en') > formatDate(new Date, 'yyyy/MM/dd', 'en') || formatDate(this.endDate, 'yyyy/MM/dd', 'en') > formatDate(new Date, 'yyyy/MM/dd', 'en')) {
      this.errorMsg = "Unable to retrieve processed applications data. Reason: Start day and End day cannot be grater than the current day.";
      this.isLoading = false;
      return;
    }
    

    let body = { "fromDate": this.startDate, "toDate": this.endDate, "siteId": this.site, "pageNumber": currentPage, "pageSize": 100 };



  }
  logout = () => {
    localStorage.clear();
    this.router.navigate(['/login']);
  };

  selectedOption() {
    this.site = this.selectOption;
    console.log(this.selectOption);
  }
}
