# Verification report

Date: 29 October 2026. Runtime: Node.js v24.22.1 on Linux. Browser: remote Chrome, two independent tabs at the same running server URL. No physical phones, separate physical computers, or projector were available.

## Automated tests — 11 passed, 0 failed

Command: `npm test` (`node --test`), zero installed test dependencies.

| Requirement | Evidence / result |
| --- | --- |
| Exact prompts | 50 unique prompts; maximum two space-separated words |
| Create/join | Unique 8-character code, independent tokens, first audience host, later audience viewers |
| Masking markup | HTTP integration confirms default password field and accessible eye label; live toggling also browser-checked below |
| Invalid / expired codes | Invalid code 404; fake-clock session expiry removes code and both roles’ tokens; unauthorized token 401 |
| 20 / 30 / 40 seconds | Each checked against server end timestamp, just before expiry and exactly at expiry using injected test-only clock |
| Consistent clients | Independent HTTP clients and state tests receive identical server end timestamps |
| Participant word privacy | Participant receives chosen word; audience has no `word` property, and serialized audience response excludes chosen answer |
| Early answer / permission enforcement | Audience reveal rejected 403 before deadline; viewers cannot reveal/change duration; audience cannot start/restart |
| Exact answer reveal | Revealed answer equals participant’s original prompt for every duration |
| Next Round | Secret cleared; ready state and no end timestamp; new start required |
| Restart | Explicit confirmation required; rounds/deck/state reset; stale revision rejected |
| 50-round no repeats | Full 50-round game exercised with fake clock; exact 50 distinct prompts, exhaustion and reshuffle checked |
| Reconnect state | Re-query with original capability restores same private word, deadline and revealed answer; HTTP clients can reconnect after reveal |
| Repeated / simultaneous actions | Stale and repeated starts rejected; parallel HTTP calls cannot duplicate a round |
| HTTP safety | Private source, word bank and .env routes return 404; malformed JSON-object input and cross-origin write blocked |
| Music logic | Mock Web Audio context schedules more than four 32-step loops; pause/resume, volume, mute and preference restoration checked |

Clock tests advance a fake clock; they are not claims of waiting 90 seconds on physical devices. Music mock tests validate scheduling/control logic, not sound quality or audible seamlessness.

## Browser interaction checks — performed

- Homepage visually inspected at the browser’s desktop viewport (screenshot approximately 1363 × 936). Both mode cards, spacing, headings and footer readable.
- Created participant session. Code initially hidden; Show Code displayed it, Hide Code concealed it.
- Separate audience tab: input type confirmed `password`; eye changed it to `text`, and toggled back. Invalid code submitted; rejection covered by API tests (the short-lived toast was not captured for browser verification).
- Joined with valid code and observed Audience Host status and participant/audience connection status.
- Host selected 20 seconds, participant started a round. After expiry, the host revealed **Annual Leave**, matching the participant word. Participant refresh after reveal restored that same word and state.
- Next Round reset audience to hidden answer/ready state. The next countdown did not start automatically.
- Restart dialog opened; Keep playing canceled. Reopened and confirmed Restart Game; state reset.
- Host selected 40 seconds. Both browser clients displayed **40** at start. Participant saw **Hard Stop**; audience still showed “Guess the corporate phrase!”. Audience Reveal Answer was visibly disabled during countdown and duration controls were locked.
- Reloading participant during that live round restored Hard Stop, current round and countdown. This simulates a new browser connection, not a physical Wi-Fi outage.
- Audience Play/Pause and Mute/Unmute button states changed correctly; volume slider set to 35. Participant reload retained 35 volume but audio remained off. Playback resumed on user interaction. No subjective listening test was performed.
- Desktop layout observed in both roles; focusable controls and accessible names checked through the browser accessibility tree. No full keyboard-only navigation or screen-reader audit performed.
- A transient preview/browser dispatch timeout occurred during one reveal attempt. Connection status recovered and the next reveal succeeded without losing the round.

## Not performed / remaining checks

- Actual physical-device Wi-Fi testing, physical network interruption/reconnection and real clock skew between devices.
- Mobile viewport emulation or physical phone layout testing; CSS phone breakpoints were reviewed, but rendered mobile layout remains unverified in this environment.
- A physical projector / 1920px display or native fullscreen test. A desktop browser layout was checked; large-display CSS is included.
- Browser rounds at 30 seconds (covered by automated clock tests); full 50-round browser playthrough (automated instead).
- Expired session messages through browser UI (expiry is covered by engine/HTTP authorization logic).
- Audible music loop quality, mobile audio suspension, and long-duration background-tab playback. Web Audio scheduling tested with a mock, controls checked live.
- A deliberate physical network disconnection after answer reveal; automated reconnect state checks and browser refresh after reveal passed.
- Production hosting deployment, load/stress testing or an external security audit.

## Known design limits

- Sync uses 500 ms polling, not a WebSocket stream. The server deadline is authoritative; visible countdowns can differ briefly with network delay or background throttling.
- All sessions are memory-only; server restarts/redeploys invalidate every session. Fixed six-hour expiry by default. Only a single server process is supported.
- Participant/host capabilities persist only within their original tab session. Lost original tabs cannot recover elevated rights from the public join code. Create a new session if host/participant access is lost.
- Music may pause or glitch when the OS suspends the browser. The game continues from server time.
- Repeated joins consume a per-session token allowance. Basic rate limits are not a complete internet-scale abuse defense.

Run the physical checks above before using it for a large live event. No unperformed check is represented as passed.
