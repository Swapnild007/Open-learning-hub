/* Dedicated disposable worker: no DOM, no application storage, no retained globals. */
self.onmessage = async ({ data }) => {
  let stdout = '', stderr = '';
  const limit = 32768;
  const append = (kind, text) => {
    if (stdout.length + stderr.length + text.length > limit) throw Error('Output limit (32 KiB) exceeded.');
    if (kind === 'stdout') stdout += text; else stderr += text;
  };
  try {
    importScripts('./python-runtime/pyodide.js');
    const python = await loadPyodide({ indexURL: new URL('./python-runtime/', self.location.href).href,
      stdin: () => { throw Error('Interactive input is unavailable. Use the supplied input data instead.'); },
      stdout: text => append('stdout', text + '\n'), stderr: text => append('stderr', text + '\n') });
    if (data.packages?.includes('pandas')) {
      await python.loadPackage('pandas');
      // Importing pandas/NumPy is runtime initialization, not learner execution.
      // Warm it before ready so slower phones keep the full execution budget.
      await python.runPythonAsync('import pandas');
    }
    // Byte writers preserve partial lines, blank lines and Unicode exactly.
    // Batched callbacks add newlines and omit unflushed print(end='') output.
    const outputDecoder = new TextDecoder();
    const errorDecoder = new TextDecoder();
    python.setStdout({ write: buffer => {
      append('stdout', outputDecoder.decode(buffer, { stream: true }));
      return buffer.length;
    } });
    python.setStderr({ write: buffer => {
      append('stderr', errorDecoder.decode(buffer, { stream: true }));
      return buffer.length;
    } });
    // Initialization diagnostics are not learner program output.
    stdout = ''; stderr = '';
    self.postMessage({ type: 'ready' });
    const scope = python.toPy({ __name__: '__main__' });
    try {
      scope.set('__code', data.code);
      await python.runPythonAsync('try:\n    exec(compile(__code, "learner.py", "exec"), globals())\nfinally:\n    __import__("sys").stdout.flush()\n    __import__("sys").stderr.flush()', { globals: scope });
      const output = stdout;
      let passed = null;
      if (data.tests) {
        scope.set('__observed_stdout', output);
        scope.set('__tests', data.tests);
        try {
          await python.runPythonAsync('exec(compile(__tests, "checks.py", "exec"), globals())', { globals: scope });
          passed = true;
        } catch (error) { passed = false; stderr = (stderr + String(error)).slice(0, limit - stdout.length); }
      }
      self.postMessage({ type: 'result', stdout: output, stderr, passed });
    } finally { scope.destroy(); }
  } catch (error) { self.postMessage({ type: 'result', stdout, stderr: (stderr + String(error)).slice(0, limit - stdout.length), passed: false }); }
};
