import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";

import CancellationDialog from "../components/CancellationDialog";

import { useCancelAppointment } from "../hooks/useCancelAppointment";

import {
    useState
} from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    Typography
} from "@mui/material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import { useAppointment } from "../hooks/useAppointment";
import { useCancellation } from "../hooks/useCancellation";

import AppointmentStatusChip
    from "../components/AppointmentStatusChip";

import {
    formatAppointmentDate,
    formatAppointmentTime
} from "../../shared/utils/dateUtils";


export default function AppointmentDetailsPage() {

    const navigate = useNavigate();

    const { id } = useParams();

    const appointmentId =
        id ? Number(id) : undefined;

    const {
        data: appointment,
        isLoading,
        isError
    } = useAppointment(appointmentId);

    const {
        data: cancellation,
        isLoading: isCancellationLoading
    } = useCancellation(
        appointment?.estadoId === 7
            ? appointment.id
            : undefined
    );

    const [
        cancellationDialogOpen,
        setCancellationDialogOpen
    ] = useState(false);

    const {
    mutateAsync: cancelAppointment,
        isPending: isCancelling,
        error: cancellationError
    } = useCancelAppointment();

    const handleCancellation = async (
        reason: string
    ) => {

        if (!appointment) {
            return;
        }

        try {

            await cancelAppointment({
                id: appointment.id,
                request: {
                    motivoCancelacion: reason
                }
            });

            setCancellationDialogOpen(false);

        } catch {
            // Error is handled by the mutation state.
        }
    };


    if (isLoading) {

        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 8
                }}
            >
                <CircularProgress />
            </Box>
        );

    }


    if (isError || !appointment) {

        return (
            <Alert severity="error">
                No fue posible cargar la cita.
            </Alert>
        );

    }


    const isCancelled =
        appointment.estadoId === 7;


    return (
        <Box>

            {/* Header actions */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row"
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "stretch",
                    sm: "center"
                }}
                spacing={2}
                sx={{
                    mb: 3
                }}
            >

                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() =>
                        navigate("/citas")
                    }
                >
                    Volver a la agenda
                </Button>


                {!isCancelled && (
                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row"
                        }}
                        spacing={1}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() =>
                                navigate(
                                    `/citas/${appointment.id}/edit`
                                )
                            }
                        >
                            Editar cita
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={() =>
                                setCancellationDialogOpen(true)
                            }
                        >
                            Cancelar cita
                        </Button>
                    </Stack>
                )}

            </Stack>


            {/* Appointment information */}

            <Paper
                variant="outlined"
                sx={{
                    p: {
                        xs: 2,
                        md: 4
                    }
                }}
            >

                <Stack spacing={3}>

                    {/* Patient / status */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 2,
                            flexWrap: "wrap"
                        }}
                    >

                        <Box>

                            <Typography
                                variant="h5"
                                fontWeight={600}
                            >
                                {appointment.pacienteNombre}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Cita #{appointment.id}
                            </Typography>

                        </Box>


                        <AppointmentStatusChip
                            statusId={
                                appointment.estadoId
                            }
                            label={
                                appointment.estado
                            }
                        />

                    </Box>


                    <Divider />


                    {/* Date */}

                    <DetailRow
                        label="Fecha"
                        value={
                            formatAppointmentDate(
                                appointment.fechaHoraInicio
                            )
                        }
                    />


                    {/* Time */}

                    <DetailRow
                        label="Horario"
                        value={
                            `${formatAppointmentTime(
                                appointment.fechaHoraInicio
                            )} – ${formatAppointmentTime(
                                appointment.fechaHoraFin
                            )}`
                        }
                    />


                    {/* Psychologist */}

                    <DetailRow
                        label="Psicólogo"
                        value={
                            appointment.usuarioNombre
                        }
                    />


                    {/* Reason */}

                    <DetailRow
                        label="Motivo"
                        value={
                            appointment.motivo ||
                            "No especificado"
                        }
                    />


                    {/* Observations */}

                    <DetailRow
                        label="Observaciones"
                        value={
                            appointment.observaciones ||
                            "Sin observaciones"
                        }
                    />


                    {/* Cancellation information */}

                    {isCancelled && (
                        <>
                            <Divider />

                            <Box>

                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    sx={{
                                        mb: 2
                                    }}
                                >
                                    Información de cancelación
                                </Typography>


                                {isCancellationLoading ? (

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            py: 2
                                        }}
                                    >
                                        <CircularProgress
                                            size={24}
                                        />
                                    </Box>

                                ) : cancellation ? (

                                    <Stack spacing={2}>

                                        <DetailRow
                                            label="Cancelada por"
                                            value={
                                                cancellation.usuarioNombre
                                            }
                                        />

                                        <DetailRow
                                            label="Fecha de cancelación"
                                            value={
                                                formatCancellationDate(
                                                    cancellation.fechaCancelacion
                                                )
                                            }
                                        />

                                        <DetailRow
                                            label="Motivo de cancelación"
                                            value={
                                                cancellation.motivoCancelacion
                                            }
                                        />

                                    </Stack>

                                ) : (

                                    <Alert severity="warning">
                                        No fue posible obtener los
                                        detalles de la cancelación.
                                    </Alert>

                                )}

                            </Box>
                        </>
                    )}

                </Stack>

            </Paper>
            <CancellationDialog
                open={cancellationDialogOpen}
                loading={isCancelling}
                error={
                    cancellationError
                        ? "No fue posible cancelar la cita."
                        : null
                }
                onClose={() =>
                    setCancellationDialogOpen(false)
                }
                onConfirm={handleCancellation}
            />
        </Box>
    );
}


interface DetailRowProps {
    label: string;
    value: string;
}


function DetailRow({
    label,
    value
}: DetailRowProps) {

    return (
        <Box>

            <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                gutterBottom
            >
                {label}
            </Typography>

            <Typography variant="body1">
                {value}
            </Typography>

        </Box>
    );
}


function formatCancellationDate(
    value: string
): string {

    const date = new Date(value);

    return new Intl.DateTimeFormat(
        "es-GT",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    ).format(date);
}