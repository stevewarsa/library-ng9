import { Component, OnInit } from '@angular/core';
import {BookService} from "src/app/book.service";
import {Book} from "src/app/book";

@Component({
  selector: 'lb-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  showInitializing = false;
  books:Book[] = [];

  constructor(private bookService:BookService) { }

  ngOnInit(): void {
    this.showInitializing = true;
    this.bookService.getBooks().subscribe(
        books => {
          console.log('MainComponent.ngOnInit - bookService.getBooks().subscribe()...');
          this.books = books;
          this.showInitializing = false;
        }
    );
  }

}
