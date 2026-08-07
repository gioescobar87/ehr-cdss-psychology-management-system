import {
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";

import { loginSchema, type LoginFormData } from "../schemas/loginSchema";

export default function LoginForm() {

    const navigate = useNavigate();
    const loginMutation = useLogin();
    const {

        control,

        handleSubmit

    } = useForm<LoginFormData>({

        resolver: zodResolver(loginSchema),

        defaultValues: {

            username: "",

            password: ""

        }

    });

    const onSubmit = async (data: LoginFormData) => {
        try{
            await loginMutation.mutateAsync(data);    
            navigate("/dashboard");
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
                bgcolor: "background.paper"
            }}
        >

            <Typography
                variant="h4"
                mb={4}
                align="center"
            >
                Sign In
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="username"
            >

                <Stack spacing={3}>

                    <Controller
                        control={control}
                        name="username"
                        render={({

                            field,

                            fieldState

                        }) => (

                            <TextField
                                {...field}
                                label="Username"
                                fullWidth
                                error={!!fieldState.error}
                                helperText={
                                    fieldState.error?.message
                                }
                            />

                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({

                            field,

                            fieldState

                        }) => (

                            <TextField
                                {...field}
                                label="Password"
                                type="password"
                                fullWidth
                                error={!!fieldState.error}
                                helperText={
                                    fieldState.error?.message
                                }
                            />

                        )}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loginMutation.isPending}
                    >
                        {
                            loginMutation.isPending
                                ? "Signing in..."
                                : "Login"
                        }
                    </Button>
                    {
                        loginMutation.isError && (

                            <Typography color="error">

                                Invalid username or password

                            </Typography>

                        )
                    }
                </Stack>

            </Box>

        </Paper>

    );

}