import {
    Box,
    Button,
    Paper,
    Stack,
    Typography
} from "@mui/material";

import {
    useForm
} from "react-hook-form";

import {
    zodResolver
} from "@hookform/resolvers/zod";

import {
    useNavigate
} from "react-router-dom";

import FormTextField
    from "../../shared/components/forms/FormTextField";

import {
    forgotPasswordSchema,
    type ForgotPasswordFormData
} from "../schemas/forgotPasswordSchema";

import {
    useForgotPassword
} from "../hooks/useForgotPassword";


export default function ForgotPasswordForm() {

    const navigate = useNavigate();

    const forgotPasswordMutation = useForgotPassword();

    const {
        control,
        handleSubmit
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(
            forgotPasswordSchema
        ),
        defaultValues: {
            email: ""
        }
    });

    const onSubmit = async (
        data: ForgotPasswordFormData
    ) => {
        try {
            await forgotPasswordMutation.mutateAsync(
                data
            );
        } catch {
            // Error is displayed below.
        }
    };


    return (
        <Paper
            elevation={4}
            sx={{
                width: 420,
                p: 5,
                bgcolor: "background.paper"
            }}
        >
            <Typography
                variant="h4"
                mb={1}
                align="center"
            >
                Forgot Password
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                mb={4}
                align="center"
            >
                Enter your email address to request
                a password reset.
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="email"
            >
                <Stack spacing={3}>
                    <FormTextField<ForgotPasswordFormData>
                        control={control}
                        name="email"
                        label="Email"
                        type="email"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={
                            forgotPasswordMutation.isPending
                        }
                    >
                        {
                            forgotPasswordMutation.isPending
                                ? "Sending..."
                                : "Send Reset Request"
                        }
                    </Button>
                    {
                        forgotPasswordMutation.isSuccess && (
                            <Typography
                                color="success.main"
                            >
                                If an account exists with
                                that email address, a password
                                reset request has been created.
                            </Typography>
                        )
                    }
                    {
                        forgotPasswordMutation.isError && (
                            <Typography
                                color="error"
                            >
                                Unable to process the
                                password reset request.
                                Please try again.
                            </Typography>
                        )
                    }
                    <Button
                        variant="text"
                        onClick={() => navigate("/login")}
                    >
                        Back to Login
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
}