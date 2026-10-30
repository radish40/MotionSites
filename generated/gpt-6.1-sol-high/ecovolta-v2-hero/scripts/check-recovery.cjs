const {chromium}=require('/app/node_modules/playwright-core');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage();
 let requests=0;
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://stream.mux.com/*.m3u8',route=>{requests++;return requests===1?route.abort('failed'):route.continue();});
 await page.goto('http://127.0.0.1:4173/motionsites-results/ecovolta-v2-hero/');
 await page.waitForFunction(()=>document.querySelector('video').currentTime>0,null,{timeout:40000});
 const video=await page.locator('video').evaluate(v=>({time:v.currentTime,width:v.videoWidth,paused:v.paused}));
 if(requests<2||errors.length) throw Error('Recovery failed');
 const result={status:'passed',scenario:'Abort initial Mux manifest request; verify automatic retry and real playback',manifestRequests:requests,video,errors};
 fs.writeFileSync('screenshots/recovery-check.json',JSON.stringify(result,null,2));
 console.log(JSON.stringify(result));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
