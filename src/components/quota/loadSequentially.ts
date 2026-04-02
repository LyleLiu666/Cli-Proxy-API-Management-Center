export async function loadSequentially<TInput, TOutput>(
  items: TInput[],
  worker: (item: TInput, index: number) => Promise<TOutput>
): Promise<TOutput[]> {
  const results: TOutput[] = [];
  for (const [index, item] of items.entries()) {
    results.push(await worker(item, index));
  }
  return results;
}
