import { Button, type ButtonProps } from "@mui/material";

export default function AppButton({children, ...props}: ButtonProps) {
    return (
        <Button
            variant="contained"
            {...props}
        >
            {children}
        </Button>
    );
}