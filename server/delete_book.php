<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$request = file_get_contents('php://input');
if (empty($request)) {
	error_log("delete_book.php - may be options call - JSON request not sent - exiting");
	exit();
}

$requestParam = json_decode($request);
$id = $requestParam->bookId;
error_log("delete_book.php - Deleting book with ID: " . $id);
$db = new SQLite3('../db/library.sqlite');
$statement = $db->prepare('delete from book where id = :id');
$statement->bindValue(':id', $id);
$statement->execute();
$statement->close();

print_r(json_encode("success"));

?>