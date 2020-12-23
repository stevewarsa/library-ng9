import { Component, OnInit } from '@angular/core';
import {Book} from "src/app/book";
import {BookService} from "src/app/book.service";
import { forkJoin } from 'rxjs';
import {ReadingData} from "src/app/reading-data";

@Component({
  templateUrl: './reading-list.component.html'
})
export class ReadingListComponent implements OnInit {
  showInitializing = false;
  readingList: Book[] = [];
  readingDataByBookId: {[bookId: number]: ReadingData[]} = {};

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.showInitializing = true;
    let bookObs = this.bookService.getReadingList()
    let readingDataObs = this.bookService.getReadingData();
    forkJoin([bookObs, readingDataObs]).subscribe((response: any[]) => {
        console.log('ReadingListComponent.ngOnInit - bookService.getBooks().subscribe()...');
        this.readingList = response[0];
        let readingData: ReadingData[] = response[1];
        readingData.forEach(rd => {
            let rdForBook: ReadingData[] = this.readingDataByBookId[rd.bookId];
            if (!rdForBook) {
                rdForBook = [];
                this.readingDataByBookId[rd.bookId] = rdForBook;
            }
            rdForBook.push(rd);
        });
        this.showInitializing = false;
    });
  }
}
