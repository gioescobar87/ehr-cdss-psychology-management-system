import {
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

import type { SessionNote } from "../types/sessionContext.types";
import { formatAppointmentDate } from "../../shared/utils/dateUtils";

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

  return (
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

            {isAuthor && (
              <Button
                size="small"
                startIcon={<EditOutlinedIcon />}
                onClick={() => onEdit(note)}
              >
                Editar
              </Button>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
