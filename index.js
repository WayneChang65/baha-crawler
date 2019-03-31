'use strict';
const baha_crawler = require('./lib/baha_crawler.js');
main();

async function main(){
    const BAHA_BOARD = '23805';
    const PAGES = 3;
    const SKIP_TOPPOSTS = true;

    // *** Initialize *** 要爬的板名編號. e.g. ToS版(23805), 極速版(35860), ...
    await baha_crawler.initialize(BAHA_BOARD);

    // *** GetResult  *** 爬 3 頁, 去掉置頂文 true
    let baha = await baha_crawler.getResults(PAGES, SKIP_TOPPOSTS);

    // *** Close      *** 關掉
    await baha_crawler.close();
                          

    //////////////////////////////////////////
    ///           Console Out              ///
    //////////////////////////////////////////   
                                  
    console.log('ScrapingPages = ' + baha_crawler.scrapingPages);
    console.log('Total Items = ' + baha.titles.length + '\n', baha);

    for (let i = 0; i < baha.titles.length; i++){
        console.log(baha.titles[i] + ' ----- ' + baha.urls[i]);
    }
    
}