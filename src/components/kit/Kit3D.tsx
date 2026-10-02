"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { KIT } from "@/content/site";
import { KitBox } from "@/components/KitBox";

// Box size in inches, from the manufacturer's sheet.
const W = 7, D = 5, H = 2.5, T = 0.08, TUCK = 2.1, EAR = 1.4;
const LID = D - 2.5 * T;
const HALF = Math.PI / 2;
const PARTS_3D = ["Scenario cards", "Poker-style chips", "Two dice", "Bid tokens", "Drawstring bag", "Rules card"];

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (v: number) => v * v * (3 - 2 * v);
const lerp = (a: number, b: number, v: number) => a + (b - a) * v;

function logoTexture() {
  const c = document.createElement("canvas");
  c.width = 700; c.height = 494;
  const g = c.getContext("2d")!;
  g.fillStyle = "#cba57c"; g.fillRect(0, 0, c.width, c.height);
  const hs = [0.17, 0.3, 0.5, 0.68, 0.92, 0.92, 0.6, 0.42, 0.24, 0.14];
  hs.forEach((h, i) => {
    g.fillStyle = i === 4 || i === 5 ? "#f5b81f" : "#74777e";
    const bh = h * 260;
    g.fillRect(104 + i * 51, 380 - bh, 36, bh);
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

function diceTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = "#ffffff"; g.fillRect(0, 0, 128, 128);
  g.fillStyle = "#141a2e";
  for (const [x, y] of [[34, 34], [94, 34], [64, 64], [34, 94], [94, 94]]) { g.beginPath(); g.arc(x, y, 11, 0, 7); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function build() {
  const outside = new THREE.MeshStandardMaterial({ color: "#c9a276", roughness: 0.95 });
  const inside = new THREE.MeshStandardMaterial({ color: "#d8b68d", roughness: 0.95 });
  const edge = new THREE.LineBasicMaterial({ color: "#3a2c1d" });
  const logo = new THREE.MeshStandardMaterial({ map: logoTexture(), roughness: 0.95 });

  // A cardboard panel lying flat, offset so its hinge edge sits at the parent's origin.
  function panel(w: number, d: number, cx: number, cz: number, bottom: THREE.Material = outside) {
    const geo = new THREE.BoxGeometry(w, T, d);
    const mesh = new THREE.Mesh(geo, [inside, inside, inside, bottom, inside, inside]);
    mesh.position.set(cx, 0, cz);
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edge));
    return mesh;
  }
  const hinge = (x: number, z: number, parent: THREE.Object3D, child: THREE.Object3D) => {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.add(child); parent.add(g); return g;
  };

  const root = new THREE.Group();
  root.add(panel(W, D, 0, 0));
  const front = hinge(0, D / 2, root, panel(W, H, 0, H / 2));
  const back = hinge(0, -D / 2, root, panel(W, H, 0, -H / 2));
  const left = hinge(-W / 2, 0, root, panel(H, D - T, -H / 2, 0));
  const right = hinge(W / 2, 0, root, panel(H, D - T, H / 2, 0));
  const lid = hinge(0, -H, back, panel(W, LID, 0, -LID / 2, logo));
  const tuck = hinge(0, -LID, lid, panel(W - 4 * T, TUCK, 0, -TUCK / 2));
  const earL = hinge(-(W / 2 - 1.5 * T), -LID / 2, lid, panel(EAR, LID * 0.8, -EAR / 2, 0));
  const earR = hinge(W / 2 - 1.5 * T, -LID / 2, lid, panel(EAR, LID * 0.8, EAR / 2, 0));

  // Contents
  const contents = new THREE.Group();
  const items: THREE.Mesh[] = [];
  const add = (part: string, mesh: THREE.Mesh, x: number, y: number, z: number) => {
    mesh.position.set(x, y, z); mesh.userData.part = part; contents.add(mesh); items.push(mesh); return mesh;
  };
  const mat = (color: string, rough = 0.6) => new THREE.MeshStandardMaterial({ color, roughness: rough });
  add("Rules card", new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.03, 4.5), mat("#f4f7fd")), 1.4, T / 2 + 0.02, 0);
  const cardTop = mat("#1f3fd1");
  add("Scenario cards", new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.62, 3.5), [mat("#ffffff"), mat("#ffffff"), cardTop, cardTop, mat("#ffffff"), mat("#ffffff")]), -1.85, T / 2 + 0.31, 0);
  const chip = new THREE.CylinderGeometry(0.72, 0.72, 0.12, 40);
  ([["#ffc629", 0.5, -1.45, 6], ["#8e96a8", 2.15, -1.45, 4], ["#1f3fd1", 1.3, -0.2, 5]] as const).forEach(([color, x, z, n]) => {
    for (let i = 0; i < n; i++) add("Poker-style chips", new THREE.Mesh(chip, mat(color, 0.45)), x, T / 2 + 0.1 + i * 0.125, z);
  });
  const dieMat = new THREE.MeshStandardMaterial({ map: diceTexture(), roughness: 0.4 });
  const die = new THREE.BoxGeometry(0.62, 0.62, 0.62);
  add("Two dice", new THREE.Mesh(die, dieMat), 2.5, T / 2 + 0.36, 0.4).rotation.y = 0.4;
  add("Two dice", new THREE.Mesh(die, dieMat), 2.7, T / 2 + 0.36, 1.2).rotation.y = -0.3;
  const token = new THREE.CylinderGeometry(0.4, 0.4, 0.09, 6);
  for (let i = 0; i < 5; i++) add("Bid tokens", new THREE.Mesh(token, mat("#d9b98f", 0.8)), 2.4 + (i % 2) * 0.05, T / 2 + 0.1 + i * 0.095, 1.95);
  const bag = add("Drawstring bag", new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 20), mat("#162c96", 0.95)), 0.75, T / 2 + 0.5, 1.45);
  bag.scale.set(1, 0.58, 1);
  root.add(contents);

  function fold(t: number) {
    const a = ease(clamp(t / 0.45));
    const b = ease(clamp((t - 0.5) / 0.5));
    const e = ease(clamp((t - 0.45) / 0.3));
    front.rotation.x = -a * HALF; back.rotation.x = a * HALF;
    left.rotation.z = -a * HALF; right.rotation.z = a * HALF;
    lid.rotation.x = b * HALF; tuck.rotation.x = e * HALF;
    earL.rotation.z = -e * HALF; earR.rotation.z = e * HALF;
    const s = ease(clamp((a - 0.55) / 0.45));
    contents.visible = s > 0.01; contents.scale.setScalar(Math.max(s, 0.001));
    return a;
  }
  return { root, items, fold };
}

