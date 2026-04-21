import { parseLogLine } from './logParsing.ts';
import type { ParsedLogLine } from './logTypes.ts';

export interface ParsedLogEntry {
  raw: string;
  rawLower: string;
  parsed: ParsedLogLine;
}

export function buildParsedLogEntries(lines: string[]): ParsedLogEntry[] {
  return lines.map((line) => ({
    raw: line,
    rawLower: line.toLowerCase(),
    parsed: parseLogLine(line),
  }));
}

export function filterParsedLogEntries(
  entries: ParsedLogEntry[],
  options: {
    hideManagementLogs: boolean;
    managementPrefix: string;
    searchQuery: string;
  }
): ParsedLogEntry[] {
  const { hideManagementLogs, managementPrefix, searchQuery } = options;
  const queryLowered = searchQuery.toLowerCase();

  return entries.filter((entry) => {
    if (hideManagementLogs && entry.raw.includes(managementPrefix)) {
      return false;
    }

    if (queryLowered && !entry.rawLower.includes(queryLowered)) {
      return false;
    }

    return true;
  });
}
