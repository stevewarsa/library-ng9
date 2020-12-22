<?php

header('Access-Control-Allow-Origin: *');

header('Content-Type: application/json; charset=utf8');

include_once('./Book.php');

$db = new SQLite3('../db/library.sqlite');



$results = $db->query('select id, title, subtitle, author, type_of_book, book_location, shelf, position_in_row from book order by LOWER(title)');

$arrayName = array();

while ($row = $results->fetchArray()) {

	$book = new Book();

	$book->id = $row['id'];

	$book->title = $row['title'];

	$book->subtitle = $row['subtitle'];

	$book->author = $row['author'];

	$book->bookLocation = $row['book_location'];

	$book->shelf = $row['shelf'];

	$book->positionInRow = $row['position_in_row'];

	$book->type_of_book = $row['type_of_book'];

	array_push($arrayName, $book);

}

print_r(json_encode($arrayName));



?>

