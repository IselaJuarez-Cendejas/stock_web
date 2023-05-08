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
	var multiplier = 1;
	var timespan = 'day';
	var from = to - 7 * 24 * 60 * 60 * 1000; // 7 days ago
	var to = new Date().getTime();
	a=$.ajax({
		url: URL + '/v2/aggs/ticker/${stock}/range/${multiplier}/${timespan}/${from}/${to}?apiKey=${API_KEY}',
		method: 'GET'
	}).done(function(data) {
		console.log(data);
		// Display data on stocks.html
		

	}).fail(function(error) {
		console.log('error', error.statusText);
	});
}
// Helper function to get the date of the specified number of days in the past
function getPastDate(days) {
	var pastDate = new Date();
	pastDate.setDate(pastDate.getDate() - days);
	return pastDate.toISOString().slice(0,10);
}

// Helper function to format date as yyyy-mm-dd
function getFormattedDate(timestamp) {
	var date = new Date(timestamp);
	return date.toISOString().slice(0,10);
}
  