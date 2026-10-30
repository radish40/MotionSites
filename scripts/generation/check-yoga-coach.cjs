// Verify the published HLS transition and all three independent card players.
const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const assert = require('node:assert/strict');
async function until(page, predicate, arg, timeout=30000) {
  const start=Date.now();
  while (Date.now()-start<timeout) {
    if (await page.evaluate(predicate,arg)) return;
    await page.waitForTimeout(200);
  }
  throw new Error(`Condition timed out: ${predicate}`);
}

(async () => {
  const [url, output] = process.argv.slice(2);
  assert(url && output, 'Usage: URL OUTPUT_JSON');
  const report = {url, checked_utc:new Date().toISOString(), passed:false, results:[]};
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
  try {
    for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page = await browser.newPage({viewport:{width,height},isMobile:name==='mobile',hasTouch:name==='mobile'});
      const errors = [];
      page.on('pageerror', error=>errors.push(error.message));
      await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
      await until(page,()=>document.querySelector('video').readyState>=3,undefined,60000);
      await page.getByRole('button',{name:"LET'S START"}).click();
      // Allow the real five-second clip to end; do not seek or synthesize events.
      await until(page,()=>document.querySelector('video').ended);
      await until(page,()=>{
        const section=document.querySelector('section');
        return !section.inert && Math.abs(section.getBoundingClientRect().top)<1;
      });
      const cards = [];
      for (let i=1;i<=3;i++) {
        const card = page.getByRole('button',{name:`Preview yoga session ${i}`,exact:true});
        if (name==='desktop') {
          const box=await card.boundingBox();
          await card.hover({position:{x:box.width*(i===1?.22:i===3?.78:.5),y:box.height*.5}});
        } else {
          // Keyboard focus also works on the touch layout and avoids occluded card centers.
          await card.focus();
        }
        await until(page,index=>{
          const video=document.querySelectorAll('video')[index];
          return !video.paused && video.currentTime>.1 && video.videoWidth>0;
        },i,20000);
        const playing=await card.locator('video').evaluate(v=>({width:v.videoWidth,height:v.videoHeight,currentTime:v.currentTime,paused:v.paused}));
        await page.mouse.move(5,5);
        await page.getByRole('button',{name:'BACK TO START'}).focus();
        await until(page,index=>{
          const video=document.querySelectorAll('video')[index];
          return video.paused && video.currentTime===0;
        },i);
        cards.push({index:i,interaction:name==='desktop'?'pointer hover':'keyboard focus in mobile viewport',playing,pausedAndRewound:true});
      }
      await page.getByRole('button',{name:'BACK TO START'}).click();
      await until(page,()=>{
        const video=document.querySelector('video');
        return video.paused && video.currentTime===0 && document.querySelector('section').inert;
      });
      const overflow=await page.evaluate(()=>({x:document.documentElement.scrollWidth-innerWidth,y:document.documentElement.scrollHeight-innerHeight}));
      assert(overflow.x<=3 && overflow.y<=3);
      assert.deepEqual(errors,[]);
      report.results.push({viewport:name,naturalVideoEnd:true,collectionTransition:true,cards,backReset:true,overflow,errors});
      await page.close();
    }
    report.passed=true;
  } finally {
    await browser.close();
    fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
  }
  console.log(JSON.stringify({url,passed:report.passed,viewports:report.results.length}));
})().catch(error=>{console.error(error);process.exitCode=1;});
