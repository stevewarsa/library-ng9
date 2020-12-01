import { Component, OnInit } from '@angular/core';

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

  constructor() { }

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
