import { Box, Stack, Typography } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import type { SessionStage } from "../types/sessionWorkspace.types";

export type ClinicalSessionStep = SessionStage;

interface ClinicalSessionStepperProps {
  activeStep: ClinicalSessionStep;
  onStepChange: (step: ClinicalSessionStep) => void;
  onBack: () => void;
  disabledSteps?: boolean;
}

interface StepDefinition {
  id: ClinicalSessionStep;
  label: string;
}

const STEPS: StepDefinition[] = [
  {
    id: "context",
    label: "Contexto",
  },
  {
    id: "evaluation",
    label: "Evaluación",
  },
  {
    id: "treatmentPlan",
    label: "Plan terapeútico",
  },
  {
    id: "evolution",
    label: "Evolución y plan",
  },
];

interface StepIndicatorProps {
  active: boolean;
}

function StepIndicator({ active }: StepIndicatorProps) {
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

        transition: "background-color 150ms ease, border-color 150ms ease",
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

export default function ClinicalSessionStepper({
  activeStep,
  onStepChange,
  onBack,
  disabledSteps = false,
}: ClinicalSessionStepperProps) {
  return (
    <Box
      component="nav"
      aria-label="Etapas de la sesión clínica"
      sx={{
        width: 156,
        flexShrink: 0,
      }}
    >
      {/* Back to agenda */}

      <Box
        component="button"
        type="button"
        onClick={onBack}
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

          "&:hover": {
            color: "primary.main",
          },

          "&:focus-visible": {
            outline: 2,
            outlineOffset: 2,
            outlineColor: "primary.main",
            borderRadius: 1,
          },
        }}
      >
        <ArrowBackIcon
          sx={{
            fontSize: 18,
          }}
        />

        <Typography component="span" variant="body2" fontWeight={600}>
          Agenda
        </Typography>
      </Box>

      {/* Clinical stages */}

      <Stack spacing={0}>
        {STEPS.map((step, index) => {
          const isActive = step.id === activeStep;
          const isDisabled = disabledSteps && step.id !== "context";

          const isLast = index === STEPS.length - 1;

          return (
            <Box
              key={step.id}
              sx={{
                position: "relative",
              }}
            >
              <Box
                component="button"
                type="button"
                onClick={() => {
                  if (!isDisabled) {
                    onStepChange(step.id);
                  }
                }}
                disabled={isDisabled}
                aria-current={isActive ? "step" : undefined}
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

                  cursor: isDisabled ? "not-allowed" : "pointer",
                  opacity: isDisabled ? 0.45 : 1,

                  borderRadius: 1.5,

                  "&:hover": {
                    bgcolor: "action.hover",
                  },

                  "&:focus-visible": {
                    outline: 2,
                    outlineOffset: 1,
                    outlineColor: "primary.main",
                  },
                }}
              >
                <StepIndicator active={isActive} />

                <Typography
                  variant="body2"
                  fontSize="0.8125rem"
                  fontWeight={isActive ? 700 : 500}
                  color={isActive ? "primary.main" : "text.secondary"}
                  sx={{
                    lineHeight: 1.25,
                  }}
                >
                  {step.label}
                </Typography>
              </Box>

              {!isLast && (
                <Box
                  sx={{
                    position: "absolute",

                    left: 11,

                    top: 31,

                    width: 2,
                    height: 20,

                    bgcolor: "divider",
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
