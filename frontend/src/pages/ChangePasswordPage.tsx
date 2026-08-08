import { Box } from "@mui/material";
import ChangePasswordForm from "../features/auth/components/ChangePasswordForm";

export default function ChangePasswordPage() {
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
            <ChangePasswordForm />
        </Box>
    );

}