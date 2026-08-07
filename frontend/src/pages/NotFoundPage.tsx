import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {

    const navigate = useNavigate();

    return (
        <>
            <Typography variant="h3">
                404
            </Typography>

            <Typography sx={{mb: 3}}>
                The requested page does not exist.
            </Typography>

            <Button
                variant="contained"
                onClick={() => navigate("/dashboard")}
            >
                Go Home
            </Button>
        </>
    );
}