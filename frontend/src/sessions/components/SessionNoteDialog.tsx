import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

import type { SessionNote } from "../types/sessionContext.types";
import { useCreateSessionNote } from "../hooks/usePatientClinicalContext";
import { useUpdateSessionNote } from "../hooks/useUpdateSessionNote";
import { getApiErrorMessage } from "../../shared/utils/apiError";
import { useNotification } from "../../shared/hooks/useNotification";

interface SessionNoteDialogProps {
  open: boolean;
  sessionId: number;
  note: SessionNote | null;
  onClose: () => void;
}

interface SessionNoteFormProps {
  sessionId: number;
  note: SessionNote | null;
  onClose: () => void;
}

function SessionNoteForm({ sessionId, note, onClose }: SessionNoteFormProps) {
  const isEditing = note !== null;

  const [content, setContent] = useState(note?.contenido ?? "");

  const [noteType, setNoteType] = useState(note?.tipoNota ?? "");

  const createMutation = useCreateSessionNote();
  const updateMutation = useUpdateSessionNote();

  const { showSuccess } = useNotification();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSave = () => {
    const trimmedContent = content.trim();

    if (!trimmedContent || isPending) {
      return;
    }

    const request = {
      sesionId: sessionId,
      contenido: trimmedContent,
      tipoNota: noteType.trim() || undefined,
    };

    if (isEditing && note) {
      updateMutation.mutate(
        {
          id: note.id,
          request,
        },
        {
          onSuccess: () => {
            showSuccess("La nota fue actualizada correctamente.");
            onClose();
          },
        },
      );

      return;
    }

    createMutation.mutate(request, {
      onSuccess: () => {
        showSuccess("La nota fue registrada correctamente.");
        onClose();
      },
    });
  };

  const error = createMutation.error ?? updateMutation.error;

  const errorMessage = error ? getApiErrorMessage(error) : null;

  const isSaveDisabled = !content.trim() || isPending;

  return (
    <>
      <DialogTitle>{isEditing ? "Editar nota" : "Nueva nota"}</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <TextField
            label="Asunto"
            value={noteType}
            onChange={(event) => setNoteType(event.target.value)}
            placeholder="Ej. Nota clínica, Observación, Seguimiento"
            fullWidth
            disabled={isPending}
            slotProps={{
              htmlInput: {
                maxLength: 100,
              },
            }}
          />

          <TextField
            label="Contenido"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Escriba el contenido de la nota clínica..."
            multiline
            minRows={8}
            fullWidth
            required
            disabled={isPending}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaveDisabled}
        >
          {isPending
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Registrar nota"}
        </Button>
      </DialogActions>
    </>
  );
}

export default function SessionNoteDialog({
  open,
  sessionId,
  note,
  onClose,
}: SessionNoteDialogProps) {
  /*
   * The key forces the form to remount when switching between:
   *
   * - Nueva nota
   * - Editar nota A
   * - Editar nota B
   *
   * This allows the form state to be initialized directly from
   * the selected note without synchronizing state inside an effect.
   */
  const formKey = note ? `edit-${note.id}` : "create";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <SessionNoteForm
        key={formKey}
        sessionId={sessionId}
        note={note}
        onClose={onClose}
      />
    </Dialog>
  );
}
