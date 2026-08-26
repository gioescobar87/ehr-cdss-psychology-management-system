import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";
import CalendarViewMonthOutlinedIcon from "@mui/icons-material/CalendarViewMonthOutlined";
import ViewDayOutlinedIcon from "@mui/icons-material/ViewDayOutlined";

import {
  Box,
  Button,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

export type AgendaViewMode = "day" | "calendar";

interface AgendaToolbarProps {
  viewMode: AgendaViewMode;
  onViewModeChange: (mode: AgendaViewMode) => void;
  title: string;
  subtitle: string;
  showTodayButton: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function AgendaToolbar({
  viewMode,
  onViewModeChange,
  title,
  subtitle,
  showTodayButton,
  onPrevious,
  onNext,
  onToday,
}: AgendaToolbarProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: {
          xs: "flex-start",
          md: "center",
        },
        gap: 2,
        flexWrap: "wrap",
        mb: 3,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton
          aria-label={viewMode === "day" ? "Día anterior" : "Mes anterior"}
          onClick={onPrevious}
        >
          <ChevronLeftIcon />
        </IconButton>

        <Box
          sx={{
            minWidth: {
              xs: 180,
              sm: 280,
            },
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textTransform: "capitalize",
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        <IconButton
          aria-label={viewMode === "day" ? "Día siguiente" : "Mes siguiente"}
          onClick={onNext}
        >
          <ChevronRightIcon />
        </IconButton>

        {showTodayButton && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<TodayIcon />}
            onClick={onToday}
          >
            Hoy
          </Button>
        )}
      </Stack>

      <ToggleButtonGroup
        value={viewMode}
        exclusive
        size="small"
        onChange={(_event, value: AgendaViewMode | null) => {
          if (value) {
            onViewModeChange(value);
          }
        }}
      >
        <ToggleButton value="calendar" aria-label="Vista de calendario">
          <CalendarViewMonthOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
          Calendario
        </ToggleButton>
        <ToggleButton value="day" aria-label="Vista diaria">
          <ViewDayOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
          Diario
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
