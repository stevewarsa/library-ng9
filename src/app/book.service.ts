import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from './book';
import {Observable, of, Subject} from 'rxjs';
import {ReadingData} from "src/app/reading-data";
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private _url:string = "http://ps11911.com/library/php/";
  // Observable string sources
  private bookAnnouncedSource = new Subject<Book>();
  bookAnnounced$:Observable<Book> = this.bookAnnouncedSource.asObservable();

  constructor(private httpService: HttpClient) {
  }

  getCurrentDateTime() {
    return moment().format("M/D/YYYY HH:mm:ss");
  }

  addBook(book:Book):Observable<any> {
    console.log('BookService.addBook - calling server to add new book...');
    return this.httpService.post(this._url + 'add_book.php', book);
  }
  
  updateBook(book:Book):Observable<any> {
    console.log('BookService.updateBook - calling server to update book...');
    return this.httpService.post(this._url + 'update_book.php', book);
  }
  
  deleteBook(bookId:number):Observable<any> {
    console.log('BookService.deleteBook - calling server to delete book...');
    return this.httpService.post(this._url + 'delete_book.php', {bookId: bookId});
  }

  announceNewBook(book:Book) {
    console.log('BookService.announceNewBook - announcing new book...');
    this.bookAnnouncedSource.next(book);
  }

  getBooks():Observable<any> {
    console.log('BookService.getBooks - calling ' + this._url + 'get_books.php...');
    return this.httpService.get(this._url + 'get_books.php');
  }

  getReadingData(): Observable<ReadingData[]> {
    console.log('BookService.getReadingData - calling ' + this._url + 'get_reading_data.php...');
    return of([<ReadingData>{
      bookId: 2,
      lastReadPage: 20,
      pagesRead: 2,
      readStartDate: '12/20/2020 7:00',
      readEndDate: '12/20/2020 7:20'
    }]);
  }

  filterBookList(books: Book[], textFilter: string, bookTypeFilter: string, bookLocationFilter: string, filterShelf: number, filterInReadingList: boolean): Observable<Book[]> {
    return of(books.filter(book => {
      let matches = false;
      if (textFilter !== null && textFilter.trim() !== "") {
        // there is a text filter, so match on that
        for (let field of ["subtitle", "title", "author"]) {
          if (book[field] && book[field].toUpperCase().includes(textFilter.toUpperCase())) {
            matches = true;
            break;
          }
        }
      } else {
        // there is no text filter, so everything is considered matching
        matches = true;
      }
      if (matches) {
        if (filterInReadingList === true) {
          matches = book.in_reading_list === 'Y';
        }
      }
      // run the next set of filters
      if (matches && bookTypeFilter !== null && bookTypeFilter.trim() !== "" && bookTypeFilter !== "NOSELECTION") {
        // there is a book type filter, so check the type of this book
        matches = book.type_of_book !== bookTypeFilter;
      }
      if (matches && bookLocationFilter !== null && bookLocationFilter.trim() !== "" && bookLocationFilter !== "NOSELECTION") {
        // there is a book location filter, so check the location of this book
        matches = book.bookLocation === bookLocationFilter;
      }
      if (matches && filterShelf !== null && filterShelf !== -1) {
        // there is a book shelf filter, so check the shelf of this book
        matches = book.shelf === filterShelf;
      }
      return matches;
    }));
  }

  getReadingList(): Observable<Book[]> {
    console.log('BookService.getReadingList - calling ' + this._url + 'get_reading_list.php...');
    return this.httpService.get<Book[]>(this._url + 'get_reading_list.php');
  }

  getRandomBook(bookType: string):Observable<Book> {
    console.log('BookService.getRandomBook - calling ' + this._url + 'get_random_book.php...');
    return this.httpService.post<Book>(this._url + 'get_random_book.php', bookType);
  }

  searchBooks(searchText:string):Observable<any> {
    console.log('BookService.getBooks - calling ' + this._url + 'get_books.php...');
    return this.httpService.get(this._url + 'search_books.php?searchText=' + searchText);
  }

  getAuthors():Observable<any> {
    console.log('BookService.getAuthors - calling ' + this._url + 'get_authors.php...');
    return this.httpService.get(this._url + 'get_authors.php');
  }

  addToReadingList(bookId: number):Observable<any> {
    console.log('BookService.addToReadingList - calling ' + this._url + 'add_to_reading_list.php...');
    return this.httpService.get(this._url + 'add_to_reading_list.php?bookId=' + bookId);
  }

  startReadingSession(readingData: ReadingData):Observable<any> {
    console.log('BookService.startReadingSession - calling ' + this._url + 'start_reading_session.php...');
    return this.httpService.post<any>(this._url + 'start_reading_session.php', readingData);
  }

  endReadingSession(readingData: ReadingData):Observable<any> {
    console.log('BookService.endReadingSession - calling ' + this._url + 'end_reading_session.php...');
    return this.httpService.post<any>(this._url + 'end_reading_session.php', readingData);
  }
}
