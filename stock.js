var API_KEY = 'EyXYU6QqaPsfWfGxGp4uPo0Kj0RGur3E';
var URL = 'https://api.polygon.io';

const EXCHANGES = [
	{ id: 'NYSE', name: 'New York Stock Exchange', mic: 'XNYS' },
	{ id: 'NASDAQ', name: 'Nasdaq Stock Market', mic: 'XNAS' },
	{ id: 'AMEX', name: 'NYSE American', mic: 'XASE' },
	{ id: 'ARCA', name: 'NYSE Arca', mic: 'ARCX' },
	{ id: 'BATS', name: 'Cboe BZX Exchange', mic: 'BATS' }
];

$(document).ready(function () {
	getExchanges();
	$('#exchangeSelect').on('change', getStocks);
	
	$('#detailsButton').on('click', function () {
		getDetails();
		//detailsTable.hidden = false;
	});

	$('#newsButton').on('click', function () {
		getNews();
	});
});

function getExchanges() {
	$('#exchangeSelect').html('');
	$('<option>').val('').text('--Select an Exchange--').appendTo('#exchangeSelect');

	// Add pre-filled options for hard-coded exchanges
	$.each(EXCHANGES, function (i, exchange) {
		$('<option>').val(exchange.id).text(exchange.name + ' (' + exchange.mic + ')').appendTo('#exchangeSelect');
	});
}

function getStocks() {
	var exchange = $('#exchangeSelect').val();
	$('#stockSelect').html('');
	$('<option>').val('').text('--Select a Stock--').appendTo('#stockSelect');

	// Get all stocks from the selected exchange
	a = $.ajax({
		url: URL + '/v3/reference/tickers',
		method: 'GET',
		data: {
			apiKey: API_KEY,
			primary_exchange: exchange,
			active: true
		}
	}).done(function (data) {
		//console.log(data);
		var stocks = data.results;
		$.each(stocks, function (i, stock) {
			$('<option>').val(stock.ticker).text(stock.name).appendTo('#stockSelect');
		});
	}).fail(function (error) {
		console.log('error', error.statusText);
	});
}

async function getDetails() {
	var stock = $('#stockSelect').val();
	//var returndata = [];
	var now = new Date().getTime();
	var from = now - 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
	var stockDetailsUrl = URL + '/v2/aggs/ticker/' + stock + '/range/1/day/' + from + '/' + now;
	a = $.ajax({
		url: stockDetailsUrl,
		method: 'GET',
		data: {
			apiKey: API_KEY,
		}
	}).done(function (data) {
		console.log(data);
		// Display data on stocks.html
		var detailsTable = $('.details-table');
		detailsTable.empty();
		$.each(data.results, function (i, result) {
			var detailsRow = $('<tr>');
			$('<td>').text(new Date(result.t).toLocaleString()).appendTo(detailsRow);
			$('<td>').text(result.o).appendTo(detailsRow);
			$('<td>').text(result.h).appendTo(detailsRow);
			$('<td>').text(result.l).appendTo(detailsRow);
			$('<td>').text(result.c).appendTo(detailsRow);
			$('<td>').text(result.v).appendTo(detailsRow);
			detailsRow.appendTo(detailsTable);
		});
		//console.log(data.results);
		tickerDetails(data.results);
	}).fail(function (error) {
		console.log('error', error.statusText);
	});
	//return returndata;
}

async function tickerDetails(prices) {
	var stock = $('#stockSelect').val();
	var stockDetailsUrl = URL + "/v3/reference/tickers/" + stock;
	a = $.ajax({
		url: stockDetailsUrl,
		method: 'GET',
		data: {
			apiKey: API_KEY,
		}
	}).done(function (data) {
		console.log(data);
		// Display data on stocks.html
		$("#tickerName").text(data.results.name);
		$("#tickerDescription").text(data.results.description);
		$("#tickerLogo").attr("src", data.results.branding.logo_url + "?apiKey=" + API_KEY);
		saveToDatabase({
			"ticker": data.results.ticker,
			"tickerDetails": data.results,
			"prices": prices
		})
	}).fail(function (error) {
		console.log('error', error.statusText);
	});
}

function saveToDatabase(json) {
	$.ajax({
		url: 'final.php',
		method: 'POST',
		data: {
			queryType: 'tickerDetails',
			jsonData: JSON.stringify(json),
			date: new Date().toISOString().slice(0, 10),
			ticker: $('#stockSelect').val()
		}
	});
}

async function getNews() {
	var stock = $('#stockSelect').val();
	var stockNewssUrl = URL + "/v2/reference/news";
	a = $.ajax({
		url: stockNewssUrl,
		method: 'GET',
		data: {
			ticker: stock,
			apiKey: API_KEY
		}
	}).done(function (data) {
		console.log(data);
		// Display data on stocks.html
		$('#tickerName').text(stock);
		$.each(data.results, function (i, result) {
			var newsRow = $('<tr>');
			$('<td>').text(result.title).appendTo(newsRow);
			$('<td>').text(result.article_url).appendTo(newsRow);
			$('<td>').text(result.author).appendTo(newsRow);
			newsRow.appendTo('.news-table');
		});
		saveNewsToDatabase({
			"ticker": stock,
			"tickerDetails": data.results
		});
	}).fail(function (error) {
		console.log('error', error.statusText);
	});
}

function saveNewsToDatabase(json) {
	$.ajax({
		url: 'final.php',
		method: 'POST',
		data: {
			queryType: 'tickerNews',
			jsonData: JSON.stringify(json),
			date: new Date().toISOString().slice(0, 10),
			ticker: $('#stockSelect').val()
		}
	});
}
