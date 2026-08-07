import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Avatar
} from "@mui/material";

export default function TopBar() {

    return (

        <AppBar
            position="fixed"
            elevation={1}
        >

            <Toolbar>

                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1 }}
                >
                    Psychological EHR
                </Typography>

                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                >

                    <Typography>

                        Administrator

                    </Typography>

                    <Avatar />

                </Box>

            </Toolbar>

        </AppBar>

    );

}