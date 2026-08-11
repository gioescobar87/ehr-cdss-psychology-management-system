import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography
} from "@mui/material";

interface SessionTimeoutDialogProps {

    open: boolean;

    remainingSeconds: number;

    onContinue: () => void;

    onLogout: () => void;
}

export default function SessionTimeoutDialog({
    open,
    remainingSeconds,
    onContinue,
    onLogout
}: SessionTimeoutDialogProps) {

    return (

        <Dialog
            open={open}
            disableEscapeKeyDown
            aria-labelledby="session-timeout-dialog-title"
            aria-describedby="session-timeout-dialog-description"
        >

            <DialogTitle id="session-timeout-dialog-title">

                Expiración de Sesión

            </DialogTitle>


            <DialogContent>

                <DialogContentText
                    id="session-timeout-dialog-description"
                >

                    Debido a inactividad, su sesión finalizará en:

                    <Typography
                        component="span"
                        display="block"
                        textAlign="center"
                        variant="h3"
                        sx={{
                            mt: 2,
                            mb: 2,
                            fontWeight: "bold"
                        }}
                    >

                        {remainingSeconds}

                    </Typography>

                    segundos.

                    ¿Desea permanecer conectado?

                </DialogContentText>

            </DialogContent>


            <DialogActions>

                <Button
                    onClick={onLogout}
                    color="inherit"
                >

                    Salir

                </Button>


                <Button
                    onClick={onContinue}
                    variant="contained"
                >

                    Continuar conectado

                </Button>

            </DialogActions>

        </Dialog>

    );

}