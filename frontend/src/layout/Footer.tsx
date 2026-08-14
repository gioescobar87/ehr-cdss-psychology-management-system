import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        mt: 4,
        py: 2,
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        Psychological EHR © 2026
      </Typography>
    </Box>
  );
}
