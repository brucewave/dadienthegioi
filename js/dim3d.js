'use strict';
/* ==========================================================
   DIM3D — đoạn kết: thế giới phẳng 2D “bung” thành 3D
   - enter({ figs, focus })   tường mọc lên, nhân vật đứng dậy khỏi mặt giấy
   - add(fig)                 thêm nhân vật (rise: trồi lên từ sàn, from: đi vào)
   - pose(c, {bow, lie})      đổi tư thế
   - collapse()               3D gập lại thành 2D rồi co về một điểm như hố đen
   - exit()                   dọn cảnh
   fig: { c: 'truong', at: [x, y], dir, emo, lie, rise, from: [x, y] }
   Không tải được three.js / không có WebGL → nghiêng bản đồ bằng CSS 3D.
   ========================================================== */
const DIM3D = (() => {
  const SRC = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  let lib = null, S = null;
  const SPD = () => (G.skip ? .15 : 1);
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const lerp = (a, b, t) => a + (b - a) * t;
  const BOW = .45;   // cúi người về phía máy quay

  function load() {
    if (window.THREE) return Promise.resolve(window.THREE);
    if (lib) return lib;
    lib = new Promise((res, rej) => {
      const s = document.createElement('script'); s.src = SRC; s.async = true;
      s.onload = () => (window.THREE ? res(window.THREE) : rej());
      s.onerror = () => { lib = null; s.remove(); rej(new Error('three.js')); };
      document.head.append(s);
    });
    return lib;
  }
  const timeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
  function webgl() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }

  // tab bị ẩn thì requestAnimationFrame đứng im → dùng setTimeout để cảnh vẫn chạy tiếp
  const next = fn => (document.hidden ? setTimeout(() => fn(performance.now()), 33) : requestAnimationFrame(fn));
  // chạy hiệu ứng theo thời gian, trả về promise
  function tween(ms, fn) {
    return new Promise(res => {
      const d = Math.max(1, ms * SPD()), t0 = performance.now();
      const step = now => {
        const t = Math.min(1, (now - t0) / d); fn(t);
        if (t < 1 && S && !S.dead) next(step); else { fn(1); res(); }
      };
      next(step);
    });
  }
  const svgImg = svg => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = svgUrl(svg); });
  const FILTERS = () => (document.querySelector('#stage > svg') || {}).innerHTML || '';
  function chibiSvg(c, dir, emo) {
    return ART.chibi(c, dir || 'down', { emo: emo || 'neutral' }).replace('<svg ', `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="380" `).replace(/(<svg[^>]*>)/, `$1<defs>${FILTERS()}</defs>`);
  }

  /* ---------- Dựng cảnh three.js ---------- */
  async function build(o) {
    const THREE = window.THREE, m = WS.m, W = WS.W, H = WS.H, th = { wood: ['#D9C7A4', '#6B4A30', '#B98552'], tile: ['#BCC8B6', '#4A5A52', '#93A596'], grass: ['#C98F6A', '#6E5A4A', '#A89C8A'], street: ['#D8C3A0', '#5A4E46', '#9AA2A8'], carpet: ['#D8C3A0', '#6B3A2A', '#9E5A4A'], dark: ['#5E504C', '#2E2428', '#3E3230'] }[m.theme] || ['#D9C7A4', '#6B4A30', '#B98552'];
    const col = c => new THREE.Color(c).convertSRGBToLinear();   // mã màu sRGB → linear
    const root = $('#world');
    const cv = h('canvas', 'w3d'); root.append(cv);
    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1;
    const scene = new THREE.Scene(); scene.background = new THREE.Color('#120d10'); scene.fog = new THREE.FogExp2('#120d10', .045);
    const cam = new THREE.PerspectiveCamera(35, 16 / 9, .1, 300);
    const focus = new THREE.Vector3(...(o.focus ? [o.focus[0], 0, o.focus[1]] : [WS.camX ?? W / 2, 0, WS.camY ?? H / 2]));
    const pivot = new THREE.Group(); pivot.position.copy(focus); scene.add(pivot);
    const world = new THREE.Group(); world.position.set(-focus.x, 0, -focus.z); pivot.add(world);
    const aniso = renderer.capabilities.getMaxAnisotropy();

    // sàn = chính bức vẽ 2D của bản đồ
    const mimg = await svgImg(ART.mapSvg(m, { ...(WS.opt || {}), standalone: true }));
    const fc = document.createElement('canvas'); fc.width = W * 64; fc.height = H * 64;
    if (mimg) fc.getContext('2d').drawImage(mimg, 0, 0, fc.width, fc.height);
    const ftex = new THREE.CanvasTexture(fc); ftex.encoding = THREE.sRGBEncoding; ftex.anisotropy = aniso;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshStandardMaterial({ map: ftex, roughness: .92, metalness: 0 }));
    floor.rotation.x = -Math.PI / 2; floor.position.set(W / 2, 0, H / 2); floor.receiveShadow = true; world.add(floor);

    // tường: mỗi ô '#' giáp sàn thành một khối, mọc lên từ mặt phẳng
    const tiles = m.tiles, isW = (x, y) => y < 0 || y >= H || x < 0 || x >= W || tiles[y][x] === '#' || tiles[y][x] === 'X';
    const wl = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (isW(x, y) && [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].some(([a, b]) => !isW(x + a, y + b))) wl.push([x, y]);
    const WH = 1.35, wg = new THREE.BoxGeometry(1, 1, 1); wg.translate(0, .5, 0);
    const side = new THREE.MeshStandardMaterial({ map: wallTex(THREE, th, aniso), roughness: .9 }), top = new THREE.MeshStandardMaterial({ color: col(th[1]), roughness: .6 });
    const walls = new THREE.InstancedMesh(wg, [side, side, top, side, side, side], wl.length);
    walls.castShadow = walls.receiveShadow = true; world.add(walls);
    const dm = new THREE.Object3D();
    // f: 0 → 1, tường gần tâm cảnh mọc trước, lan dần ra xa
    const wallH = f => {
      wl.forEach(([x, y], i) => {
        const d = Math.hypot(x + .5 - focus.x, y + .5 - focus.z), k = Math.max(0, Math.min(1, f * 1.6 - d / 40));
        // tường nằm giữa máy quay và nhân vật chỉ dựng thấp — kiểu sa bàn cắt mặt
        const hh = y + .5 > focus.z + 1 ? .28 : WH;
        dm.position.set(x + .5, 0, y + .5); dm.scale.set(1, Math.max(.001, ease(k) * hh), 1); dm.updateMatrix(); walls.setMatrixAt(i, dm.matrix);
      });
      walls.instanceMatrix.needsUpdate = true;
    };
    wallH(0);

    // đồ vật đứng: bàn thờ, tượng, chân nến, hộp
    const props = new THREE.Group(); world.add(props);
    const flames = [];
    const mat = (c, e) => new THREE.MeshStandardMaterial({ color: col(c), roughness: .75, ...(e ? { emissive: col(e), emissiveIntensity: 2 } : {}) });
    (m.props || []).forEach(p => {
      const cx = p.x + (p.w || 1) / 2, cz = p.y + (p.h || 1) / 2;
      if (p.k === 'altar' || p.k === 'box' || p.k === 'table' || p.k === 'crate') {
        const hh = p.k === 'altar' ? .7 : .45, b = new THREE.Mesh(new THREE.BoxGeometry(p.w * .96, hh, p.h * .9), mat(p.k === 'altar' ? '#5a2a22' : '#9a7448'));
        b.position.set(cx, hh / 2, cz); b.castShadow = b.receiveShadow = true; props.add(b);
      }
      if (p.k === 'statue') {
        const b = new THREE.Mesh(new THREE.CylinderGeometry(.22, .3, 1, 12), mat('#8d8a84')); b.position.set(cx, .5, cz);
        const hd = new THREE.Mesh(new THREE.SphereGeometry(.2, 16, 12), mat('#8d8a84')); hd.position.set(cx, 1.15, cz);
        [b, hd].forEach(q => { q.castShadow = true; props.add(q); });
      }
      if (p.k === 'candelabra' || p.k === 'lampfloor') {
        const st = new THREE.Mesh(new THREE.CylinderGeometry(.04, .12, .9, 8), mat('#b08a3a')); st.position.set(cx, .45, cz); st.castShadow = true; props.add(st);
        const fl = new THREE.Mesh(new THREE.SphereGeometry(.07, 10, 8), mat('#ffcf7a', '#ff9a2a')); fl.scale.y = 1.6; fl.position.set(cx, .98, cz); props.add(fl);
        const L = new THREE.PointLight(col('#ffb35a'), 2.2, 7, 2); L.position.set(cx, 1.05, cz); props.add(L);
        flames.push({ fl, L, seed: Math.random() * 9 });
      }
    });
    props.scale.y = .001;

    // ánh sáng
    scene.add(new THREE.HemisphereLight(col('#8f9cc8'), col('#2a1a14'), .32));
    const amb = new THREE.AmbientLight('#ffffff', .1); scene.add(amb);
    const sun = new THREE.DirectionalLight(col('#b9c6ff'), .55);
    sun.position.set(focus.x - 7, 14, focus.z - 9); sun.target.position.copy(focus); scene.add(sun, sun.target);
    sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0006; sun.shadow.normalBias = .02;
    const sc = sun.shadow.camera, R = Math.max(W, H) * .75; sc.left = -R; sc.right = R; sc.top = R; sc.bottom = -R; sc.near = 1; sc.far = 60;
    const key = new THREE.SpotLight(col('#ffe6c4'), 1.1, 22, .55, .6, 1.4); key.position.set(focus.x + 2, 7, focus.z + 4); key.target.position.copy(focus); scene.add(key, key.target);
    const rim = new THREE.PointLight(col('#8f6bd8'), 0, 14, 2); rim.position.set(focus.x, 2.4, focus.z); scene.add(rim);

    // bụi lơ lửng — thời gian ngưng đọng
    const N = 520, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { pos[i * 3] = focus.x + (Math.random() - .5) * 16; pos[i * 3 + 1] = Math.random() * 3.2; pos[i * 3 + 2] = focus.z + (Math.random() - .5) * 10; }
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(pg, new THREE.PointsMaterial({ color: col('#ffe2b0'), size: .045, transparent: true, opacity: 0, depthWrite: false }));
    scene.add(dust);

    S = { THREE, col, renderer, scene, cam, cv, focus, pivot, world, walls, wallH, props, flames, sun, amb, rim, key, dust, figs: {}, W, H, dead: false,
      orbit: { el: 88, dist: 0, az: 0, t0: performance.now(), drift: 0 }, shake: 0, hole: null };
    // máy quay ban đầu khớp với khung hình 2D (nhìn thẳng từ trên xuống)
    const U = unitPx(), Z = WS.zoom || 1, visH = stage().clientHeight / (TILE * U * Z);
    S.orbit.dist0 = (visH / 2) / Math.tan(17.5 * Math.PI / 180); S.orbit.dist = S.orbit.dist0;
    loop();
    for (const f of (o.figs || [])) await addFig(f, true);
    return S;
  }

  // vữa tường: nền + đốm + chân tường + nẹp, vẽ một lần lên canvas
  function wallTex(T, th, aniso) {
    const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
    x.fillStyle = th[0]; x.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${i % 2 ? '255,255,255' : '0,0,0'},${.02 + Math.random() * .05})`; x.fillRect(Math.random() * 128, Math.random() * 128, 1 + Math.random() * 3, 1 + Math.random() * 3); }
    x.fillStyle = th[2]; x.fillRect(0, 86, 128, 42);
    x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(0, 84, 128, 4); x.fillRect(0, 0, 128, 3);
    x.fillStyle = 'rgba(0,0,0,.18)'; for (let i = 0; i < 128; i += 16) x.fillRect(i, 90, 2, 38);
    const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = aniso; return t;
  }
  async function texFor(c, dir, emo) {
    const T = S.THREE, img = await svgImg(chibiSvg(c, dir, emo));
    const cv = document.createElement('canvas'); cv.width = 320; cv.height = 380;
    if (img) cv.getContext('2d').drawImage(img, 0, 0, 320, 380);
    const t = new T.CanvasTexture(cv); t.encoding = T.sRGBEncoding; t.anisotropy = 4; return t;
  }
  async function addFig(f, initial) {
    if (!S) return;
    const T = S.THREE, tex = await texFor(f.c, f.dir, f.emo);
    if (!S) return;
    const sz = f.c === 've' ? .8 : f.c === 'bong' ? 1.3 : 1, w = 1.3 * sz, hh = 1.55 * sz;
    const geo = new T.PlaneGeometry(w, hh); geo.translate(0, hh / 2 - .08 * sz, 0);
    const mtl = new T.MeshStandardMaterial({ map: tex, alphaTest: .5, transparent: true, side: T.DoubleSide, roughness: .8 });
    const mesh = new T.Mesh(geo, mtl); mesh.castShadow = true;
    mesh.customDepthMaterial = new T.MeshDepthMaterial({ depthPacking: T.RGBADepthPacking, map: tex, alphaTest: .5 });
    const blob = new T.Mesh(new T.CircleGeometry(.42 * sz, 24), new T.MeshBasicMaterial({ color: '#000', transparent: true, opacity: .35, depthWrite: false }));
    blob.rotation.x = -Math.PI / 2; blob.position.y = .012;
    const g = new T.Group(); g.add(blob, mesh); S.world.add(g);
    const [x, y] = f.from || f.at; g.position.set(x, .02, y);
    const F = S.figs[f.c] = { ...f, g, mesh, blob, lie: !!f.lie, yawFree: !f.lie, tilt: 0 };
    // bóng đen: quầng tím phía sau để tách khỏi nền tối
    if (f.c === 'bong') { const L = new T.PointLight(S.col('#9a6bff'), f.rise ? 0 : 3, 4.5, 2); L.position.set(0, 1.3, -.6); g.add(L); F.glow = L; }
    // mới vào cảnh: nằm phẳng như hình 2D, dựng dậy cùng lúc với tường
    mesh.rotation.x = initial || f.lie ? -Math.PI / 2 : 0;
    if (f.lie) { mesh.position.z = 0; blob.visible = false; g.rotation.y = f.yaw || 0; }
    if (f.rise) {
      mesh.rotation.x = 0; mesh.scale.set(1, .001, 1); mtl.opacity = 0;
      AUDIO.sfx('glitch');
      await tween(2200, t => { const e = ease(t); mesh.scale.y = Math.max(.001, e); mtl.opacity = e; blob.scale.setScalar(e); if (F.glow) F.glow.intensity = 3 * e; });
    }
    if (f.from) {
      const [x1, y1] = f.at, x0 = x, y0 = y;
      await tween(2600, t => { const e = ease(t); g.position.set(lerp(x0, x1, e), .02 + Math.abs(Math.sin(t * Math.PI * 7)) * .06 * (1 - t), lerp(y0, y1, e)); });
    }
    if (!initial && !f.rise && !f.from && !f.lie) { mesh.rotation.x = -Math.PI / 2; await tween(900, t => { mesh.rotation.x = -Math.PI / 2 * (1 - ease(t)); }); }
    return F;
  }

  function loop() {
    const s = S; if (!s) return;
    const T = s.THREE, now = performance.now();
    if (s.dead || !s.cv.isConnected) { dispose(s); return; }
    requestAnimationFrame(loop);
    const cw = s.cv.clientWidth, ch = s.cv.clientHeight;
    if (cw && ch && (s._w !== cw || s._h !== ch)) { s._w = cw; s._h = ch; s.renderer.setSize(cw, ch, false); s.cam.aspect = cw / ch; s.cam.updateProjectionMatrix(); }
    const o = s.orbit, tt = (now - o.t0) / 1000;
    const az = o.az + Math.sin(tt * .12) * .2 * o.drift, el = o.el * Math.PI / 180;
    const dist = o.dist - Math.min(1, tt / 40) * o.drift * .6;
    const sh = s.shake ? (Math.random() - .5) * s.shake : 0;
    s.cam.position.set(s.focus.x + Math.sin(az) * Math.cos(el) * dist + sh, Math.sin(el) * dist + .6 + sh, s.focus.z + Math.cos(az) * Math.cos(el) * dist);
    s.cam.lookAt(s.focus.x, .5, s.focus.z + 2.6 * (1 - o.el / 90));   // đẩy cảnh lên trên hộp thoại
    // nhân vật đứng luôn quay mặt về máy quay (như hình cắt giấy dựng đứng)
    for (const k in s.figs) {
      const F = s.figs[k]; if (!F.yawFree) continue;
      const wp = F.g.getWorldPosition(new T.Vector3());
      F.g.rotation.y = Math.atan2(s.cam.position.x - wp.x, s.cam.position.z - wp.z) - s.pivot.rotation.y;
    }
    s.flames.forEach(q => { const f = 1 + Math.sin(tt * 1.3 + q.seed) * .04; q.L.intensity = 2.2 * f * (s.lightK ?? 1); q.fl.scale.set(f, 1.6 * f, f); });
    s.dust.rotation.y = Math.sin(tt * .05) * .02;
    if (s.hole) { s.hole.ring.rotation.z += .02; s.hole.ring2.rotation.z -= .013; }
    s.renderer.render(s.scene, s.cam);
  }
  function dispose(s) {
    s.dead = true;
    s.scene.traverse(o => { if (o.geometry) o.geometry.dispose(); const mm = o.material; (Array.isArray(mm) ? mm : mm ? [mm] : []).forEach(x => { if (x.map) x.map.dispose(); x.dispose(); }); });
    s.renderer.dispose(); s.cv.remove(); if (S === s) S = null;
  }

  /* ---------- Phương án dự phòng: nghiêng bản đồ bằng CSS ---------- */
  function cssEnter(o) {
    const root = $('#world'), c = $('#world .wcont'); if (!c) return;
    if (o.focus) { WS.zoom = 1.4; camera(o.focus[0], o.focus[1] + .8, true); }
    root.classList.add('persp'); (o.figs || []).forEach(f => addEnt(f.c, f.at[0], f.at[1], f.dir || 'down').el.classList.toggle('lie', !!f.lie));
    void c.offsetWidth; c.classList.add('tilt3d');
    S = { css: true, dead: false };
    return sleep(2400 * SPD());
  }

  /* ---------- API ---------- */
  async function enter(o = {}) {
    if (!WS || WS.special) return;
    exit();
    let ok = webgl();
    if (ok) { try { await timeout(load(), 8000); } catch (e) { ok = false; } }
    if (!ok) return cssEnter(o);
    $('#world').classList.add('is3d');
    AUDIO.sfx('whoosh');
    const s = await build(o); if (!s || s.dead) return;
    s.cv.classList.add('on');
    if (o.instant) { s.wallH(1); s.props.scale.y = 1; s.dust.material.opacity = .7; s.orbit.el = 40; s.orbit.dist = 11.5; s.orbit.drift = 1; for (const k in s.figs) if (!s.figs[k].lie) s.figs[k].mesh.rotation.x = s.figs[k].bow ? BOW : 0; return; }
    await sleep(500 * SPD());
    // 2D → 3D: máy quay nghiêng xuống, tường mọc, nhân vật đứng dậy
    const d0 = s.orbit.dist0, figs = Object.values(s.figs).filter(F => !F.lie);
    AUDIO.sfx('gong');
    await tween(4200, t => {
      const e = ease(t);
      s.orbit.el = lerp(88, 40, e); s.orbit.dist = lerp(d0, 11.5, e); s.orbit.az = lerp(0, -.35, e);
      s.wallH(t); s.props.scale.y = Math.max(.001, ease(Math.min(1, t * 1.4)));
      figs.forEach((F, i) => { const k = Math.max(0, Math.min(1, t * 1.5 - .3 - i * .06)); F.mesh.rotation.x = -Math.PI / 2 * (1 - ease(k)); });
      s.dust.material.opacity = .7 * e;
    });
    s.orbit.t0 = performance.now(); s.orbit.az = -.35; s.orbit.drift = 1;
  }
  async function add(f) {
    if (S && S.css) { const e = addEnt(f.c, f.at[0], f.at[1], f.dir || 'down'); e.el.classList.toggle('lie', !!f.lie); return; }
    if (S) await addFig(f);
    else if (WS && !WS.special) addEnt(f.c, f.at[0], f.at[1], f.dir || 'down');
  }
  async function pose(c, p = {}) {
    const F = S && S.figs && S.figs[c]; if (!F) return;
    const a = F.mesh.rotation.x, b = p.lie ? -Math.PI / 2 : p.bow ? BOW : 0;
    await tween(p.ms || 1200, t => { F.mesh.rotation.x = lerp(a, b, ease(t)); });
  }
  // vùng không gian sụp đổ: 3D gập về 2D, rồi cả mặt phẳng co lại thành một điểm
  async function collapse() {
    const s = S; if (!s) return;
    if (s.css) { const c = $('#world .wcont'); if (c) c.classList.add('crush'); AUDIO.sfx('boom'); await sleep(2200 * SPD()); return; }
    const T = s.THREE, figs = Object.values(s.figs);
    AUDIO.sfx('glitch'); s.shake = .05;
    await tween(1600, t => {
      const e = ease(t); s.wallH(1 - e); s.props.scale.y = Math.max(.001, 1 - e);
      figs.forEach(F => { if (!F.lie) F.mesh.rotation.x = -Math.PI / 2 * e; });
      s.orbit.el = lerp(40, 70, e); s.dust.material.opacity = .7 * (1 - e);
    });
    figs.forEach(F => { F.yawFree = false; });
    // hố đen
    const hole = new T.Group(); hole.position.set(s.focus.x, .7, s.focus.z);
    const core = new T.Mesh(new T.SphereGeometry(1, 32, 24), new T.MeshBasicMaterial({ color: '#000' }));
    const ring = new T.Mesh(new T.TorusGeometry(1.5, .07, 12, 96), new T.MeshBasicMaterial({ color: s.col('#e0402f') }));
    const ring2 = new T.Mesh(new T.TorusGeometry(1.9, .05, 12, 96), new T.MeshBasicMaterial({ color: s.col('#9a6bff') }));
    ring.rotation.x = Math.PI / 2.3; ring2.rotation.x = Math.PI / 1.8;
    hole.add(core, ring, ring2); hole.scale.setScalar(.001); s.scene.add(hole); s.hole = { ring, ring2 };
    AUDIO.sfx('boom'); s.shake = .12;
    await tween(3400, t => {
      const e = ease(t);
      s.pivot.rotation.y = e * e * 6; s.pivot.scale.setScalar(Math.max(.001, 1 - e));
      hole.scale.setScalar(Math.max(.001, Math.sin(Math.min(1, t * 1.15) * Math.PI) * 1.6));
      s.rim.intensity = 6 * Math.sin(t * Math.PI); s.lightK = 1 - e; s.amb.intensity = .1 * (1 - e); s.sun.intensity = .55 * (1 - e); s.key.intensity = 1.1 * (1 - e);
      s.orbit.dist = lerp(11.5, 15, e); s.shake = .12 * (1 - e);
    });
    s.cv.classList.add('out'); await sleep(700 * SPD());
  }
  function exit() {
    const root = $('#world'); if (root) root.classList.remove('is3d', 'persp');
    if (S && !S.css) dispose(S);
    S = null;
  }
  return { load, enter, add, pose, collapse, exit, get on() { return !!S; } };
})();
