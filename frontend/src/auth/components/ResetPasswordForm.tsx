import { useState } from "react";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

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

  const resetPasswordMutation = useResetPassword();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get("token");

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
    } catch {
      // Error is displayed below.
    }
  };

  if (!token) {
    return (
      <Paper
        elevation={4}
        sx={{
          width: 420,
          p: 5,
          bgcolor: "background.paper",
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h4" align="center">
            Enlace inválido
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
          >
            El enlace de restablecimiento de contraseña no es válido o está
            incompleto.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/forgot-password")}
          >
            Solicitar nuevo enlace
          </Button>

          <Button
            variant="text"
            onClick={() => navigate("/login")}
          >
            Volver a iniciar sesión
          </Button>
        </Stack>
      </Paper>
    );
  }

  if (resetPasswordMutation.isSuccess) {
    return (
      <Paper
        elevation={4}
        sx={{
          width: 420,
          p: 5,
          bgcolor: "background.paper",
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h4" align="center">
            Contraseña restablecida
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
          >
            Su contraseña ha sido restablecida correctamente. Ya puede
            iniciar sesión con su nueva contraseña.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/login")}
          >
            Ir a iniciar sesión
          </Button>
        </Stack>
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
        Restablecer contraseña
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        mb={4}
        align="center"
      >
        Ingrese una nueva contraseña para su cuenta.
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <Stack spacing={3}>
          <FormTextField<ResetPasswordFormData>
            control={control}
            name="newPassword"
            label="Nueva contraseña"
            type={showPassword ? "text" : "password"}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((previous) => !previous)}
                      edge="end"
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon />
                      ) : (
                        <VisibilityOutlinedIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormTextField<ResetPasswordFormData>
            control={control}
            name="confirmPassword"
            label="Confirmar contraseña"
            type={showConfirmPassword ? "text" : "password"}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword((previous) => !previous)
                      }
                      edge="end"
                      aria-label={
                        showConfirmPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffOutlinedIcon />
                      ) : (
                        <VisibilityOutlinedIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending
              ? "Restableciendo..."
              : "Restablecer contraseña"}
          </Button>

          {resetPasswordMutation.isError && (
            <Typography color="error" align="center">
              No fue posible restablecer la contraseña. El enlace puede haber
              expirado o ya haber sido utilizado.
            </Typography>
          )}

          <Button
            variant="text"
            onClick={() => navigate("/login")}
          >
            Volver a iniciar sesión
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}