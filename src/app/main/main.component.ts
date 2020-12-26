import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BookService} from "src/app/book.service";
import {Book} from "src/app/book";
import {Constants} from "src/app/constants";
import {ModalHelperService} from "src/app/modal-helper.service";
import {Router} from "@angular/router";

@Component({
    templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {
    showInitializing = false;
    books: Book[] = [];
    filteredBooks: Book[] = [];
    filterCategory: string = null;
    filterLocation: string = null;
    filterBook: string = null;
    filterShelf: number = -1;
    filterInReadingList = false;
    randomFiltered = false;
    editing: {[bookId: number]: boolean} = {};
    locations = Constants.bookLocations;
    shelves = Constants.shelfs;
    positions = Constants.positions;
    bookTypes = Constants.bookTypes;
    editingBook: Book = null;
    showAddBook = false;
    newBook: Book = new Book(null, null, null, null, -1, null, "N/A", "N", "N");
    @ViewChild('titleInput') titleInput: ElementRef;
    filtering = false;
    serverCall = false;
    serverCallMessage: string = null;
    doingRandom = false;

    constructor(private bookService: BookService, private modalHelperService: ModalHelperService, private route: Router) {
    }

    ngOnInit(): void {
        this.showInitializing = true;
        this.bookService.getBooks().subscribe(
            books => {
                console.log('MainComponent.ngOnInit - bookService.getBooks().subscribe()...');
                this.books = books;
                this.books.forEach(book => {
                    this.filteredBooks.push(book);
                    this.editing[book.id] = false;
                });
                this.showInitializing = false;
            }
        );
    }

    private doFilter(showSpinner: boolean = true) {
        this.filtering = showSpinner;
        this.bookService.filterBookList(this.books, this.filterBook, this.filterCategory, this.filterLocation, this.filterShelf, this.filterInReadingList).subscribe(filteredBooks => {
            setTimeout(() => {
                this.filteredBooks = filteredBooks;
                this.filtering = false;
            }, 300);
        });
    }

    filterItems(event: any) {
        this.filterBook = event.target.value;
        this.doFilter();
    }

    onFilterCategory(evt: any) {
        this.filterCategory = evt.target.value;
        this.doFilter();
    }

    onFilterLocation(evt: any) {
        this.filterLocation = evt.target.value;
        this.doFilter();
    }

    onFilterShelf(evt: any) {
        this.filterShelf = parseInt(evt.target.value);
        this.doFilter();
    }

    onFilterInReadingList(evt: any) {
        this.filterInReadingList = evt.target.checked;
        this.doFilter();
    }

    onInReadingListChange(evt: any) {
        console.log("onInReadingListChange - event is:");
        console.log(evt.target.checked);
        this.editingBook.in_reading_list = evt.target.checked ? "Y" : "N";
    }

    onFinishedReading(evt: any) {
        console.log("onFinishedReading - event is:");
        console.log(evt.target.checked);
        this.editingBook.finished_reading = evt.target.checked ? "Y" : "N";
    }

    randomBook() {
        this.doingRandom = true;
        setTimeout(() => {
            let randomBook = this.filteredBooks[Math.floor(Math.random() * Math.floor(this.filteredBooks.length - 1))];
            if (randomBook) {
                this.filteredBooks = this.filteredBooks.filter(bk => bk.id === randomBook.id);
                this.randomFiltered = true;
            }
            this.doingRandom = false;
        }, 300);
    }

    revertRandomBook() {
        this.doingRandom = true;
        setTimeout(() => {
            this.books.forEach(book => this.filteredBooks.push(book));
            this.doFilter(false);
            this.randomFiltered = false;
            this.doingRandom = false;
        }, 300);
    }

    doSave(updatedBook: Book) {
        console.log("Updating book:");
        console.log(updatedBook);
        this.serverCall = true;
        this.serverCallMessage = "Updating book...";
        this.bookService.updateBook(updatedBook).subscribe(response => {
            if (response === "success") {
                // copy all the properties of the book from the DB with the updatedBook
                Object.assign(this.books.find(bk => bk.id === updatedBook.id), updatedBook);
                this.editing[updatedBook.id] = false;
                this.doFilter(false);
            } else {
                this.modalHelperService.alert({message: "Error with updating book: " + response, header: "Error!"}).result.then(() => {});
            }
            this.serverCall = false;
            this.serverCallMessage = null;
        },
            () => {
                this.modalHelperService.alert({message: "Error with updating book ...", header: "Error!"}).result.then(() => {});
                this.serverCall = false;
                this.serverCallMessage = null;
            });
    }

    doDelete(deletedBook: Book) {
        console.log("Deleting book:");
        console.log(deletedBook);
        this.modalHelperService.confirm({message: "Delete this book?"}).result.then(() => {
            this.serverCall = true;
            this.serverCallMessage = "Deleting book...";
            this.bookService.deleteBook(deletedBook.id).subscribe(response => {
                if (response === "success") {
                    this.books = this.books.filter(bk => bk.id !== deletedBook.id);
                    this.doFilter(false);
                } else {
                    this.modalHelperService.alert({message: "Error with deleting: " + response, header: "Error!"}).result.then(() => {});
                }
                this.serverCall = false;
                this.serverCallMessage = null;
            });
        },
            () => {
                // user answered no
                console.log("User chose not to save data...");
            });
    }

    revertBookChanges(book: Book) {
        this.editing[book.id] = false;
    }

    editBook(book: Book) {
        // create a "deep copy" of the book so that any changes made are not applied until save is pressed
        this.editingBook = JSON.parse(JSON.stringify(book));
        this.editing[book.id] = true;
    }

    showNewBookForm() {
        this.newBook = new Book(null, null, null, null, -1, null, "REGULAR", "N", "N");
        this.showAddBook = true;
        setTimeout(() => {
            this.titleInput.nativeElement.focus();
        }, 100);
    }

    addBook() {
        this.serverCall = true;
        this.serverCallMessage = "Saving new book...";
        this.bookService.addBook(this.newBook).subscribe(response => {
            if (response === "success") {
                this.showAddBook = false;
                this.books.push(this.newBook);
                this.doFilter(false);
            } else {
                this.modalHelperService.alert({message: "Error adding book: " + response, header: "Error!"}).result.then(() => {});
            }
            this.serverCall = false;
            this.serverCallMessage = null;
        },
            () => {
                this.modalHelperService.alert({message: "Error with adding book ...", header: "Error!"}).result.then(() => {});
                this.serverCall = false;
                this.serverCallMessage = null;
            });
    }

    hideNewBookForm() {
        this.showAddBook = false;
    }

    addToReadingList(book: Book) {
        this.serverCall = true;
        this.serverCallMessage = "Adding book to reading list...";
        this.bookService.addToReadingList(book.id).subscribe(response => {
            if (response !== "success") {
                this.modalHelperService.alert({message: "Error adding book to reading list: " + response, header: "Error!"}).result.then(() => {});
            } else {
                this.books.forEach(bk => {
                    if (book.id === bk.id) {
                        bk.in_reading_list = "Y";
                    }
                });
                this.doFilter(false);
            }
            this.serverCall = false;
            this.serverCallMessage = null;
        },
            () => {
                this.modalHelperService.alert({message: "Error adding book to reading list ...", header: "Error!"}).result.then(() => {});
                this.serverCall = false;
                this.serverCallMessage = null;
            });
    }

    clearFilter() {
        this.filterBook = "";
        this.doFilter();
    }
}
