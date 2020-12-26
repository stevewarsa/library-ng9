<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$request = file_get_contents('php://input');
if (empty($request)) {
	error_log("update_book.php - may be options call - JSON request not sent - exiting");
	exit();
}

$book = json_decode($request);
$id = $book->id;
$title = $book->title;
$subtitle = $book->subtitle;
$author = $book->author;
$type_of_book = $book->type_of_book;
$book_location = $book->bookLocation;
$shelf = $book->shelf;
$position_in_row = $book->positionInRow;
$finished = $book->finished_reading;
$in_reading_list = $book->in_reading_list;

$db = new SQLite3('../db/library.sqlite');
$statement = $db->prepare('update book set title = :title, subtitle = :subtitle, author = :author,type_of_book = :type_of_book, book_location = :book_location, shelf = :shelf, position_in_row = :position_in_row, finished_reading = :finished_reading, in_reading_list = :in_reading_list where id = :id');
$statement->bindValue(':id', $id);
$statement->bindValue(':title', $title);
$statement->bindValue(':subtitle', $subtitle);
$statement->bindValue(':author', $author);
$statement->bindValue(':type_of_book', $type_of_book);
$statement->bindValue(':book_location', $book_location);
$statement->bindValue(':shelf', $shelf);
$statement->bindValue(':position_in_row', $position_in_row);
$statement->bindValue(':finished_reading', $finished);
$statement->bindValue(':in_reading_list', $in_reading_list);
$statement->execute();
$statement->close();

print_r(json_encode("success"));

?>