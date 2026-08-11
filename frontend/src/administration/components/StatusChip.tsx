import { Chip } from "@mui/material";

interface StatusChipProps {
    active: boolean;
}

export default function StatusChip({
    active
}: StatusChipProps) {
    return (
        <Chip 
            label={active ? "Activo" : "Inactivo"}
            size="small"
            color={active ? "success" : "default"}
            variant={active ? "filled" : "outlined"}
        />
    );
}