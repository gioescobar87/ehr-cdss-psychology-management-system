import {
  Box,
  Divider,
  List,
  Stack,
  Typography,
} from "@mui/material";

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
    <Stack spacing={2}>
      {encounters.map((encounter, encounterIndex) => (
        <Box key={encounter.sessionId}>
          <Box sx={{ px: 1, mb: 1 }}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
            >
              {formatRecordDate(encounter.date)}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {encounter.sessionType ??
                "Sesión clínica"}
            </Typography>

            {encounter.reason && (
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mt: 0.25 }}
              >
                Motivo: {encounter.reason}
              </Typography>
            )}
          </Box>

          <List disablePadding>
            {encounter.activities.map((activity) => (
              <ClinicalRecordActivity
                key={activity.id}
                activity={activity}
                selected={
                  selectedActivity?.id === activity.id
                }
                onClick={() =>
                  onSelectActivity(activity)
                }
              />
            ))}
          </List>

          {encounterIndex < encounters.length - 1 && (
            <Divider sx={{ mt: 1.5 }} />
          )}
        </Box>
      ))}
    </Stack>
  );
}