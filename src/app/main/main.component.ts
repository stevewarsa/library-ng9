import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BookService} from "src/app/book.service";
import {Book} from "src/app/book";
import {Constants} from "src/app/constants";
import {ModalHelperService} from "src/app/modal-helper.service";
import {ReadingData} from "src/app/reading-data";
import {forkJoin} from "rxjs";
import * as moment from 'moment';
import {StringUtils} from "src/app/string.utils";

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
    filterInReadingList = true;
    filterLiveReadingSession = false;
    randomFiltered = false;
    editing: {[bookId: number]: boolean} = {};
    locations = Constants.bookLocations;
    shelves = Constants.shelfs;
    positions = Constants.positions;
    bookTypes = Constants.bookTypes;
    bookTypeLabelsByBookType: {[code: string]: string} = {};
    editingBook: Book = null;
    showAddBook = false;
    newBook: Book = new Book(null, null, null, null, -1, null, "N/A", "N", "N");
    @ViewChild('titleInput') titleInput: ElementRef;
    filtering = false;
    serverCall = false;
    serverCallMessage: string = null;
    doingRandom = false;
    readingBookNow: {[bookId: number]: boolean} = {};
    bookHistoryExpanded: {[bookId: number]: boolean} = {};
    historyRecords: {[bookId: number]: ReadingData[]} = {};

    constructor(private bookService: BookService, private modalHelperService: ModalHelperService) {
    }

    ngOnInit(): void {
        this.showInitializing = true;
        this.bookTypes.forEach(bt => this.bookTypeLabelsByBookType[bt.value] = bt.label);
        let readingDataObs = this.bookService.getReadingData();
        let booksObs = this.bookService.getBooks();
        forkJoin([booksObs, readingDataObs]).subscribe(
            response => {
                console.log('MainComponent.ngOnInit - bookService.getBooks().subscribe()...');
                this.books = response[0];
                this.books.forEach(book => {
                    if ((book.in_reading_list === 'Y') === this.filterInReadingList) {
                        this.filteredBooks.push(book);
                    }
                    this.editing[book.id] = false;
                    this.readingBookNow[book.id] = false;
                    this.bookHistoryExpanded[book.id] = false;
                });
                response[1].forEach(histRec => {
                    if (this.historyRecords.hasOwnProperty(histRec.bookId)) {
                        this.historyRecords[histRec.bookId].push(histRec);
                    } else {
                        this.historyRecords[histRec.bookId] = [histRec];
                    }
                    if (!histRec.readEndDate) {
                        // this means that there is a history record for which no end date/time is set
                        // so it is still in progress - so set the flag for this book
                        this.readingBookNow[histRec.bookId] = true;
                        this.books.find(bk => bk.id === histRec.bookId).currentlyReading = true;
                    }
                });
                this.showInitializing = false;
            }
        );
    }

    private doFilter(showSpinner: boolean = true) {
        this.filtering = showSpinner;
        this.bookService.filterBookList(this.books, this.filterBook, this.filterCategory, this.filterLocation, this.filterShelf, this.filterInReadingList, this.filterLiveReadingSession).subscribe(filteredBooks => {
            setTimeout(() => {
                this.filteredBooks = filteredBooks;
                this.filtering = false;
            }, 300);
        });
    }

    filterItems(event: any) {
        if (event.target.value.trim().length > 2 || event.target.value.trim().length === 0) {
            this.filterBook = event.target.value.trim();
            this.doFilter();
        }
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

    onFilterInLiveReadingSession(evt: any) {
        this.filterLiveReadingSession = evt.target.checked;
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
                    } else {
                        this.modalHelperService.alert({message: "Error with deleting: " + response, header: "Error!"}).result.then(() => {});
                    }
                });
            },
            () => {console.log("User chose not to delete book...")});
    }

    doDeleteHistoryEntry(readingData: ReadingData) {
        console.log("Deleting reading session:");
        console.log(readingData);
        this.modalHelperService.confirm({message: "Delete this reading session?"}).result.then(() => {
            this.serverCall = true;
            this.serverCallMessage = "Deleting reading session...";
            this.bookService.deleteReadingSession(readingData).subscribe(response => {
                if (response === "success") {
                    this.historyRecords[readingData.bookId] = this.historyRecords[readingData.bookId].filter(rs => rs.readStartDate !== readingData.readStartDate);
                } else {
                    this.modalHelperService.alert({message: "Error with deleting: " + response, header: "Error!"}).result.then(() => {});
                }
                this.serverCall = false;
                this.serverCallMessage = null;
            });
        },
            () => {
                // user answered no
                console.log("User chose not to delete history entry...");
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
        if (StringUtils.isEmpty(this.filterCategory)) {
            this.newBook = new Book(null, null, null, null, -1, null, "REGULAR", "N", "N");
        } else {
            this.newBook = new Book(null, null, null, null, -1, null, this.filterCategory, "N", "N");
        }
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
        this.filterBook = null;
        this.doFilter();
    }

    startReading(book: Book) {
        let sessionType = ['AUDIBLE', 'CHRSTNAUDIO', 'MP3'].includes(book.type_of_book) ? "listening" : "reading";
        this.modalHelperService.confirm({message: "Start " + sessionType + " session for this book?"}).result.then(() => {
            console.log("User chose to start " + sessionType + " this book at " + new Date());
            this.serverCall = true;
            this.serverCallMessage = "Starting " + sessionType + " session...";
            let param: ReadingData = <ReadingData>{
                bookId: book.id,
                readStartDate: this.bookService.getCurrentDateTime(),
                pagesRead: null,
                lastReadPage: null,
                readEndDate: null,
                percentageRead: null
            };
            this.bookService.startReadingSession(param).subscribe(response => {
                if (response === "success") {
                    // since the response was success, set the flag indicating that this book is being read
                    this.readingBookNow[book.id] = true;
                    // now push this record onto the history records related to this book id
                    if (this.historyRecords.hasOwnProperty(book.id)) {
                        this.historyRecords[book.id].push(param);
                    } else {
                        this.historyRecords[book.id] = [param];
                    }
                    book.currentlyReading = true;
                    // on the server call it sets in reading list to Y, so set it here on the client side
                    book.in_reading_list = "Y";
                    this.filterLiveReadingSession = true;
                    this.doFilter();

                } else {
                    this.modalHelperService.alert({message: "Error starting " + sessionType + " session: " + response, header: "Error!"}).result.then(() => {});
                }
                this.serverCall = false;
                this.serverCallMessage = null;
            },
                () => {
                    this.modalHelperService.alert({message: "Error starting " + sessionType + " session...", header: "Error!"}).result.then(() => {});
                    this.serverCall = false;
                    this.serverCallMessage = null;
                });
        }, () => console.log("User chose not to start " + sessionType + "..."));
    }

    stopReading(book: Book) {
        // I should be able to find a record in history records for this reading session where start date/time is
        // populated and end date/time is not populated.  I need to get the start date/time from this history record
        // so that I can close out the correct record on the server side.
        let sessionType = ['AUDIBLE', 'CHRSTNAUDIO', 'MP3'].includes(book.type_of_book) ? "listening" : "reading";
        let histRecordToBeStopped: ReadingData = this.historyRecords[book.id].find(histRec => histRec.readStartDate && !histRec.readEndDate);
        let sessionStartDateTime: string = histRecordToBeStopped.readStartDate;
        this.modalHelperService.openStopReading(book, sessionStartDateTime, this.historyRecords[book.id]).result.then((readingData: ReadingData) => {
                console.log("User chose to end " + sessionType + " this book at " + new Date());
                this.serverCall = true;
                this.serverCallMessage = "Stopping " + sessionType + " session...";
                let param: ReadingData = <ReadingData>{
                    bookId: book.id,
                    pagesRead: readingData.pagesRead,
                    lastReadPage: readingData.lastReadPage,
                    readStartDate: readingData.readStartDate,
                    readEndDate: this.bookService.getCurrentDateTime(),
                    percentageRead: readingData.percentageRead
                };
                this.bookService.endReadingSession(param).subscribe(response => {
                    if (response === "success") {
                        this.readingBookNow[book.id] = false;
                        histRecordToBeStopped.readEndDate = param.readEndDate;
                        histRecordToBeStopped.pagesRead = param.pagesRead;
                        histRecordToBeStopped.lastReadPage = param.lastReadPage;
                        histRecordToBeStopped.percentageRead = param.percentageRead;
                        book.currentlyReading = false;
                    } else {
                        this.modalHelperService.alert({message: "Error ending " + sessionType + " session: " + response, header: "Error!"}).result.then(() => {});
                    }
                    this.serverCall = false;
                    this.serverCallMessage = null;
                },
                    () => {
                        this.modalHelperService.alert({message: "Error ending " + sessionType + " session...", header: "Error!"}).result.then(() => {});
                        this.serverCall = false;
                        this.serverCallMessage = null;
                    });
            },
            () => console.log("User chose not to end " + sessionType + " session..."));
    }

    sortRecsForBook(historyRecords: ReadingData[]) {
        if (!historyRecords || historyRecords.length < 2) {
            return historyRecords;
        } else {
            return this.bookService.sortArrayByDate(historyRecords, "readStartDate", true);
        }
    }

    getDateOnlyString(dateTimeString: string): string {
        const dt = moment(dateTimeString, 'M/D/YYYY HH:mm:ss');
        const current = moment();
        if (dt.year() == current.year()) {
            return dt.format("M/D");
        } else {
            return dt.format("M/D/YY");
        }
    }

    getTimeRange(histRecord: ReadingData): string {
        let startDateTime = moment(histRecord.readStartDate, "M/D/YYYY HH:mm:ss");
        if (StringUtils.isEmpty(histRecord.readEndDate)) {
            return "Started at: " + startDateTime.format("H:mm:ss");
        } else {
            let endDateTime = moment(histRecord.readEndDate, "M/D/YYYY HH:mm:ss");
            let minutesRead = (endDateTime.diff(startDateTime) / 1000) / 60;
            return startDateTime.format("H:mm") + "-" + endDateTime.format("H:mm") + " (" + minutesRead.toFixed(1) + " min)";
        }
    }
}
