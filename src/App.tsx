import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Overview from "./pages/Overview";
import Paths from "./pages/Paths";
import SearchPage from "./pages/SearchPage";
import Projects from "./pages/Projects";
import Project from "./pages/Project";
import ProgressPage from "./pages/ProgressPage";
import { PageHeading, LessonLinks } from "./components/LearningShared";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Search,
  Compass,
  LayoutGrid,
  FlaskConical,
  FolderOpen,
  BarChart3,
  Bookmark,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  GraduationCap,
  Download,
  Upload,
  WifiOff,
} from "lucide-react";
import { findLesson } from "./content/catalog";
import {
  download,
  emptyProgress,
  loadProgress,
  parseProgress,
  STORAGE_KEY,
  validateProgress,
  type Progress,
} from "./progress";
import LessonReader from "./components/LessonReader";
import Practice from "./components/Practice";
const nav = [
  ["Home", "home", Compass],
  ["Catalog", "catalog", LayoutGrid],
  ["Learning Paths", "paths", BookOpen],
  ["Practice", "practice", FlaskConical],
  ["Projects", "projects", FolderOpen],
  ["Progress", "progress", BarChart3],
  ["Bookmarks", "bookmarks", Bookmark],
  ["Search", "search", Search],
  ["Settings", "settings", Settings],
] as const;
function useRoute() {
  const read = () => location.hash.replace(/^#\/?/, "") || "home";
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => setRoute(read());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}
export default function App() {
  const route = useRoute(),
    [page, id] = route.split("/"),
    [menu, setMenu] = useState(false),
    [online, setOnline] = useState(navigator.onLine);
  const initial = useRef<ReturnType<typeof loadProgress> | null>(null);
  if (!initial.current) initial.current = loadProgress();
  const [progress, setProgress] = useState(initial.current.progress),
    [storageError, setStorageError] = useState(initial.current.error),
    [notice, setNotice] = useState("");
  const main = useRef<HTMLElement>(null),
    loaded = useRef(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const progressRef = useRef(progress);
  const update = useCallback((fn: (p: Progress) => Progress) => {
    const p = progressRef.current;
    const next = fn(p);
    if (next === p) return;
    try {
      validateProgress(next);
    } catch {
      setStorageError(
        "An invalid progress update was rejected. Your previous record is intact.",
      );
      return;
    }
    progressRef.current = next;
    setProgress(next);
    if (initial.current?.error) {
      setStorageError(
        "Existing saved data is unreadable and has been preserved. Export the raw saved data or restore a valid backup in Settings.",
      );
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStorageError("");
    } catch {
      setStorageError(
        "Changes are in memory only. Browser storage is unavailable; export your progress now.",
      );
    }
  }, []);
  useEffect(() => {
    const on = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      try {
        const next = event.newValue
          ? parseProgress(event.newValue)
          : emptyProgress();
        progressRef.current = next;
        setProgress(next);
      } catch {
        setStorageError(
          "Another tab wrote invalid progress. Current in-memory progress was preserved.",
        );
      }
    };
    const offlineFailed = () =>
      setNotice(
        "Offline caching is unavailable in this browser session. Learning is still available online.",
      );
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("storage", on);
    window.addEventListener("olh-offline-error", offlineFailed);
    window.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("storage", on);
      window.removeEventListener("olh-offline-error", offlineFailed);
      window.removeEventListener("keydown", escape);
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = progress.theme;
  }, [progress.theme]);
  useEffect(() => {
    setMenu(false);
    setNotice("");
    window.scrollTo(0, 0);
    if (loaded.current) main.current?.focus();
    loaded.current = true;
    document.title = `${page === "lesson" ? findLesson(id)?.title || "Lesson" : page.charAt(0).toUpperCase() + page.slice(1)} | Open Learning Hub`;
  }, [route]);
  useEffect(() => {
    const on = () => setOnline(navigator.onLine);
    window.addEventListener("online", on);
    window.addEventListener("offline", on);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", on);
    };
  }, []);
  const current =
    page === "course" || page === "lesson" || page === "project"
      ? "catalog"
      : page;
  return (
    <div className="app">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="topbar">
        <a className="brand" href="#/home" aria-label="Open Learning Hub home">
          <span className="brand-mark">
            <BookOpen size={23} />
          </span>
          <span>
            open<span className="brand-light">learning</span>
            <small>THE KNOWLEDGE IS YOURS.</small>
          </span>
        </a>
        <a
          className="top-search"
          aria-label="Search all learning content"
          href="#/search"
        >
          <Search size={17} />
          <span>What will you learn today?</span>
          <kbd>Search</kbd>
        </a>
        <div className="top-actions">
          <span className="local-badge">
            <span />
            Local-first learning
          </span>
          <button
            aria-label={`Switch to ${progress.theme === "light" ? "dark" : "light"} theme`}
            onClick={() =>
              update((p) => ({
                ...p,
                theme: p.theme === "light" ? "dark" : "light",
              }))
            }
          >
            {progress.theme === "light" ? (
              <Moon size={19} />
            ) : (
              <Sun size={19} />
            )}
          </button>
          <button
            className="menu-toggle"
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>
      <aside className={`app-sidebar ${menu ? "open" : ""}`}>
        <span className="nav-label">YOUR LEARNING SPACE</span>
        <nav aria-label="Main navigation">
          {nav.map(([label, path, Icon]) => (
            <a
              key={path}
              href={`#/${path}`}
              aria-current={current === path ? "page" : undefined}
            >
              <Icon size={19} />
              <span>{label}</span>
              {path === "catalog" && <span className="nav-count">36</span>}
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="mini-orbit">
            <GraduationCap size={27} />
          </div>
          <strong>Small steps. Lasting skills.</strong>
          <p>
            One idea, one experiment,
            <br />
            one breakthrough at a time.
          </p>
          <a href="#/paths">
            Find your direction <ArrowUpRight size={14} />
          </a>
        </div>
        <a className="legacy-link" href="./wfm-glossary.html">
          WFM glossary ↗
        </a>
      </aside>
      {menu && (
        <button
          className="menu-scrim"
          aria-label="Close navigation overlay"
          onClick={() => setMenu(false)}
        />
      )}
      <main
        id="main-content"
        className={`main ${page === "lesson" ? "reader-main" : ""}`}
        tabIndex={-1}
        ref={main}
      >
        {!online && (
          <div className="status-banner">
            <WifiOff size={17} />
            You’re offline. Cached learning remains available.
          </div>
        )}
        {storageError && (
          <div className="status-banner error" role="alert">
            {storageError}
            <a href="#/settings">Manage progress</a>
          </div>
        )}
        {notice && (
          <div className="status-banner" role="status">
            {notice}
          </div>
        )}
        {page === "home" ? (
          <Home progress={progress} />
        ) : page === "catalog" ? (
          <Catalog progress={progress} />
        ) : page === "paths" ? (
          <Paths progress={progress} />
        ) : page === "course" ? (
          <Overview id={id} progress={progress} />
        ) : page === "lesson" ? (
          <LessonReader key={id} id={id} progress={progress} update={update} />
        ) : page === "practice" ? (
          <Practice />
        ) : page === "project" ? (
          <Project key={id} id={id} progress={progress} update={update} />
        ) : page === "projects" ? (
          <Projects progress={progress} />
        ) : page === "progress" ? (
          <ProgressPage progress={progress} />
        ) : page === "bookmarks" ? (
          <>
            <PageHeading
              kicker="YOUR SAVED IDEAS"
              title="Worth coming back to."
              description="Bookmarked lessons, kept on this device."
            />
            <LessonLinks ids={progress.bookmarks} />
          </>
        ) : page === "search" ? (
          <SearchPage />
        ) : page === "settings" ? (
          <>
            <PageHeading
              kicker="MAKE YOURSELF AT HOME"
              title="Your space. Your preferences."
              description="No account, mandatory keys or background analytics."
            />
            <section className="panel">
              <h2>Appearance & reading</h2>
              <label>
                Theme
                <select
                  value={progress.theme}
                  onChange={(e) =>
                    update((p) => ({
                      ...p,
                      theme: e.target.value as Progress["theme"],
                    }))
                  }
                >
                  <option value="light">Pearl light</option>
                  <option value="dark">Evening dark</option>
                </select>
              </label>
              <label>
                Reading size
                <select
                  value={progress.fontSize}
                  onChange={(e) =>
                    update((p) => ({ ...p, fontSize: Number(e.target.value) }))
                  }
                >
                  {Array.from({ length: 9 }, (_, i) => i + 16).map((n) => (
                    <option key={n} value={n}>
                      {n}px
                    </option>
                  ))}
                </select>
              </label>
            </section>
            <section className="panel">
              <h2>Your progress belongs to you.</h2>
              <p>
                Export a backup before clearing browser data or changing
                devices. Import replaces current progress after validation.
                Results are local learning records, not verified credentials.
              </p>
              <div className="button-row">
                <button
                  onClick={() =>
                    download(
                      "open-learning-progress.json",
                      JSON.stringify(progress, null, 2),
                    )
                  }
                >
                  <Download size={16} />
                  Export progress
                </button>
                <label className="file-button">
                  <Upload size={16} />
                  Import progress
                  <input
                    aria-label="Import progress"
                    type="file"
                    accept=".json,application/json"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      try {
                        if (f.size > 1000000)
                          throw Error("Progress file exceeds 1 MB.");
                        const next = parseProgress(await f.text());
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                        initial.current!.error = "";
                        progressRef.current = next;
                        setProgress(next);
                        setStorageError("");
                        setNotice("Progress imported successfully.");
                      } catch (err) {
                        setNotice(
                          `Import rejected: ${err instanceof Error ? err.message : "invalid file"}. Existing progress was preserved.`,
                        );
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
                <button
                  onClick={() => {
                    try {
                      download(
                        "open-learning-raw-backup.txt",
                        localStorage.getItem(STORAGE_KEY) ||
                          "No stored progress.",
                        "text/plain",
                      );
                    } catch {
                      setNotice(
                        "Browser storage cannot be read. Export the in-memory progress instead.",
                      );
                    }
                  }}
                >
                  Export raw saved data
                </button>
              </div>
            </section>
            <section className="panel">
              <h2>Offline & installation</h2>
              <p>
                The production build caches the application shell and bundled
                lessons. Visit once online and allow caching to finish. Browser
                storage eviction or clearing site data removes offline access.
                On Android, use your browser’s Install app or Add to Home screen
                option when available.
              </p>
              <p className="muted">
                Physical Android installation is not verified by browser
                emulation. Legacy pages must be visited online once to cache
                them.
              </p>
            </section>
            <section className="panel">
              <h2>Legacy learning</h2>
              <p>
                Original content and original local-storage records remain
                available in the legacy readers. Exploration records are not
                converted into mastery.
              </p>
              <div className="button-row">
                <a href="./wfm-curriculum.html">Original WFM reader ↗</a>
                <a href="./python-curriculum.html">Original Python reader ↗</a>
                <a href="./legacy/index.html">Original catalog ↗</a>
              </div>
            </section>
            <section className="panel">
              <h2>Reset local learning data</h2>
              <p>
                This clears only the new platform’s progress. Export first if
                you want to keep it.
              </p>
              {confirmReset ? (
                <div className="button-row">
                  <button
                    className="danger"
                    onClick={() => {
                      try {
                        localStorage.removeItem(STORAGE_KEY);
                        initial.current!.error = "";
                        setStorageError("");
                        progressRef.current = emptyProgress();
                        setProgress(progressRef.current);
                        setConfirmReset(false);
                        setNotice("Local progress reset.");
                      } catch {
                        setNotice(
                          "Reset failed because storage is unavailable.",
                        );
                      }
                    }}
                  >
                    Confirm reset
                  </button>
                  <button onClick={() => setConfirmReset(false)}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => setConfirmReset(true)}>
                  Reset progress…
                </button>
              )}
            </section>
          </>
        ) : (
          <section className="panel">
            <h1>Page not found</h1>
            <a href="#/catalog">Return to catalog</a>
          </section>
        )}
        <footer className="footer">
          <span>Open Learning Hub · Built for curious minds.</span>
          <span>Original content · Local progress · No account needed</span>
        </footer>
      </main>
    </div>
  );
}
