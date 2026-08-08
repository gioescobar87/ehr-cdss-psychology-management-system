import {
    AppBar,
    Toolbar,
    Typography,
    Button
} from "@mui/material";

import { useAuth } from "../../auth/useAuth";


export default function TopBar() {

    const {
        user,
        logout
    } = useAuth();


    return (

        <AppBar
            position="fixed"
            sx={{
                zIndex: theme =>
                    theme.zIndex.drawer + 1
            }}
        >

            <Toolbar>

                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1 }}
                >
                    Psychological EHR
                </Typography>

                {user && (

                    <Typography
                        sx={{ mr: 2 }}
                    >
                        {user.nombre} {user.apellido}
                    </Typography>

                )}

                <Button
                    color="inherit"
                    onClick={() => void logout()}
                >
                    Logout
                </Button>

            </Toolbar>

        </AppBar>

    );

}