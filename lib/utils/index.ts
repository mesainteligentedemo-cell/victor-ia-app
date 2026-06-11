export * from "./validators";
export * from "./errors";

export function generateId(): string {
  return Math.random().toString(36).substring(7);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function delay<T>(fn: () => Promise<T>, ms: number): Promise<T> {
  return sleep(ms).then(() => fn());
}
