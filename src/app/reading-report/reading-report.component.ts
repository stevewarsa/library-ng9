import { Component, OnInit } from '@angular/core';
import {ReadingData} from "src/app/reading-data";
import {BookService} from "src/app/book.service";
import {forkJoin} from "rxjs";
import {Book} from "src/app/book";

@Component({
  templateUrl: './reading-report.component.html'
})
export class ReadingReportComponent implements OnInit {
  expanded: {[key: string]: boolean} = {};
  readingReportByDate: {[dateAsString: string]: ReadingData[]} = {};
  readingReportByBook: {[bookId: number]: ReadingData[]} = {};
  mode: string = "byDate";
  busy: boolean = false;
  busyMessage: string = null;
  obj = Object;
  countByDate: { [dateAsString: string]: number } = {};
  booksById: {[bookId: number]: string} = {};
  booksObjById: {[bookId: number]: Book} = {};
  countByBookId: { [bookId: string]: number } = {};

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.busy = true;
    this.busyMessage = "Initializing data...";
    let readingDataObs = this.bookService.getReadingData();
    let booksObs = this.bookService.getBooks();
    forkJoin([booksObs, readingDataObs]).subscribe(
        response => {
          console.log('MainComponent.ngOnInit - bookService.getBooks().subscribe()...');
          response[0].forEach((book: Book) => {
            this.booksById[book.id] = book.title;
            this.booksObjById[book.id] = book;
          });
          response[1].forEach(readingData => {
            if (this.readingReportByBook.hasOwnProperty(readingData.bookId)) {
              this.readingReportByBook[readingData.bookId].push(readingData);
            } else {
              this.readingReportByBook[readingData.bookId] = [readingData];
            }
            let readDate = readingData.readStartDate.split(" ")[0];
            if (this.readingReportByDate.hasOwnProperty(readDate)) {
              this.readingReportByDate[readDate].push(readingData);
            } else {
              this.readingReportByDate[readDate] = [readingData];
            }
            this.expanded["" + readingData.bookId] = true;
            this.expanded[readDate] = true;
          });
          let bookIds: number[] = Object.keys(this.readingReportByBook).map(Number);
          for (let bookId of bookIds) {
            if (this.readingReportByBook.hasOwnProperty(bookId)) {
              this.countByBookId[bookId] = this.readingReportByBook[bookId].length;
            } else {
              this.countByBookId[bookId] = 0;
            }
          }
          let dates: string[] = Object.keys(this.readingReportByDate);
          for (let dt of dates) {
            if (this.countByDate.hasOwnProperty(dt) || this.readingReportByDate[dt]) {
              this.countByDate[dt] = this.readingReportByDate[dt].length;
            } else {
              this.countByDate[dt] = 0;
            }
          }
          this.busy = false;
          this.busyMessage = null;
        }
    );
  }

  expandAll() {
    let keys: string[] = Object.keys(this.expanded);
    for (let key of keys) {
      this.expanded[key] = true;
    }
  }

  collapseAll() {
    let keys: string[] = Object.keys(this.expanded);
    for (let key of keys) {
      this.expanded[key] = false;
    }
  }

  toggle(category: string) {
    this.expanded[category] = true;
  }

  sortByDateDesc(records: ReadingData[]): ReadingData[] {
    return this.bookService.sortArrayByDate(records, "readEndDate", true);
  }

  sortByBookName(records: ReadingData[]) {
    return records.sort(((a, b) => {
      return this.booksById[a.bookId].localeCompare(this.booksById[b.bookId]);
    }));
  }

  sortByDatesOnly(dates: string[]) {
    return this.bookService.sortArrayByDate(dates, null, true, "M/D/YYYY");
  }
}
