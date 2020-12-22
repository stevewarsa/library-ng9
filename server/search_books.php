<?php

header('Access-Control-Allow-Origin: *');

header('Content-Type: application/json; charset=utf8');

include_once('./Book.php');

$db = new SQLite3('../db/library.sqlite');

$searchText = strtoupper($_REQUEST['searchText']);



$results = $db->query('select id, title, subtitle, author, type_of_book, book_location, shelf, position_in_row from book where upper(title) like \'%' . $searchText . '%\' or upper(subtitle) like \'%' . $searchText . '%\' or upper(author) like \'%' . $searchText . '%\' order by LOWER(title)');

$arrayName = array();

while ($row = $results->fetchArray()) {

	$book = new Book();

	$book->id = $row['id'];

	$book->title = $row['title'];

	$book->subtitle = $row['subtitle'];

	$book->author = $row['author'];

	$book->type_of_book = $row['type_of_book'];

	$book->shelf = $row['shelf'];

	$book->bookLocation = $row['book_location'];

	$book->positionInRow = $row['position_in_row'];

	array_push($arrayName, $book);

}

print_r(json_encode($arrayName));



?>