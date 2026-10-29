# OUT OF OFFICE

Corporate charades for office parties. One private participant screen, one audience host, optional extra audience devices, 50 prompts and original browser-generated music.

## Quick start

1. Install **Node.js 22.9 or newer** (with npm) from https://nodejs.org/ .
2. Download/extract this project. Open a terminal **inside the folder containing `package.json`**.
3. Run:

```sh
npm start
```

4. Open **http://localhost:3000** on that computer.

No `npm install` is necessary: the project has **zero external dependencies**, no build step and no API keys. `npm test` runs the included automated suite.

This is a server-backed application, not a double-click HTML file. Keep the terminal running while playing. Stop with Ctrl+C. Players only need a browser; no account, installation, microphone, camera, or music subscription.

## Phone + laptop on the same Wi-Fi (free local option)

- Keep the server computer awake and connected to the same trusted Wi-Fi as the phone.
- Find its LAN IPv4 address: Windows `ipconfig` (look under Wi-Fi for IPv4 Address); macOS System Settings → Wi-Fi → Details → TCP/IP; Linux `hostname -I`.
- If it is `192.168.1.25`, open **http://192.168.1.25:3000** on **both** devices. Substitute your actual address. `localhost` on a phone means the phone itself, not your laptop.
- Choose Participant View on the actor’s private device. Click **Show Code**, share the code, then **Hide Code**.
- Choose Audience View on the projector/laptop. Enter the masked code and click Join. The eye button toggles visibility. The **first audience device is host**; later devices only watch.
- The host selects 20/30/40 seconds. The participant clicks Reveal Word. The host can reveal the answer only when time is over. The participant then clicks Next Round.
- Allow Node through your computer firewall on **private networks** if prompted. Guest Wi-Fi/client isolation or company network policy may block device-to-device access; use an approved shared Wi-Fi network. No router port forwarding is needed for local play.

## Rules and controls

Act it out—no speaking, spelling, or mouthing! Prompts have one or two words (hyphenated compounds count as one). Duration locks during the countdown. Next Round requires the host to reveal the previous answer. After prompt 50, Next Round opens the completion screen; choose Reshuffle & start again. Restart Game asks for confirmation and resets both screens.

Participant codes are hidden by default, including after refresh. Audience entry is masked by default. Masking protects against casual shoulder surfing; it is not a password-security boundary. Anyone with a valid code may join as audience, but never receives participant permission.

Music is an original procedural instrumental, included as `public/music.js` under this project’s MIT license. It loops a four-bar harmonic sequence without downloaded recordings. Audience music starts after joining (a user interaction); if the browser prevents that, press Play music. Participant music is off by default. Play/Pause, Mute/Unmute and Volume are independent, and saved per browser/device via localStorage. Playback never starts without a user gesture. Browser/OS background throttling can interrupt music; it is optional and never affects game state. Multiple audience devices should mute all except the projector to prevent overlap.

## GitHub upload

Create an empty repository on GitHub, then either:

- Use **Add file → Upload files** and upload the **contents** of this folder, preserving `public/` and `test/`. Include `.env.example` and `.gitignore`; do not upload your own `.env`.
- Or, if Git is installed, from this folder:

