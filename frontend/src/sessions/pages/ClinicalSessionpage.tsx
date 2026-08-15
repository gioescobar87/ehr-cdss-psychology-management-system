import { Alert, Box, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import SessionHeader from "../components/SessionHeader";
import SessionWorkspace from "../components/SessionWorkspace";
import { useSession } from "../hooks/useSession";

export default function ClinicalSessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const sessionId = id ? Number(id) : undefined;
  const { data: session, isLoading, isError } = useSession(sessionId);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !session) {
    return (
      <Alert severity="error">No fue posible cargar la sesión clínica.</Alert>
    );
  }

  return (
    <Box>
      <SessionHeader session={session} onBack={() => navigate("/citas")} />
      <Box sx={{ mt: 3 }}>
        <SessionWorkspace session={session} />
      </Box>
    </Box>
  );
}
