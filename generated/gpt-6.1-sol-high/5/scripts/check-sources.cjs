// Separate, deliberately intercepted SOURCE-HANDLER tests. No claim of original playback.
const fs=require('fs');
const assert=require('node:assert/strict');
const {start}=require('./browser-helpers.cjs');
(async()=>{
 const app=await start();
 const report={originalPlayback:'unavailable; not tested as restored',fixtureOnly:true};
 try {
  const generator=await app.browser.newPage();
  const fixture=Buffer.from(await generator.evaluate(async()=>{
   const c=document.createElement('canvas');c.width=64;c.height=36;const ctx=c.getContext('2d');
   const stream=c.captureStream(15);const recorder=new MediaRecorder(stream,{mimeType:'video/webm'});const chunks=[];
   recorder.ondataavailable=e=>chunks.push(e.data);const done=new Promise(r=>recorder.onstop=r);recorder.start();
   for(let i=0;i<12;i++){ctx.fillStyle=i%2?'#c967e8':'#983ad6';ctx.fillRect(0,0,64,36);await new Promise(r=>setTimeout(r,80))}
   recorder.stop();await done;stream.getTracks().forEach(t=>t.stop());return Array.from(new Uint8Array(await new Blob(chunks).arrayBuffer()));
  }));await generator.close();
  for(const mode of ['hls-fallback','native-selection-fallback','no-hls-support-fallback','both-unavailable']) {
   const page=await app.browser.newPage();const attempts={hls:0,fallback:0};
   if(mode==='native-selection-fallback'||mode==='no-hls-support-fallback') {
    await page.addInitScript(native=>{
     Object.defineProperty(window,'MediaSource',{value:undefined});Object.defineProperty(window,'ManagedMediaSource',{value:undefined});
     const original=HTMLMediaElement.prototype.canPlayType;
     HTMLMediaElement.prototype.canPlayType=function(type){return type==='application/vnd.apple.mpegurl'?(native?'probably':''):original.call(this,type)};
    },mode==='native-selection-fallback');
   }
   await page.route('**/manifest/video.m3u8',r=>{attempts.hls++;return r.fulfill({status:404,body:'Explicit test failure, not original footage'})});
   await page.route('**/_videos/v1/**',r=>{attempts.fallback++;return r.fulfill(mode==='both-unavailable'?{status:404,body:'Explicit test failure'}:{status:200,contentType:'video/webm',body:fixture})});
   await page.goto(app.url+'?media=original',{waitUntil:'networkidle'});
   if(mode==='both-unavailable') {
    await page.waitForFunction(()=>document.querySelector('.hero-media').dataset.playbackStatus==='failed');
    await page.waitForTimeout(1200);assert.deepEqual(attempts,{hls:1,fallback:1});
    report[mode]={attempts,cssApproximationVisible:await page.locator('.hero-media').getAttribute('data-media-status')==='unavailable',controlsHidden:await page.locator('.playback').count()===0};
    assert.equal(report[mode].cssApproximationVisible,true);assert.equal(report[mode].controlsHidden,true);
   } else {
    await page.waitForFunction(()=>document.querySelector('video')?.readyState>=2);
    await page.waitForTimeout(100);
    const result={attempts,fixtureLoaded:await page.locator('video').evaluate(v=>v.readyState>=2),fixturePlaying:await page.locator('video').evaluate(v=>!v.paused)};
    await page.getByRole('button',{name:'Pause background video'}).click();result.pauseWorks=await page.locator('video').evaluate(v=>v.paused);
    await page.getByRole('button',{name:'Play background video'}).click();await page.waitForTimeout(100);result.resumeWorks=await page.locator('video').evaluate(v=>!v.paused);
    assert.deepEqual(attempts,{hls:mode==='no-hls-support-fallback'?0:1,fallback:1});
    for(const key of ['fixtureLoaded','fixturePlaying','pauseWorks','resumeWorks'])assert.equal(result[key],true);
    report[mode]=result;
   }
   await page.close();
  }
  report.passed=true;
 } finally {fs.writeFileSync('/work/screenshots/source-handler-checks.json',JSON.stringify(report,null,2)+'\n');await app.close();}
 console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
