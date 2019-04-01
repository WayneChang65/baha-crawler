'use strict';
const puppeteer = require('puppeteer');
const os = require('os');

const self = {
    browser: null,
    page: null,
    scrapingBoard: '',
    scrapingPages: 1,
    skipTopPosts: true,
    this_os: '',
    stopSelector: '#BH-master > form > div > table > tbody',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3723.0 Safari/537.36',

    /**
     *  @param {string} board 
     */
    initialize: async () => {
        self.this_os = os.platform();
        self.browser = (self.this_os === 'linux') ?
            await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }) :
            await puppeteer.launch({
                headless: false
            });

        /***** 建立Browser上的 newPage *****/
        self.page = await self.browser.newPage();
        self.page.setUserAgent(self.userAgent);
    },

    /**
     *  @param {number} num
     *  @param {boolean} skipTPs
     *  @returns {object}
     */
    getResults: async (board = '23805', num = 1, skipTPs = true) => {
        let data_pages = [];
        let numOfPage = 1;
        self.scrapingBoard = board;
        self.scrapingPages = (num < 0) ? 1 : num;
        self.skipTopPosts = skipTPs;

        /***** 前往 baha要爬的版面的 Url (最新頁面) *****/
        const bahaUrl = 'https://forum.gamer.com.tw/B.php?page=1&bsn=' + board;
        self.page.setViewport({
            width: 1024,
            height: 768
        });
        await self.page.goto(bahaUrl);
        //await page.screenshot({path: 'baha_crawler.png'});
        
        await self.page.waitForSelector(self.stopSelector);
        data_pages.push(await self.page.evaluate(self._scrapingOnePage, skipTPs));

        for (let i = 1; i < self.scrapingPages; i++) {
            numOfPage++;
            /***** 前往下一頁 *****/
            let pageUrl = 'https://forum.gamer.com.tw/B.php?page=' + numOfPage.toString() + '&bsn=' + board;
            await self.page.goto(pageUrl);
            await self.page.waitForSelector(self.stopSelector);

            /***** 抓取網頁資料 (下一頁) *****/
            data_pages.push(await self.page.evaluate(self._scrapingOnePage, skipTPs));
        }

        /***** 將多頁資料 "照實際新舊順序" 合成 1 個物件 *****/
        return await self._mergePages(data_pages);
    },

    /**
     * @return
     */
    close: async () => {
        await self.browser.close();
    },

    ///////////////////////////////////////////
    ///          Private Methods            ///
    ///////////////////////////////////////////  

    /**
     *  @param {boolean} skipTopPosts
     *  @returns {object}
     */
    _scrapingOnePage: (skipTopPosts /* 濾掉置底文 */ ) => {
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
    },

    /**
     *  @param {number} pages
     *  @returns {object}
     */
    _mergePages: (pages) => {
        return new Promise((resolve, reject) => {
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
}

module.exports = self;