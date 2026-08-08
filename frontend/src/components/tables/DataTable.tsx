import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { DataTableProps } from "./DataTable.types";
import EmptyState from "../common/EmptyState";
import LoadingSkeleton from "../feedback/LoadingSkeleton";

export default function DataTable<T>({
    columns,
    rows,
    getRowId,
    loading = false,
    emptyMessage = "No se encontraron registros.",
    onRowClick,
    ariaLabel = "Data table"
}: DataTableProps<T>) {
    if (loading) {
        return (
            <LoadingSkeleton rows={5} />
        );
    }

    if (rows.length === 0) {
        return (
            <Paper>
                <EmptyState message={emptyMessage} />
            </Paper>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label={ariaLabel}>
                <TableHead>
                    <TableRow>
                        {columns.map(column => (
                            <TableCell
                                key={column.id}
                                align={column.align}
                                sx={{
                                    minWidth: column.minWidth
                                }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow
                            key={getRowId(row)}
                            hover={!!onRowClick}
                            onClick={() => onRowClick?.(row)}
                            sx={{
                                cursor: onRowClick ? "pointer" : "default"
                            }}
                        >
                            {columns.map(column => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                >
                                    {column.render ? column.render(row, index)
                                    : column.value ? column.value(row) : null}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}