import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup-modal',
  templateUrl: './popup-modal.component.html',
  styleUrls: ['./popup-modal.component.scss']
})
export class PopupModalComponent implements OnInit {
@Input() showErrorModal:any
  constructor() { }

  ngOnInit(): void {
    console.log("showErrorModal:::",this.showErrorModal)
  }

}