export default function Kit3D() {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{ setT: (t: number) => void; select: (p: string | null) => void } | null>(null);
  const [t, setT] = useState(0.5);
  const [part, setPart] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const anim = useRef(0);

  useEffect(() => {
    const el = host.current!;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch { const id = requestAnimationFrame(() => setFailed(true)); return () => cancelAnimationFrame(id); }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight("#ffffff", 1.5));
    const sun = new THREE.DirectionalLight("#ffffff", 1.9); sun.position.set(6, 12, 8); scene.add(sun);
    const fill = new THREE.DirectionalLight("#dfe6f5", 0.7); fill.position.set(-8, 5, -6); scene.add(fill);
    const { root, items, fold } = build();
    scene.add(root);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
    camera.position.set(9, 9.5, 13);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false; controls.minDistance = 6; controls.maxDistance = 40; controls.maxPolarAngle = Math.PI * 0.49;
    const render = () => renderer.render(scene, camera);
    controls.addEventListener("change", render);

    function frame(v: number) {
      const a = fold(v);
      const lidUp = ease(clamp((v - 0.5) / 0.5));
      const target = new THREE.Vector3(0, lerp(0, 1.4, a), lerp(-3.6, lerp(-1.2, 0, lidUp), a));
      const dir = camera.position.clone().sub(controls.target).normalize();
      controls.target.copy(target);
      camera.position.copy(target).addScaledVector(dir, lerp(27, lerp(19, 15, lidUp), a));
      controls.update(); render();
    }
    let selected: string | null = null;
    function select(p: string | null) {
      selected = p;
      for (const m of items) {
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        for (const mm of mats as THREE.MeshStandardMaterial[]) { mm.emissive.set(m.userData.part === p ? "#5a4a00" : "#000000"); }
      }
      render();
    }
    api.current = { setT: frame, select };

    const size = () => { const w = el.clientWidth, h = el.clientHeight; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); render(); };
    const ro = new ResizeObserver(size); ro.observe(el);
    size(); frame(0.5);

    const ray = new THREE.Raycaster(); const mouse = new THREE.Vector2();
    let down = { x: 0, y: 0 };
    const onDown = (e: PointerEvent) => { down = { x: e.clientX, y: e.clientY }; };
    const onUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) return;
      const r = renderer.domElement.getBoundingClientRect();
      mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(mouse, camera);
      const hit = ray.intersectObjects(items.filter((m) => m.parent?.visible), false)[0];
      const p = hit ? (hit.object.userData.part as string) : null;
      if (p !== selected) { select(p); setPart(p); }
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);

    return () => {
      ro.disconnect(); controls.dispose(); renderer.dispose();
      renderer.domElement.remove(); api.current = null;
    };
  }, []);

  function go(v: number) { cancelAnimationFrame(anim.current); setT(v); api.current?.setT(v); }
  function glide(to: number) {
    cancelAnimationFrame(anim.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { go(to); return; }
    const from = t, ms = 300 + 1100 * Math.abs(to - from);
    let start = 0;
    const step = (now: number) => {
      if (!start) start = now;
      const k = clamp((now - start) / ms), v = lerp(from, to, ease(k));
      setT(v); api.current?.setT(v);
      if (k < 1) anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
  }
  function choose(p: string) { const next = part === p ? null : p; setPart(next); api.current?.select(next); if (next && (t < 0.3 || t > 0.62)) glide(0.5); }

  if (failed) return <div className="kit-art"><KitBox /></div>;
  const info = KIT.parts.find((p) => p.name === part);

  return (
    <div className="kit3d">
      <div className="kit3d-stage" ref={host} role="img" aria-label="3D model of the kit box. Use the slider to fold it from a flat cutout into a closed box." />
      <div className="kit3d-bar">
        <label htmlFor="fold">Fold</label>
        <span>Flat</span>
        <input id="fold" type="range" min={0} max={100} value={Math.round(t * 100)} onChange={(e) => go(Number(e.target.value) / 100)} />
        <span>Closed</span>
        <div className="btns">
          <button type="button" className="btn alt sm" onClick={() => glide(0)}>Lay flat</button>
          <button type="button" className="btn alt sm" onClick={() => glide(0.5)}>Open box</button>
          <button type="button" className="btn alt sm" onClick={() => glide(1)}>Close lid</button>
        </div>
      </div>
      <p className="muted kit3d-help">Drag to turn the box. Scroll or pinch to zoom. Tap a piece inside to see what it is.</p>
      <div className="chips" role="group" aria-label="Pieces in the kit">
        {PARTS_3D.map((p) => <button type="button" key={p} aria-pressed={part === p} className={part === p ? "chip on" : "chip"} onClick={() => choose(p)}>{p}</button>)}
      </div>
      <div aria-live="polite">{info && <p className="notice"><b>{info.name}.</b> {info.text}</p>}</div>
    </div>
  );
}
