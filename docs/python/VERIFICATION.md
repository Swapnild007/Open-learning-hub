# Python Academy verification — approved six-chapter baseline

For the subsequent seven-chapter collections milestone and private Android workflow, see [CURRICULUM-PROGRESS.md](CURRICULUM-PROGRESS.md). The results below record the approved `3cacc30` file tree published as `15d0866`.

That follow-up supersedes the earlier 34-test checkpoint. On 23 October 2026 the final source fingerprint `f4ef18990ac5` passed:

- Clean dependency installation and zero-vulnerability audit.
- Scoped lint, 12 unit/content/storage checks and strict TypeScript/production build.
- 42 real Pyodide curriculum checks.
- **38 browser tests**, desktop Chromium and emulated Pixel 7, using Playwright's pinned Chromium 141.
- An independent Vite development-server beginner example with real stdout and no page errors.

[Public-site comparison, fixes, reproduction and limits](ANDROID-VERIFICATION.md).
[Exact check log](check-output.txt). [Exact browser log](browser-output.txt).

The public Python page is still the old static artifact. No merge, public deployment or hosted preview was performed. CI uploads a built-preview artifact after its checks pass. A phone-accessible preview deployment requires separate approval.

The Python course remains incomplete: six foundation chapters, twelve graded tasks and eighteen missing required topic groups. Physical Android keyboard, TalkBack, PWA installation, cross-browser verification, two-build cache upgrades, broader curriculum/assessment and independent editorial acceptance remain unverified.

Inherited build warnings remain: SQL.js Node-module browser externalization notices and a lazy editor/academy chunk above 500 kB. Runtime assets are approximately 23 MB. These warnings are not represented as passed learner acceptance gates.
