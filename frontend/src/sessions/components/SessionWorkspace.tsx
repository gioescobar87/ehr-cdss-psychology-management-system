import { Box, Paper, Stack, Typography } from "@mui/material";

import type { Sesion } from "../types/session.types";

interface SessionWorkspaceProps {
  session: Sesion;
}

export default function SessionWorkspace({ session }: SessionWorkspaceProps) {
  return (
    <Stack spacing={3}>
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Atención clínica
        </Typography>
        <Typography color="text.secondary">
          Registre la información correspondiente a la sesión clínica de{" "}
          {session.pacienteNombre}.
        </Typography>
      </Paper>
      <Box>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Registro clínico
        </Typography>
        <Typography color="text.secondary">
          Las notas, intervenciones, evaluaciones y demás componentes clínicos
          estarán disponibles dentre de esta sesión
        </Typography>
      </Box>
    </Stack>
  );
}
