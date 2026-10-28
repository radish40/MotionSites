const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const fs=require('node:fs'),assert=require('node:assert/strict');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const qa=path.join(root,'qa');fs.mkdirSync(qa,{recursive:true});
(async()=>{
const data=JSON.parse(fs.readFileSync(root+'/dist/data/catalog-meta.json'));
const details=JSON.parse(fs.readFileSync(root+'/dist/data/catalog-details.json'));
const lite=JSON.parse(fs.readFileSync(root+'/dist/data/catalog-lite.json'));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('https://static.cloudflareinsights.com/beacon.min.js/'))errors.push(m.text());});
page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
const until=async fn=>{for(let i=0;i<100;i++){if(await page.evaluate(fn))return;await new Promise(r=>setTimeout(r,200));}throw Error('Timeout '+fn+' ERRORS '+JSON.stringify(errors));};
if(!process.env.LIVE)await context.route('https://tool.luo-xd.com/motionsites-preview/**',route=>{
const rel=new URL(route.request().url()).pathname.replace('/motionsites-preview/','')||'index.html';
return route.fulfill({path:root+'/dist/'+decodeURIComponent(rel),headers:{'Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; media-src 'self'; connect-src 'self';"}});
});
await page.goto('https://tool.luo-xd.com/motionsites-preview/');
await until(()=>document.querySelectorAll('.card[data-id]').length===380);
assert.equal(await page.locator('#stat-text').textContent(),'601');
for(const source of ['gallery','original','library']){
await page.locator('#source').selectOption(source);
assert.equal(Number(await page.locator('#count b').textContent()),lite.sourceCounts[source]);
}
await page.locator('#source').selectOption('');
await page.locator('#media').selectOption('video');
assert.equal(Number(await page.locator('#count b').textContent()),134);
await page.locator('.card[data-id]').first().click();
await until(()=>{const v=document.querySelector('#preview video');return v&&v.readyState>=2;});
await page.locator('#close').click();await page.locator('#media').selectOption('');
await until(()=>document.querySelectorAll('.card[data-id]').length===380);
await page.locator('.card[data-id="codercrest-hero"]').click();
await until(()=>document.querySelector('#prompt').dataset.mode==='prompt');
const versions=details['codercrest-hero'].variants;
assert.equal(await page.locator('#variant-choice option').count(),versions.length);
for(let i=0;i<versions.length;i++){
await page.locator('#variant-choice').selectOption(String(i));
await until(()=>document.querySelector('#prompt').dataset.mode==='prompt');
const expected=fs.readFileSync(root+'/dist/data/'+versions[i].text_path,'utf8');
assert.equal(await page.locator('#prompt').textContent(),expected);
await page.locator('#copy').click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),expected);
}
const downloadPromise=page.waitForEvent('download');await page.locator('#download').click();
const download=await downloadPromise;await download.saveAs(qa+'/download.md');
assert.ok(fs.readFileSync(qa+'/download.md','utf8').includes(fs.readFileSync(root+'/dist/data/'+versions.at(-1).text_path,'utf8')));
await page.locator('#close').click();
await page.locator('#media').selectOption('art');assert.equal(Number(await page.locator('#count b').textContent()),53);
await page.locator('.card[data-id]').first().click();await until(()=>document.querySelector('#prompt').dataset.mode==='prompt');
assert.ok((await page.locator('#preview').textContent()).includes('暂无预览'));
await page.locator('#close').click();await page.locator('#media').selectOption('');
await page.locator('#q').fill('cursor-following');
await until(()=>document.querySelector('#search-status').textContent===''&&Number(document.querySelector('#count b').textContent)>0&&Number(document.querySelector('#count b').textContent)<380);
await page.locator('#q').fill('');await until(()=>document.querySelectorAll('.card[data-id]').length===380);
await until(()=>Array.from(document.querySelectorAll('.card img')).filter(i=>i.naturalWidth>0).length>=4);
await page.screenshot({path:qa+'/desktop.png'});
await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await page.screenshot({path:qa+'/mobile.png'});
await page.locator('.card[data-id]').first().click();await until(()=>document.querySelector('#prompt').dataset.mode==='prompt');
assert.ok(await page.locator('#dlg').evaluate(d=>d.getBoundingClientRect().right<=innerWidth));
await page.locator('#close').click();
if(process.env.LIVE){await page.goto('https://tool.luo-xd.com/');await page.locator('a[href="/motionsites-preview/"]').waitFor();assert.ok((await page.locator('a[href="/motionsites-preview/"]').textContent()).includes('合集'));}
assert.deepEqual(errors,[]);console.log('PASS: counts, sources, video, all versions, exact clipboard/export, no-preview entries, full-text search, desktop/mobile'+(process.env.LIVE?', homepage':''));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
