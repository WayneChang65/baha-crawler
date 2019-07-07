'use strict';
const baha_crawler = require('../index.js');
main();

async function main(){
    
    // *** Initialize ***
    await baha_crawler.initialize();

    // *** GetResult  ***
    let baha = await baha_crawler.getResults({
        board: '23805',
        pages: 3,
        skipTPs: true
    }); // ToS版(23805), 爬 3頁, 去掉置底文
    consoleOut(baha_crawler, baha);

    baha = await baha_crawler.getResults({
        board: '35860',
        pages: 2,
    }); // 極速版(35860), 爬 2頁, 保留置底文
    consoleOut(baha_crawler, baha);

    // *** Close      ***
    await baha_crawler.close();
}


//////////////////////////////////////////
///           Console Out              ///
////////////////////////////////////////// 
function consoleOut(baha_crawler, baha) {
    console.log('-----------------------------')
    console.log('Board Name = ' + baha_crawler.scrapingBoard);
    console.log('ScrapingPages = ' + baha_crawler.scrapingPages);
    console.log('Total Items = ' + baha.titles.length + '\n-----------------------------');

    for (let i = 0; i < baha.titles.length; i++){
        console.log(baha.titles[i] + ' ----- ' + baha.urls[i]);
    }
}