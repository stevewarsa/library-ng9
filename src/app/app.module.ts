import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopnavComponent } from './topnav/topnav.component';
import { MainComponent } from './main/main.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { AlertComponent } from './alert/alert.component';
import { StopReadingComponent } from './stop-reading/stop-reading.component';
import { ReadingReportComponent } from './reading-report/reading-report.component';

@NgModule({
  declarations: [
    AppComponent,
    TopnavComponent,
    MainComponent,
    ConfirmComponent,
    AlertComponent,
    StopReadingComponent,
    ReadingReportComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