```sh
git init
git add .
git commit -m "Add OUT OF OFFICE charades"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the repository URL. Never commit credentials. No real credentials are included in this project.

**GitHub Pages alone cannot run this game’s multiplayer backend.** Pages only serves static files. Uploading the repository stores the code; a Node server must run it. Serve frontend and API together at one origin for the simplest setup.

## Straightforward online option: Render Web Service

This project is ready for a Node-capable host. It is **not already published** and no hosting account has been created for you. Sites’ managed Worker hosting is a different runtime from this dependency-free Node HTTP server; this archive intentionally preserves the requested simple Node/local architecture.

1. Upload this project to GitHub.
2. Create a Render account at https://render.com/ and connect the repository.
3. Choose **New → Web Service**, not Static Site. Choose Node runtime, your branch and the root directory containing `package.json` (leave root blank if the project is at repository root).
4. Set build command `node --version` (there are no packages to install) and start command `npm start`.
5. Choose a currently available Free instance if suitable. Use **one instance/process only**. Render supplies `PORT`; the server listens on `0.0.0.0` automatically. No database or realtime subscription is needed.
6. Use the HTTPS URL Render returns on every device. Keep participant and audience tabs on that same URL.

Free-hosting facts checked against official docs on **29 October 2026**: Render Free web services sleep after 15 minutes without inbound traffic; waking can take about a minute. Workspaces share 750 Free instance hours/month. Bandwidth and build limits also apply, and services may restart. Accounts with payment methods may incur overage charges; review dashboard limits. Free services are intended for hobby/testing use and are not an always-on guarantee. Open game tabs poll and therefore consume active hosting time. **A server stop/restart/sleep loses all sessions.** Verify current terms before deploying:

- https://render.com/docs/free
- https://render.com/docs/your-first-deploy
- https://render.com/docs/web-services

Use a running local server for a no-hosting-account party, or choose an appropriate reliable Node host for an important event. This project does not promise permanent free third-party hosting. A Dockerfile is also included: `docker build -t out-of-office .` then `docker run --rm -p 3000:3000 out-of-office` (Docker installation is optional).

## Configuration

Defaults work without configuration. Optionally copy `.env.example` to `.env`, change the values, then restart:

| Variable | Default | Meaning |
| --- | --- | --- |
| `PORT` | `3000` | Listening port; cloud hosts normally supply it |
| `HOST` | `0.0.0.0` | Allows LAN devices to connect |
| `SESSION_TTL_HOURS` | `6` | Fixed lifetime from session creation, not an inactivity timeout |
| `TRUST_PROXY` | `0` | Set `1` only behind a trusted proxy that overwrites X-Forwarded-For |

Hosted platforms can configure environment variables directly; no `.env` file is needed there. No secrets, paid APIs, database, CDN, or audio service is required.

## Sync, permissions and recovery

- The Node process owns shuffled decks, the secret word, revision numbers and authoritative end timestamps. State is in RAM.
- Clients poll every 500 ms (near-real-time sync). Client displays interpolate against the server clock using request midpoint correction. Network latency may produce a brief visual difference; **the server decides when reveal is allowed**.
- Each create/join issues an independent 256-bit bearer capability. Participant and audience access are checked on every request; only the first audience token can change duration or reveal. Joining never issues participant access.
- The audience JSON contains **no `word` field** until the host successfully reveals after expiry. Server source and word-bank files are not publicly served. The exact chosen word becomes public only after reveal.
- A revision check plus synchronous state transitions prevent repeated/stale actions from selecting multiple words. A failed/stale action reports an error and refreshes state.
- Tokens live in tab-specific sessionStorage, never URLs. Refreshing the **same tab** restores permissions, round, timer and revealed answer while the server and session remain alive. Network loss retries automatically; returning to a suspended tab immediately refreshes state. The countdown does not pause for disconnected clients.
- Keep the original participant/host tabs open. Closing a tab, clearing storage, using Leave, or losing that browser session can lose its capability. There is no code-based recovery for participant/host rights: that would let audience members claim private access. If host access is lost, create a new session. Additional audience tabs can rejoin using the code but cannot take over the original host.
- Sessions expire **6 hours after creation**, even while active. Restart Game reshuffles but does not extend session expiry. Expired codes and tokens are removed. Create a new session after expiry.
- Restarting/redeploying/stopping the server erases all active sessions and tokens. Every screen must create/join a new session. There is no persistent history and no cross-instance replication. Do not use cluster mode, serverless request functions, or multiple replicas without adding a shared authoritative store.
- Limits: 1,000 concurrent sessions, 99 audience joins/session (refresh uses the same token; new joins consume slots). Basic per-IP rate limits protect session creation/join attempts. Public deployments need HTTPS from the host/reverse proxy; LAN HTTP is intended only for a trusted Wi-Fi network. Session codes are invitations, not a substitute for an organization-wide access-control system.

## Troubleshooting

- **Cannot connect from phone:** use the computer’s LAN IP, keep both devices on the same Wi-Fi, check private-network firewall allowance and client isolation, keep the server awake.
- **Code invalid/expired:** check all eight characters, same server URL and the six-hour lifetime. Server restarts invalidate every code. Create a new session if necessary.
- **Disconnected:** keep tabs open and restore Wi-Fi. It retries automatically. A 401 means the session expired/server restarted; create/join again.
- **Reveal is disabled:** the round is still running, you are a viewer rather than the first audience host, or the screen is waiting for an authoritative update. Only the host can reveal after the server deadline.
- **Buttons briefly report a round changed:** simultaneous actions were safely rejected; the screen refreshes. Retry once.
- **Cannot hear music:** press Play music, Unmute and increase Volume; also check system/tab mute. Mobile browsers may suspend audio in the background. The game does not require audio.
- **Too many requests:** wait one minute. Large offices sharing one IP may hit basic limits; review rate limits in `server.js` for your deployment.
- **Port occupied:** set a different `PORT` in `.env` and use it in each URL.
- **Free host is waking:** wait for its loading page; do not create multiple services as a workaround.

## Tests and known limitations

See **TEST_REPORT.md** for the exact automated and browser checks performed and checks still requiring physical devices. The tests use a fake server clock for duration boundaries; no production backdoor for changing time is included. `npm test` requires no dependency installation.

Project files: `server.js` (HTTP/security), `game.js` (authoritative game), `words.js` (private bank), `public/` (responsive UI/music), `test/` (Node tests), `.env.example`, `Dockerfile`, documentation and license.
