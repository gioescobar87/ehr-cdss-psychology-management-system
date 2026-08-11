import { Box, Typography } from "@mui/material";

interface EmptyStateProps {
    title?: string;
    message?: string;
}

export default function EmptyState({
    title = "No data available",
    message = "There are no records to display."
}: EmptyStateProps) {
    return (
        <Box
            sx={{
                py: 6,
                textAlign: "center"
            }}
        >
            <Typography
                variant="h6"
                color="text.secondary"
            >
                {title}
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1}}
            >
                {message}
            </Typography>
        </Box>
    );
}