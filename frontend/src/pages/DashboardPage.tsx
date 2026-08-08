import { Box, Button, Stack } from "@mui/material";

import { useState } from "react";

import AppButton from "../components/common/AppButton";
import EmptyState from "../components/common/EmptyState";
import PageHeader from "../components/common/PageHeader";

import ErrorState from "../components/feedback/ErrorState";
import LoadingSkeleton from "../components/feedback/LoadingSkeleton";
import LoadingSpinner from "../components/feedback/LoadingSpinner";

import ConfirmationDialog from "../components/dialogs/ConfirmationDialog";

import { useNotification } from "../hooks/useNotification";


export default function DashboardPage() {

    const {
        showSuccess,
        showError,
        showWarning,
        showInfo
    } = useNotification();

    const [confirmationOpen, setConfirmationOpen] =
        useState(false);


    return (

        <Box>

            <PageHeader
                title="Dashboard"
                description="System overview and reusable component testing."
                actions={
                    <AppButton
                        onClick={() =>
                            setConfirmationOpen(true)
                        }
                    >
                        Test Confirmation
                    </AppButton>
                }
            />


            <Stack spacing={4}>

                {/* Notifications */}

                <Box>

                    <h2>Notifications</h2>

                    <Stack
                        direction="row"
                        spacing={2}
                        flexWrap="wrap"
                    >

                        <Button
                            variant="contained"
                            onClick={() =>
                                showSuccess(
                                    "Operation completed successfully."
                                )
                            }
                        >
                            Success
                        </Button>


                        <Button
                            variant="contained"
                            color="error"
                            onClick={() =>
                                showError(
                                    "An error occurred."
                                )
                            }
                        >
                            Error
                        </Button>


                        <Button
                            variant="contained"
                            color="warning"
                            onClick={() =>
                                showWarning(
                                    "This action requires attention."
                                )
                            }
                        >
                            Warning
                        </Button>


                        <Button
                            variant="contained"
                            color="info"
                            onClick={() =>
                                showInfo(
                                    "This is an informational message."
                                )
                            }
                        >
                            Info
                        </Button>

                    </Stack>

                </Box>


                {/* Loading components */}

                <Box>

                    <h2>Loading Components</h2>

                    <LoadingSpinner minHeight={120} />

                    <LoadingSkeleton rows={3} />

                </Box>


                {/* Empty state */}

                <Box>

                    <h2>Empty State</h2>

                    <EmptyState
                        title="No patients"
                        message="There are currently no patients registered."
                    />

                </Box>


                {/* Error state */}

                <Box>

                    <h2>Error State</h2>

                    <ErrorState
                        message="Unable to load the requested information."
                        onRetry={() =>
                            showInfo(
                                "Retry action triggered."
                            )
                        }
                    />

                </Box>


                {/* Confirmation dialog */}

                <Box>

                    <h2>Confirmation Dialog</h2>

                    <AppButton
                        onClick={() =>
                            setConfirmationOpen(true)
                        }
                    >
                        Open Confirmation Dialog
                    </AppButton>

                </Box>

            </Stack>


            <ConfirmationDialog
                open={confirmationOpen}
                title="Confirm test action"
                message="Are you sure you want to execute this test action?"
                confirmText="Confirm"
                cancelText="Cancel"
                onConfirm={() => {

                    setConfirmationOpen(false);

                    showSuccess(
                        "Confirmation action executed."
                    );

                }}
                onCancel={() =>
                    setConfirmationOpen(false)
                }
            />

        </Box>

    );

}