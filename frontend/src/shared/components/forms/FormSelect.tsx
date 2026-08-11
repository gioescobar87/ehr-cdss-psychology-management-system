import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

export interface FormSelectOption {
    value: string | number;
    label: string;
}

interface FormSelectProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    label: string;
    options: FormSelectOption[];
    disabled?: boolean;
}

export default function FormSelect<T extends FieldValues>({
    name,
    control,
    label,
    options,
    disabled = false
}: FormSelectProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({
                field,
                fieldState
            }) => (
                <FormControl
                    fullWidth
                    error={!!fieldState.error}
                    disabled={disabled}
                >
                    <InputLabel>
                        {label}
                    </InputLabel>
                    <Select
                        {...field}
                        label={label}
                    >
                        {options.map(option => (
                            <MenuItem
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                    {fieldState.error && (
                        <FormHelperText>
                            {
                                fieldState.error
                                    .message
                            }
                        </FormHelperText>
                    )}
                </FormControl>
            )}
        />
    );
}