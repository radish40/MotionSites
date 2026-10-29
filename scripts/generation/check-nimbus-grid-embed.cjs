const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

(async () => {
  const [url, output] = process.argv.slice(2);
  if (!url || !output) throw Error('URL and output directory required');
  fs.mkdirSync(output, {recursive:true});
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
  const results = [];
  try {
    for (const [name, viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]) {
      const context = await browser.newContext({viewport,deviceScaleFactor:1});
      const page = await context.newPage();
      page.setDefaultTimeout(60000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      try {
        const response = await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
        await page.waitForTimeout(10000);
        const frame = page.frames().find(f => f.url().startsWith('https://fragcoord.xyz/embed/c6zisyc6'));
        if (!frame) throw Error('Required FragCoord frame not found');
        const canvas = frame.locator('canvas').first();
        await canvas.waitFor({state:'visible'});
        const gl = await canvas.evaluate(c => {
          const context = c.getContext('webgl2') || c.getContext('webgl');
          return {width:c.width,height:c.height,supported:!!context,lost:context?.isContextLost(),version:context?.getParameter(context.VERSION)};
        });
        const box = await canvas.boundingBox();
        const visible = !!box && box.width>0 && box.height>0 && box.y<viewport.height && box.y+box.height>0;
        const first = await canvas.screenshot({path:path.join(output,name+'-shader-first.png')});
        await page.waitForTimeout(1500);
        let second = await canvas.screenshot({path:path.join(output,name+'-shader-second.png')});
        if (first.equals(second)) {
          await page.waitForTimeout(3000);
          second = await canvas.screenshot({path:path.join(output,name+'-shader-second.png')});
        }
        const changingFrames = !first.equals(second);
        results.push({viewport:name,status:response.status(),frame:frame.url(),gl,visible,changingFrames,errors,
          first_sha256:crypto.createHash('sha256').update(first).digest('hex'),
          second_sha256:crypto.createHash('sha256').update(second).digest('hex'),
          passed:response.status()===200 && gl.supported && !gl.lost && gl.width>0 && gl.height>0 && visible && changingFrames && !errors.length});
      } catch (error) { results.push({viewport:name,passed:false,error:String(error),errors}); }
      await context.close();
    }
  } finally { await browser.close(); }
  const report = {url,checked_at:new Date().toISOString(),passed:results.every(r=>r.passed),results};
  fs.writeFileSync(path.join(output,'embed-check.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report));
  if (!report.passed) process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
