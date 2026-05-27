import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";
import type { IngestSkip } from "@dave/shared";
import type { ParseResult, Schema } from "./jsonl.parser.js";

export async function parseCsv<T>(
  absolutePath: string,
  schema: Schema<T>,
): Promise<ParseResult<T>> {
  const raw = await readFile(absolutePath, "utf8");

  const nonEmptyLineCount = raw.split(/\r?\n/).filter((line) => line.trim().length > 0).length;
  const expectedDataRows = Math.max(0, nonEmptyLineCount - 1);

  let rows: Record<string, string>[];
  try {
    rows = parse(raw, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      skip_records_with_error: true,
    });
  } catch (err) {
    return {
      records: [],
      skipped: [
        {
          row: 0,
          reason: `CSV parse failed: ${err instanceof Error ? err.message : String(err)}`,
        },
      ],
    };
  }

  const records: T[] = [];
  const skipped: IngestSkip[] = [];

  for (let i = 0; i < rows.length; i++) {
    const rowNumber = i + 2;

    const parsed = schema.safeParse(rows[i]);
    if (!parsed.success) {
      skipped.push({
        row: rowNumber,
        reason: `validation failed: ${parsed.error.issues
          .map((issue) => `${issue.path.join(".") || "<root>"} ${issue.message}`)
          .join("; ")}`,
      });
      continue;
    }

    records.push(parsed.data);
  }

  const silentlyDropped = expectedDataRows - rows.length;
  if (silentlyDropped > 0) {
    skipped.push({
      row: 0,
      reason: `${silentlyDropped} row${silentlyDropped === 1 ? "" : "s"} unparseable (likely malformed CSV: bad quoting or escapes)`,
    });
  }

  return { records, skipped };
}
