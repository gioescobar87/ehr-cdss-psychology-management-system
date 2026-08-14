import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <>
      <Typography variant="h3">403</Typography>

      <Typography sx={{ mb: 3 }}>
        You do not have permission to access this page.
      </Typography>

      <Button variant="contained" onClick={() => navigate("/dashboard")}>
        Go Back
      </Button>
    </>
  );
}
