import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import type { Sesion } from "../types/session.types";
import type { SessionNote } from "../types/sessionContext.types";
import { useSessionNotes } from "../hooks/usePatientClinicalContext";
import SessionNoteCard from "./SessionNoteCard";
import SessionNoteDialog from "./SessionNoteDialog";
import { useCurrentUser } from "../../auth/hooks/useCurrentUser";

interface SessionNotesProps {
  session: Sesion;
  allowCreate?: boolean;
}

export default function SessionNotes({ session, allowCreate = true }: SessionNotesProps) {
  const { data: notes = [], isLoading, isError } = useSessionNotes(session.id);

  const { data: currentUser } = useCurrentUser();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<SessionNote | null>(null);

  const handleCreate = () => {
    setSelectedNote(null);
    setDialogOpen(true);
  };

  const handleEdit = (note: SessionNote) => {
    setSelectedNote(note);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent
          sx={{
            minHeight: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack spacing={3}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Notas
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Registre y consulte las notas clínicas de esta sesión.
                </Typography>
              </Box>

              {allowCreate && (
                <Button
                  variant="contained"
                  startIcon={<AddOutlinedIcon />}
                  onClick={handleCreate}
                >
                  Nueva nota
                </Button>
              )}
            </Box>

            {isError && (
              <Alert severity="error">
                No fue posible cargar las notas de la sesión.
              </Alert>
            )}

            {!isError && notes.length === 0 && (
              <Box
                sx={{
                  py: 6,
                  textAlign: "center",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  No hay notas registradas para esta sesión.
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Las notas se mostrarán aquí cuando existan registros para la
                  sesión.
                </Typography>
              </Box>
            )}

            {notes.map((note) => (
              <SessionNoteCard
                key={note.id}
                note={note}
                currentUserId={currentUser?.id ?? -1}
                onEdit={handleEdit}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      <SessionNoteDialog
        open={dialogOpen}
        sessionId={session.id}
        note={selectedNote}
        onClose={() => {
          setDialogOpen(false);
          setSelectedNote(null);
        }}
      />
    </>
  );
}
