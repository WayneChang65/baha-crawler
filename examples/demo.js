'use strict';
const baha_crawler = require('../index.js');
main();

async function main(){
	let board, pages;

	// *** Initialize ***
	await baha_crawler.initialize();

	// *** GetResult  ***
	board = '23805', pages = 3;
	let baha = await baha_crawler.getResults({
		board: board,
		pages: pages,
		skipTPs: true
	}); // ToS Board (23805), 3 pages, Skip fixed upper posts
	consoleOut(board, pages, baha);

	board = '35860', pages = 2;
	baha = await baha_crawler.getResults({
		board: board,
		pages: pages,
	}); // Game Board(35860), 2 pages, keep fixed upper posts
	consoleOut(board, pages, baha);

	// *** Close      ***
	await baha_crawler.close();
}


//////////////////////////////////////////
///           Console Out              ///
////////////////////////////////////////// 
function consoleOut(_scrapingBoard, _scrapingPages, baha) {	
	console.log('-----------------------------');
	console.log('Board Name = ' + _scrapingBoard);
	console.log('ScrapingPages = ' + _scrapingPages);
	console.log('Total Items = ' + baha.titles.length + '\n-----------------------------');

	for (let i = 0; i < baha.titles.length; i++){
		console.log(baha.titles[i] + ' ----- ' + baha.urls[i]);
	}
}