import { TextField, type TextFieldProps } from "@mui/material";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

interface FormDateFieldProps<T extends FieldValues> extends Omit<TextFieldProps, "name" | "type"> {
    name: Path<T>;
    control: Control<T>;
}

export default function FormDateField<T extends FieldValues>({
    name,
    control,
    ...props
}: FormDateFieldProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({
                field,
                fieldState
            }) => (
                <TextField
                    {...field}
                    {...props}
                    type="date"
                    fullWidth
                    slotProps={{
                        inputLabel: {
                            shrink: true
                        }
                    }}
                    error={!!fieldState.error}
                    helperText={
                        fieldState.error?.message
                    }
                />
            )}
        />
    );
}