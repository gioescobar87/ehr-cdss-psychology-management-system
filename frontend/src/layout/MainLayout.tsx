import { Box, CssBaseline, Toolbar } from "@mui/material";

import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Footer from "./Footer";
import AppBreadcrumbs from "./AppBreadcrumbs";

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
          ml: `${drawerWidth}px`,
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
