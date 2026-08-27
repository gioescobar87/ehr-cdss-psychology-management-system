import { useEffect, useMemo } from "react";

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
} from "@mui/material";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";

interface PdfPreviewDialogProps {
    open: boolean;
    file: File | null;
    onClose: () => void;
}

export default function PdfPreviewDialog({
    open,
    file,
    onClose,
}: PdfPreviewDialogProps) {
    const objectUrl = useMemo(() => {
        if (!file) {
            return null;
        }

        return URL.createObjectURL(file);
    }, [file]);

    useEffect(() => {
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [objectUrl]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            fullScreen
        >
            <DialogTitle>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{ minWidth: 0 }}
                >
                    <PictureAsPdfOutlinedIcon color="error" />

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            noWrap
                        >
                            Vista previa del documento
                        </Typography>

                        {file && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                noWrap
                            >
                                {file.name}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </DialogTitle>

            <DialogContent
                dividers
                sx={{
                    p: 0,
                    bgcolor: "grey.100",
                    overflow: "hidden",
                }}
            >
                {objectUrl ? (
                    <Box
                        component="iframe"
                        src={objectUrl}
                        title="Vista previa del PDF"
                        sx={{
                            display: "block",
                            width: "100%",
                            height: "100%",
                            minHeight: "calc(100vh - 140px)",
                            border: 0,
                            bgcolor: "background.paper",
                        }}
                    />
                ) : (
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            height: "100%",
                            minHeight: 400,
                        }}
                    >
                        <Typography color="text.secondary">
                            No hay un documento disponible
                            para visualizar.
                        </Typography>
                    </Stack>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                    onClick={onClose}
                    startIcon={<CloseOutlinedIcon />}
                >
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}