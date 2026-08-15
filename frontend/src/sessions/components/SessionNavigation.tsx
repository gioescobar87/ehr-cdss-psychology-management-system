import { Box, ButtonBase, Divider, Stack, Typography } from "@mui/material";

import type {
  SessionWorkspaceNavigationItem,
  SessionWorkspaceSection,
} from "../types/sessionWorkspace.types";

const NAVIGATION_ITEMS: SessionWorkspaceNavigationItem[] = [
  {
    id: "summary",
    label: "Resumen",
  },
  {
    id: "notes",
    label: "Notas",
  },
  {
    id: "interventions",
    label: "Intervenciones",
  },
  {
    id: "risk",
    label: "Riesgo",
  },
  {
    id: "tests",
    label: "Pruebas",
  },
  {
    id: "objectives",
    label: "Objetivos",
  },
  {
    id: "diagnosis",
    label: "Diagnóstico",
  },
];

interface SessionNavigationProps {
  activeSection: SessionWorkspaceSection;
  onSectionChange: (section: SessionWorkspaceSection) => void;
}

export default function SessionNavigation({
  activeSection,
  onSectionChange,
}: SessionNavigationProps) {
  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        overflowX: "auto",
        bgcolor: "background.paper",
      }}
    >
      <Stack
        direction="row"
        sx={{
          minWidth: "max-content",
          px: {
            xs: 1,
            md: 2,
          },
        }}
      >
        {NAVIGATION_ITEMS.map((item) => {
          const active = item.id === activeSection;

          return (
            <ButtonBase
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              sx={{
                position: "relative",
                px: {
                  xs: 1.5,
                  md: 2,
                },
                py: 1.75,
                minHeight: 56,
                color: active ? "primary.main" : "text.secondary",
                transition: "color 0.2s ease",

                "&:hover": {
                  color: "primary.main",
                  bgcolor: "action.hover",
                },

                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: 12,
                  right: 12,
                  bottom: -1,
                  height: 2,
                  borderRadius: "2px 2px 0 0",
                  backgroundColor: active ? "primary.main" : "transparent",
                  transition: "background-color 0.2s ease",
                },
              }}
            >
              <Typography
                variant="body2"
                fontWeight={active ? 700 : 500}
                sx={{
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </Typography>
            </ButtonBase>
          );
        })}
      </Stack>

      <Divider />
    </Box>
  );
}
