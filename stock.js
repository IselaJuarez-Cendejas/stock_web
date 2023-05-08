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
	a=$.ajax({
		url: URL + '/v2/aggs/ticker/' + stock + '/range/',
		method: 'GET',
		data: {
			apiKey: API_KEY,
			multiplier: 1,
			timespan: 'day',
			to: new Date().getTime(),
			from: to - 7 * 24 * 60 * 60 * 1000
		}
	}).done(function(data) {
		console.log(data);
		// Display data on stocks.html
		// Populate the details table with the retrieved data
		var detailsRow = $('#detailsTable tbody tr');
		detailsRow.empty();
		$('<td>').text(data.c).appendTo(detailsRow);
		$('<td>').text(data.h).appendTo(detailsRow);
		$('<td>').text(data.l).appendTo(detailsRow);
		$('<td>').text(data.n).appendTo(detailsRow);
		$('<td>').text(data.o).appendTo(detailsRow);
		$('<td>').text(data.otc).appendTo(detailsRow);
		$('<td>').text(new Date(data.t).toLocaleString()).appendTo(detailsRow);
		$('<td>').text(data.v).appendTo(detailsRow);
		$('<td>').text(data.vw).appendTo(detailsRow);
	}).fail(function(error) {
		console.log('error', error.statusText);
	});
}
  