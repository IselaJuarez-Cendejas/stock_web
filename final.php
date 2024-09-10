<?php

$DBSTRING = "" ; // secret database location 
include "sql.inc";

// phpinfo();

// This function is for a POST request that will save data into the database
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $ticker = $_POST['ticker'];
  $jsonData = $_POST['jsonData'];
  $date = $_POST['date'];
  $queryType = $_POST['queryType'];
  $sql = "INSERT INTO stock (stockTicker, jsonData, dateTime, queryType) VALUES ('$ticker', '$jsonData', '$date', '$queryType')";
  $db = new PDO($DBSTRING);
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $db->exec($sql);
} else if ($_SERVER["REQUEST_METHOD"] == 'GET') {
  $startdate;
  $enddate;
  $limit;
  $ticker;

  if (isset($_GET['startdate'])) {
    $startdate = $_GET['startdate'];
  } else {
    $startdate = '2022-01-01';
  }

  if (isset($_GET['enddate'])) {
    $enddate = $_GET['enddate'];
  } else {
    $enddate = '2025-01-01';
  }

  if (isset($_GET['limit'])) {
    $limit = $_GET['limit'];
  } else {
    $limit = 100;
  }

  if (isset($_GET['ticker'])) {
    $ticker = $_GET['ticker'];
  } else {
    $ticker = "%";
  }

  $sql = "SELECT * FROM stock WHERE dateTime BETWEEN ? AND ? AND stockTicker LIKE ? LIMIT ?";

  try {
    $data = GET_SQL($sql, $startdate, $enddate, $ticker, $limit);
    echo json_encode($data);
  } catch (Exception $e) {
    echo $e->getMessage();
  }
}
?>
