import { useState } from "react";

import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@mui/material";

interface CancellationDialogProps {
    open: boolean;
    loading?: boolean;
    error?: string | null;
    onClose: () => void;
    onConfirm: (
        reason: string
    ) => void | Promise<void>;
}

export default function CancellationDialog({
    open,
    loading = false,
    error = null,
    onClose,
    onConfirm
}: CancellationDialogProps) {

    const [
        motivoCancelacion,
        setMotivoCancelacion
    ] = useState("");

    const handleClose = () => {

        if (loading) {
            return;
        }

        setMotivoCancelacion("");

        onClose();
    };

    const handleSubmit = async () => {

        const motivo =
            motivoCancelacion.trim();

        if (!motivo || loading) {
            return;
        }

        await onConfirm(motivo);

        setMotivoCancelacion("");
    };

    const hasInvalidReason =
        motivoCancelacion.length > 0 &&
        !motivoCancelacion.trim();

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>
                Cancelar cita
            </DialogTitle>


            <DialogContent>

                <Alert
                    severity="warning"
                    sx={{
                        mb: 2,
                        mt: 1
                    }}
                >
                    Esta acción cambiará el estado de
                    la cita a cancelada.
                </Alert>


                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>
                )}


                <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Motivo de cancelación"
                    value={motivoCancelacion}
                    onChange={event =>
                        setMotivoCancelacion(
                            event.target.value
                        )
                    }
                    required
                    error={hasInvalidReason}
                    helperText={
                        hasInvalidReason
                            ? "El motivo de cancelación es obligatorio."
                            : undefined
                    }
                    disabled={loading}
                    autoFocus
                />

            </DialogContent>


            <DialogActions>

                <Button
                    onClick={handleClose}
                    disabled={loading}
                >
                    Volver
                </Button>


                <Button
                    variant="contained"
                    color="error"
                    onClick={handleSubmit}
                    disabled={
                        !motivoCancelacion.trim() ||
                        loading
                    }
                >
                    {loading
                        ? "Cancelando..."
                        : "Confirmar cancelación"}
                </Button>

            </DialogActions>

        </Dialog>
    );
}