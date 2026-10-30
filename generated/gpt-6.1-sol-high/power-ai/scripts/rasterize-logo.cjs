const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
(async () => {
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const page = await browser.newPage({viewport:{width:248,height:64},deviceScaleFactor:2});
 await page.setContent('<style>body{margin:0;background:transparent}svg{display:block}</style>'+fs.readFileSync('src/assets/logo-source.svg','utf8'));
 await page.screenshot({path:'src/assets/logo.png',omitBackground:true});
 await browser.close();
})();
