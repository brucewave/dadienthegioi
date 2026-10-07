'use strict';
/* ==========================================================
   AUDIO — nhạc nền & hiệu ứng âm thanh tổng hợp bằng WebAudio
   (không cần file nhạc). Nhạc tự đổi theo bối cảnh.
   ========================================================== */
const AUDIO = (() => {
  let ctx = null, master, musicBus, sfxBus, ambBus, reverb, noiseBuf;
  const vol = { music: .55, sfx: .8 };
  const midi = n => 440 * Math.pow(2, (n - 69) / 12);
  const rnd = s => { const x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };

  function init() {
    if (ctx) return true;
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return false; }
    master = ctx.createGain(); master.gain.value = .9; master.connect(ctx.destination);
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4; comp.connect(master);
    musicBus = ctx.createGain(); musicBus.gain.value = vol.music * .5; musicBus.connect(comp);
    sfxBus = ctx.createGain(); sfxBus.gain.value = vol.sfx; sfxBus.connect(comp);
    ambBus = ctx.createGain(); ambBus.gain.value = vol.music * .6; ambBus.connect(comp);
    // tiếng vang (impulse response tự tạo)
    reverb = ctx.createConvolver();
    const len = ctx.sampleRate * 2.4, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    reverb.buffer = ir; const rg = ctx.createGain(); rg.gain.value = .32; reverb.connect(rg); rg.connect(comp);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    return true;
  }
  function unlock() { if (!init()) return; if (ctx.state === 'suspended') ctx.resume(); if (want && !cur) startTrack(want); }

  /* ---------- nhạc cụ ---------- */
  function env(g, t, a, peak, d) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  function out(node, dest, wet) { node.connect(dest); if (wet) { const s = ctx.createGain(); s.gain.value = wet; node.connect(s); s.connect(reverb); } }
  function osc(type, f, t, dur, peak, a, dest, wet = 0, filt = 0, det = 0) {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); o.detune.value = det;
    let n = o; if (filt) { const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = filt; o.connect(lp); n = lp; }
    n.connect(g); env(g, t, a, peak, dur); out(g, dest, wet); o.start(t); o.stop(t + a + dur + .05);
  }
  const I = {
    piano: (t, n, d, v = .18, wet = .25) => { osc('triangle', midi(n), t, d * 1.6, v, .008, musicBus, wet, 2600); osc('sine', midi(n) * 2, t, d * .8, v * .25, .005, musicBus, wet); },
    pluck: (t, n, d, v = .16, wet = .2) => { osc('triangle', midi(n), t, d, v, .004, musicBus, wet, 3200); osc('square', midi(n), t, d * .3, v * .12, .003, musicBus, 0, 1800); },
    bell: (t, n, d, v = .1, wet = .5) => { osc('sine', midi(n), t, d * 2.5, v, .004, musicBus, wet); osc('sine', midi(n) * 2.76, t, d * 1.2, v * .3, .002, musicBus, wet); },
    bass: (t, n, d, v = .22) => { osc('triangle', midi(n), t, d, v, .01, musicBus, 0, 600); osc('sine', midi(n) / 2, t, d, v * .6, .01, musicBus); },
    pad: (t, ns, d, v = .05, wet = .45, cut = 1100) => ns.forEach(n => { [-7, 7].forEach(dt => { const o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.value = midi(n); o.detune.value = dt; lp.type = 'lowpass'; lp.frequency.value = cut; o.connect(lp); lp.connect(g); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + d * .3); g.gain.linearRampToValueAtTime(0.0001, t + d * 1.05); out(g, musicBus, wet); o.start(t); o.stop(t + d * 1.1); }); }),
    drone: (t, n, d, v = .06) => { [0, 5].forEach(dt => osc('sine', midi(n) + dt * .3, t, d, v, d * .4, musicBus, .5)); },
    kick: (t, v = .5) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(42, t + .13); env(g, t, .003, v, .22); o.connect(g); g.connect(musicBus); o.start(t); o.stop(t + .3); },
    noise: (t, d, v, type, f, dest = musicBus, q = 1, wet = 0) => { const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = noiseBuf; s.playbackRate.value = .8 + Math.random() * .4; fl.type = type; fl.frequency.value = f; fl.Q.value = q; s.connect(fl); fl.connect(g); env(g, t, .002, v, d); out(g, dest, wet); s.start(t, Math.random()); s.stop(t + d + .05); },
    hat: (t, v = .05) => I.noise(t, .035, v, 'highpass', 7500),
    snare: (t, v = .18) => { I.noise(t, .16, v, 'bandpass', 1900, musicBus, .8, .15); osc('triangle', 190, t, .08, v * .6, .002, musicBus); },
    wood: (t, n, v = .12) => osc('sine', midi(n), t, .06, v, .001, musicBus, .1),
  };
  const ch = { Am: [57, 60, 64], F: [53, 57, 60], C: [55, 60, 64], G: [55, 59, 62], Dm: [57, 62, 65], E: [56, 59, 64], Em: [55, 59, 64], Cmaj7: [55, 59, 64], Am7: [55, 60, 64], Dm7: [57, 60, 65], G7: [53, 59, 62], Fmaj7: [57, 60, 64], Bb: [53, 58, 62] };

  /* ---------- các bản nhạc (mỗi bước = nốt móc kép) ---------- */
  const TRACKS = {
    title: { bpm: 70, bars: 4, prog: ['Am', 'F', 'C', 'G'], f(s, t, sp) {
      const bar = Math.floor(s / 16) % 4, c = ch[this.prog[bar]], st = s % 16;
      if (st === 0) { I.pad(t, c.map(n => n - 12), sp * 16, .035); I.bass(t, c[0] - 24, sp * 14, .16); }
      if (st % 2 === 0) I.piano(t, c[[0, 1, 2, 1, 0, 2, 1, 2][st / 2]] + (st === 8 ? 12 : 0), sp * 3, .12);
      if (st === 14 && bar % 2) I.bell(t, c[2] + 24, sp * 4, .05);
    } },
    calm: { bpm: 92, bars: 4, prog: ['Cmaj7', 'Am7', 'Dm7', 'G7'], mel: [76, null, 79, 76, null, 74, 72, null, 74, null, 76, null, 79, null, 81, 79], f(s, t, sp) {
      const bar = Math.floor(s / 16) % 4, c = ch[this.prog[bar]], st = s % 16;
      if (st === 0) { I.pad(t, c, sp * 16, .025, .3, 1500); }
      if (st === 0 || st === 8) I.bass(t, c[0] - 24 + (st === 8 ? 7 : 0), sp * 6, .14);
      if (st % 4 === 2) I.hat(t, .025);
      if (st % 4 === 0) I.piano(t, c[(st / 4) % 3] + 12, sp * 2, .06);
      const m = this.mel[(st + bar * 5) % 16]; if (m && rnd(s) > .35) I.pluck(t, m - (bar === 2 ? 2 : 0), sp * 2, .08);
    } },
    mystery: { bpm: 72, bars: 4, prog: ['Dm', 'Bb', 'Dm', 'E'], f(s, t, sp) {
      const bar = Math.floor(s / 16) % 4, c = ch[this.prog[bar]], st = s % 16;
      if (st === 0) I.pad(t, c.map(n => n - 12), sp * 16, .04, .5, 800);
      if (st % 4 === 0) I.bass(t, c[0] - 24, sp * 2, .14);
      if (st % 4 === 0) I.wood(t, st === 0 ? 84 : 79, .05);
      if (rnd(s * 3) > .8) I.bell(t, [74, 77, 81, 82, 86][Math.floor(rnd(s) * 5)], sp * 4, .05);
      if (st === 10 && bar === 3) I.piano(t, 68, sp * 4, .07);
    } },
    tense: { bpm: 112, bars: 2, f(s, t, sp) {
      const st = s % 16, bar = Math.floor(s / 16) % 2;
      I.bass(t, (st === 14 || st === 15) ? 41 : 40, sp * .9, .16);
      if (st === 0) I.pad(t, bar ? [52, 55, 58] : [52, 55, 59], sp * 16, .03, .4, 700);
      if (st % 2 === 0) I.hat(t, st % 4 === 0 ? .04 : .022);
      if (st === 0 || st === 10) I.kick(t, .32);
      if (st === 6 && rnd(s) > .4) I.pluck(t, 76 + (bar ? 1 : 0), sp * 2, .06);
    } },
    action: { bpm: 140, bars: 2, riff: [45, 45, 57, 45, 48, 45, 50, 48, 45, 45, 57, 45, 52, 50, 48, 47], f(s, t, sp) {
      const st = s % 16, bar = Math.floor(s / 16) % 2;
      I.bass(t, this.riff[st] - (bar && st > 11 ? 2 : 0), sp * .9, .2);
      if (st % 4 === 0) I.kick(t, .45); if (st % 8 === 4) I.snare(t, .16); I.hat(t, st % 2 ? .02 : .035);
      if (st === 0) I.pad(t, bar ? [57, 60, 65] : [57, 60, 64], sp * 16, .03, .2, 1400);
      if (st === 0 || st === 3 || st === 6) I.pluck(t, 69 + (st === 6 ? 3 : 0), sp * 1.5, .07);
    } },
    sad: { bpm: 62, bars: 4, prog: ['Am', 'F', 'C', 'E'], mel: [76, null, null, 74, 72, null, null, null, 72, null, 74, 76, 71, null, null, null], f(s, t, sp) {
      const bar = Math.floor(s / 16) % 4, c = ch[this.prog[bar]], st = s % 16;
      if (st === 0) { I.pad(t, c.map(n => n - 12), sp * 16, .035, .55, 900); I.bass(t, c[0] - 24, sp * 14, .14); c.forEach((n, i) => I.piano(t + i * .03, n, sp * 8, .08)); }
      if (st === 8) c.forEach((n, i) => I.piano(t + i * .04, n + 12, sp * 6, .04));
      const m = this.mel[st]; if (m && (bar % 2 === 0 || rnd(s) > .5)) I.piano(t, m - (bar === 3 ? 1 : 0), sp * 4, .11, .4);
    } },
    market: { bpm: 104, bars: 2, mel: [72, null, 74, 76, 79, null, 76, 74, 72, null, 69, null, 72, 74, 76, null, 79, null, 81, 79, 76, null, 74, 76, 72, null, 74, null, 72, null, null, null], f(s, t, sp) {
      const st = s % 32, bar = Math.floor(st / 16);
      const m = this.mel[st]; if (m) I.pluck(t, m, sp * 1.6, .1);
      if (st % 4 === 0) I.bass(t, [48, 43, 45, 43][Math.floor(st / 8)], sp * 3, .14);
      if (st % 4 === 2) I.wood(t, 88, .06); if (st % 8 === 4) I.wood(t, 81, .08);
      if (st % 2 === 0) I.hat(t, .018);
      if (st === 0 || st === 16) I.pad(t, bar ? [55, 60, 64] : [57, 60, 64], sp * 16, .02, .3, 1600);
    } },
    dream: { bpm: 56, bars: 2, f(s, t, sp) {
      const st = s % 16, bar = Math.floor(s / 16) % 2;
      if (st === 0) I.pad(t, bar ? [52, 55, 59, 62] : [53, 57, 60, 64], sp * 16, .045, .7, 1200);
      if (st % 3 === 0) I.bell(t, [76, 79, 83, 84, 88][Math.floor(rnd(s) * 5)] + (rnd(s + 1) > .8 ? 1 : 0), sp * 6, .05, .8);
    } },
    eerie: { bpm: 48, bars: 2, f(s, t, sp) {
      const st = s % 16;
      if (st === 0) { I.drone(t, 38, sp * 17, .07); I.pad(t, [50, 51], sp * 16, .02, .8, 500); }
      if (rnd(s * 7) > .82) I.bell(t, 84 + Math.floor(rnd(s) * 8), sp * 6, .035, .9);
      if (st === 8 && rnd(s) > .5) I.noise(t, sp * 6, .02, 'bandpass', 400 + rnd(s) * 600, musicBus, 6, .8);
    } },
    night: { bpm: 78, bars: 4, prog: ['Dm7', 'G7', 'Cmaj7', 'Am7'], f(s, t, sp) {
      const bar = Math.floor(s / 16) % 4, c = ch[this.prog[bar]], st = s % 16;
      if (st === 0) { c.forEach((n, i) => I.piano(t + i * .05, n, sp * 10, .05)); I.bass(t, c[0] - 24, sp * 8, .12); }
      if (st === 10) I.piano(t, c[2] + 12, sp * 4, .04);
      if (st % 4 === 2) I.hat(t, .018); if (st === 4 || st === 12) I.noise(t, .08, .03, 'bandpass', 1200);
      if (rnd(s * 5) > .88) I.bell(t, c[1] + 24, sp * 3, .03);
    } },
  };

  /* ---------- trình phát (lookahead) ---------- */
  let cur = null, want = null, step = 0, nextT = 0, timer = null, gainNode = null;
  function startTrack(name) {
    const tr = TRACKS[name]; if (!ctx) return; if (!tr) { stopTrack(); return; }
    stopTrack(true);
    cur = name; step = 0; nextT = ctx.currentTime + .08;
    gainNode = musicBus;
    timer = setInterval(() => {
      if (!ctx || cur !== name) return;
      const sp = 60 / tr.bpm / 4;
      while (nextT < ctx.currentTime + .15) { try { tr.f(step, nextT, sp); } catch (e) { } step++; nextT += sp; }
    }, 30);
  }
  function stopTrack() { clearInterval(timer); timer = null; cur = null; }
  function music(name) {
    if (name === want) return;
    want = name;
    if (!ctx || ctx.state !== 'running') return;
    const g = musicBus.gain, t = ctx.currentTime;
    g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0.0001, t + .6);
    setTimeout(() => { if (want !== name) return; if (name) startTrack(name); else stopTrack(); const t2 = ctx.currentTime; g.cancelScheduledValues(t2); g.setValueAtTime(0.0001, t2); g.linearRampToValueAtTime(vol.music * .5, t2 + 1.2); }, 650);
  }

  /* ---------- âm thanh nền (mưa, lửa, phố) ---------- */
  let ambNodes = [], ambTimer = null, ambKey = '';
  function ambience(o = {}) {
    const key = `${!!o.rain}${!!o.fire}${!!o.city}`; if (key === ambKey) return; ambKey = key;
    ambNodes.forEach(n => { try { n.stop(); } catch (e) { } }); ambNodes = []; clearInterval(ambTimer);
    if (!ctx) return;
    const loop = (type, f, v, q = 1) => { const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = noiseBuf; s.loop = true; fl.type = type; fl.frequency.value = f; fl.Q.value = q; g.gain.value = v; s.connect(fl); fl.connect(g); g.connect(ambBus); s.start(); ambNodes.push(s); };
    if (o.rain) { loop('lowpass', 1400, .22); loop('highpass', 5000, .05); ambTimer = setInterval(() => { if (Math.random() > .5) I.noise(ctx.currentTime, .03, .05, 'highpass', 3000, ambBus); }, 90); }
    if (o.fire) { loop('lowpass', 500, .25); ambTimer = setInterval(() => { for (let i = 0; i < 3; i++) if (Math.random() > .4) I.noise(ctx.currentTime + Math.random() * .1, .02, .12, 'bandpass', 1500 + Math.random() * 2000, ambBus, 2); }, 120); }
    if (o.city && !o.rain) { loop('lowpass', 300, .06); }
  }

  /* ---------- hiệu ứng âm thanh ---------- */
  const tone = (f, d, type = 'sine', v = .1, slide = 0, t0 = 0) => {
    if (!ctx) return; const t = ctx.currentTime + t0, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), t + d);
    env(g, t, .004, v, d); o.connect(g); g.connect(sfxBus); o.start(t); o.stop(t + d + .05);
  };
  const nz = (d, v, type, f, q = 1, t0 = 0) => ctx && I.noise(ctx.currentTime + t0, d, v, type, f, sfxBus, q);
  let stepAlt = false;
  const SURF = { wood: ['bandpass', 750, 3], tile: ['bandpass', 2400, 2], grass: ['lowpass', 700, 1], street: ['bandpass', 1400, 1.5], carpet: ['lowpass', 500, 1], dark: ['bandpass', 600, 3] };
  const S = {
    blip: () => tone(560 + Math.random() * 80, .03, 'triangle', .02),
    click: () => { tone(900, .03, 'square', .025); tone(1400, .02, 'sine', .03, 0, .01); },
    hover: () => tone(1200, .025, 'sine', .012),
    pop: () => { tone(520, .07, 'sine', .08, 380); },
    clue: () => { [784, 988, 1175, 1568].forEach((f, i) => tone(f, .25, 'triangle', .06, 0, i * .07)); },
    ok: () => { tone(523, .12, 'triangle', .08); tone(784, .3, 'triangle', .08, 0, .1); },
    bad: () => { tone(220, .22, 'sawtooth', .05, -80); tone(180, .3, 'sawtooth', .04, -60, .08); },
    hit: () => { nz(.12, .35, 'lowpass', 900); tone(110, .16, 'sine', .3, -60); },
    boom: () => { nz(.6, .5, 'lowpass', 400); tone(70, .7, 'sine', .45, -40); },
    shot: () => { nz(.35, .7, 'lowpass', 2500); tone(90, .4, 'sine', .4, -50); },
    whoosh: () => nz(.35, .12, 'bandpass', 900, .7),
    page: () => { nz(.18, .08, 'highpass', 2500); nz(.1, .05, 'bandpass', 1500, 1, .1); },
    alarm: () => { [0, .18, .36].forEach(t => tone(880, .14, 'square', .05, 0, t)); tone(660, .5, 'sawtooth', .04, -200, .54); },
    zap: () => { tone(1800, .2, 'sawtooth', .05, -1500); nz(.15, .1, 'highpass', 4000); },
    glitch: () => { for (let i = 0; i < 6; i++) tone(200 + Math.random() * 1800, .04, 'square', .03, 0, i * .05); },
    meow: () => { if (!ctx) return; const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.setValueAtTime(520, t); o.frequency.linearRampToValueAtTime(820, t + .12); o.frequency.linearRampToValueAtTime(560, t + .38); f.type = 'bandpass'; f.frequency.setValueAtTime(900, t); f.frequency.linearRampToValueAtTime(1800, t + .15); f.frequency.linearRampToValueAtTime(1100, t + .38); f.Q.value = 3; env(g, t, .04, .09, .36); o.connect(f); f.connect(g); g.connect(sfxBus); o.start(t); o.stop(t + .45); },
    step: (surf = 'wood') => { const s = SURF[surf] || SURF.wood; stepAlt = !stepAlt; nz(.055, .09, s[0], s[1] * (stepAlt ? 1 : .85), s[2]); tone(stepAlt ? 90 : 80, .05, 'sine', .05); },
    door: () => { tone(200, .12, 'square', .03, -60); nz(.2, .12, 'lowpass', 500, 1, .05); },
    gong: () => { tone(110, 2.4, 'sine', .14); tone(220 * 1.01, 1.6, 'sine', .05); tone(330 * .99, 1.1, 'sine', .03); },
    heart: () => { tone(60, .12, 'sine', .25); tone(55, .12, 'sine', .2, 0, .18); },
    tick: () => tone(1500, .02, 'square', .015),
    shutter: () => { nz(.03, .2, 'highpass', 3000); tone(2400, .02, 'square', .03); nz(.05, .14, 'bandpass', 1800, 2, .07); tone(1800, .02, 'square', .025, 0, .07); },
    swish: () => { nz(.22, .16, 'bandpass', 2600, 1.4); nz(.14, .08, 'highpass', 5000, 1, .04); },
    impact: () => { nz(.08, .5, 'highpass', 2200); nz(.3, .45, 'lowpass', 700); tone(80, .35, 'sine', .45, -40); tone(160, .08, 'square', .06, -80); },
    clash: () => { tone(1250, .35, 'triangle', .07); tone(1870, .25, 'sine', .05); nz(.1, .2, 'highpass', 3500); },
    stomp: () => { nz(.25, .35, 'lowpass', 300); tone(55, .4, 'sine', .4, -20); },
  };
  function sfx(name, arg) { if (!ctx || vol.sfx <= 0) return; try { S[name] && S[name](arg); } catch (e) { } }
  function setVol(kind, v) { vol[kind] = v; if (!ctx) return; if (kind === 'music') { musicBus.gain.value = v * .5; ambBus.gain.value = v * .6; } else sfxBus.gain.value = v; }

  ['pointerdown', 'keydown', 'touchstart'].forEach(ev => addEventListener(ev, unlock, { passive: true }));
  return { music, sfx, ambience, setVol, vol, unlock, get current() { return want; } };
})();

/* chọn nhạc theo bối cảnh */
function autoMusic(ctxName) {
  if (G.musicLock) return AUDIO.music(G.musicLock);
  const k = G.bgKey || '', o = G.bgOpt || {};
  const byBg = { funeral: 'sad', market: 'market', dream_home: 'dream', dream_elephant: 'dream', void: 'eerie', black: 'eerie', white: 'dream', collapse: 'eerie', cage: 'eerie', x_house: 'eerie', fire: 'action', car: 'night', street_night: 'night', alley: 'night', house_night: 'night', house_in: 'mystery', victim_room: 'mystery', station: 'calm', academy: 'calm', auditorium: 'calm' };
  let m = byBg[k] || (o.night || o.dark ? 'mystery' : 'calm');
  if (ctxName) m = ctxName;
  AUDIO.music(m);
  AUDIO.ambience({ rain: o.rain, fire: o.fire || k === 'fire', city: /street|alley/.test(k) });
}
