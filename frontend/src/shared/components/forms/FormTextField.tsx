import { TextField, type TextFieldProps } from "@mui/material";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

interface FormTextFieldProps<T extends FieldValues> extends Omit<
  TextFieldProps,
  "name"
> {
  name: Path<T>;
  control: Control<T>;
}

export default function FormTextField<T extends FieldValues>({
  name,
  control,
  ...props
}: FormTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...props}
          fullWidth
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
}
