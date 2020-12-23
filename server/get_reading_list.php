<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf8');

$db = new SQLite3('../db/library.sqlite');

$results = $db->query("select id, title, subtitle, author, type_of_book, book_location, shelf, position_in_row, in_reading_list, finished_reading from book where in_reading_list = 'Y' order by LOWER(title)");
$arrayName = array();
while ($row = $results->fetchArray()) {
	$book = new stdClass;
	$book->id = $row['id'];
	$book->title = $row['title'];
	$book->subtitle = $row['subtitle'];
	$book->author = $row['author'];
	$book->bookLocation = $row['book_location'];
	$book->shelf = $row['shelf'];
	$book->positionInRow = $row['position_in_row'];
	$book->type_of_book = $row['type_of_book'];
	$book->in_reading_list = $row['in_reading_list'];
	$book->finished_reading = $row['finished_reading'];
	array_push($arrayName, $book);
}
print_r(json_encode($arrayName));
?>

