import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import TodayIcon from "@mui/icons-material/Today";

import {
    Box,
    Button,
    IconButton,
    Stack,
    Typography
} from "@mui/material";

import {
    addDays,
    formatAppointmentDate,
    isToday
} from "../../shared/utils/dateUtils";


interface AgendaToolbarProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
    onCreateAppointment: () => void;
}


export default function AgendaToolbar({
    selectedDate,
    onDateChange,
    onCreateAppointment
}: AgendaToolbarProps) {

    const today = isToday(selectedDate);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: {
                    xs: "flex-start",
                    md: "center"
                },
                gap: 2,
                flexWrap: "wrap",
                mb: 3
            }}
        >

            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
            >

                <IconButton
                    aria-label="Día anterior"
                    onClick={() =>
                        onDateChange(
                            addDays(selectedDate, -1)
                        )
                    }
                >
                    <ChevronLeftIcon />
                </IconButton>

                <Box
                    sx={{
                        minWidth: {
                            xs: 180,
                            sm: 280
                        }
                    }}
                >

                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >
                        {today
                            ? "Hoy"
                            : "Agenda"}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            textTransform: "capitalize"
                        }}
                    >
                        {formatAppointmentDate(
                            `${selectedDate}T00:00:00`
                        )}
                    </Typography>

                </Box>

                <IconButton
                    aria-label="Día siguiente"
                    onClick={() =>
                        onDateChange(
                            addDays(selectedDate, 1)
                        )
                    }
                >
                    <ChevronRightIcon />
                </IconButton>

                {!today && (
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<TodayIcon />}
                        onClick={() =>
                            onDateChange(
                                new Date()
                                    .toLocaleDateString(
                                        "en-CA"
                                    )
                            )
                        }
                    >
                        Hoy
                    </Button>
                )}

            </Stack>

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onCreateAppointment}
            >
                Nueva cita
            </Button>

        </Box>
    );
}