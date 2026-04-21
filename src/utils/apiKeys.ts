export function normalizeApiKeyList(input: unknown): string[] {
  if (!Array.isArray(input)) return [];

  return input.flatMap((item) => {
    const record =
      item !== null && typeof item === 'object' && !Array.isArray(item)
        ? (item as Record<string, unknown>)
        : null;
    const value =
      typeof item === 'string'
        ? item
        : record
          ? (record['api-key'] ?? record['apiKey'] ?? record.key ?? record.Key)
          : '';
    const trimmed = String(value ?? '').trim();
    return trimmed ? [trimmed] : [];
  });
}
