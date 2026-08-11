import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface ConfirmationDialogProps {
    open: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationDialog({
    open,
    title = "Confirm action",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
    onConfirm,
    onCancel
}: ConfirmationDialogProps) {

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onCancel}
        >

            <DialogTitle>
                {title}
            </DialogTitle>

            <DialogContent>

                <DialogContentText>
                    {message}
                </DialogContentText>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onCancel}
                    disabled={loading}
                >
                    {cancelText}
                </Button>

                <Button
                    onClick={onConfirm}
                    variant="contained"
                    disabled={loading}
                >
                    {loading
                        ? "Processing..."
                        : confirmText}
                </Button>

            </DialogActions>

        </Dialog>
    );
}