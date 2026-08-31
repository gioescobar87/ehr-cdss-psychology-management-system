import { Box, TextField, InputAdornment } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

interface CrudToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  fullWidth?: boolean;
}

export default function CrudToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filters,
  actions,
  fullWidth = false,
}: CrudToolbarProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: fullWidth ? 0 : 2,
        flexWrap: fullWidth ? "nowrap" : "wrap",
        ...(fullWidth && {
          flex: 1,
          minWidth: 0,
          height: "fit-content",
        }),
      }}
    >
      <TextField
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
        size="small"
        sx={{
          minWidth: 280,
          ...(fullWidth && {
            flex: 1,
          }),
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
