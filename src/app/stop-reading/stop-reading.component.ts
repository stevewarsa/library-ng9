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
  historyForBook: ReadingData[] = [];
  lastPageRead: number = null;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.kindleMode = this.book.type_of_book === 'KINDLE';
    this.audioMode = ['AUDIBLE', 'CHRSTNAUDIO', 'MP3'].includes(this.book.type_of_book);
    if (!this.kindleMode && !this.audioMode && this.historyForBook && this.historyForBook.length) {
      // should be a regular book, so try to set the last page read
      if (this.historyForBook.length === 1) {
        if (this.historyForBook[0].lastReadPage && this.historyForBook[0].lastReadPage > 0) {
          this.lastPageRead = this.historyForBook[0].lastReadPage;
        }
      } else {
        this.lastPageRead = this.historyForBook
            .filter(hist => hist.lastReadPage && hist.lastReadPage > 0)
            .sort((a, b) => b.lastReadPage - a.lastReadPage)[0].lastReadPage;
      }
    }
  }

  doStop() {
    this.activeModal.close(<ReadingData>{
      percentageRead: this.percentageComplete,
      lastReadPage: this.endPage,
      pagesRead: this.pagesRead,
      readStartDate: this.sessionStartDateTime
    });
  }

  updatePagesRead(evt: any) {
    if (this.lastPageRead && this.lastPageRead > 0) {
      let currentLastPageRead = parseInt(evt.target.value);
      this.pagesRead = currentLastPageRead - this.lastPageRead;
    }
  }
}
