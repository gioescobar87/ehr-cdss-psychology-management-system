import { Box } from "@mui/material";

import ResetPasswordForm from "../features/auth/components/ResetPasswordForm";

export default function ResetPasswordPage() {

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <ResetPasswordForm />
        </Box>
    );
}