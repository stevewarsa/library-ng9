<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$request = file_get_contents('php://input');
if (empty($request)) {
    error_log("start_reading_session.php - may be options call - JSON request not sent - exiting");
    exit();
}

$readingData = json_decode($request);

$db = new SQLite3('../db/library.sqlite');
$bookId = $readingData->bookId;
$pagesRead = $readingData->pagesRead;
$lastReadPage = $readingData->lastReadPage;
$percentageRead = $readingData->percentageRead;
$readStartDate = $readingData->readStartDate;
$statement = $db->prepare("update book set in_reading_list = 'Y' where id = :bookId");
$statement->bindValue(':bookId', $bookId);
$statement->execute();
$statement->close();
$statement = $db->prepare("insert into reading_list(book_id, pages_read, last_page_read, percentage_read, read_start_date_time, record_date_time) 
values(:bookId, :pages_read, :last_page_read, :percentage_read, :read_start_date_time, :record_date_time)");
$statement->bindValue(':bookId', $bookId);
$statement->bindValue(':pages_read', $pagesRead);
$statement->bindValue(':last_page_read', $lastReadPage);
$statement->bindValue(':percentage_read', $percentageRead);
$statement->bindValue(':read_start_date_time', $readStartDate);
$statement->bindValue(':record_date_time', $readStartDate);
$statement->execute();
$statement->close();

$db->close();
print_r(json_encode("success"));

?>