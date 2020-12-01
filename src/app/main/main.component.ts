import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lb-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  showInitializing = false;

  constructor() { }

  ngOnInit(): void {
  }

}
