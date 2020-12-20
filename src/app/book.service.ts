import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from './book';
import {Observable, of, Subject} from 'rxjs';
import {ReadingData} from "src/app/reading-data";

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
    console.log('BookService.getBooks - calling ' + this._url + 'get_reading_data.php...');
    return of([<ReadingData>{
      bookId: 2,
      lastReadPage: 20,
      pagesRead: 2,
      readStartDate: '12/20/2020 7:00',
      readEndDate: '12/20/2020 7:20'
    }]);
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
}
