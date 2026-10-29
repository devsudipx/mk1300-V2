/**
 * Ripple engine: pure math, no DOM and no HID.
 * A ripple starts at one key and a ring of light travels outward to every other key.
 * Distances are measured in key-widths (1u) between key centers from keyboard-layout.js.
 */
import { KEYBOARD_LAYOUT, KEY_COUNT } from './keyboard-layout.js';

export const KEYS = KEYBOARD_LAYOUT.map(k => ({
  index: k.index,
  name: k.name,
  cx: k.x + k.w / 2,
  cy: k.y + k.h / 2,
}));

const POS_BY_INDEX = new Map(KEYS.map((k, pos) => [k.index, pos]));

export function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360;
  const f = (n) => {
    const k = (n + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    return l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
  };
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

/**
 * opts: { mode: 'single' | 'rgb', color: [r,g,b], speed: keys/second, width: ring thickness in keys }
 * Returns null when keyIndex is not a key on this keyboard.
 */
export function createRipple(keyIndex, now, opts) {
  const origin = POS_BY_INDEX.get(keyIndex);
  if (origin === undefined) return null;
  const o = KEYS[origin];
  const dist = KEYS.map(k => Math.hypot(k.cx - o.cx, k.cy - o.cy));
  const maxDist = Math.max(...dist);
  const speed = opts.speed;
  const width = opts.width;
  return {
    t: now,
    dist,
    speed,
    width,
    mode: opts.mode,
    color: opts.color,
    hue: (now * 0.12) % 360,
    // Time (seconds) until the ring, including its trailing glow, has left the last key.
    life: (maxDist + width * 1.4) / speed,
  };
}

export function isAlive(rp, now) {
  return (now - rp.t) / 1000 < rp.life;
}

/**
 * Returns { flat, perKey, active }.
 * flat: Uint8Array(KEY_COUNT * 3) laid out by hardware key index, ready for the keyboard.
 * perKey: [{r,g,b}] in KEYBOARD_LAYOUT order, for the on-screen preview.
 * Keys that no ripple touches stay at 0,0,0, which is "light off".
 */
export function renderFrame(ripples, now, brightness = 1) {
  const acc = new Float32Array(KEYS.length * 3);
  for (const rp of ripples) {
    const t = (now - rp.t) / 1000;
    if (t < 0) continue;
    const r = t * rp.speed;
    const fade = Math.max(0, 1 - t / rp.life);
    const fadeCurve = Math.pow(fade, 0.6);
    const ahead = rp.width * 0.6;   // soft edge in front of the ring
    const behind = rp.width * 1.4;  // longer glow trailing behind the ring
    for (let i = 0; i < KEYS.length; i++) {
      const d = rp.dist[i];
      const delta = d - r; // > 0 means the ring has not reached this key yet
      let v;
      if (delta > 0) {
        if (delta >= ahead) continue;
        v = 1 - delta / ahead;
      } else {
        if (-delta >= behind) continue;
        v = 1 + delta / behind;
      }
      v = Math.pow(v, 1.5) * fadeCurve;
      let c;
      if (rp.mode === 'rgb') {
        c = hslToRgb(rp.hue + d * 28 + t * 90, 1, 0.5);
      } else {
        c = rp.color;
      }
      acc[i * 3] += c[0] * v;
      acc[i * 3 + 1] += c[1] * v;
      acc[i * 3 + 2] += c[2] * v;
    }
  }

  const flat = new Uint8Array(KEY_COUNT * 3);
  const perKey = new Array(KEYS.length);
  for (let i = 0; i < KEYS.length; i++) {
    const r = Math.min(255, Math.round(acc[i * 3] * brightness));
    const g = Math.min(255, Math.round(acc[i * 3 + 1] * brightness));
    const b = Math.min(255, Math.round(acc[i * 3 + 2] * brightness));
    perKey[i] = { r, g, b };
    const hw = KEYS[i].index * 3;
    flat[hw] = r; flat[hw + 1] = g; flat[hw + 2] = b;
  }
  return { flat, perKey, active: ripples.length > 0 };
}

/**
 * KeyboardEvent.code -> hardware key index used in keyboard-layout.js.
 * Arrow keys are approximate: on a 60% board they come from the Fn layer,
 * so they start the ripple at the nearest physical key.
 */
export const CODE_TO_INDEX = {
  Escape: 21, Backquote: 21,
  Digit1: 22, Digit2: 23, Digit3: 24, Digit4: 25, Digit5: 26, Digit6: 27,
  Digit7: 28, Digit8: 29, Digit9: 30, Digit0: 31, Minus: 32, Equal: 33, Backspace: 34,
  Tab: 42, KeyQ: 43, KeyW: 44, KeyE: 45, KeyR: 46, KeyT: 47, KeyY: 48, KeyU: 49,
  KeyI: 50, KeyO: 51, KeyP: 52, BracketLeft: 53, BracketRight: 54, Backslash: 55,
  CapsLock: 63, KeyA: 64, KeyS: 65, KeyD: 66, KeyF: 67, KeyG: 68, KeyH: 69,
  KeyJ: 70, KeyK: 71, KeyL: 72, Semicolon: 73, Quote: 74, Enter: 76,
  ShiftLeft: 84, KeyZ: 86, KeyX: 87, KeyC: 88, KeyV: 89, KeyB: 90, KeyN: 91,
  KeyM: 92, Comma: 93, Period: 94, Slash: 95, ShiftRight: 97,
  ControlLeft: 105, MetaLeft: 106, AltLeft: 107, Space: 111,
  AltRight: 115, ContextMenu: 116, ControlRight: 117,
  ArrowUp: 95, ArrowLeft: 116, ArrowDown: 117, ArrowRight: 118,
};
