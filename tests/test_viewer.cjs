// Run against an isolated demo server. Requires Playwright and Chromium.
// TEST_UI_PASSWORD, TEST_BASE_URL, optional TEST_CAPTURE_DIR.
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.TEST_BROWSER_PATH?{executablePath:process.env.TEST_BROWSER_PATH}:{})});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1100}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.TEST_BASE_URL || 'http://127.0.0.1:8091');
  await page.locator('#username').fill(process.env.TEST_UI_USER || 'pimientero');
  await page.locator('#password').fill(process.env.TEST_UI_PASSWORD);
  await page.locator('#loginButton').click();
  await page.locator('#workspace').waitFor({state:'visible'});
  await page.waitForFunction(()=>document.querySelector('#eventImage').getAttribute('href'));
  await page.locator('#scenario').selectOption('Golpes');
  async function generate(){
   const previous=await page.locator('#eventImage').getAttribute('data-event-id');
   await page.locator('#simulate').click();
   await page.waitForFunction(old=>document.querySelector('#eventImage').dataset.eventId!==old,previous);
   const href=await page.locator('#eventImage').getAttribute('href');
   // Decode the exact image loaded by the SVG viewer before taking evidence.
   await page.evaluate(src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=reject;img.src=src;}),href);
   return {href,id:await page.locator('#eventImage').getAttribute('data-event-id'),pixels:await page.locator('#inspectionSvg').screenshot()};
  }
  const capture=process.env.TEST_CAPTURE_DIR;
  if(capture)fs.mkdirSync(capture,{recursive:true});
  const first=await generate();
  if(capture)await page.locator('.inspection-grid').screenshot({path:path.join(capture,'inspeccion-antes.png')});
  const second=await generate();
  assert.notEqual(first.id,second.id);
  assert.notEqual(first.href,second.href);
  assert.ok(!first.pixels.equals(second.pixels),'Rendered image pixels must change');
  assert.equal(await page.locator('#eventImage').getAttribute('data-source'),'SIMULADA');
  assert.ok((await page.locator('#inspectionSvg').getAttribute('aria-label')).includes('no es una captura real de IMACASA'));
  if(capture)await page.locator('.inspection-grid').screenshot({path:path.join(capture,'inspeccion-despues.png')});
  // A poll with no new event must retain the same image.
  await page.waitForTimeout(3200);
  assert.equal(await page.locator('#eventImage').getAttribute('href'),second.href);
  await page.locator('#zoomIn').click();
  assert.equal(await page.locator('#zoomValue').textContent(),'130 %');
  await page.locator('#rotateView').click();
  assert.ok((await page.locator('#inspectionObject').getAttribute('transform')).includes('rotate(90)'));
  await page.locator('#focusDefect').click();
  assert.notEqual(await page.locator('#zoomValue').textContent(),'100 %');
  await page.locator('#resetView').click();
  while(await page.locator('#zoomIn').isEnabled())await page.locator('#zoomIn').click();
  assert.equal(await page.locator('#zoomValue').textContent(),'500 %');
  const beforePan=await page.locator('#inspectionSvg').getAttribute('viewBox');
  await page.locator('#inspectionSvg').focus();await page.keyboard.press('ArrowRight');
  assert.notEqual(await page.locator('#inspectionSvg').getAttribute('viewBox'),beforePan);
  await page.locator('#toggleMarker').click();
  assert.equal(await page.locator('#toggleMarker').getAttribute('aria-pressed'),'false');
  await page.locator('#resetView').click();
  assert.equal(await page.locator('#zoomValue').textContent(),'100 %');
  await page.evaluate(()=>window.inspector.update(null));
  assert.equal(await page.locator('#eventImage').getAttribute('href'),null);
  assert.ok(await page.locator('#imageEmpty').isVisible());
  assert.deepEqual(errors,[]);
  console.log('PASS browser: repeated inspections change decoded image and pixels; polling stable; zoom/rotation/focus/empty state preserved');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
