<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$request = file_get_contents('php://input');
if (empty($request)) {
    error_log("end_reading_session.php - may be options call - JSON request not sent - exiting");
    exit();
}

$readingData = json_decode($request);
$bookId = $readingData->bookId;
$pagesRead = $readingData->pagesRead;
$lastReadPage = $readingData->lastReadPage;
$percentageRead = $readingData->percentageRead;
$readStartDate = $readingData->readStartDate;
$readEndDate = $readingData->readEndDate;
$db = new SQLite3('../db/library.sqlite');
$statement = $db->prepare("update reading_list set pages_read = :pages_read, last_page_read = :last_page_read, 
                        percentage_read = :percentage_read, read_end_date_time = :read_end_date_time 
                        where book_id = :bookId and read_start_date_time = :read_start_date_time");
$statement->bindValue(':pages_read', $pagesRead);
$statement->bindValue(':last_page_read', $lastReadPage);
$statement->bindValue(':percentage_read', $percentageRead);
$statement->bindValue(':read_end_date_time', $readEndDate);
$statement->bindValue(':bookId', $bookId);
$statement->bindValue(':read_start_date_time', $readStartDate);
$statement->execute();
$statement->close();

print_r(json_encode("success"));

?>