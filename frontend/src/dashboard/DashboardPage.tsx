import {
    Box,
    Button,
    Chip,
    Stack
} from "@mui/material";

import { useState } from "react";

import AppButton from "../shared/components/common/AppButton";
import EmptyState from "../shared/components/common/EmptyState";
import PageHeader from "../shared/components/common/PageHeader";

import ErrorState from "../shared/components/feedback/ErrorState";
import LoadingSkeleton from "../shared/components/feedback/LoadingSkeleton";
import LoadingSpinner from "../shared/components/feedback/LoadingSpinner";

import ConfirmationDialog from "../shared/components/dialogs/ConfirmationDialog";

import DataTable from "../shared/components/tables/DataTable";
import type {
    DataTableColumn
} from "../shared/components/tables/DataTable.types";

import { useNotification } from "../shared/hooks/useNotification";

import FormArchitectureTest from "./components/FormArchitectureTest";

interface TestUser {

    id: number;

    username: string;

    name: string;

    email: string;

    active: boolean;

}


const users: TestUser[] = [

    {
        id: 1,
        username: "admin",
        name: "System Administrator",
        email: "admin@example.com",
        active: true
    },

    {
        id: 2,
        username: "psychologist",
        name: "Clinical Psychologist",
        email: "psychologist@example.com",
        active: true
    },

    {
        id: 3,
        username: "reception",
        name: "Reception User",
        email: "reception@example.com",
        active: false
    }

];


const columns: DataTableColumn<TestUser>[] = [

    {
        id: "username",
        label: "Username",
        value: row => row.username
    },

    {
        id: "name",
        label: "Name",
        value: row => row.name
    },

    {
        id: "email",
        label: "Email",
        value: row => row.email
    },

    {
        id: "status",
        label: "Status",
        align: "center",

        render: row => (

            <Chip
                label={
                    row.active
                        ? "Active"
                        : "Inactive"
                }
                color={
                    row.active
                        ? "success"
                        : "default"
                }
                size="small"
            />

        )

    }

];


export default function DashboardPage() {

    const {
        showSuccess,
        showError,
        showWarning,
        showInfo
    } = useNotification();

    const [
        confirmationOpen,
        setConfirmationOpen
    ] = useState(false);

    const [
        tableLoading,
        setTableLoading
    ] = useState(false);

    const handleRowClick = (
        user: TestUser
    ) => {

        showInfo(
            `Selected user: ${user.username}`
        );

    };


    const handleTableLoading = () => {

        setTableLoading(true);

        window.setTimeout(() => {
            setTableLoading(false);
        }, 1500);

    };


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

                {/* Form Architecture Test */}
                <FormArchitectureTest />

            {/* 
             * This variable is intentionally rendered
             * separately so we can test the loading state.
             */}

            {tableLoading && (

                <Box sx={{ mt: 4 }}>

                    <h2>DataTable Loading State</h2>

                    <DataTable
                        columns={columns}
                        rows={users}
                        getRowId={row => row.id}
                        loading
                        ariaLabel="System users"
                    />

                </Box>

            )}


                {/* DataTable */}

                <Box>

                    <h2>Data Table</h2>

                    <Stack spacing={2}>

                        <DataTable
                            columns={columns}
                            rows={users}
                            getRowId={row => row.id}
                            onRowClick={handleRowClick}
                            ariaLabel="System users"
                        />

                        <Stack
                            direction="row"
                            spacing={2}
                        >

                            <Button
                                variant="outlined"
                                onClick={handleTableLoading}
                            >
                                Test Loading
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={() =>
                                    showInfo(
                                        "DataTable row interaction is working."
                                    )
                                }
                            >
                                Test Table
                            </Button>

                        </Stack>

                    </Stack>

                </Box>


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