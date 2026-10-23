export interface RunResult {
  stdout: string;
  stderr: string;
  passed: boolean | null;
}
export function executePython(
  code: string,
  tests: string | undefined,
  packages: string[],
  onReady: () => void,
  signal: AbortSignal,
): Promise<RunResult> {
  return new Promise((resolve) => {
    let worker: Worker;
    try {
      worker = new Worker(`${import.meta.env.BASE_URL}python-worker.js`);
    } catch {
      resolve({
        stdout: "",
        stderr:
          "This browser could not start a Python worker. Enable Web Workers or use a supported browser.",
        passed: false,
      });
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    let settled = false;
    const finish = (result: RunResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      signal.removeEventListener("abort", abort);
      resolve(result);
    };
    const abort = () =>
      finish({
        stdout: "",
        stderr: "Execution stopped. The Python worker was discarded.",
        passed: false,
      });
    signal.addEventListener("abort", abort, { once: true });
    timer = setTimeout(
      () =>
        finish({
          stdout: "",
          stderr:
            "Python could not initialize within 60 seconds. Check offline readiness or retry.",
          passed: false,
        }),
      60000,
    );
    worker.onmessage = ({ data }) => {
      if (data.type === "ready") {
        clearTimeout(timer);
        onReady();
        timer = setTimeout(
          () =>
            finish({
              stdout: "",
              stderr:
                "Time limit exceeded (8 seconds). Simplify the program and run again.",
              passed: false,
            }),
          8000,
        );
      } else if (data.type === "result") finish(data);
    };
    worker.onerror = (e) =>
      finish({
        stdout: "",
        stderr:
          e.message || "Python worker failed to load. Refresh or retry online.",
        passed: false,
      });
    if (signal.aborted) abort();
    else worker.postMessage({ code, tests, packages });
  });
}
