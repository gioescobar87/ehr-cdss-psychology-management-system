import { Box, Typography } from "@mui/material";
import { type ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
}

export default function PageHeader({
    title,
    description,
    actions
}: PageHeaderProps) {
    return(
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 3,
                gap: 2
            }}
        >
            <Box>
                <Typography
                    variant="h4"
                    component="h1"
                >
                    {title}
                </Typography>
                {description && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{mt: 0.5}}
                    >
                        {description}
                    </Typography>
                )}
            </Box>
            {actions && (
                <Box>
                    {actions}
                </Box>
            )}
        </Box>
    );
}