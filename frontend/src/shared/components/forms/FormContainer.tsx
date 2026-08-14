import { Box, Paper } from "@mui/material";
import type { ReactNode, FormEventHandler } from "react";

interface FormContainerProps {
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export default function FormContainer({
  children,
  onSubmit,
}: FormContainerProps) {
  return (
    <Paper
      component="form"
      onSubmit={onSubmit}
      sx={{
        p: 3,
      }}
    >
      <Box>{children}</Box>
    </Paper>
  );
}
