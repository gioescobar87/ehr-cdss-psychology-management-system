import { Box, TextField, InputAdornment } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import type { ReactNode } from "react";

interface CrudToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  actions?: ReactNode;
}

export default function CrudToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filters,
  actions,
}: CrudToolbarProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 2,
        flexWrap: "wrap",
      }}
    >
      <TextField
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
        size="small"
        sx={{
          minWidth: 280,
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      {filters && (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {filters}
        </Box>
      )}

      {actions && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            marginLeft: "auto",
          }}
        >
          {actions}
        </Box>
      )}
    </Box>
  );
}
