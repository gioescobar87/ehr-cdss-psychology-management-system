import { Box, Button, Paper, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          textAlign: "center",
          maxWidth: 500,
        }}
      >
        <Typography variant="h3" gutterBottom>
          403
        </Typography>
        <Typography variant="h5" gutterBottom>
          Acceso denegado
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          No cuenta con autorización para acceder a este sitio.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/dashboard")}>
          Volver al inicio
        </Button>
      </Paper>
    </Box>
  );
}
