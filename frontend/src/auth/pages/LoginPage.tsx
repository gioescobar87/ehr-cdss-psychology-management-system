import { Box } from "@mui/material";

import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <LoginForm />
    </Box>
  );
}
