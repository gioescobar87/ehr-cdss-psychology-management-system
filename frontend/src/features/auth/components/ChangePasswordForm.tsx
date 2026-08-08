import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextField from "../../../components/forms/FormTextField";
import { changePasswordSchema, type ChangePasswordFormData } from "../schemas/changePasswordSchema";
import { useChangePassword } from "../hooks/useChangePassword";
import { useAuth } from "../../../auth/useAuth";

export default function ChangePasswordForm() {
    const { logout } = useAuth();
    const changePasswordMutation = useChangePassword();
    const { control, handleSubmit, reset } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    });

    const onSubmit = async (
        data: ChangePasswordFormData
    ) => {
        try {
            await changePasswordMutation.mutateAsync({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });
            reset();
            logout();
        } catch {
            // Error is displayed through changePasswordMutation.isError
        }
    };

    return (
        <Paper
            elevation={4}
            sx={{
                width: 420,
                p: 5,
                bgcolor: "backgound.paper"
            }}
        >
            <Typography
                variant="h4"
                mb={1}
                align="center"
            >
                Change Password
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                mb={4}
                align="center"
            >
                Enter your current password and choose
                a new secure password.
            </Typography>
            <Box
                component="form"
                onSubmit={
                    handleSubmit(onSubmit)
                }
                autoComplete="off"
            >
                <Stack spacing={3}>
                    <FormTextField<ChangePasswordFormData>
                        control={control}
                        name="currentPassword"
                        label="Current Password"
                        type="password"
                    />
                    <FormTextField<ChangePasswordFormData>
                        control={control}
                        name="newPassword"
                        label="New Password"
                        type="password"
                    />
                    <FormTextField<ChangePasswordFormData>
                        control={control}
                        name="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={
                            changePasswordMutation.isPending
                        }
                    >
                        {
                            changePasswordMutation.isPending
                                ? "Changing Password..."
                                : "Change Password"
                        }
                    </Button>
                    {
                        changePasswordMutation.isError && (
                            <Typography
                                color="error"
                            >
                                Unable to change password.
                                Verify your current password
                                and try again.
                            </Typography>
                        )
                    }
                </Stack>
            </Box>
        </Paper>
    )
}