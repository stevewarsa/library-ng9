import { Component } from '@angular/core';

@Component({
  selector: 'lb-root',
  template: `
    <!--<lb-topnav></lb-topnav>-->
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
}
