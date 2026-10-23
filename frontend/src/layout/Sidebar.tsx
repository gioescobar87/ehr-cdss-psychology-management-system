import {
  Box,
  CircularProgress,
  Collapse,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
} from "@mui/material";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNavigation } from "../navigation/useNavigation";
import { iconMap } from "../shared/utils/iconMapper";
import type { NavigationOption } from "../navigation/navigation.types";
import {
  BASIC_CATALOG_PATH,
  groupBasicCatalogNavigation,
} from "../catalog/basicCatalogs";

const drawerWidth = 260;

interface NavigationItemProps {
  option: NavigationOption;
  level?: number;
}

function NavigationItem({ option, level = 0 }: NavigationItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const hasChildren = option.children.length > 0;
  const isActive =
    location.pathname === option.rutaFrontend ||
    (option.rutaFrontend === BASIC_CATALOG_PATH &&
      location.pathname.startsWith(`${BASIC_CATALOG_PATH}/`));
  const hasActiveChild = option.children.some(
    (child) =>
      location.pathname === child.rutaFrontend ||
      location.pathname.startsWith(`${child.rutaFrontend}/`),
  );
  const [open, setOpen] = useState(hasActiveChild);
  const Icon =
    option.icono && iconMap[option.icono]
      ? iconMap[option.icono]
      : SettingsIcon;
  const handleClick = () => {
    if (hasChildren) {
      setOpen((previous) => !previous);
      return;
    }
    navigate(option.rutaFrontend);
  };

  return (
    <>
      <ListItemButton
        selected={isActive}
        onClick={handleClick}
        sx={{
          pl: 2 + level * 2,
        }}
      >
        <ListItemIcon>
          <Icon />
        </ListItemIcon>

        <ListItemText primary={option.nombre} />

        {hasChildren && (open ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
      </ListItemButton>

      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {option.children.map((child) => (
              <NavigationItem key={child.id} option={child} level={level + 1} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

export default function Sidebar() {
  const { navigation, loading } = useNavigation();

  if (loading) {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box display="flex" justifyContent="center" mt={4}>
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
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />

      <List>
        {groupBasicCatalogNavigation(navigation).map((module) => (
          <Box key={module.id}>
            <ListSubheader>{module.nombre}</ListSubheader>
            {module.opciones.map((option) => (
              <NavigationItem key={option.id} option={option} />
            ))}
          </Box>
        ))}
      </List>
    </Drawer>
  );
}
