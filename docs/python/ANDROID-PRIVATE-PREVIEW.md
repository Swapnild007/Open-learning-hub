# Test the PR on Android without a public deployment

Use a GitHub Codespace on `codex/open-learning-hub-2`. A private forwarded port is a running development preview; it does not merge the branch or change GitHub Pages. No Codespace has been created by this change.

1. In Android Chrome, sign into GitHub and open [the development branch](https://github.com/Swapnild007/Open-learning-hub/tree/codex/open-learning-hub-2). Use Chrome's Desktop site option if GitHub's editor controls are difficult to reach.
2. Choose **Code → Codespaces → Create codespace**. Confirm the selected branch is `codex/open-learning-hub-2`, not `main`. Check your account's Codespaces availability and included usage before creating it; stop the Codespace when finished.
3. In its terminal, run the following from the repository root (Node >=22.13 and Python 3 required):

   ```bash
   git branch --show-current
   git rev-parse HEAD
   npm ci
   npm run build
   python3 -m http.server 8000 --bind 0.0.0.0 --directory dist
   ```

4. Open **Ports**, forward port **8000**, and keep **Port Visibility: Private**. Choose **Open in Browser**. Sign in as the Codespace owner if GitHub prompts. Do not select Public. The resulting HTTPS address ends in `-8000.app.github.dev`.
5. Append `/#/python/variables` to that address. For the new collections chapter use `/#/python/collections`. Keep the Codespace running while testing. A private preview URL exists only after you create/start the Codespace; no live preview address is being claimed here.

## What to check on the phone

- In Read, open worked example 1 in the coding lab. Run it and inspect actual stdout.
- Edit code. Try a missing colon and then `raise ValueError("test")`; confirm the visible summary and full stderr.
- Choose a practice task. Incorrect code must fail Check exercise; a correct solution must pass behavior checks. An example run does not complete the chapter.
- In Notes, write your own note, reload the same preview address and confirm it remains. Notes belong to that browser and preview origin. Export the notebook before deleting a Codespace or switching preview URLs.
- Review the Code tab with the Android keyboard open; check selection, scrolling, Run and the output panels. Physical-device verification remains open until performed on the phone.

The built preview uses a simple HTTP static server rather than Vite HMR, so it does not need wildcard Vite allowed-host settings. GitHub supplies HTTPS at the private forwarded URL. No production host or GitHub Pages configuration is changed.

If Codespaces is unavailable, the alternative is to serve the downloaded preview ZIP from a computer on your own network and open that computer's address on the phone. The ZIP cannot run a Web Worker reliably by opening `index.html` directly as a file in Android Chrome. A GitHub Actions preview artifact is downloadable build output, not a clickable running website.

Official reference: [GitHub: forwarding ports in your codespace](https://docs.github.com/en/codespaces/developing-in-a-codespace/forwarding-ports-in-your-codespace). This repository documents the private-port workflow; it has not launched or physically tested a Codespace on an OPPO phone.
