import type { ComponentState } from "../state";

const PAGE_SEGMENT = "page";

export type PageDirection = "next" | "previous" | "first" | "last";

interface PaginationOptions extends Record<string, unknown> {
  offset?: number;
  pageSize?: number;
  total?: number;
}

export function isPagination(parts: string[]): boolean {
  return parts[1] === PAGE_SEGMENT;
}

/** Mutates state.options.offset. Returns the new offset, or null if unchanged. */
export function applyPagination(
  state: ComponentState,
  direction: string | undefined,
): number | null {

  const options = state.options as PaginationOptions;

  const size = Math.max(1, toInt(options.pageSize, 10));
  const maxOffset = Math.max(0, toInt(options.total, 0) - size);
  const current = clamp(toInt(options.offset, 0), 0, maxOffset);

  let next: number;

  switch (direction as PageDirection) {
    case "next":     next = current + size; break;
    case "previous": next = current - size; break;
    case "first":    next = 0;              break;
    case "last":     next = maxOffset;      break;
    default:         return null;
  }

  next = clamp(next, 0, maxOffset);
  if (next === current) return null;

  options.offset = next;
  return next;
}

/**
 * Scroll so that `index` sits `POSITION_IN_WINDOW`-th in the visible window
 * (1-based). Clamps at both ends, so a match near the top or bottom simply
 * shows the first or last window instead.
 */
const POSITION_IN_WINDOW = 1;

export function centerOn(state: ComponentState, index: number): number {

  const options = state.options as PaginationOptions;

  const size = Math.max(1, toInt(options.pageSize, 10));
  const maxOffset = Math.max(0, toInt(options.total, 0) - size);

  const offset = clamp(index - (POSITION_IN_WINDOW - 1), 0, maxOffset);

  options.offset = offset;
  return offset;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

function toInt(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.floor(n) : fallback;
}
