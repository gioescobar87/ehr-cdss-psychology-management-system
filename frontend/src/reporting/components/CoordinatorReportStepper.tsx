import { Box, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { COORDINATOR_STAGE_ITEMS } from "../constants/coordinatorStage.constants";
import type { CoordinatorStage } from "../types/coordinatorWorkspace.types";

interface CoordinatorReportStepperProps {
  activeStage: CoordinatorStage;
  onStageChange: (stage: CoordinatorStage) => void;
}

function StepIndicator({ active }: { active: boolean }) {
  return (
    <Box
      sx={{
        width: 24,
        height: 24,
        flexShrink: 0,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: 2,
        borderColor: active ? "primary.main" : "divider",
        bgcolor: active ? "primary.main" : "background.paper",
      }}
    >
      <Box
        sx={{
          width: active ? 7 : 5,
          height: active ? 7 : 5,
          borderRadius: "50%",
          bgcolor: active ? "common.white" : "text.disabled",
        }}
      />
    </Box>
  );
}

export default function CoordinatorReportStepper({
  activeStage,
  onStageChange,
}: CoordinatorReportStepperProps) {
  return (
    <Box
      component="nav"
      aria-label="Etapas del reporte de coordinación"
      sx={{ width: 190, flexShrink: 0 }}
    >
      <Box
        component="button"
        type="button"
        onClick={() => onStageChange("summary")}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          width: "100%",
          mb: 2.5,
          p: 0,
          border: 0,
          bgcolor: "transparent",
          color: "text.secondary",
          font: "inherit",
          fontSize: "0.8125rem",
          fontWeight: 600,
          textAlign: "left",
          cursor: "pointer",
          "&:hover": { color: "primary.main" },
          "&:focus-visible": {
            outline: 2,
            outlineOffset: 2,
            outlineColor: "primary.main",
            borderRadius: 1,
          },
        }}
      >
        <ArrowBackIcon sx={{ fontSize: 18 }} />
        <Typography component="span" variant="body2" fontWeight={600}>
          Inicio del reporte
        </Typography>
      </Box>

      <Stack spacing={0}>
        {COORDINATOR_STAGE_ITEMS.map((item, index) => {
          const active = item.id === activeStage;
          const last = index === COORDINATOR_STAGE_ITEMS.length - 1;
          return (
            <Box key={item.id} sx={{ position: "relative" }}>
              <Box
                component="button"
                type="button"
                onClick={() => onStageChange(item.id)}
                aria-current={active ? "step" : undefined}
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 0,
                  py: 0.75,
                  border: 0,
                  bgcolor: "transparent",
                  textAlign: "left",
                  font: "inherit",
                  cursor: "pointer",
                  borderRadius: 1.5,
                  color: active ? "primary.main" : "text.secondary",
                  "&:hover": { color: "primary.main" },
                  "&:focus-visible": {
                    outline: 2,
                    outlineOffset: 2,
                    outlineColor: "primary.main",
                  },
                }}
              >
                <StepIndicator active={active} />
                <Typography
                  component="span"
                  variant="body2"
                  fontWeight={active ? 700 : 500}
                >
                  {item.label}
                </Typography>
              </Box>
              {!last && (
                <Box
                  sx={{
                    position: "absolute",
                    left: 11,
                    top: 31,
                    height: 24,
                    borderLeft: "1px solid",
                    borderColor: "divider",
                  }}
                />
              )}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
