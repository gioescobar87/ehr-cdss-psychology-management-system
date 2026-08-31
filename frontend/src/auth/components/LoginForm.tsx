import { Box, Button, Paper, Stack, Typography } from "@mui/material";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { getCurrentUser } from "../api/authApi";

import { loginSchema, type LoginFormData } from "../schemas/loginSchema";

import FormTextField from "../../shared/components/forms/FormTextField";

export default function LoginForm() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const {
    control,

    handleSubmit,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      username: "",

      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);

      const profile = await getCurrentUser();

      navigate(profile.roles.includes("PSICOLOGO") ? "/citas" : "/dashboard");
    } catch {
      // The mutation error is already exposed
      // through loginMutation.isError.
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        width: 420,
        p: 5,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h4" mb={4} align="center">
        Iniciar sesión
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="username"
      >
        <Stack spacing={3}>
          <FormTextField<LoginFormData>
            control={control}
            name="username"
            label="Usuario"
          />

          <FormTextField<LoginFormData>
            control={control}
            name="password"
            label="Contraseña"
            type="password"
          />

          <Link
            to="/forgot-password"
            style={{
              textAlign: "right",
              textDecoration: "none",
            }}
          >
            Olvidé mi contraseña
          </Link>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
          {loginMutation.isError && (
            <Typography color="error">Credenciales inválidas</Typography>
          )}
        </Stack>
      </Box>
    </Paper>
  );
}
