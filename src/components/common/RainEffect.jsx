import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'rl-rain-enabled';

function getInitial() {
  if (typeof window === 'undefined') return false;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === '0') return false;
  if (stored === '1') return true;
  return false;
}

function buildScene(THREE, canvas) {
  const w = window.innerWidth;
  const h = window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w, h, false);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xc7d8c2, 30, 95);

  const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 200);
  camera.position.set(0, 0, 30);

  const COUNT = w < 640 ? 100 : w < 1200 ? 200 : 300;

  const positions = new Float32Array(COUNT * 6);
  const alphas = new Float32Array(COUNT * 2);
  const speeds = new Float32Array(COUNT);
  const drifts = new Float32Array(COUNT);

  const SPREAD_X = 90;
  const SPREAD_Y = 80;
  const SPREAD_Z = 70;
  const TOP = 35;
  const BOTTOM = -35;

  const reset = (i, fromTop = false) => {
    const idx = i * 6;
    const aIdx = i * 2;
    const x = (Math.random() - 0.5) * SPREAD_X;
    const y = fromTop ? TOP + Math.random() * 6 : (Math.random() - 0.5) * SPREAD_Y;
    const z = (Math.random() - 0.5) * SPREAD_Z;
    const length = 1.6 + Math.random() * 3.0;
    const slant = 0.16 + Math.random() * 0.10;

    // Top vertex (trail) — transparent fade
    positions[idx]     = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;
    // Bottom vertex (head, leading drop) — bright
    positions[idx + 3] = x + slant;
    positions[idx + 4] = y - length;
    positions[idx + 5] = z;

    // Brighter for drops nearer the camera (z closer to 30 = bigger alpha)
    const depth = (z + SPREAD_Z / 2) / SPREAD_Z;        // 0..1, 1=back
    const depthBoost = 1.0 - depth * 0.55;              // 0.45..1.0
    const head = (0.55 + Math.random() * 0.45) * depthBoost;

    alphas[aIdx]     = 0.0;   // tail = transparent
    alphas[aIdx + 1] = head;  // head = bright

    speeds[i] = 0.10 + Math.random() * 0.22;
    drifts[i] = 0.04 + Math.random() * 0.05;
  };

  for (let i = 0; i < COUNT; i++) reset(i);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0xd9ecff) },
    },
    vertexShader: `
      attribute float aAlpha;
      varying float vAlpha;
      void main() {
        vAlpha = aAlpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vAlpha;
      void main() {
        if (vAlpha <= 0.001) discard;
        gl_FragColor = vec4(uColor, vAlpha);
      }
    `,
    transparent: true,
    depthWrite: false,
  });

  const rain = new THREE.LineSegments(geometry, material);
  scene.add(rain);

  const posAttr = geometry.attributes.position;

  // ----- Lightning -----
  const BOLT_MAX_SEGMENTS = 60;
  const boltPositions = new Float32Array(BOLT_MAX_SEGMENTS * 6);
  const boltAlphas = new Float32Array(BOLT_MAX_SEGMENTS * 2);

  const boltGeometry = new THREE.BufferGeometry();
  boltGeometry.setAttribute('position', new THREE.BufferAttribute(boltPositions, 3));
  boltGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(boltAlphas, 1));
  boltGeometry.setDrawRange(0, 0);

  const boltMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0xeaf3ff) },
      uBrightness: { value: 0.0 },
    },
    vertexShader: `
      attribute float aAlpha;
      varying float vAlpha;
      void main() {
        vAlpha = aAlpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uBrightness;
      varying float vAlpha;
      void main() {
        float a = vAlpha * uBrightness;
        if (a <= 0.001) discard;
        gl_FragColor = vec4(uColor, a);
      }
    `,
    transparent: true,
    depthWrite: false,
  });

  const bolt = new THREE.LineSegments(boltGeometry, boltMaterial);
  bolt.frustumCulled = false;
  scene.add(bolt);

  const generateBolt = () => {
    // Pick a "zone" so different strikes happen in different areas of the sky
    const zones = [
      { xMin: -36, xMax: -10, z: -8 - Math.random() * 18 },     // far-left
      { xMin: -10, xMax:  10, z: -4 - Math.random() * 12 },     // center, closer
      { xMin:  10, xMax:  36, z: -8 - Math.random() * 18 },     // far-right
      { xMin: -28, xMax:  28, z: -22 - Math.random() * 20 },    // way back, wide
    ];
    const zone = zones[Math.floor(Math.random() * zones.length)];

    let segs = 0;
    let curX = zone.xMin + Math.random() * (zone.xMax - zone.xMin);
    let curY = 28 + Math.random() * 8;
    const z = zone.z;
    const targetY = -10 - Math.random() * 18;
    const stepCount = 14 + Math.floor(Math.random() * 8);
    const stepY = (targetY - curY) / stepCount;
    const jitter = 1.6 + Math.random() * 2.0;

    for (let i = 0; i < stepCount && segs < BOLT_MAX_SEGMENTS; i++) {
      const nextX = curX + (Math.random() - 0.5) * jitter;
      const nextY = curY + stepY;

      const idx = segs * 6;
      boltPositions[idx]     = curX;
      boltPositions[idx + 1] = curY;
      boltPositions[idx + 2] = z;
      boltPositions[idx + 3] = nextX;
      boltPositions[idx + 4] = nextY;
      boltPositions[idx + 5] = z;

      const aIdx = segs * 2;
      boltAlphas[aIdx]     = 1.0;
      boltAlphas[aIdx + 1] = 1.0;
      segs++;

      // Occasional fork
      if (segs < BOLT_MAX_SEGMENTS - 4 && Math.random() < 0.22) {
        const branchSteps = 2 + Math.floor(Math.random() * 4);
        let bx = nextX;
        let by = nextY;
        for (let j = 0; j < branchSteps && segs < BOLT_MAX_SEGMENTS; j++) {
          const bnX = bx + (Math.random() - 0.5) * jitter * 1.4;
          const bnY = by + stepY * (0.45 + Math.random() * 0.4);
          const bIdx = segs * 6;
          boltPositions[bIdx]     = bx;
          boltPositions[bIdx + 1] = by;
          boltPositions[bIdx + 2] = z;
          boltPositions[bIdx + 3] = bnX;
          boltPositions[bIdx + 4] = bnY;
          boltPositions[bIdx + 5] = z;

          const baIdx = segs * 2;
          const fade = Math.max(0.15, 0.85 - j * 0.18);
          boltAlphas[baIdx]     = fade;
          boltAlphas[baIdx + 1] = fade;
          segs++;
          bx = bnX;
          by = bnY;
        }
      }

      curX = nextX;
      curY = nextY;
    }

    boltGeometry.attributes.position.needsUpdate = true;
    boltGeometry.attributes.aAlpha.needsUpdate = true;
    boltGeometry.setDrawRange(0, segs * 2);
  };

  return {
    renderer,
    scene,
    camera,
    geometry,
    material,
    posAttr,
    speeds,
    drifts,
    COUNT,
    BOTTOM,
    TOP,
    reset,
    boltMaterial,
    boltGeometry,
    generateBolt,
  };
}

