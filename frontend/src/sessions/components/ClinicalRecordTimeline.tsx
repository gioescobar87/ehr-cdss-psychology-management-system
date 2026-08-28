import { Box, List, Stack, Typography } from "@mui/material";

import type {
  ClinicalActivity,
  ClinicalEncounter,
} from "../types/clinicalRecord.types";

import { formatRecordDate } from "../../shared/utils/dateUtils";

import ClinicalRecordActivity from "./ClinicalRecordActivity";

interface ClinicalRecordTimelineProps {
  encounters: ClinicalEncounter[];
  selectedActivity: ClinicalActivity | null;
  onSelectActivity: (activity: ClinicalActivity) => void;
}

export default function ClinicalRecordTimeline({
  encounters,
  selectedActivity,
  onSelectActivity,
}: ClinicalRecordTimelineProps) {
  return (
    <Stack
      spacing={1.5}
      sx={{
        p: 1.25,
      }}
    >
      {encounters.map((encounter) => (
        <Box
          key={encounter.sessionId}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 1.5,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: 1.5,
              py: 1,
              bgcolor: "action.hover",
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={700}
              color="text.primary"
            >
              {formatRecordDate(encounter.date)}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {encounter.sessionType ?? "Sesión clínica"}
            </Typography>

            {encounter.reason && (
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{
                  mt: 0.25,
                }}
              >
                Motivo: {encounter.reason}
              </Typography>
            )}
          </Box>

          <List disablePadding sx={{ p: 0.5 }}>
            {encounter.activities.map((activity) => (
              <ClinicalRecordActivity
                key={activity.id}
                activity={activity}
                selected={selectedActivity?.id === activity.id}
                onClick={() => onSelectActivity(activity)}
              />
            ))}
          </List>
        </Box>
      ))}
    </Stack>
  );
}
