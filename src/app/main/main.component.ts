import {Component, OnInit} from '@angular/core';
import {BookService} from "src/app/book.service";
import {Book} from "src/app/book";

@Component({
    templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {
    showInitializing = false;
    books: Book[] = [];
    filteredBooks: Book[] = [];
    categories: string[] = ['REGULAR', 'KINDLE'];
    locations: string[] = ['N/A', 'Main', 'Bathroom', 'Extra Rm', 'Brians BR'];
    filterCategory: string = null;
    filterLocation: string = null;
    filterBook: string = null;
    randomFiltered = false;

    constructor(private bookService: BookService) {
    }

    ngOnInit(): void {
        this.showInitializing = true;
        this.bookService.getBooks().subscribe(
            books => {
                console.log('MainComponent.ngOnInit - bookService.getBooks().subscribe()...');
                this.books = books;
                this.books.forEach(book => this.filteredBooks.push(book));
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
        } else {
            this.filteredBooks = this.filteredBooks.filter(book => book.type_of_book === 'REGULAR' || book.type_of_book === 'KINDLE');
        }
        if (this.filterLocation !== null && this.filterLocation !== "NOSELECTION") {
            this.filteredBooks = this.filteredBooks.filter(book => book.bookLocation === this.filterLocation);
        } else {
            this.filteredBooks = this.filteredBooks.filter(book => {
                for (let location of this.locations) {
                    if (book.bookLocation === location) {
                        return true;
                    }
                }
                return false;
            });
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
}
