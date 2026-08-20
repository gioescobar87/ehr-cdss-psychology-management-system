import { Box, ButtonBase, Stack, Typography } from "@mui/material";

import type { SessionStage } from "../types/sessionWorkspace.types";

import {
  SESSION_PROGRESS_HEIGHT,
  SESSION_STAGE_ITEMS,
  SESSION_STAGE_SECTION_IDS,
} from "../constants/sessionStage.constants";

interface SessionProgressProps {
  activeStage: SessionStage;
}

export default function SessionProgress({ activeStage }: SessionProgressProps) {
  const handleStageClick = (stage: SessionStage) => {
    const sectionId = SESSION_STAGE_SECTION_IDS[stage];

    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Box
      sx={{
        position: "sticky",
        top: "var(--app-header-height, 64px)",
        zIndex: (theme) => theme.zIndex.appBar - 1,
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Stack
        direction="row"
        sx={{
          width: "100%",
          minHeight: SESSION_PROGRESS_HEIGHT,
          px: {
            xs: 1,
            md: 3,
          },
        }}
      >
        {SESSION_STAGE_ITEMS.map((item, index) => {
          const active = item.id === activeStage;

          return (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                alignItems: "stretch",
                flex: 1,
                minWidth: 0,
              }}
            >
              <ButtonBase
                onClick={() => handleStageClick(item.id)}
                aria-current={active ? "step" : undefined}
                sx={{
                  position: "relative",
                  width: "100%",
                  minHeight: SESSION_PROGRESS_HEIGHT,
                  px: {
                    xs: 1,
                    sm: 1.5,
                    md: 2,
                  },
                  color: active ? "primary.main" : "text.secondary",
                  transition: "color 0.2s ease, background-color 0.2s ease",

                  "&:hover": {
                    bgcolor: "action.hover",
                    color: "primary.main",
                  },

                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: 8,
                    right: 8,
                    bottom: 0,
                    height: 2,
                    borderRadius: "2px 2px 0 0",
                    bgcolor: active ? "primary.main" : "transparent",
                    transition: "background-color 0.2s ease",
                  },
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={active ? 700 : 500}
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {index + 1}. {item.label}
                </Typography>
              </ButtonBase>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
