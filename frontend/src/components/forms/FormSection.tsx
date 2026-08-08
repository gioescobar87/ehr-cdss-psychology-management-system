import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface FormSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
}

export default function FormSection({
    title,
    description,
    children
}: FormSectionProps) {
    return(
        <Box sx={{mb: 4}}>
            <Typography
                variant="h6"
                component="h2"
                sx={{mb: 1}}
            >
                {title}
            </Typography>
            {description && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{mb:2}}
                >
                    {description}
                </Typography>
            )}
            <Box>
                {children}
            </Box>
        </Box>
    );
}