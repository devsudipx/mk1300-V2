# MK1300 V2 Ripple

Press a key, a ripple of light spreads from that key across the whole keyboard.
Idle = all lights off. Single color or RGB (rainbow ring).

## Run
1. Install Node.js (needed for `npx serve`).
2. Close the official MK1300 software.
3. Close ALL Chrome windows, then double-click `start.bat`.
   (It opens Chrome with `--disable-hid-blocklist`, same as kicktroll's tool.)
4. Click **Connect keyboard**, pick *Gaming Keyboard*.
5. Keep that tab focused and type. You can also click keys on the on-screen keyboard.

## Notes
- Keys are only detected while this browser tab is focused (browser limit).
- The Windows key and Fn are not visible to the browser, so they cannot start a ripple.
- "Fast send" streams frames without waiting for replies. If the lights flicker or lag, untick it.
- "Hardware rev 20": try it if the keyboard does not react (same switch as the original tool).
- If lights stay off after closing the page, unplug and replug the keyboard.

## Credits
`hid-driver.js`, `keyboard-layout.js` and `LICENSE` come from
https://github.com/kicktroll/mk1300v2_RGB (Apache-2.0), unchanged.
`ripple-engine.js` and `index.html` are new.
