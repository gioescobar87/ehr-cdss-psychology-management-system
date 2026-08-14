import { FormControlLabel, Switch } from "@mui/material";

interface StatusToggleProps {
  active: boolean;
  disabled?: boolean;
  onChange: (active: boolean) => void;
}

export default function StatusToggle({
  active,
  disabled = false,
  onChange,
}: StatusToggleProps) {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={active}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
      }
      label={active ? "Activo" : "Inactivo"}
    />
  );
}
