import { Box, Button } from "@mui/material";

interface FormActionsProps {
    onCancel?: () => void;
    submitText?: string;
    cancelText?: string;
    loading?: boolean;
    disabled?: boolean;
}

export default function FormActions({
    onCancel,
    submitText = "Save",
    cancelText = "Cancel",
    loading = false,
    disabled = false
}: FormActionsProps) {

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3
            }}
        >

            {onCancel && (
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={loading}
                >
                    {cancelText}
                </Button>
            )}

            <Button
                type="submit"
                variant="contained"
                disabled={loading || disabled}
            >
                {loading
                    ? "Saving..."
                    : submitText}
            </Button>

        </Box>
    );
}