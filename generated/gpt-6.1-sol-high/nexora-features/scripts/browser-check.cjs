const { chromium } = require('/app/node_modules/playwright-core')
const fs = require('node:fs')
const assert = require('node:assert/strict')
;(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] })
  const checks = []
  for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: name === 'mobile', hasTouch: name === 'mobile' })
    const page = await context.newPage()
    const errors = [], failed = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('requestfailed', req => failed.push({ url: req.url(), error: req.failure() }))
    page.on('response', res => { if (res.status() >= 400) errors.push(`${res.status()} ${res.url()}`) })
    await page.goto('http://127.0.0.1:3000/motionsites-results/nexora-features/', { waitUntil: 'networkidle' })
    await page.waitForSelector('article')
    await page.waitForFunction(() => [...document.querySelectorAll('video')].every(v => v.readyState >= 2 && !v.paused && v.videoWidth > 0), { timeout: 30000 })
    const times = await page.locator('video').evaluateAll(videos => videos.map(v => v.currentTime))
    await page.waitForTimeout(700)
    const layout = await page.evaluate(() => ({
      viewport: { width: innerWidth, height: innerHeight },
      scrollWidth: document.documentElement.scrollWidth,
      background: getComputedStyle(document.body).backgroundColor,
      font: getComputedStyle(document.body).fontFamily,
      cards: [...document.querySelectorAll('article')].map(c => { const r = c.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, background: getComputedStyle(c).backgroundColor, radius: getComputedStyle(c).borderRadius } }),
      videos: [...document.querySelectorAll('video')].map(v => ({ src: v.currentSrc, time: v.currentTime, width: v.videoWidth, height: v.videoHeight, muted: v.muted, loop: v.loop, autoplay: v.autoplay, playsInline: v.playsInline, opacity: getComputedStyle(v).opacity, error: v.error?.message || null })),
    }))
    assert.equal(layout.scrollWidth, width, `${name} horizontal overflow`)
    assert.equal(layout.cards.length, 4)
    assert.equal(layout.background, 'rgb(0, 0, 0)')
    assert(layout.videos.every((v,i) => v.time > times[i] && v.muted && v.loop && v.autoplay && v.playsInline && v.opacity === '1' && !v.error))
    if (name === 'desktop') {
      assert(layout.cards[0].height > layout.cards[1].height)
      assert(layout.cards[1].width > layout.cards[0].width * 1.9)
      const button = page.getByRole('button', { name: 'Start Using Nexora' }).first()
      await button.hover()
      await page.waitForTimeout(250)
      const scale = await button.evaluate(el => getComputedStyle(el).scale)
      assert.equal(scale, '1.02')
      await button.click()
      await button.focus()
      await page.keyboard.press('Enter')
      await page.getByRole('button', { name: 'Start Using Nexora' }).nth(1).click()
      await page.mouse.move(0,0)
      await page.waitForTimeout(200)
      layout.buttonHoverScale = scale
    } else {
      assert(layout.cards.every(c => c.x === 24 && c.width === 342))
      await page.getByRole('button', { name: 'Start Using Nexora' }).first().tap()
    }
    // Freeze a consistent moment only for the screenshots; normal page playback remains automatic.
    await page.locator('video').evaluateAll(async videos => { await Promise.all(videos.map(v => new Promise(resolve => { v.pause(); v.addEventListener('seeked', resolve, { once: true }); v.currentTime = Math.min(1.5, v.duration / 2) }))) })
    await page.evaluate(() => scrollTo(0,0))
    await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true })
    assert.deepEqual(errors, [], `${name} browser errors`)
    assert.deepEqual(failed, [], `${name} failed requests`)
    checks.push({ name, status: 'passed', ...layout, errors, failedRequests: failed })
    await context.close()
  }
  fs.writeFileSync('browser-checks.json', JSON.stringify(checks, null, 2) + '\n')
  await browser.close()
  console.log('Desktop and mobile browser checks passed; screenshots saved.')
})().catch(error => { console.error(error); process.exit(1) })
