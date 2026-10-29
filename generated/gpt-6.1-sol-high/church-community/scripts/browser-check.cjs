const { chromium } = require("/app/node_modules/playwright-core");
const fs = require("fs");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const checks = [];
  const errors = [],
    failed = [];
  for (const [label, width, height] of [
    ["desktop", 1440, 1000],
    ["mobile", 390, 844],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("requestfailed", (r) => failed.push(r.url()));
    await page.goto(
      "http://127.0.0.1:4173/motionsites-results/church-community/",
      { waitUntil: "networkidle" },
    );
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `screenshots/${label}.png`, fullPage: true });
    const metrics = await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
      phones: [...document.querySelectorAll('[data-testid^="phone-"]')].map(
        (e) => {
          let r = e.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height };
        },
      ),
      images: [...document.images]
        .filter((i) => !i.complete || !i.naturalWidth)
        .map((i) => i.src),
    }));
    assert.equal(metrics.scroll, width, "no viewport overflow");
    assert.equal(metrics.phones.length, 3);
    if (label === "mobile") {
      for (const phone of metrics.phones) {
        assert.ok(phone.x >= 19 && phone.x + phone.width <= width - 19, "scaled phone fits mobile width");
      }
      assert.ok(Math.abs(metrics.phones[1].y - metrics.phones[0].y - metrics.phones[0].height - 32) < 1, "32px mobile gap");
    } else {
      assert.equal(metrics.phones[0].width, 379);
      assert.equal(metrics.phones[0].height, 816);
      assert.equal(metrics.phones[1].x - metrics.phones[0].x - metrics.phones[0].width, 48);
    }

    assert.equal(metrics.images.length, 0);
    for (let i = 0; i < 3; i++) {
      let phone = page.getByTestId(`phone-${i + 1}`);
      await phone
        .getByRole("button", { name: "Open menu", exact: true })
        .click();
      await phone
        .getByRole("button", { name: "Close menu", exact: true })
        .waitFor();
      await phone
        .getByRole("button", { name: "Close menu", exact: true })
        .click();
      await phone
        .getByRole("button", { name: "Open menu", exact: true })
        .click();
      await phone.getByRole("button", { name: "Events", exact: true }).click();
      await phone
        .getByRole("button", { name: "Play Sunday sermon", exact: true })
        .click();
      await phone
        .getByText("The sermon recording is not available in this preview.", {
          exact: true,
        })
        .first()
        .waitFor();
      await phone.getByRole("button", { name: "Back", exact: true }).click();
      await phone
        .getByRole("button", { name: "Open menu", exact: true })
        .click();
      await phone.getByRole("button", { name: "Home", exact: true }).click();
      await page.waitForTimeout(250);
      await phone.getByRole("button", { name: "Join us", exact: true }).click();
      await phone.getByRole("button", { name: "Back", exact: true }).click();
      await phone
        .getByRole("button", { name: "Open menu", exact: true })
        .click();
      await phone.getByRole("button", { name: "About", exact: true }).click();
      await phone
        .getByRole("button", {
          name: "Learn more about Sunday Worship Service",
          exact: true,
        })
        .click();
      await phone.getByRole("button", { name: "Back", exact: true }).click();
    }
    const first = page.getByTestId("phone-1");
    await first.getByRole("button", { name: "Open menu", exact: true }).click();
    await page.waitForTimeout(1400);
    if (label === "desktop") await page.screenshot({path:"screenshots/menu.png",fullPage:true});
    await page.keyboard.press("Escape");
    await page.waitForTimeout(250);
    await first.getByRole("button", { name: "Open menu", exact: true }).click();
    await first.getByRole("button", { name: "Contact", exact: true }).click();
    await first.getByRole("button", { name: "Back", exact: true }).click();
    await first.getByRole("button", { name: "Open menu", exact: true }).click();
    await first.getByRole("button", { name: "Sermons", exact: true }).click();
    await first.getByRole("button", { name: "Play Sunday sermon", exact: true }).waitFor();
    checks.push({
      viewport: label,
      dimensions: `${width}x${height}`,
      status: "passed",
      metrics,
      interactions:
        "All three menus open/close; Home, About, Events, Sermons, Contact links; Escape dismiss; sermon, Join us, Learn more and Back controls",
    });
    await page.close();
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(failed, []);
  fs.writeFileSync(
    "screenshots/browser-checks.json",
    JSON.stringify(
      { checks, script_errors: errors, failed_requests: failed },
      null,
      2,
    ),
  );
  await browser.close();
  console.log(
    JSON.stringify(
      { checks, script_errors: errors, failed_requests: failed },
      null,
      2,
    ),
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
