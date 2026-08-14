import Chip from "@mui/material/Chip";

interface AppointmentStatusChipProps {
  statusId: number;
  label: string;
}

export default function AppointmentStatusChip({
  statusId,
  label,
}: AppointmentStatusChipProps) {
  const color = statusId === 7 ? "default" : "primary";

  return (
    <Chip
      label={label}
      color={color}
      size="small"
      variant={statusId === 7 ? "outlined" : "filled"}
    />
  );
}
