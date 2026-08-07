import {
    Box,
    CssBaseline,
    Toolbar
} from "@mui/material";

import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import Footer from "../components/layout/Footer";
import AppBreadcrumbs from "../components/layout/AppBreadcrumbs";

const drawerWidth = 260;

export default function MainLayout() {

    return (

        <Box sx={{ display: "flex" }}>

            <CssBaseline />

            <TopBar />

            <Sidebar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 4,
                    ml: `${drawerWidth}px`
                }}
            >

                <Toolbar />

                <AppBreadcrumbs />

                <Outlet />

                <Footer />

            </Box>

        </Box>

    );

}