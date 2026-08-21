import type { ReactNode } from "react";

import { Box, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";

import type { ClinicalActivity } from "../types/clinicalRecord.types";

interface ClinicalRecordActivityProps {
  activity: ClinicalActivity;
  selected: boolean;
  onClick: () => void;
}

function assertNever(value: never): never {
  throw new Error(`Unsupported clinical activity type: ${String(value)}`);
}

function getActivityIcon(type: ClinicalActivity["type"]): ReactNode {
  switch (type) {
    case "observation":
      return <NotesOutlinedIcon />;

    case "risk":
      return <WarningAmberOutlinedIcon />;

    case "psychological-test":
      return <PsychologyOutlinedIcon />;

    case "diagnosis":
      return <LocalHospitalOutlinedIcon />;

    case "objective":
      return <TrackChangesOutlinedIcon />;

    default:
      return assertNever(type);
  }
}

function getActivityLabel(type: ClinicalActivity["type"]): string {
  switch (type) {
    case "observation":
      return "Observaciones";

    case "risk":
      return "Evaluación de riesgo";

    case "psychological-test":
      return "Prueba psicológica";

    case "diagnosis":
      return "Diagnóstico";

    case "objective":
      return "Objetivo terapéutico";

    default:
      return assertNever(type);
  }
}

export default function ClinicalRecordActivity({
  activity,
  selected,
  onClick,
}: ClinicalRecordActivityProps) {
  return (
    <ListItemButton
      selected={selected}
      onClick={onClick}
      sx={{
        borderRadius: 1.5,
        alignItems: "flex-start",
        py: 1,
        px: 1.25,

        "&.Mui-selected": {
          bgcolor: "action.selected",
          borderLeft: 3,
          borderColor: "primary.main",
          pl: 1,
        },

        "&.Mui-selected:hover": {
          bgcolor: "action.selected",
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 36,
          mt: 0.25,
          color: selected ? "primary.main" : "text.secondary",
        }}
      >
        {getActivityIcon(activity.type)}
      </ListItemIcon>

      <ListItemText
        primary={
          <Box
            component="span"
            sx={{
              fontSize: "0.875rem",
              fontWeight: selected ? 700 : 600,
              color: selected ? "primary.main" : "text.primary",
            }}
          >
            {getActivityLabel(activity.type)}
          </Box>
        }
        secondary={activity.title}
        slotProps={{
          secondary: {
            sx: {
              mt: 0.25,
              fontSize: "0.8rem",
            },
          },
        }}
      />
    </ListItemButton>
  );
}
