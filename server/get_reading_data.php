<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$db = new SQLite3('../db/library.sqlite');

$results = $db->query('select book_id, pages_read, last_page_read, percentage_read, read_start_date_time, read_end_date_time from reading_list');
$arrayName = array();
while ($row = $results->fetchArray()) {
    $readingData = new stdClass;
    $readingData->bookId = $row['book_id'];
    $readingData->pagesRead = $row['pages_read'];
    $readingData->lastReadPage = $row['last_page_read'];
    $readingData->percentageRead = $row['percentage_read'];
    $readingData->readStartDate = $row['read_start_date_time'];
    $readingData->readEndDate = $row['read_end_date_time'];
    array_push($arrayName, $readingData);
}
print_r(json_encode($arrayName));
?>
