import { Box, Paper, Stack, Typography } from "@mui/material";

import type { Appointment } from "../types/appointment.types";
import { APPOINTMENT_STATUS } from "../constants/appointmentStatus";
import { isToday, toDateInputValue } from "../../shared/utils/dateUtils";

interface CalendarMonthViewProps {
  month: string;
  appointments: Appointment[];
  selectedDate: string;
  onSelectDay: (date: string) => void;
}

const WEEKDAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function buildMonthMatrix(month: string): string[] {
  const [year, monthIndex] = month.split("-").map(Number);

  const startOffset = new Date(year, monthIndex - 1, 1).getDay();
  const daysInMonth = new Date(year, monthIndex, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const cells: string[] = [];

  for (let i = 0; i < totalCells; i++) {
    const dayOffset = i - startOffset + 1;

    cells.push(toDateInputValue(new Date(year, monthIndex - 1, dayOffset)));
  }

  return cells;
}

export default function CalendarMonthView({
  month,
  appointments,
  selectedDate,
  onSelectDay,
}: CalendarMonthViewProps) {
  const cells = buildMonthMatrix(month);
  const currentMonthIndex = Number(month.slice(5, 7));

  const countsByDate = new Map<string, number>();

  for (const appointment of appointments) {
    if (appointment.estadoId === APPOINTMENT_STATUS.CANCELLED) {
      continue;
    }

    const date = appointment.fechaHoraInicio.slice(0, 10);

    countsByDate.set(date, (countsByDate.get(date) ?? 0) + 1);
  }

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          backgroundColor: "primary.main",
        }}
      >
        {WEEKDAY_LABELS.map((label) => (
          <Box key={label} sx={{ py: 1, textAlign: "center" }}>
            <Typography
              variant="caption"
              fontWeight={700}
              sx={{ color: "white", letterSpacing: 0.4 }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {cells.map((date) => {
          const dayNumber = Number(date.slice(8, 10));
          const inCurrentMonth = Number(date.slice(5, 7)) === currentMonthIndex;
          const count = countsByDate.get(date) ?? 0;
          const selected = date === selectedDate;
          const today = isToday(date);

          return (
            <Box
              key={date}
              onClick={() => onSelectDay(date)}
              sx={{
                minHeight: { xs: 64, sm: 88 },
                p: 1,
                borderRight: "1px solid",
                borderBottom: "1px solid",
                borderColor: "divider",
                cursor: "pointer",
                opacity: inCurrentMonth ? 1 : 0.4,
                backgroundColor: selected ? "primary.50" : "background.paper",
                transition: "background-color 0.12s ease",
                "&:hover": {
                  backgroundColor: selected ? "primary.100" : "action.hover",
                },
              }}
            >
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Box
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: today ? "primary.main" : "transparent",
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={today ? 700 : 500}
                    sx={{ color: today ? "white" : "text.primary" }}
                  >
                    {dayNumber}
                  </Typography>
                </Box>
              </Stack>

              {count > 0 && (
                <Box
                  sx={{
                    mt: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    px: 0.75,
                    py: 0.25,
                    borderRadius: 1,
                    backgroundColor: "primary.50",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="primary.main"
                  >
                    {count} {count === 1 ? "cita" : "citas"}
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
