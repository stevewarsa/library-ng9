<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$bookId = $_GET['bookId'];
$db = new SQLite3('../db/library.sqlite');
$statement = $db->prepare("update book set in_reading_list = 'Y' where id = :bookId");
$statement->bindValue(':bookId', $bookId);
$statement->execute();
$statement->close();

print_r(json_encode("success"));

?>