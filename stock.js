var API_KEY = 'EyXYU6QqaPsfWfGxGp4uPo0Kj0RGur3E';
var URL = 'https://api.polygon.io';

const EXCHANGES = [
  { id: 'NYSE', name: 'New York Stock Exchange', mic: 'XNYS' },
  { id: 'NASDAQ', name: 'Nasdaq Stock Market', mic: 'XNAS' },
  { id: 'AMEX', name: 'NYSE American', mic: 'XASE' },
  { id: 'ARCA', name: 'NYSE Arca', mic: 'ARCX' },
  { id: 'BATS', name: 'Cboe BZX Exchange', mic: 'BATS' }
];

$(document).ready(function() {
	getExchanges();
	$('#exchangeSelect').on('change', getStocks);
	// Add event listener to detailsButton
	$('#detailsButton').on('click', function() {
		// Toggle visibility of details table
		$('.details-table').toggle();
		getDetails();
	});
});

function getExchanges() {
  // Clear the existing options in the exchange dropdown
  $('#exchangeSelect').html('');

  // Add a default option
  $('<option>').val('').text('--Select an Exchange--').appendTo('#exchangeSelect');

  // Add pre-filled options for hard-coded exchanges
  $.each(EXCHANGES, function(i, exchange) {
    $('<option>').val(exchange.id).text(exchange.name + ' (' + exchange.mic + ')').appendTo('#exchangeSelect');
  });
}

function getStocks() {
	var exchange = $('#exchangeSelect').val();
	$('#stockSelect').html('');
	$('<option>').val('').text('--Select a Stock--').appendTo('#stockSelect');
  
	// Get all stocks from the selected exchange
	a=$.ajax({
	  url: URL + '/v3/reference/tickers',
	  method: 'GET',
	  data: {
		apiKey: API_KEY,
		primary_exchange: exchange,
		active: true
	  }
	}).done(function(data) {
	  //console.log(data);
	  var stocks = data.results;
	  $.each(stocks, function(i, stock) {
		$('<option>').val(stock.ticker).text(stock.name).appendTo('#stockSelect');
	  });
	}).fail(function(error) {
	  console.log('error', error.statusText);
	});
}

function getDetails() {
	var stock = $('#stockSelect').val();
	var now = new Date().getTime();
	var from = now - 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
	var stockDetailsUrl = URL + '/v2/aggs/ticker/' + stock + '/range/1/day/' + from + '/' + now;
	a=$.ajax({
		url: stockDetailsUrl,
		method: 'GET',
		data: {
			apiKey: API_KEY,
		}
	}).done(function(data) {
		console.log(data);
		// Display data on stocks.html
		// Populate the details table with the retrieved data
		var detailsTable = $('.details-table');
		detailsTable.empty();
		$.each(data.results, function(i, result) {
			var detailsRow = $('<tr>');
			$('<td>').text(new Date(result.t).toLocaleString()).appendTo(detailsRow);
			$('<td>').text(result.o).appendTo(detailsRow);
			$('<td>').text(result.h).appendTo(detailsRow);
			$('<td>').text(result.l).appendTo(detailsRow);
			$('<td>').text(result.c).appendTo(detailsRow);
			$('<td>').text(result.v).appendTo(detailsRow);
			detailsRow.appendTo(detailsTable);
		});
	}).fail(function(error) {
		console.log('error', error.statusText);
	});
}
  