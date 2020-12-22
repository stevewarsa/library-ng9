<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$request = file_get_contents('php://input');
if (empty($request)) {
	error_log("get_random_book.php - may be options call - JSON request not sent - exiting");
	exit();
}

include_once('./Book.php');

error_log('Here is the incoming request:');
error_log($request);
$bookType = json_decode('{ "value": "' . $request . '" }');
error_log('Querying random book of type: ' . $bookType->value . '...');
$db = new SQLite3('../db/library.sqlite');
$results = $db->query("select id, title, subtitle, author, type_of_book, book_location, shelf, position_in_row from book where type_of_book = '" . $bookType->value . "' ORDER BY RANDOM() LIMIT 1");
while ($row = $results->fetchArray()) {
	error_log('Found record with name: ' . $row['title'] . '...');
	$book = new Book();
	$book->id = $row['id'];
	$book->title = $row['title'];
	$book->subtitle = $row['subtitle'];
	$book->author = $row['author'];
	$book->bookLocation = $row['book_location'];
	$book->shelf = $row['shelf'];
	$book->positionInRow = $row['position_in_row'];
	$book->type_of_book = $row['type_of_book'];
	break;
}


print_r(json_encode($book));


?>