import { Button } from "@mui/material";

import { useNotification } from "../hooks/useNotification";


export default function DashboardPage() {

    const {
        showSuccess,
        showError,
        showWarning,
        showInfo
    } = useNotification();


    return (

        <div>

            <h1>Dashboard</h1>

            <Button
                onClick={() =>
                    showSuccess(
                        "Operation completed successfully."
                    )
                }
            >
                Success
            </Button>


            <Button
                onClick={() =>
                    showError(
                        "An error occurred."
                    )
                }
            >
                Error
            </Button>


            <Button
                onClick={() =>
                    showWarning(
                        "This action requires attention."
                    )
                }
            >
                Warning
            </Button>


            <Button
                onClick={() =>
                    showInfo(
                        "This is an informational message."
                    )
                }
            >
                Info
            </Button>

        </div>

    );

}