import type { ComponentState } from "../state";

const PAGE_SEGMENT = "page";

export type PageDirection = "next" | "previous" | "first" | "last";

interface PaginationOptions extends Record<string, unknown> {
  page?: number;
  totalPages?: number;
}

export function isPagination(parts: string[]): boolean {
  return parts[1] === PAGE_SEGMENT;
}

export function applyPagination(
  state: ComponentState,
  direction: string | undefined,
): number | null {

  const options = state.options as PaginationOptions;

  const current = toInt(options.page, 0);
  const last = Math.max(1, toInt(options.totalPages, 1)) - 1;

  let next: number;

  switch (direction as PageDirection) {
    case "next":     next = Math.min(current + 1, last); break;
    case "previous": next = Math.max(current - 1, 0);    break;
    case "first":    next = 0;                           break;
    case "last":     next = last;                        break;
    default:         return null;
  }

  if (next === current) return null;

  options.page = next;
  return next;
}

/** Jump straight to a page — used by search modals. */
export function jumpToPage(state: ComponentState, page: number): number {

  const options = state.options as PaginationOptions;

  const last = Math.max(1, toInt(options.totalPages, 1)) - 1;
  const target = Math.min(Math.max(0, Math.floor(page)), last);

  options.page = target;
  return target;
}

function toInt(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.floor(n) : fallback;
}
