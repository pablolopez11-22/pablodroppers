/* =========================================================
   Street Beef · el logo en 3D (portada)
   Placa metálica gruesa con el logo en la cara, labio cromado,
   tubo de neón rojo alrededor y luz de la parrilla desde abajo.
   Flota y se balancea, da un giro completo cada pocos segundos
   (o al pulsarla) y se inclina con el ratón o el dedo.
   Si el navegador no tiene WebGL, se queda la imagen plana.
   Fuente: este archivo se empaqueta con three.js en js/logo3d.js
   ========================================================= */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, CylinderGeometry, TorusGeometry, PlaneGeometry,
  MeshStandardMaterial, MeshBasicMaterial, TextureLoader, CanvasTexture, SRGBColorSpace, ACESFilmicToneMapping,
  AdditiveBlending, PMREMGenerator, AgXToneMapping, AmbientLight, DirectionalLight, PointLight, Color, DoubleSide
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

(function () {
  var canvas = document.getElementById('logo3d');
  var wrap = document.getElementById('scene');
  var hero = document.querySelector('.hero');
  if (!canvas || !wrap) return;
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var renderer;
  try { renderer = new WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'high-performance' }); }
  catch (e) { return; }
  if (!renderer.getContext()) return;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setClearColor(0x000000, 0);

  var scene = new Scene();
  var pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  var camera = new PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 5.9);

  var sign = new Group();
  scene.add(sign);

  // ---------- La placa ----------
  var R = 1, T = 0.17;
  var tex = new TextureLoader().load(canvas.dataset.tex, function () {
    wrap.classList.add('is-3d');
    ready = true;
  });
  tex.colorSpace = SRGBColorSpace;
  tex.center.set(0.5, 0.5); tex.rotation = Math.PI / 2;   // el cilindro mapea la tapa girada: se endereza
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  // la cara muestra el logo con sus colores exactos (sin que la luz lo altere)
  var face = new MeshBasicMaterial({ map: tex, toneMapped: false });
  var side = new MeshStandardMaterial({ color: 0x3a3533, roughness: 0.22, metalness: 1 });
  var disc = new Mesh(new CylinderGeometry(R, R, T, 160, 1), [side, face, face]);
  disc.rotation.x = Math.PI / 2;
  sign.add(disc);

  // capa de barniz: reflejos que barren la cara al moverse
  var gloss = new Mesh(new CylinderGeometry(R, R, 0.002, 160), new MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.12, transparent: true, opacity: 0.22, depthWrite: false }));
  gloss.rotation.x = Math.PI / 2; gloss.position.z = T / 2 + 0.002; sign.add(gloss);
  // labios cromados delante y detrás
  var chrome = new MeshStandardMaterial({ color: 0xb9b2ab, roughness: 0.18, metalness: 1 });
  [T / 2, -T / 2].forEach(function (z) {
    var lip = new Mesh(new TorusGeometry(R, 0.03, 20, 200), chrome);
    lip.position.z = z;
    sign.add(lip);
  });

  // tubo de neón
  var neonMat = new MeshBasicMaterial({ color: new Color(1, 0.12, 0.07).multiplyScalar(2.2), toneMapped: false });
  var neon = new Mesh(new TorusGeometry(R + 0.075, 0.026, 16, 220), neonMat);
  neon.position.z = 0.03;
  sign.add(neon);
  // soportes del tubo
  var clipMat = new MeshStandardMaterial({ color: 0x111010, roughness: 0.5, metalness: 0.6 });
  for (var i = 0; i < 8; i++) {
    var a = i / 8 * Math.PI * 2 + Math.PI / 8;
    var clip = new Mesh(new CylinderGeometry(0.012, 0.012, 0.09, 8), clipMat);
    clip.rotation.x = Math.PI / 2;
    clip.position.set(Math.cos(a) * (R + 0.075), Math.sin(a) * (R + 0.075), -0.01);
    sign.add(clip);
  }

  // resplandor del neón (anillo difuminado, suma de luz)
  function glowTexture(inner) {
    var c = document.createElement('canvas'); c.width = c.height = 512;
    var x = c.getContext('2d');
    x.filter = 'blur(' + (inner ? 14 : 34) + 'px)';
    x.strokeStyle = inner ? 'rgba(255,70,45,1)' : 'rgba(255,40,25,.9)';
    x.lineWidth = inner ? 16 : 46;
    x.beginPath(); x.arc(256, 256, 256 * 0.62, 0, Math.PI * 2); x.stroke();
    var t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t;
  }
  // estrías en el canto (se ven al girar)
  var ridgeMat = new MeshStandardMaterial({ color: 0x8f8780, roughness: 0.3, metalness: 1 });
  for (var j = 0; j < 3; j++) {
    var rg = new Mesh(new TorusGeometry(R + 0.004, 0.008, 8, 160), ridgeMat);
    rg.position.z = (j - 1) * T * 0.28; sign.add(rg);
  }
  var glowSize = (R + 0.075) / 0.62 * 2;
  var glowMats = [];
  [[glowTexture(false), -0.05, 1], [glowTexture(true), 0.05, 0.9]].forEach(function (g) {
    var m = new MeshBasicMaterial({ map: g[0], transparent: true, blending: AdditiveBlending, depthWrite: false, opacity: g[2], toneMapped: false, side: DoubleSide });
    var p = new Mesh(new PlaneGeometry(glowSize, glowSize), m);
    p.position.z = g[1];
    sign.add(p);
    glowMats.push(m);
  });

  // ---------- Luces ----------
  scene.add(new AmbientLight(0xffffff, 0.25));
  var key = new DirectionalLight(0xfff1dc, 1.4); key.position.set(-2.5, 3, 4); scene.add(key);
  var fire = new PointLight(0xff7a2a, 5, 9, 1.6); fire.position.set(0.3, -2.4, 1.8); scene.add(fire);
  var red = new PointLight(0xff2a1a, 4, 6, 1.5); red.position.set(1.6, 0.6, 1.2); scene.add(red);

  // ---------- Tamaño ----------
  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    dirty = true;
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  window.addEventListener('resize', resize);

  // ---------- Movimiento ----------
  var target = { x: 0, y: 0 }, user = { x: 0, y: 0 };
  function aim(cx, cy) {
    var r = canvas.getBoundingClientRect();
    target.x = Math.max(-1, Math.min(1, (cx - (r.left + r.width / 2)) / (r.width)));
    target.y = Math.max(-1, Math.min(1, (cy - (r.top + r.height / 2)) / (r.height)));
  }
  (hero || window).addEventListener('pointermove', function (e) { aim(e.clientX, e.clientY); });
  (hero || window).addEventListener('pointerleave', function () { target.x = target.y = 0; });

  var spinFrom = -1, SPIN = 1.5;               // giro completo
  function spin(now) { if (spinFrom < 0) spinFrom = now; }
  canvas.addEventListener('click', function () { spin(performance.now() / 1000); });
  var nextSpin = 4.5;

  var ready = false, dirty = true, visible = true;
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(canvas);
  var ease = function (k) { return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };

  function frame(ms) {
    requestAnimationFrame(frame);
    if (!ready || !visible || (calm && !dirty)) return;
    dirty = false;
    var t = ms / 1000;
    user.x += (target.x - user.x) * 0.06;
    user.y += (target.y - user.y) * 0.06;

    var ry = calm ? 0 : Math.sin(t * 0.55) * 0.32;
    var rx = calm ? 0 : Math.sin(t * 0.43) * 0.07;
    if (!calm && t > nextSpin) { spin(t); nextSpin = t + 9; }
    if (spinFrom >= 0) {
      var k = (t - spinFrom) / SPIN;
      if (k >= 1) spinFrom = -1; else ry += ease(k) * Math.PI * 2;
    }
    sign.rotation.y = ry + user.x * 0.6;
    sign.rotation.x = rx + user.y * 0.4;
    sign.position.y = calm ? 0 : Math.sin(t * 0.9) * 0.05;

    // la parrilla parpadea; el neón tiembla de vez en cuando
    fire.intensity = 4.5 + Math.sin(t * 7.3) * 0.9 + Math.sin(t * 13.1) * 0.6;
    var off = !calm && (t % 7.1 > 6.6 && t % 7.1 < 6.68 || t % 7.1 > 6.78 && t % 7.1 < 6.83);
    var n = off ? 0.25 : 1;
    neonMat.color.setRGB(2.2 * n, 0.26 * n, 0.15 * n);
    glowMats[0].opacity = 1 * n; glowMats[1].opacity = 0.9 * n;
    red.intensity = 4 * n;

    renderer.render(scene, camera);
  }
  resize();
  requestAnimationFrame(frame);
})();
