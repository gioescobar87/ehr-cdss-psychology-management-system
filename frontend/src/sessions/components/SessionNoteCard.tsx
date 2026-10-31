import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";

import type { SessionNote } from "../types/sessionContext.types";
import { formatAppointmentDate } from "../../shared/utils/dateUtils";
import { useSessionNoteAttachment } from "../hooks/useSessionNoteAttachment";
import PdfPreviewDialog from "../../shared/components/dialogs/PdfPreviewDialog";

interface SessionNoteCardProps {
  note: SessionNote;
  currentUserId: number;
  onEdit: (note: SessionNote) => void;
}

export default function SessionNoteCard({
  note,
  currentUserId,
  onEdit,
}: SessionNoteCardProps) {
  const isAuthor = note.usuarioId === currentUserId;
  const [previewOpen, setPreviewOpen] = useState(false);
  const attachmentQuery = useSessionNoteAttachment(note.id, {
    enabled: previewOpen,
  });

  return (
    <>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 2,
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ minWidth: 0 }}
              >
                <NotesOutlinedIcon color="action" />

                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {note.tipoNota || "Nota clínica"}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {note.usuarioNombre}
                  </Typography>
                </Box>
              </Stack>

              {note.tipoNota && (
                <Chip label={note.tipoNota} size="small" variant="outlined" />
              )}
            </Box>

            <Divider />

            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {note.contenido}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {formatAppointmentDate(note.fechaRegistro)}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                {note.archivoAdjunto && (
                  <Button
                    size="small"
                    startIcon={<AttachFileOutlinedIcon />}
                    onClick={() => setPreviewOpen(true)}
                    disabled={attachmentQuery.isFetching}
                  >
                    {attachmentQuery.isFetching
                      ? "Cargando adjunto..."
                      : "Ver adjunto"}
                  </Button>
                )}

                {isAuthor && (
                  <Button
                    size="small"
                    startIcon={<EditOutlinedIcon />}
                    onClick={() => onEdit(note)}
                  >
                    Editar
                  </Button>
                )}
              </Stack>
            </Box>

            {attachmentQuery.isError && previewOpen && (
              <Alert severity="error">
                No fue posible cargar el adjunto de la nota.
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>

      <PdfPreviewDialog
        open={previewOpen}
        file={
          attachmentQuery.data
            ? new File([attachmentQuery.data], "nota-sesion.pdf", {
                type: "application/pdf",
              })
            : null
        }
        loading={attachmentQuery.isFetching}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
}
