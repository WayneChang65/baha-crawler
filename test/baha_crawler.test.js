const baha_crawler = require('../index.js');

test('1. Test for default Options ', async () => {
	await baha_crawler.initialize();
	let baha = await baha_crawler.getResults(); // Default Options
	await baha_crawler.close();
	expect(baha.titles).toBeDefined();
	expect(baha.urls).toBeDefined();
}, 20000);  // 20 seconds

test('2. Test for scraping "PokemonGo" board with 2 pages and containing contents of posts ' + 
	'by skipping bottom fixed posts. ', async () => {
	await baha_crawler.initialize();
	let baha = await baha_crawler.getResults({
		board: '23805',
		pages: 3,
		skipTPs: true
	}); // scraping "ToS" board, 3 pages, skip fixed upper posts
	
	await baha_crawler.close();
	expect(baha.titles).toBeDefined();
	expect(baha.urls).toBeDefined();
}, 180000); // 3 minutes