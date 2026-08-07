import {
    Paper,
    Typography
} from "@mui/material";

export default function DashboardPage() {

    return (

        <Paper sx={{ p: 4 }}>

            <Typography variant="h4">

                Dashboard

            </Typography>

            <Typography mt={2}>

                Welcome to the Psychological EHR.

            </Typography>

        </Paper>

    );

}