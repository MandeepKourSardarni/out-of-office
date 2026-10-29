<div align="center">

# 🎭 OUT OF OFFICE

### Work hard. Play louder.

**A little office humour. A lot of big gestures.**

🟦 Play from one screen · 🟩 Connect an audience · 🩷 Make it a team thing

[**▶ Open the game**](https://out-of-office-0z5v.onrender.com/)  <-- click this link to play

**50 corporate phrases · 20, 30 or 40 seconds · No player accounts**

</div>

---

## 🟨 What is the game?

One person acts out a workplace word or phrase. Everyone else tries to guess it before the timer ends.

Your phrase might be **Coffee Break**, **Monday Blues** or **Spreadsheet Ninja**.

**Big gestures. Corporate energy. Zero actual work.**

## 🩷 The rules — keep it simple!

| ✅ Do this | 🚫 Skip this |
| --- | --- |
| Use actions, gestures and facial expressions. | No speaking or making word sounds. |
| Let the audience call out their guesses. | No spelling letters or writing the answer. |
| Keep the participant’s screen private. | No mouthing the words or showing the screen. |
| Keep it friendly and have fun! | No need for perfect acting. |

**Choose 20, 30 or 40 seconds for each round.** The setting locks while the timer runs.

> 💡 Optional party rule: split into teams and give one point for a correct guess. Keep scores yourself—the app does not track points.

## 🟦 Option 1: Play using only Participant View

**One screen is enough to run the whole game.** Your friends can watch you act and guess aloud without opening Audience View.

1. Open the game and choose **Participant View**.
2. Pick **20, 30 or 40 seconds**.
3. Click **Reveal Word**. Your phrase appears and the countdown starts.
4. Act it out while everyone guesses. Keep your screen to yourself!
5. Click **Reveal Next Word** when you want a fresh phrase. The next countdown starts immediately.

**You do not need to connect an audience screen.** There is no Reveal Answer button here because you can already see your word.

## 🟩 Option 2: Connect an Audience View

Great for a laptop, TV or projector that everyone can see.

1. The actor opens **Participant View** on their private device.
2. Click **Show Code**, share the code with the host, then click **Hide Code**.
3. On the audience device, open the **same game link** and choose **Audience View**.
4. Enter the code and join. The **eye button** shows or hides what you type.
5. The participant or audience host picks the round duration.
6. The participant clicks **Reveal Word**. Both screens start the same countdown.
7. When time is up, the audience host can click **Reveal Answer** to show the phrase.
8. The participant clicks **Reveal Next Word** to continue. Both screens move to the new round.

**The first audience device to join becomes the host.** Extra audience devices can watch but cannot change settings or reveal answers.

> 🔒 The audience does not receive the secret word before the answer is revealed. Connecting halfway through a game restores the current round and countdown.

## 🟧 What do the buttons do?

| Button | What happens? |
| --- | --- |
| **Reveal Word** | Shows the first phrase privately and starts the timer. |
| **Reveal Next Word** | Shows a fresh phrase and immediately starts a new timer on connected screens. |
| **Reveal Answer** | Audience host only in the interface. Shows the answer after time runs out. |
| **20 / 30 / 40** | Sets the round length before the next countdown. |
| **Show Code / Hide Code** | Shows or hides the audience join code. |
| **Restart Game** | Asks for confirmation, then resets rounds and reshuffles the phrases. |
| **Reshuffle & start again** | Appears after the final round finishes so you can play another set. |
| **Fullscreen** | Makes Audience View fill the screen, when supported by your browser. |

**Want to skip a phrase?** Click Reveal Next Word, even during a countdown. It ends the old round and starts a fresh one. Reveal the old answer first if you want the audience to see it.

**No repeats within a set:** all 50 phrases are used before you reshuffle. Restart Game starts a new shuffled set, so earlier phrases may appear again.

## 🎵 Set the mood

- **Play / Pause:** start or stop the background music.
- **Mute / Unmute:** switch the sound off or on.
- **Volume:** choose how loud it plays.

Music is optional. It starts after a user action, usually when the audience joins. Participant music is off by default. Your browser remembers the audio settings.

**Use sound on just one device** to avoid hearing overlapping music. No music account or subscription is needed.

## 🟪 If something goes wrong

| Problem | Try this |
| --- | --- |
| The website takes a while to open. | The free host may be waking up. Give it about a minute. |
| The code does not work. | Check all eight characters and use the same website link on both devices. |
| An audience screen disconnects. | Keep its tab open and reconnect to the internet. It will try again automatically. |
| Reveal Answer is disabled. | Wait until the countdown ends. Only the first audience device is the host. |
| The page has no colours or layout. | Refresh with **Ctrl + Shift + R**. If it persists, check the file paths below. |
| There is no music. | Press Play music, check Mute and Volume, and check the device’s sound. |

**Keep the participant and host tabs open.** Sessions last six hours by default. If the server restarts or the session expires, create a new session and share the new code.

---

# 🛠️ Setup & technical guide

**Just playing? You can stop reading here.** Everything below is for the person setting up or maintaining the game.

## 🧩 What you need

For players: a browser and the game link. No GitHub account, app installation, microphone or camera is required.

For local hosting: **Node.js 22.9 or newer**, including npm, from [nodejs.org](https://nodejs.org/).

The project has **no third-party dependencies**, no build step, no API keys and no database requirement.

## 💻 Run it on your computer

1. Download and extract the project.
2. Open a terminal inside the folder containing `package.json`.
3. Run:

```sh
npm start
```

4. Open **http://localhost:3000**.

You do not need `npm install`. Keep the terminal open and the computer awake while playing. Press **Ctrl + C** to stop the server.

**Do not double-click `index.html`.** The game needs its running server, even when you use only Participant View.

## 📱 Use a phone and laptop on the same Wi-Fi

1. Start the server on your computer.
2. Find that computer’s local IPv4 address:
   - **Windows:** run `ipconfig` and check the Wi-Fi IPv4 Address.
   - **Mac:** System Settings → Wi-Fi → Details → TCP/IP.
   - **Linux:** run `hostname -I`.
3. If the address is `192.168.1.25`, open **http://192.168.1.25:3000** on each device. Replace that example address with your own.
4. Create and join the game using the instructions above.

The devices must share a network that allows them to communicate. Allow Node through the computer’s firewall on private networks if needed. Guest Wi-Fi and workplace restrictions may block the connection. No router port forwarding is needed for local play.

**On your phone, `localhost` means the phone—not your computer.**

## 📂 Project files

```text
out-of-office/
  public/
    index.html       # Page content
    style.css        # Colours, layout and animations
    app.js           # Buttons, countdown display and syncing
    music.js         # Original browser-generated music
  test/
    game.test.js
    music.test.js
  server.js          # Serves the website and checks requests
  game.js            # Game rules, permissions and server timers
  words.js           # The exact 50-prompt word bank
  package.json       # Startup and test commands
  .env.example       # Optional settings template
  .gitignore
  Dockerfile
  TEST_REPORT.md
  README.md
  LICENSE
```

Keep the names and folders exactly as shown. In particular, use **`public/style.css`**, not `styles.css` or a CSS file outside `public`.

## 🐙 Upload or update on GitHub

1. Open your repository.
2. Choose **Add file → Upload files**.
3. Upload the extracted project contents, keeping the folders intact.
4. Commit the changes.

Upload the files themselves, **not the ZIP**. If replacing the full project, `package.json` should be at the repository’s main level—not inside an extra nested folder.

**For this README update alone, replace only `README.md`.** It changes the instructions, not the game.

Keep `.env.example` and `.gitignore`; never commit your own `.env` or credentials. The repository can be private if your hosting provider has access to it.

<details>
<summary><strong>Optional: upload using Git commands</strong></summary>

For a new, empty repository, run these inside the project folder:

```sh
git init
git add .
git commit -m "Add OUT OF OFFICE"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the example repository URL with yours.

</details>

## ☁️ Host online with Render

GitHub stores the files. **Render runs the server.** GitHub Pages alone cannot run this game’s multiplayer backend.

For a new deployment, connect the repository to a Render **Web Service** and use:

| Setting | Value |
| --- | --- |
| Runtime | **Node** |
| Branch | Your project branch, usually `main` |
| Root Directory | Blank if `package.json` is at repository root |
| Build Command | `node --version` |
| Start Command | `npm start` |
| Compute | **Free**, if available and suitable |

Render provides the public website link and `PORT`. Use **one server instance/process**; this project keeps sessions in memory.

For an existing deployment, commit updated files. If automatic deployment is enabled, Render deploys the commit. Otherwise select **Manual Deploy → Deploy latest commit**. After an app deployment, refresh the screens and create a new session because the server restarts.

### Free hosting: what to expect

Render’s documented limits, checked on **29 October 2026**, include:

- Sleeping after 15 minutes without inbound traffic; waking can take about a minute.
- 750 Free instance hours per workspace per month, shared across free services.
- Bandwidth and build limits. Overage charges may apply if a payment method is added; without one, services or builds can be suspended instead.
- Possible restarts, which erase this game’s active sessions.

An open game tab keeps polling and uses active hosting time. Free hosting is not a promise of permanent free service or uninterrupted availability. Check current [Render Free limits](https://render.com/docs/free) and [Web Service instructions](https://render.com/docs/web-services) before deploying.

Local hosting avoids a hosting subscription. Online hosting requires the owner’s hosting account; players do not need one.

## ⚙️ Optional configuration

The defaults work without changes. To customize local settings, copy `.env.example` to `.env`, edit it and restart the server.

| Setting | Default | What it controls |
| --- | --- | --- |
| `PORT` | `3000` | Port the server listens on |
| `HOST` | `0.0.0.0` | Allows other devices on the local network to connect |
| `SESSION_TTL_HOURS` | `6` | Fixed session lifetime from creation |
| `TRUST_PROXY` | `0` | Use `1` only behind a trusted proxy that replaces `X-Forwarded-For` |

On Render, configure environment variables in its dashboard. You do not need to upload `.env`.

<details>
<summary><strong>Optional: run with Docker</strong></summary>

With Docker installed:

```sh
docker build -t out-of-office .
docker run --rm -p 3000:3000 out-of-office
```

Then open **http://localhost:3000**.

</details>

## 🔒 How syncing and privacy work

- The server selects words, tracks the shuffled deck and sets each countdown’s end time.
- Screens request updates every **500 milliseconds** and display timers using server time. Network delays can cause brief display differences; the server decides when an answer may be revealed.
- Participant and audience access use separate, randomly generated tokens. Joining as audience never grants access to private participant state.
- Audience responses contain no secret word before the reveal. Private server files and the word bank are not served as website assets.
- The participant controls new words and restarts. Both participant and audience host can set the duration. The visible Reveal Answer button is only on the audience host’s screen; the backend also retains a participant reveal capability.
- Revisions reject stale or simultaneous actions so they cannot select conflicting words for the same round.
- Codes are hidden or masked to discourage shoulder surfing. A join code is still an invitation: share it only with your group.
- Original music is generated in the browser by `public/music.js`, included under the project’s MIT license. No recordings, external music API or subscription are needed.

### Refreshing, expiry and restarts

Refreshing the same tab normally restores its access and the current round. Brief disconnections retry automatically; the timer keeps running on the server.

Closing a tab, clearing its storage or choosing Leave may lose its private access. The join code cannot recover participant or host rights. If the host tab is lost, the participant can still continue rounds; create a new session if you need a new audience host.

Sessions expire after **six hours from creation** by default. Restart Game does not extend that lifetime. A server restart, redeployment or hosting sleep erases all sessions. Create a new session afterward.

This project supports **one server process**, up to 1,000 sessions and 99 audience joins per session. Refreshing with an existing token does not consume another join. Multiple server replicas need a shared state store, which is not included.

## 🧪 Testing and limitations

Run the automated checks with:

```sh
npm test
```

The latest recorded run passed **20 automated tests**. Remote browser checks covered participant-only play, connected audience screens, timer changes, answer privacy, round progression and removal of the redundant participant reveal button.

See [TEST_REPORT.md](TEST_REPORT.md) for exact coverage. Physical phone/Wi-Fi tests, mobile layouts, real projectors and audible music-loop quality remain unverified. This documentation update does not change game code or add new test claims.

### More troubleshooting

- **Unstyled page:** check `public/style.css`, exact lowercase spelling, successful deployment and a hard refresh.
- **Expired code or 401 error:** create a new session; the old server session is no longer available.
- **Round changed message:** a competing action was safely rejected. Let the screen refresh, then retry.
- **Too many requests:** wait a minute. Large groups sharing an IP may need adjusted rate limits in `server.js`.
- **Port already in use:** set another `PORT` and use it in the website address.
- **Audio pauses in the background:** browsers may suspend music. Gameplay recovers using server time.

---

<div align="center">

**🎭 OUT OF OFFICE · IN GOOD COMPANY**

*No spreadsheets were harmed in the making of this game.*

</div>
