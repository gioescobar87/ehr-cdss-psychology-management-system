import { Box, Button, Paper, Stack, Typography } from "@mui/material";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";

import FormTextField from "../../shared/components/forms/FormTextField";

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../schemas/resetPasswordSchema";

import { useResetPassword } from "../hooks/useResetPassword";

export default function ResetPasswordForm() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const resetPasswordMutation = useResetPassword();

  const { control, handleSubmit } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),

    defaultValues: {
      newPassword: "",

      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        token,

        newPassword: data.newPassword,
      });

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Reinicio de contraseña exitoso. Por favor ingrese de nuevo.",
        },
      });
    } catch {
      // Error is exposed through resetPasswordMutation.isError.
    }
  };

  if (!token) {
    return (
      <Paper
        elevation={4}
        sx={{
          width: 420,
          p: 5,
        }}
      >
        <Typography variant="h5" mb={2}>
          Invalid Reset Link
        </Typography>
        <Typography color="text.secondary" mb={3}>
          El enlace de reinicio de contraseña es inválido.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/login")}>
          Back to Login
        </Button>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={4}
      sx={{
        width: 420,
        p: 5,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h4" mb={1} align="center">
        Reset Password
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" mb={4}>
        Enter your new password.
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <FormTextField<ResetPasswordFormData>
            control={control}
            name="newPassword"
            label="New Password"
            type="password"
          />
          <FormTextField<ResetPasswordFormData>
            control={control}
            name="confirmPassword"
            label="Confirm Password"
            type="password"
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending
              ? "Resetting..."
              : "Reset Password"}
          </Button>

          {resetPasswordMutation.isError && (
            <Typography color="error">
              No fue posible resetear la contraseña. Por favor intente de nuevo.
            </Typography>
          )}
        </Stack>
      </Box>
    </Paper>
  );
}
