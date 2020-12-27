import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Book} from "src/app/book";
import {ReadingData} from "src/app/reading-data";

@Component({
  templateUrl: './stop-reading.component.html'
})
export class StopReadingComponent implements OnInit {
  book: Book;
  kindleMode = false;
  pagesRead: number = null;
  endPage: number = null;
  percentageComplete: number = null;
  sessionStartDateTime: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.kindleMode = this.book.type_of_book === 'KINDLE';
  }

  doStop() {
    this.activeModal.close(<ReadingData>{
      percentageRead: this.percentageComplete,
      lastReadPage: this.endPage,
      pagesRead: this.pagesRead,
      readStartDate: this.sessionStartDateTime
    });
  }
}
