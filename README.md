# MK1300 Light Lab

Modern UI + ripple effect site for the **MK1300 V2** (60%) keyboard.
Kisi key par click karo (ya real keyboard type karo) — wahan se rang ki ripple poore keyboard mein phailti hai,
aur wahi frame asli keyboard par bhi jaata hai.

## Chalane ka tareeka (Windows)

1. Official MK1300 software band karo.
2. `start.bat` double-click karo. Ye local server (port 8080) chalata hai aur Chrome ko
   `--disable-hid-blocklist` flag ke saath kholta hai (ye flag zaroori hai, warna keyboard ka
   config interface Chrome ko dikhta hi nahi aur rang nahi badalta).
3. **Connect keyboard** dabao, popup mein *Gaming Keyboard* chuno.
4. Neeche **Keyboard link** log mein `✓ Device opened on vendor config interface!` aur
   `OK: custom RGB mode active` dikhna chahiye. **Test** button: Esc red, Q green, W blue.

Manual: `npx serve -l 8080 .` phir `chrome.exe --disable-hid-blocklist http://localhost:8080`
(Edge: `msedge.exe ...`). `index.html` seedha double-click karne se kaam nahi karega (ES modules ko server chahiye).

## Files

- `index.html` — naya UI + effects engine (ripple, base effects).
- `hid-driver.js`, `keyboard-layout.js` — **kickTROLL/mk1300v2_RGB se bina badlaav ke copy** (same protocol:
  vendor interface 0xFF00/0x02, `setHardwareAnimation(16, 4)` se custom mode, `setAllKeyColors(flat, KEY_COUNT)`,
  `flat[key.index*3]` mapping).
- `start.bat`, `favicon.png`, `LICENSE` — upstream se (Apache-2.0).

## Notes

- Default = **Lights off · ripple only**: keyboard band rehta hai, jis key par click/type karo wahin se ripple shuru hoti hai.
  Doosre base effects (Rainbow, Aurora…) chip se chun sakte ho.
- Site 30 fps par chalti hai, aur jab kuch light nahi ho raha tab koi kaam/packet nahi bhejti (GPU/CPU almost zero).

- Mode 16 ya 20 (UserLight) dropdown se badal sakte ho, jaise original tool ka toggle.
- Ek frame = 7 HID packets (har ek ka response wait hota hai), isliye real keyboard par animation
  screen se thodi dheemi ho sakti hai. Agar atke, to "Send live ripples to keyboard" band kar do.
- Driver mein firmware-flash aur factory-reset opcodes blocked hain (upstream safety).
