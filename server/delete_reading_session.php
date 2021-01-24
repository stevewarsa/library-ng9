<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$request = file_get_contents('php://input');
if (empty($request)) {
    error_log("delete_reading_session.php - may be options call - JSON request not sent - exiting");
    exit();
}

$requestParam = json_decode($request);
$bookId = $requestParam->bookId;
$lastReadPage = $requestParam->lastReadPage;
$pagesRead = $requestParam->pagesRead;
$percentageRead = $requestParam->percentageRead;
$readStartDate = $requestParam->readStartDate;
error_log("delete_reading_session.php - reading session entry has bookId: " . $bookId . ", pagesRead: " . $pagesRead . ", lastReadPage: " . $lastReadPage . ", percentageRead: " . $percentageRead . ", readStartDate: " . $readStartDate);
$db = new SQLite3('../db/library.sqlite');
$statement = $db->prepare('delete from reading_list where book_id = :book_id and read_start_date_time = :read_start_date_time');
$statement->bindValue(':book_id', $bookId);
//$statement->bindValue(':pages_read', $pagesRead);
//$statement->bindValue(':last_page_read', $lastReadPage);
//$statement->bindValue(':percentage_read', $percentageRead);
$statement->bindValue(':read_start_date_time', $readStartDate);
$statement->execute();
error_log("delete_reading_session.php - there were " . $db->changes() . " rows deleted");
$statement->close();

print_r(json_encode("success"));

?>