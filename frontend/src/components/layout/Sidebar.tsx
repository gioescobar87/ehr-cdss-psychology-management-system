import {
    Box,
    CircularProgress,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Toolbar
} from "@mui/material";

import SettingsIcon from "@mui/icons-material/Settings";

import { useLocation, useNavigate } from "react-router-dom";

import { useNavigation } from "../../navigation/useNavigation";
import { iconMap } from "../../utils/iconMapper";

const drawerWidth = 260;

export default function Sidebar() {

    const navigate = useNavigate();
    const location = useLocation();

    const {
        navigation,
        loading
    } = useNavigation();

    if (loading) {

        return (

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box"
                    }
                }}
            >

                <Toolbar />

                <Box
                    display="flex"
                    justifyContent="center"
                    mt={4}
                >
                    <CircularProgress />
                </Box>

            </Drawer>

        );

    }

    return (

        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box"
                }
            }}
        >

            <Toolbar />

            <List>

                {navigation.map(module => (

                    <Box key={module.id}>

                        <ListSubheader>

                            {module.nombre}

                        </ListSubheader>

                        {module.opciones.map(option => {

                            const Icon =
                                option.icono && iconMap[option.icono]
                                    ? iconMap[option.icono]
                                    : SettingsIcon;

                            return (

                                <ListItemButton
                                    key={option.id}
                                    selected={
                                        location.pathname === option.rutaFrontend
                                    }
                                    onClick={() =>
                                        navigate(option.rutaFrontend)
                                    }
                                >

                                    <ListItemIcon>

                                        <Icon />

                                    </ListItemIcon>

                                    <ListItemText
                                        primary={option.nombre}
                                    />

                                </ListItemButton>

                            );

                        })}

                    </Box>

                ))}

            </List>

        </Drawer>

    );

}