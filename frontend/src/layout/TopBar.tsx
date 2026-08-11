import {
    AppBar,
    Avatar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from "@mui/material";

import {
    AccountCircle,
    Lock,
    Logout
} from "@mui/icons-material";

import { useState, type MouseEvent } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/hooks/useAuth";


export default function TopBar() {

    const {
        user,
        logout
    } = useAuth();

    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] =
        useState<null | HTMLElement>(null);

    const menuOpen = Boolean(anchorEl);

    const handleMenuOpen = (
        event: MouseEvent<HTMLElement>
    ) => {

        setAnchorEl(event.currentTarget);

    };

    const handleMenuClose = () => {

        setAnchorEl(null);

    };

    const handleProfile = () => {

        handleMenuClose();

        navigate("/profile");

    };

    const handleChangePassword = () => {

        handleMenuClose();

        navigate("/change-password");

    };

    const handleLogout = () => {

        handleMenuClose();

        logout();

    };

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
                    sx={{
                        flexGrow: 1
                    }}
                >
                    Psychological EHR
                </Typography>

                {user && (

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1
                        }}
                    >

                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 500
                            }}
                        >
                            {user.nombre} {user.apellido}
                        </Typography>

                        <IconButton
                            onClick={handleMenuOpen}
                            color="inherit"
                            aria-label="User account menu"
                            aria-controls={
                                menuOpen
                                    ? "user-menu"
                                    : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={
                                menuOpen
                                    ? "true"
                                    : undefined
                            }
                        >

                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36
                                }}
                            >
                                {user.nombre
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </Avatar>

                        </IconButton>

                        <Menu
                            id="user-menu"
                            anchorEl={anchorEl}
                            open={menuOpen}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right"
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right"
                            }}
                        >

                            <MenuItem
                                onClick={handleProfile}
                            >

                                <AccountCircle
                                    sx={{
                                        mr: 1
                                    }}
                                />

                                My Profile

                            </MenuItem>

                            <MenuItem
                                onClick={handleChangePassword}
                            >

                                <Lock
                                    sx={{
                                        mr: 1
                                    }}
                                />

                                Change Password

                            </MenuItem>

                            <MenuItem
                                onClick={handleLogout}
                            >

                                <Logout
                                    sx={{
                                        mr: 1
                                    }}
                                />

                                Logout

                            </MenuItem>

                        </Menu>

                    </Box>

                )}

            </Toolbar>

        </AppBar>

    );

}