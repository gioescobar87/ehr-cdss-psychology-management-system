import type { ReactNode } from "react";

export interface DataTableColumn<T> {
  id: string;
  label: string;
  minWidth?: number;
  align?: "left" | "center" | "right";
  ariaLabel?: string;

  render?: (row: T, index: number) => ReactNode;

  value?: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];

  getRowId: (row: T) => string | number;

  loading?: boolean;
  emptyMessage?: string;

  onRowClick?: (row: T) => void;

  ariaLabel?: string;
}
