/// <reference lib="webworker" />
import initSqlJs from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";
self.onmessage = async ({ data }: { data: string }) => {
  try {
    if (
      typeof data !== "string" ||
      data.length > 1500 ||
      !/^\s*select\b/i.test(data) ||
      /;\s*\S|\b(attach|pragma|insert|update|delete|drop|create|replace|load_extension|zeroblob|randomblob|printf|format|group_concat|hex|unhex)\b/i.test(
        data,
      )
    )
      throw Error("Use one read-only SELECT query, up to 1500 characters.");
    const SQL = await initSqlJs({ locateFile: () => wasmUrl });
    const db = new SQL.Database();
    db.run(
      "CREATE TABLE contacts (team TEXT, handled INTEGER, offered INTEGER); INSERT INTO contacts VALUES ('CountyCare',180,200),('Premera',120,150),('SOMOS',90,100);",
    );
    const statement = db.prepare(data);
    const values: (string | number | null | Uint8Array)[][] = [];
    const columns = statement.getColumnNames();
    while (values.length < 100 && statement.step())
      values.push(
        statement
          .get()
          .map((v) => (typeof v === "string" ? v.slice(0, 5000) : v)),
      );
    statement.free();
    const rows = [{ columns, values }];
    db.close();
    self.postMessage({ rows });
  } catch (e) {
    self.postMessage({
      error: e instanceof Error ? e.message : "Query failed.",
    });
  }
};
