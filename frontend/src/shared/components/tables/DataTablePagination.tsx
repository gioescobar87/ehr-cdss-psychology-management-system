import { Box, Pagination, Typography } from "@mui/material";

interface DataTablePaginationProps {
    page: number;
    pageCount: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page:number) => void;
}

export default function DataTablePagination({
    page,
    pageCount,
    totalItems,
    pageSize,
    onPageChange
}: DataTablePaginationProps) {

    if (totalItems === 0){
        return null;
    }

    const firstItem = page * pageSize + 1;
    const lastItem = Math.min(
        (page + 1) * pageSize, totalItems
    );

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2
            }}
        >
            <Typography
                variant="body2"
                color="text.secondary"
            >
                Mostrando {firstItem}-{lastItem} de {totalItems}
            </Typography>

            <Pagination 
                page={page + 1}
                count={pageCount}
                onChange={(_, value) => {
                    onPageChange(value - 1);
                }}
                color="primary"
            />
        </Box>
    );
}