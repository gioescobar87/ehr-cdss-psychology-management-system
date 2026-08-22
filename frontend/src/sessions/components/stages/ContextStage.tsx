import { Box } from "@mui/material";

import type { Sesion } from "../../types/session.types";

import ClinicalRecord from "../ClinicalRecordContext";

interface ContextStageProps {
  session: Sesion;
}

export default function ContextStage({ session }: ContextStageProps) {
  return (
    <Box
      sx={{
        minHeight: { xs: 400, md: 560 },
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          minWidth: 0,
          minHeight: 0,
          overflowY: "auto",
          p: { xs: 2, md: 3 },
        }}
      >
        <ClinicalRecord session={session} />
      </Box>
    </Box>
  );
}
