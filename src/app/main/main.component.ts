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

    private doFilter() {
        this.filteredBooks = [];
        this.books.forEach(book => this.filteredBooks.push(book));
        if (this.filterBook !== null && this.filterBook.trim() !== "") {
            this.filteredBooks = this.books.filter(book => {
                for (let field of ["subtitle", "title", "author"]) {
                    if (book[field] && book[field].toUpperCase().includes(this.filterBook.toUpperCase())) {
                        return true;
                    }
                }
                return false;
            });
        }

        if (this.filterCategory !== null && this.filterCategory !== "NOSELECTION") {
            this.filteredBooks = this.filteredBooks.filter(book => book.type_of_book === this.filterCategory);
        }
        if (this.filterLocation !== null && this.filterLocation !== "NOSELECTION") {
            this.filteredBooks = this.filteredBooks.filter(book => book.bookLocation === this.filterLocation);
        }
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

    randomBook() {
        let randomBook = this.filteredBooks[Math.floor(Math.random() * Math.floor(this.filteredBooks.length - 1))];
        if (randomBook) {
            this.filteredBooks = this.filteredBooks.filter(bk => bk.id === randomBook.id);
            this.randomFiltered = true;
        }
    }

    revertRandomBook() {
        this.books.forEach(book => this.filteredBooks.push(book));
        this.doFilter();
        this.randomFiltered = false;
    }

    doSave(updatedBook: Book) {
        console.log("Updating book:");
        console.log(updatedBook);
        this.bookService.updateBook(updatedBook).subscribe(response => {
            if (response === "success") {
                // copy all the properties of the book from the DB with the updatedBook
                Object.assign(this.books.find(bk => bk.id === updatedBook.id), updatedBook);
                this.editing[updatedBook.id] = false;
                this.doFilter();
            } else {
                this.modalHelperService.alert({message: "Error with updating book: " + response, header: "Error!"}).result.then(() => {});
            }
        },
            () => {
                this.modalHelperService.alert({message: "Error with updating book ...", header: "Error!"}).result.then(() => {});
            });
    }

    doDelete(deletedBook: Book) {
        console.log("Deleting book:");
        console.log(deletedBook);
        this.modalHelperService.confirm({message: "Delete this book?"}).result.then(() => {
            this.bookService.deleteBook(deletedBook.id).subscribe(response => {
                if (response === "success") {
                    this.books = this.books.filter(bk => bk.id !== deletedBook.id);
                    this.doFilter();
                } else {
                    this.modalHelperService.alert({message: "Error with deleting: " + response, header: "Error!"}).result.then(() => {});
                }
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
        this.bookService.addBook(this.newBook).subscribe(response => {
            if (response === "success") {
                this.showAddBook = false;
                this.books.push(this.newBook);
                this.doFilter();
            } else {
                this.modalHelperService.alert({message: "Error adding book: " + response, header: "Error!"}).result.then(() => {});
            }
        },
            () => {
                this.modalHelperService.alert({message: "Error with adding book ...", header: "Error!"}).result.then(() => {});
            });
    }

    hideNewBookForm() {
        this.showAddBook = false;
    }

    addToReadingList(book: Book) {
        this.bookService.addToReadingList(book.id).subscribe(response => {
            if (response === "success") {
                this.route.navigate(['readingList']);
            } else {
                this.modalHelperService.alert({message: "Error adding book to reading list: " + response, header: "Error!"}).result.then(() => {});
            }
        },
            () => {
                this.modalHelperService.alert({message: "Error adding book to reading list ...", header: "Error!"}).result.then(() => {});
            });
    }
}