export default function RainEffect() {
  const [on, setOn] = useState(getInitial);
  const canvasRef = useRef(null);
  const flashRef = useRef(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
    document.body.classList.toggle('rl-rain-on', on);
    return () => document.body.classList.remove('rl-rain-on');
  }, [on]);

  useEffect(() => {
    if (!on) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let cleanup = () => {};
    let cancelled = false;

    import('three').then((THREE) => {
      if (cancelled || !canvasRef.current) return;

      const ctx = buildScene(THREE, canvas);
      const { renderer, scene, camera, geometry, material, posAttr, speeds, drifts, COUNT, BOTTOM, reset, boltMaterial, boltGeometry, generateBolt } = ctx;

      const arr = posAttr.array;
      let running = true;
      let raf = 0;

      // Lightning state
      let nextStrikeAt = performance.now() + 3000 + Math.random() * 7000;
      let strikeStart = -1;
      let strikeDuration = 260;
      let flashTimer = 0;
      const triggerFlash = (intensity) => {
        const el = flashRef.current;
        if (!el) return;
        el.style.opacity = String(intensity);
        clearTimeout(flashTimer);
        flashTimer = setTimeout(() => {
          if (flashRef.current) flashRef.current.style.opacity = '0';
        }, 110);
      };

      const onResize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      window.addEventListener('resize', onResize);

      const tick = () => {
        if (!running) return;
        for (let i = 0; i < COUNT; i++) {
          const idx = i * 6;
          const dy = speeds[i];
          const dx = drifts[i] * dy;
          arr[idx + 1] -= dy;
          arr[idx + 4] -= dy;
          arr[idx]     -= dx;
          arr[idx + 3] -= dx;

          if (arr[idx + 4] < BOTTOM) {
            reset(i, true);
          }
        }
        posAttr.needsUpdate = true;

        // Lightning lifecycle
        const now = performance.now();
        if (strikeStart < 0 && now >= nextStrikeAt) {
          generateBolt();
          strikeStart = now;
          strikeDuration = 220 + Math.random() * 180;
          triggerFlash(0.35 + Math.random() * 0.25);
          nextStrikeAt = now + strikeDuration + 4500 + Math.random() * 9000;
        }

        if (strikeStart >= 0) {
          const elapsed = now - strikeStart;
          if (elapsed >= strikeDuration) {
            boltMaterial.uniforms.uBrightness.value = 0;
            boltGeometry.setDrawRange(0, 0);
            strikeStart = -1;
          } else {
            const t = elapsed / strikeDuration;
            // initial bright spike, decaying with a flicker partway through
            let b = Math.exp(-t * 4.5) * 1.4;
            if (elapsed > 70 && elapsed < 110) b *= 1.6;     // flicker 1
            if (elapsed > 160 && elapsed < 190) b *= 1.25;   // flicker 2
            boltMaterial.uniforms.uBrightness.value = Math.min(1.6, b);
            // Re-flash slightly on flicker
            if (elapsed > 70 && elapsed < 80) triggerFlash(0.25);
          }
        }

        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };

      if (reduceMotion) {
        renderer.render(scene, camera);
      } else {
        tick();
      }

      const onVisibility = () => {
        if (document.hidden) {
          running = false;
          cancelAnimationFrame(raf);
        } else if (!running && !reduceMotion) {
          running = true;
          tick();
        }
      };
      document.addEventListener('visibilitychange', onVisibility);

      cleanup = () => {
        running = false;
        cancelAnimationFrame(raf);
        clearTimeout(flashTimer);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', onVisibility);
        geometry.dispose();
        material.dispose();
        boltGeometry.dispose();
        boltMaterial.dispose();
        renderer.dispose();
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [on]);

  return (
    <>
      {on && (
        <div className="rl-rain" aria-hidden="true">
          <span className="rl-rain-fog" />
          <canvas ref={canvasRef} className="rl-rain-canvas" />
          <span ref={flashRef} className="rl-rain-flash" />
        </div>
      )}
      <button
        type="button"
        className="rl-rain-toggle"
        aria-label={on ? 'Turn off rain effect' : 'Turn on rain effect'}
        title={on ? 'Pause the rain' : 'Make it rain'}
        onClick={() => setOn((v) => !v)}
      >
        <i className={on ? 'fas fa-cloud-rain' : 'fas fa-cloud-sun'} aria-hidden="true" />
      </button>
    </>
  );
}
