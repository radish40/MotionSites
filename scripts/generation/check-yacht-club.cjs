const {chromium}=require('/app/node_modules/playwright-core');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
  const output=process.argv[2]||'/work/.work/generation/yacht-club-public';
  fs.mkdirSync(output,{recursive:true});
  const report={checked_utc:new Date().toISOString(),url:'https://tool.luo-xd.com/motionsites-results/yacht-club-hero/',viewports:[]};
  const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
  const state=v=>({src:v.currentSrc,time:v.currentTime,duration:v.duration,readyState:v.readyState,width:v.videoWidth,paused:v.paused,error:v.error?.message||null});
  try {
    for(const [name,width,height,touch] of [['desktop',1440,1000,false],['mobile',390,844,true]]){
      const context=await browser.newContext({viewport:{width,height},isMobile:touch,hasTouch:touch});
      const page=await context.newPage();
      const row={name,errors:[],networkFailures:[],frames:[],fleet:[]};report.viewports.push(row);
      page.on('pageerror',e=>row.errors.push(e.message));
      page.on('requestfailed',r=>row.networkFailures.push({url:r.url(),error:r.failure()?.errorText}));
      const response=await page.goto(report.url,{waitUntil:'domcontentloaded',timeout:90000});assert.equal(response.status(),200);
      await page.waitForTimeout(9000);
      assert.equal(await page.locator('.ripple').count(),80);
      row.heroBefore=await page.locator('.background-fallback').evaluate(state);
      await page.waitForTimeout(1500);
      row.heroAfter=await page.locator('.background-fallback').evaluate(state);
      assert(row.heroAfter.width>0&&row.heroAfter.readyState>=2&&!row.heroAfter.paused);
      assert(row.heroAfter.time!==row.heroBefore.time);
      row.originalIframe=await page.locator('.vimeo-background').evaluate(e=>({src:e.src,visibility:getComputedStyle(e).visibility}));
      for(const frame of page.frames().slice(1)){
        try {row.frames.push(await frame.evaluate(()=>({url:location.href,title:document.title,text:document.body?.innerText.slice(0,1500),videos:[...document.querySelectorAll('video')].map(v=>({time:v.currentTime,readyState:v.readyState,width:v.videoWidth,paused:v.paused}))})));}
        catch(e){row.frames.push({url:frame.url(),inspectionError:e.message});}
      }
      row.originalPlaybackVerified=row.originalIframe.visibility==='visible'&&row.frames.some(f=>f.videos?.some(v=>v.width>0&&v.readyState>=2&&v.time>0&&!v.paused));
      await page.screenshot({path:output+'/'+name+'-hero.png'});
      await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.waitForTimeout(1800);
      assert.equal(await page.locator('.menu-item').count(),6);
      await page.screenshot({path:output+'/'+name+'-menu.png'});
      await page.getByRole('button',{name:'Our Fleet',exact:false}).click();await page.waitForTimeout(2400);
      assert(await page.locator('.fleet-overlay').isVisible());
      for(let i=0;i<3;i++){
        const card=page.locator('.fleet-video').nth(i);await card.scrollIntoViewIfNeeded();
        if(!touch){await card.hover();await page.waitForTimeout(1000);assert.equal(await card.locator('dl>div').count(),5);}
        const video=card.locator('video');
        if(touch) await card.locator('.mobile-view').click();
        else await card.getByRole('button',{name:'VIEW ↗',exact:true}).click();
        const dialog=page.getByRole('dialog');await dialog.waitFor();await page.waitForTimeout(1200);
        const before=await dialog.locator('video').evaluate(state);await page.waitForTimeout(1400);const after=await dialog.locator('video').evaluate(state);
        assert(after.width>0&&after.readyState>=2&&!after.paused&&before.time!==after.time);
        assert.equal(await dialog.locator('dl>div').count(),5);
        row.fleet.push({index:i,before,after});
        await page.screenshot({path:output+'/'+name+'-vessel-'+i+'.png'});
        await page.keyboard.press('Escape');await dialog.waitFor({state:'detached'});
        if(!touch){await page.mouse.move(0,0);await card.hover();await page.waitForTimeout(300);const before=await video.evaluate(state);await page.waitForTimeout(900);const after=await video.evaluate(state);assert(!after.paused&&after.time!==before.time);row.fleet[i].hoverPlayback={before,after};}
      }
      await page.locator('.fleet-overlay').evaluate(e=>e.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(500);
      await page.screenshot({path:output+'/'+name+'-fleet.png'});
      row.widths=await page.evaluate(()=>[innerWidth,document.documentElement.scrollWidth]);assert(row.widths[1]<=row.widths[0]+3);
      await page.getByRole('button',{name:'BACK TO THE OCEAN',exact:false}).click();await page.waitForTimeout(1500);
      assert(await page.locator('h1').isVisible());
      await context.close();
      fs.writeFileSync(output+'/report.json',JSON.stringify(report,null,2)+'\n');
      console.log(JSON.stringify({name,originalPlaybackVerified:row.originalPlaybackVerified,fleetVerified:row.fleet.length,errors:row.errors}));
    }
    report.original_playback_verified=report.viewports.every(v=>v.originalPlaybackVerified);
    report.fallback_and_fleet_passed=true;
    report.limitation=report.original_playback_verified?null:'Original Vimeo playback was not verified. Exact embed retained; original supplied fleet MP4 provides an explicitly documented visual approximation.';
    fs.writeFileSync(output+'/report.json',JSON.stringify(report,null,2)+'\n');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
