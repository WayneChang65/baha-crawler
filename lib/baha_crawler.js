'use strict';
const puppeteer = require('puppeteer');
const os = require('os');

let browser;
let page;
let scrapingBoard = '';
let scrapingPages = 1;
let skipTopPosts = true;
let this_os = '';
let stopSelector = '#BH-master > form > div > table > tbody';
let userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3723.0 Safari/537.36';

async function _initialize() {
	this_os = os.platform();
	browser = (this_os === 'linux') ?
		await puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		}) :
		await puppeteer.launch({
			headless: false
		});

	/***** 建立Browser上的 newPage *****/
	page = await browser.newPage();
	await page.setDefaultNavigationTimeout(180 * 1000); // 3 mins
	page.setUserAgent(userAgent);
}

async function _getResults(options) {
	let data_pages = [];
	let numOfPage = 1;
	options = options || {};
	scrapingBoard = options.board || '23805';
	scrapingPages = (options.pages < 0) ? 1 : options.pages;
	skipTopPosts = options.skipTPs && true;

	// 巴哈網頁新增縮圖功能後，如果要回到原來的列表，要加入以下cookie
	const cookie = {
		name: 'ckForumListType',
		value: 'simple',
		domain: '.gamer.com.tw',
		url: 'https://forum.gamer.com.tw',
		path: '/',
		httpOnly: false,
		secure: false
	};

	/***** 前往 baha要爬的版面的 Url (最新頁面) *****/
	const bahaUrl = 'https://forum.gamer.com.tw/B.php?page=1&bsn=' + scrapingBoard;
	page.setViewport({
		width: 1024,
		height: 768
	});
	try {
		await page.setCookie(cookie);
		await page.goto(bahaUrl);
		await page.waitForSelector(stopSelector);
		data_pages.push(await page.evaluate(_scrapingOnePage, skipTopPosts));
	} catch (e) {
		console.log('[baha-crawler] ERROR!---getResults');
		console.log(e);
		browser.close();
	}

	for (let i = 1; i < scrapingPages; i++) {
		numOfPage++;
		/***** 前往下一頁 *****/
		let pageUrl = 'https://forum.gamer.com.tw/B.php?page=' + numOfPage.toString() + '&bsn=' + scrapingBoard;
		try {
			await page.goto(pageUrl);
			await page.waitForSelector(stopSelector);
			/***** 抓取網頁資料 (下一頁) *****/
			data_pages.push(await page.evaluate(_scrapingOnePage, skipTopPosts));
		} catch (e) {
			console.log('[baha-crawler] ERROR!---getResults');
			console.log(e);
			await browser.close();
		}	
	}

	/***** 將多頁資料 "照實際新舊順序" 合成 1 個物件 *****/
	return await _mergePages(data_pages);
}

function _scrapingOnePage(skipTopPosts /* 濾掉置底文 */ ) {
	let aryTitle = [],
		aryHref = [];

	// 全文(含置頂文 及 刪除文)
	const titleSelectorAll = '#BH-master > form > div > table > tbody > tr.b-list__row > td > a.b-list__main__title';
	let nlResultTitleAll = document.querySelectorAll(titleSelectorAll);
	let aryResultTitleAll = Array.from(nlResultTitleAll).map(xxx => xxx.innerText);
	let aryResultHrefAll = Array.from(nlResultTitleAll).map(xxx => xxx.href);

	// 置頂文
	const titleSelectorSticky = '#BH-master > form > div > table > tbody > tr.b-list__row--sticky > td > a.b-list__main__title';
	let nlResultTitleSticky = document.querySelectorAll(titleSelectorSticky);
	let aryResultTitleSticky = Array.from(nlResultTitleSticky).map(xxx => xxx.innerText);
	let aryResultHrefSticky = Array.from(nlResultTitleSticky).map(xxx => xxx.href);

	// 刪除文
	const titleSelectorDelete = '#BH-master > form > div > table > tbody > tr.b-list__row--delete > td > a.b-list__main__title';
	let nlResultTitleDelete = document.querySelectorAll(titleSelectorDelete);
	let aryResultTitleDelete = Array.from(nlResultTitleDelete).map(xxx => xxx.innerText);
	let aryResultHrefDelete = Array.from(nlResultTitleDelete).map(xxx => xxx.href);

	// 全文 扣除 刪除文
	aryTitle = aryResultTitleAll.filter(xxx => !aryResultTitleDelete.includes(xxx));
	aryHref = aryResultHrefAll.filter(xxx => !aryResultHrefDelete.includes(xxx));

	// 全文 扣除 刪除文後，再扣除 置頂文
	if (skipTopPosts) {
		aryTitle = aryTitle.filter(xxx => !aryResultTitleSticky.includes(xxx));
		aryHref = aryHref.filter(xxx => !aryResultHrefSticky.includes(xxx));
	}

	return ({
		aryTitle,
		aryHref
	});
}

function _mergePages(pages) {
	return new Promise((resolve /*, reject*/ ) => {
		let aryAllPagesTitle = [],
			aryAllPagesUrl = [];
		for (let i = 0; i < pages.length; i++) {
			for (let j = 0; j < pages[i].aryTitle.length; j++) {
				aryAllPagesTitle.push(pages[i].aryTitle[j]);
				aryAllPagesUrl.push(pages[i].aryHref[j]);
			}
		}
		let titles = aryAllPagesTitle;
		let urls = aryAllPagesUrl;

		resolve({
			titles,
			urls
		});
	});
}

async function _close() {
	if (browser) await browser.close();
}

module.exports = {
	initialize: _initialize,
	getResults: _getResults,
	close: _close
};