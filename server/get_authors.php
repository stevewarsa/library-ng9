<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf8');
$db = new SQLite3('../db/library.sqlite');

$results = $db->query('select distinct author from book order by LOWER(author)');
$arrayName = array();
while ($row = $results->fetchArray()) {
	array_push($arrayName, $row['author']);
}
print_r(json_encode($arrayName));

?>
