import { Component, OnInit } from '@angular/core';
import {NavigationStart, Router} from "@angular/router";

@Component({
  selector: 'lb-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css']
})
export class TopnavComponent implements OnInit {
  mobile: boolean = false;
  expanded = false;
  isCollapsed = true;
  currentRoute: string = null;

  constructor(private route: Router) {
    route.events.subscribe(val => {
      if (val instanceof NavigationStart) {
        console.log(val.url);
        this.currentRoute = val.url;
      }
    });
  }

  ngOnInit(): void {
    if (window.screen.width < 500) { // 768px portrait
      this.mobile = true;
    }
  }

  toggleExpanded(): boolean {
    this.isCollapsed = !this.isCollapsed;
    return false;
  }
}
