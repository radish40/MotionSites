import { createRequire } from 'node:module'
import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import { extname, resolve } from 'node:path'
import assert from 'node:assert/strict'
import { calculatePrice, calculateAgencyCost, calculateFreelancerCost } from '../src/pricing.js'

const require = createRequire('/app/package.json')
const { chromium } = require('playwright-core')
const prefix = '/motionsites-results/price-calculator/'
const root = resolve('dist')
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' }
const server = createServer(async (req, res) => {
  try {
    if (!req.url.startsWith(prefix)) { res.writeHead(404); return res.end() }
    const name = decodeURIComponent(req.url.split('?')[0].slice(prefix.length)) || 'index.html'
    const file = resolve(root, name)
    if (!file.startsWith(root + '/')) throw new Error('Invalid path')
    const body = await readFile(file)
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' })
    res.end(body)
  } catch { res.writeHead(404); res.end() }
})
await new Promise((done) => server.listen(4173, '0.0.0.0', done))
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] })
const errors = []
const failedRequests = []
const checks = []
try {
  let combinations = 0
  for (const serviceType of ['design', 'development', 'both']) {
    for (let pages = 1; pages <= 30; pages++) {
      for (const needContent of [false, true]) for (const needSEO of [false, true]) {
        for (const timeline of ['regular', 'fast', 'rush']) {
          const state = { serviceType, pages, needContent, needSEO, timeline }
          const base = { design: 399, development: 199, both: 499 }[serviceType]
          const expected = base + (pages - 1) * (serviceType === 'both' ? 200 : 100) + pages * ((needContent ? 50 : 0) + (needSEO ? 50 : 0) + { regular: 0, fast: 25, rush: 100 }[timeline])
          assert.equal(calculatePrice(state), expected)
          assert.equal(calculateAgencyCost(state), 8000 + (pages - 1) * (serviceType === 'both' ? 1000 : 400))
          assert.equal(calculateFreelancerCost(state), 3000 + (pages - 1) * (serviceType === 'both' ? 500 : 200))
          combinations++
        }
      }
    }
  }
  checks.push(`All three pricing formulas pass across ${combinations} input combinations`)
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 })
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('requestfailed', (request) => failedRequests.push(request.url()))
  page.on('response', (response) => { if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`) })
  await page.goto(`http://127.0.0.1:4173${prefix}`, { waitUntil: 'networkidle' })
  const price = async (testid, expected) => assert.equal(await page.getByTestId(testid).textContent(), expected)
  await price('studio-price', '$1,299')
  await price('agency-price', '$12,000')
  await price('freelancer-price', '$5,000')
  await page.getByRole('radio', { name: 'Only Design', exact: true }).check()
  await price('studio-price', '$799')
  await price('agency-price', '$9,600')
  await price('freelancer-price', '$3,800')
  await page.getByRole('radio', { name: 'Only Development', exact: true }).check()
  await price('studio-price', '$599')
  const content = page.getByRole('checkbox', { name: /I will need help with content/ })
  const seo = page.getByRole('checkbox', { name: /I want to optimize/ })
  await content.check()
  await price('studio-price', '$849')
  await seo.check()
  await price('studio-price', '$1,099')
  await page.getByRole('radio', { name: /Within 7 Days/ }).check()
  await price('studio-price', '$1,599')
  await page.getByRole('radio', { name: /Within 14 Days/ }).check()
  await price('studio-price', '$1,224')
  const slider = page.getByRole('slider')
  await slider.focus()
  await page.keyboard.press('End')
  assert.equal(await slider.getAttribute('aria-valuenow'), '30')
  await price('studio-price', '$6,849')
  await page.keyboard.press('Home')
  assert.equal(await slider.getAttribute('aria-valuenow'), '1')
  await price('studio-price', '$324')
  await page.keyboard.press('ArrowRight')
  await price('studio-price', '$549')
  const track = await page.locator('.slider-track').boundingBox()
  await page.mouse.click(track.x + track.width * .5, track.y + track.height / 2)
  assert.ok(Number(await slider.getAttribute('aria-valuenow')) >= 15)
  checks.push('Desktop: service radios, both add-ons, rush/fast timelines, slider pointer and keyboard/bounds update prices correctly')
  await page.reload({ waitUntil: 'networkidle' })
  const overflow = () => page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  assert.equal(await overflow(), false)
  assert.equal(await page.locator('.calculator-grid').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length), 2)
  await page.screenshot({ path: 'screenshots/desktop.png', fullPage: true })
  checks.push('Desktop 1440×1000: two columns, no horizontal overflow; full-page screenshot saved')
  await page.setViewportSize({ width: 390, height: 844 })
  assert.equal(await overflow(), false)
  assert.equal(await page.locator('.calculator-grid').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length), 1)
  await page.getByRole('radio', { name: 'Only Design', exact: true }).check()
  await content.check()
  await price('studio-price', '$1,049')
  await page.getByRole('radio', { name: /Within 7 Days/ }).check()
  await price('studio-price', '$1,549')
  await page.reload({ waitUntil: 'networkidle' })
  await page.screenshot({ path: 'screenshots/mobile.png', fullPage: true })
  checks.push('Mobile 390×844: stacked layout, working service/add-on/timeline controls, no horizontal overflow; full-page screenshot saved')
  for (const width of [320, 768, 1024, 1280, 1920]) {
    await page.setViewportSize({ width, height: 1000 })
    assert.equal(await overflow(), false, `Overflow at ${width}px`)
  }
  checks.push('Additional responsive checks: no horizontal overflow at 320, 768, 1024, 1280 and 1920px')
  assert.deepEqual(errors, [])
  assert.deepEqual(failedRequests, [])
  checks.push('No browser script/console errors or failed resource requests')
  await writeFile('screenshots/checks.json', JSON.stringify({ passed: true, checks, errors, failedRequests }, null, 2) + '\n')
  console.log(JSON.stringify({ passed: true, checks, errors, failedRequests }, null, 2))
} finally {
  await browser.close()
  server.close()
}
