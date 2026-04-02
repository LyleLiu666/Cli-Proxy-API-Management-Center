import { parsePriorityValue } from '../../utils/priority.ts';

type PrioritySource = {
  priority?: unknown;
  [key: string]: unknown;
};

export const readPriorityValue = (item: PrioritySource): number | undefined =>
  parsePriorityValue(item.priority ?? item['priority']);

export const buildPriorityPatch = (value: string): { priority: number } | null => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { priority: 0 };
  }

  const priority = parsePriorityValue(trimmed);
  if (priority === undefined) return null;
  return { priority };
};
