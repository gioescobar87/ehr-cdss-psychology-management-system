import { Box } from "@mui/material";
import ForgotPasswordForm from "../features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 3
            }}
        >
            <ForgotPasswordForm />
        </Box>
    );
}