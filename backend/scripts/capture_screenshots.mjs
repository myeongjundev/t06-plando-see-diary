// README 스크린샷 생성기.
//
// 헤드리스 Chrome을 CDP로 몰아 구획별로 잘라 2배 해상도로 찍는다. 화면 스크린샷은
// AGENTS.md 3번에 따라 합성 자료만 담아야 하므로, 운영 데이터베이스가 아니라
// 합성 자료를 심은 로컬 서버를 대상으로 돌린다.
//
//   1) 합성 자료를 심은 백엔드를 띄운다 (docs/DEVELOPMENT.md 참고)
//   2) chrome --headless=new --remote-debugging-port=9222 --user-data-dir=<임시>
//   3) SHOTS='[{"name":"plan-light","theme":"light","height":940}]' //        node backend/scripts/capture_screenshots.mjs http://127.0.0.1:5055/ docs/screenshots
//
// SHOTS 항목: name, theme(light|dark), selector?, pad?, maxHeight?, width?, height?, mobile?

import { writeFileSync } from "node:fs";

const PORT = 9222, BASE = "http://127.0.0.1:9222";
const APP = process.argv[2] || "http://127.0.0.1:5055/";
const OUT = process.argv[3];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function target() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`${BASE}/json/list`);
      const list = await r.json();
      const page = list.find((t) => t.type === "page");
      if (page) return page;
    } catch {}
    await sleep(300);
  }
  throw new Error("no debuggable page");
}

const t = await target();
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

let id = 0;
const pending = new Map();
const events = [];
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) {
    const { res, rej } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
  } else if (msg.method) events.push(msg.method);
};
const send = (method, params = {}) =>
  new Promise((res, rej) => { const n = ++id; pending.set(n, { res, rej }); ws.send(JSON.stringify({ id: n, method, params })); });

// 찍을 구획: [파일 이름, 테마, 셀렉터(없으면 뷰포트 위쪽), 여백]
const SHOTS = JSON.parse(process.env.SHOTS);

await send("Page.enable");
await send("Runtime.enable");

for (const shot of SHOTS) {
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-color-scheme", value: shot.theme }],
  });
  await send("Emulation.setDeviceMetricsOverride", {
    width: shot.width || 1280, height: shot.height || 900,
    deviceScaleFactor: 2, mobile: !!shot.mobile,
  });
  await send("Page.navigate", { url: APP });
  await sleep(2500);

  let clip;
  if (shot.selector) {
    const { result } = await send("Runtime.evaluate", {
      expression: `(() => { const e = document.querySelector(${JSON.stringify(shot.selector)});
        const r = e.getBoundingClientRect();
        return JSON.stringify({x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height}); })()`,
      returnByValue: true,
    });
    const r = JSON.parse(result.value);
    const pad = shot.pad ?? 0;
    const full = r.height + pad * 2;
    clip = { x: Math.max(0, r.x - pad), y: Math.max(0, r.y - pad),
             width: r.width + pad * 2,
             height: shot.maxHeight ? Math.min(full, shot.maxHeight) : full, scale: 1 };
  } else {
    clip = { x: 0, y: 0, width: shot.width || 1280, height: shot.height || 900, scale: 1 };
  }

  const { data } = await send("Page.captureScreenshot", {
    format: "png", clip, captureBeyondViewport: true, fromSurface: true,
  });
  writeFileSync(`${OUT}/${shot.name}.png`, Buffer.from(data, "base64"));
  console.log(`  ${shot.name}.png  ${Math.round(clip.width)}x${Math.round(clip.height)} @2x  (${shot.theme})`);
}
ws.close();
