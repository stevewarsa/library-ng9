export class Book {
    public id: number;
    constructor(
        public title: string, 
        public subtitle: string, 
        public author: string, 
        public bookLocation: string,
        public shelf: number,
        public positionInRow: string,
        public type_of_book: string,
        public in_reading_list: string,
        public finished_reading: string
    ) { }
}
