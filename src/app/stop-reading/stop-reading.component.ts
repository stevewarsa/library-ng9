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
  audioMode = false;
  pagesRead: number = null;
  endPage: number = null;
  percentageComplete: number = null;
  sessionStartDateTime: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.kindleMode = this.book.type_of_book === 'KINDLE';
    this.audioMode = ['AUDIBLE', 'CHRSTNAUDIO', 'MP3'].includes(this.book.type_of_book);
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
