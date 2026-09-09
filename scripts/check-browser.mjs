// Browser smoke checks. Start the local server first; requires Node 22+ and Chrome.
import { spawn } from 'node:child_process';
import { writeFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const dir = await mkdtemp(join(tmpdir(), 'portfolio-check-'));
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const chrome = spawn(chromePath, ['--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-component-update', '--remote-debugging-port=0', `--user-data-dir=${dir}/profile`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
const endpoint = await new Promise((resolve, reject) => {
  let out = ''; const timer = setTimeout(() => { chrome.kill(); reject(new Error('Browser start timeout')); }, 20000);
  chrome.on('error', error => { clearTimeout(timer); reject(error); });
  chrome.stderr.on('data', data => { out += data; const match = out.match(/DevTools listening on (ws:\/\/[^\s]+)/); if (match) { clearTimeout(timer); resolve(match[1]); } });
});
const ws = new WebSocket(endpoint);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let next = 0; const pending = new Map(); const errors = []; const failures = []; const report = [];
ws.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  if (pending.has(data.id)) { pending.get(data.id)(data); pending.delete(data.id); }
  if (data.method === 'Runtime.exceptionThrown') errors.push(data.params.exceptionDetails.text + ': ' + (data.params.exceptionDetails.exception?.description || ''));
  if (data.method === 'Network.responseReceived' && data.params.response.status >= 400) errors.push(`${data.params.response.status}: ${data.params.response.url}`);
});
async function call(method, params = {}, sessionId) {
  const id = ++next;
  const result = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`${method} timed out`)); }, 15000);
    pending.set(id, data => { clearTimeout(timer); resolve(data); });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  if (result.error) throw new Error(JSON.stringify(result.error)); return result.result;
}
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
let sessionId;
const evaluate = async expression => {
  const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, sessionId);
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
};
function check(condition, description) { report.push({ description, passed: Boolean(condition) }); if (!condition) failures.push(description); }
async function shot(name) { const result = await call('Page.captureScreenshot', { format: 'png' }, sessionId); await writeFile(join(dir, name + '.png'), Buffer.from(result.data, 'base64')); }
try {
  const { targetId } = await call('Target.createTarget', { url: 'about:blank' });
  ({ sessionId } = await call('Target.attachToTarget', { targetId, flatten: true }));
  await call('Page.enable', {}, sessionId); await call('Runtime.enable', {}, sessionId); await call('Network.enable', {}, sessionId);
  await call('Page.addScriptToEvaluateOnNewDocument', { source: `
    window.addEventListener('load', () => {
      window.heroLoadTime = performance.now();
      setTimeout(() => {
        const video = document.querySelector('.hero-video');
        const visual = document.querySelector('.plume-visual');
        window.heroWaited = !!video && video.paused && getComputedStyle(visual).opacity === '0';
      }, 500);
    });
    document.addEventListener('playing', event => {
      if (event.target.matches('.hero-video') && !window.heroPlayTime) window.heroPlayTime = performance.now();
    }, true);
  ` }, sessionId);
  const pages = ['/', '/html/index.html', '/html/projects.html', '/html/experience.html', '/html/about.html', '/html/academics.html', '/html/skills.html', '/html/contact.html', '/html/project-swarm-hunt.html', '/html/project-boids-simulation.html', '/html/project-obsidian-sync.html', '/html/project-my-jobscraper.html', '/html/project-university-weather.html', '/html/project-world-pandemic.html', '/html/project-drunk-driving-sensor.html'];
  for (const width of [1440, 390]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 761 }, sessionId);
    for (const page of pages) {
      await call('Page.navigate', { url: base + page }, sessionId); await pause(850);
      const state = await evaluate(`({title:document.title,h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>innerWidth+1,images:[...document.images].filter(i=>i.loading!=='lazy'&&(!i.complete||!i.naturalWidth)).map(i=>i.src),main:!!document.querySelector('main')})`);
      check(state.h1 === 1 && state.main && !state.overflow && state.images.length === 0, `${width}px ${page}: heading, content, images, no horizontal overflow`);
      if (page === '/') {
        await pause(1200); await shot(`home-${width}`);
        check(await evaluate(`document.querySelectorAll('.plume-visual').length===1 && !document.querySelector('[data-scene]') && document.querySelector('.plume-hero').classList.contains('video-ready')`), `${width}px single video scene plays`);
        const entrance = await evaluate(`({hidden:window.heroWaited, delay:window.heroPlayTime-window.heroLoadTime})`);
        check(entrance.hidden && entrance.delay >= 1000, `${width}px smoke stays hidden and waits one second after load (${JSON.stringify(entrance)})`);
        check(await evaluate(`(() => {
          const visual = document.querySelector('.plume-visual').getBoundingClientRect();
          const hero = document.querySelector('.plume-hero').getBoundingClientRect();
          const video = document.querySelector('.hero-video').getBoundingClientRect();
          const nozzleRight = video.right;
          return Math.abs(visual.x)<1 && Math.abs(visual.width-innerWidth)<1 &&
            Math.abs(visual.height-hero.height)<2 && Math.abs(hero.bottom-innerHeight)<2 &&
            Math.abs(nozzleRight-innerWidth)<2 && video.height>=visual.height-1 &&
            video.x<=0 && Math.abs(video.width/video.height-64/33)<.01;
        })()`), `${width}px video fills landing viewport with nozzle aligned to right edge`);
        check(await evaluate(`JSON.stringify([...document.querySelectorAll('main > section')].map(section=>section.id))===JSON.stringify(['landing','about','experience','work','skills','contact'])`), `${width}px requested homepage section order`);
        const firstFrame = await evaluate(`document.querySelector('.hero-video').currentTime`);
        await pause(350);
        check(firstFrame !== await evaluate(`document.querySelector('.hero-video').currentTime`), `${width}px video advances`);
        await evaluate(`document.querySelector('#about').scrollIntoView({behavior:'instant'})`); await pause(700); await shot(`about-${width}`);
        check(await evaluate(`document.querySelector('.hero-video').paused`), `${width}px offscreen video pauses`);
        await evaluate(`document.querySelector('#work').scrollIntoView({behavior:'instant'})`); await pause(700); await shot(`work-${width}`);
        if (width === 1440) {
          await evaluate(`document.querySelector('#experience').scrollIntoView({behavior:'instant'})`); await pause(300); await shot('experience-1440');
          await evaluate(`document.querySelector('#contact').scrollIntoView({behavior:'instant'})`); await pause(300); await shot('contact-1440');
        }
      }
      if (page === '/html/experience.html') {
        await evaluate(`document.querySelector('details summary').click()`);
        check(await evaluate(`document.querySelector('details').open && getComputedStyle(document.querySelector('.experience-detail')).display!=='none'`), `${width}px experience disclosure`);
      }
      if (page === '/html/project-swarm-hunt.html') { await shot(`project-${width}`); }
    }
    if (width === 390) {
      await evaluate(`document.querySelector('.menu-toggle').click()`);
      check(await evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='true' && getComputedStyle(document.querySelector('nav')).display==='flex'`), 'Mobile menu opens');
      await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }, sessionId);
      check(await evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='false' && document.activeElement===document.querySelector('.menu-toggle')`), 'Escape closes menu and restores focus');
    }
  }
  await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }, sessionId);
  await call('Page.navigate', { url: base + '/' }, sessionId); await pause(1100);
  check(await evaluate(`document.body.classList.contains('motion-paused') && !document.querySelector('.decode-active') && document.querySelector('.motion-toggle').disabled`), 'Reduced motion disables decoding and animation controls');
  check(await evaluate(`!document.querySelector('.hero-video').hasAttribute('src') && !document.querySelector('.video-ready')`), 'Reduced-motion visit uses the poster without loading video');
  const reducedFrame = await evaluate(`document.querySelector('.hero-video').currentTime`);
  await pause(200);
  check(reducedFrame === await evaluate(`document.querySelector('.hero-video').currentTime`), 'Reduced-motion video remains paused');
  await call('Emulation.setEmulatedMedia', { features: [] }, sessionId);
  await evaluate(`new Promise(resolve => { function ready() { if (!document.querySelector('.motion-toggle').disabled) resolve(true); else requestAnimationFrame(ready); } ready(); })`);
  await evaluate(`document.querySelector('.motion-toggle').click()`);
  check(await evaluate(`document.body.classList.contains('motion-paused') && localStorage.getItem('portfolio-motion')==='paused'`), 'Motion toggle pauses and saves preference');
  await pause(150);
  const pausedFrame = await evaluate(`document.querySelector('.hero-video').currentTime`);
  await pause(200);
  check(pausedFrame === await evaluate(`document.querySelector('.hero-video').currentTime`), 'Manual pause freezes video');
  await call('Page.reload', {}, sessionId); await pause(650);
  check(await evaluate(`document.body.classList.contains('motion-paused')`), 'Motion preference survives navigation');
  await evaluate(`document.querySelector('.motion-toggle').click()`);
  await call('Emulation.setScriptExecutionDisabled', { value: true }, sessionId); await call('Page.reload', {}, sessionId); await pause(700);
  check(await evaluate(`document.querySelectorAll('.project-card').length===3 && document.querySelector('h1').textContent.includes('HORIZON')`), 'Homepage content exists without JavaScript');
  check(await evaluate(`getComputedStyle(document.querySelector('nav')).display!=='none'`), 'Mobile navigation remains available without JavaScript');
  check(await evaluate(`getComputedStyle(document.querySelector('.plume-fallback')).visibility==='visible' && document.querySelector('.plume-fallback').naturalWidth>0`), 'Static plume artwork remains available without JavaScript');
  await call('Emulation.setScriptExecutionDisabled', { value: false }, sessionId);
  for (const width of [320, 768]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 761 }, sessionId);
    for (const page of ['/', '/html/projects.html', '/html/about.html', '/html/contact.html']) {
      await call('Page.navigate', { url: base + page }, sessionId); await pause(1200);
      const overflow = await evaluate(`document.documentElement.scrollWidth>innerWidth+1`);
      check(!overflow, `${width}px ${page}: narrow and tablet reflow`);
    }
  }
  check(errors.length === 0, 'No runtime exceptions or failed HTTP responses');
  await writeFile(join(dir, 'report.json'), JSON.stringify({ report, errors, failures }, null, 2));
  console.log(JSON.stringify({ checks: report.length, failures, errors, screenshots: dir }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally { await call('Browser.close').catch(() => {}); ws.close(); chrome.kill('SIGTERM'); }
