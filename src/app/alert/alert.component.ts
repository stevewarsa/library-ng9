import {Component, Input, OnInit} from '@angular/core';
import {StringUtils} from "src/app/string.utils";

@Component({
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit {
  @Input() header: string;
  @Input() message: string;

  constructor() {}

  ngOnInit() {
    if (!StringUtils.isEmpty(this.message)) {
      this.message = this.message.replace(/\r\n/g, "<br>").replace(/\n/g, "<br>");
    }
  }
}
