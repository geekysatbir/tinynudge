const startBtn = document.getElementById("start");
const timerEl = document.getElementById("timer");
const canvas = document.getElementById("path");
const ctx = canvas.getContext("2d");
const autoStop = document.getElementById("auto-stop");
const stopAt = document.getElementById("stop-at");
const lamps = {
  wake: document.getElementById("lamp-wake"),
  audio: document.getElementById("lamp-audio"),
  pip: document.getElementById("lamp-pip"),
};

let running = false;
let startedAt = 0;
let tickId = 0;
let rafId = 0;
let wakeLock = null;
let audioCtx = null;
let osc = null;
let gain = null;
let pipVideo = null;

function fitCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawCursor(t) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const phase = reduced || !running ? 0.15 : t / 8000;
  const x = w * 0.5 + Math.sin(phase * Math.PI * 2) * (w * 0.28);
  const y = h * 0.52 + Math.sin(phase * Math.PI * 4) * (h * 0.18);

  ctx.fillStyle = "rgba(92,255,193,0.07)";
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.78, w * 0.28, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#5cffc1";
  ctx.beginPath();
  ctx.moveTo(x, y - 14);
  ctx.lineTo(x + 12, y + 10);
  ctx.lineTo(x + 4, y + 10);
  ctx.lineTo(x + 8, y + 20);
  ctx.lineTo(x + 3, y + 22);
  ctx.lineTo(x - 1, y + 12);
  ctx.lineTo(x - 8, y + 18);
  ctx.closePath();
  ctx.fill();
}

function loop(ts) {
  drawCursor(ts);
  rafId = requestAnimationFrame(loop);
}

function formatElapsed(ms) {
  const s = Math.floor(ms / 1000);
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function setLamp(el, on) {
  el.classList.toggle("on", on);
}

async function requestWake() {
  if (!("wakeLock" in navigator)) return false;
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => setLamp(lamps.wake, false));
    setLamp(lamps.wake, true);
    return true;
  } catch {
    setLamp(lamps.wake, false);
    return false;
  }
}

function startAudio() {
  try {
    audioCtx = new AudioContext();
    osc = audioCtx.createOscillator();
    gain = audioCtx.createGain();
    osc.frequency.value = 20;
    gain.gain.value = 0.00001;
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    setLamp(lamps.audio, true);
  } catch {
    setLamp(lamps.audio, false);
  }
}

function stopAudio() {
  try {
    osc?.stop();
    audioCtx?.close();
  } catch {
    /* ignore */
  }
  osc = null;
  audioCtx = null;
  setLamp(lamps.audio, false);
}

async function startPip() {
  try {
    if (!document.pictureInPictureEnabled) return;
    pipVideo = document.createElement("video");
    pipVideo.muted = true;
    pipVideo.playsInline = true;
    pipVideo.srcObject = canvas.captureStream(30);
    await pipVideo.play();
    await pipVideo.requestPictureInPicture();
    setLamp(lamps.pip, true);
    pipVideo.addEventListener("leavepictureinpicture", () => setLamp(lamps.pip, false));
  } catch {
    setLamp(lamps.pip, false);
  }
}

async function stopPip() {
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    }
  } catch {
    /* ignore */
  }
  pipVideo = null;
  setLamp(lamps.pip, false);
}

function tick() {
  if (!running) return;
  timerEl.textContent = formatElapsed(Date.now() - startedAt);
  if (autoStop.checked && stopAt.value) {
    const [h, m] = stopAt.value.split(":").map(Number);
    const now = new Date();
    if (now.getHours() === h && now.getMinutes() === m) stopSession();
  }
}

async function startSession() {
  running = true;
  startedAt = Date.now();
  document.body.classList.add("is-on");
  startBtn.textContent = "ON";
  startBtn.setAttribute("aria-pressed", "true");
  document.title = "Session Active — TinyNudge";
  tick();
  tickId = setInterval(tick, 250);
  await requestWake();
  startAudio();
}

async function stopSession() {
  running = false;
  document.body.classList.remove("is-on");
  startBtn.textContent = "START";
  startBtn.setAttribute("aria-pressed", "false");
  document.title = "TinyNudge — Free Online Mouse Jiggler (Keep Screen Awake)";
  clearInterval(tickId);
  try {
    await wakeLock?.release();
  } catch {
    /* ignore */
  }
  wakeLock = null;
  setLamp(lamps.wake, false);
  stopAudio();
  await stopPip();
}

startBtn.addEventListener("click", async () => {
  startBtn.disabled = true;
  try {
    if (running) await stopSession();
    else await startSession();
  } finally {
    startBtn.disabled = false;
  }
});

document.getElementById("pip-btn")?.addEventListener("click", async () => {
  if (!running) await startSession();
  await startPip();
});

document.addEventListener("visibilitychange", async () => {
  if (running && document.visibilityState === "visible") {
    await requestWake();
  }
});

window.addEventListener("resize", fitCanvas);
fitCanvas();
rafId = requestAnimationFrame(loop);
