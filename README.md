# baha-crawler
baha-crawler 是一個專門用來爬[巴哈姆特](https://www.gamer.com.tw/)各版資料的爬蟲模組。  
  
baha-crawler is a web crawler module designed to scarp data from [Bahamut Forum](https://www.gamer.com.tw/).

## 前言(Overview)
[巴哈姆特](https://www.gamer.com.tw/)是台灣最大的電玩討論區，也是許多台灣玩家不可不知的電玩資訊網站。
找了一下，似乎巴哈的爬蟲少之又少，更別說是用Javascript所寫的模組了。
本人為了在Node.js上爬[巴哈姆特](https://www.gamer.com.tw/)，乾脆就自己用javascript打造一個簡單的爬蟲模組，並且分享給大家使用。 
  
[Bahamut Forum](https://www.gamer.com.tw/) is the most famous and biggest game forum in Taiwan and game plays are well-know forum.
Just search a while, [Bahamut Forum](https://www.gamer.com.tw/) crawler modules are not easy to be found especially written by javascript.  
In order to scrap data from [Bahamut Forum](https://www.gamer.com.tw/) by Node.js, 
I just create a simple [Bahamut Forum](https://www.gamer.com.tw/) crawler module by javascript and share it to everyone to use.

## 這個爬蟲模組能做什麼事？ (What can it do ?)
* 爬[巴哈姆特](https://www.gamer.com.tw/)任意版上資料。
* 可以爬多頁資料。
* 爬資料時，可選擇是否忽略**置頂文**。
* 爬的資料以單一帖發文為單位，其中包含該帖的**主題**及**超連結**。(其他資料如推文數、日期及作者等，因為個人目前用不到，所以尚未實作，有興趣歡迎fork and pr)

## 如何在您的專案使用？ (How to use it in your project ?)
* 利用 npm 套件進行下載  
```
npm install @waynechang65/baha-crawler
```
* 在您的專案環境中，引用 baha-crawler模組。
```javascript
const baha_crawler = require('@waynechang65/baha-crawler');
```

* 接下來，用**async函式**包含下面幾行程式就搞定了。
```javascript
// *** Initialize *** 
await baha_crawler.initialize();

// *** GetResult  ***
    let baha = await baha_crawler.getResults({
        board: '23805',
        pages: 3,
        skipTPs: true
    }); // ToS版(23805), 爬 3頁, 去掉置頂文

// *** Close      ***
await baha_crawler.close();
```

* 爬完的資料會透過函式 getResults() 回傳一個物件，裏面各陣列放著爬完的資料，結構如下：
```javascript
{ titles[], urls[] }
```

## 如何跑範例程式？ (How to run the example ?)

* 從Github下載baha-crawler專案程式碼。  
```
git clone https://github.com/WayneChang65/baha-crawler.git
```
* 進入baha-crawler專案目錄
```
cd baha-crawler
```
* 下載跑範例程式所需要的環境組件
```
npm install
```
* 透過 npm 直接使用以下指令。(實際範例程式在 ./examples/demo.js)  
```
npm start
```

## 基本函式 (Base Methods)
* initialize(): 初始化物件。
* getResults(options): 開始爬資料，options.board: 欲爬的巴哈版名編號，options.pages: 要爬幾頁，options.skipTPs: 是否忽略置頂文。
* close(): 關閉物件。

## 參考網站 (Reference)
* [puppeteer](https://github.com/GoogleChrome/puppeteer)
* [巴哈姆特](https://www.gamer.com.tw/)

## 貢獻一己之力 (Contribution)
baha-crawler 雖然是一個小模組，但本人還是希望這個專案能夠持續進步！若有發現臭蟲(bug)或問題，請幫忙在Issue留言告知詳細情形。  
歡迎共同開發。歡迎Pull Request，謝謝。:)  
