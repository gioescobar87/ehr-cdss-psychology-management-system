import {
    useNavigate
} from "react-router-dom";

import PageHeader from "../../shared/components/common/PageHeader";
import PermissionForm from "../components/PermisoForm";

import {
    useCreate
} from "../hooks/usePermisos";

import {
    useGetAllEstados
} from "../hooks/useEstados";

import type {
    Request
} from "../types/permiso.types";

export default function PermissionCreatePage() {
    const navigate = useNavigate();

    const createPermission =
        useCreate();

    const {
        data: states = [],
        isLoading: statesLoading
    } = useGetAllEstados();

    const handleSubmit = (
        request: Request
    ) => {
        createPermission.mutate(
            request,
            {
                onSuccess: () => {
                    navigate(
                        "/administration/permissions"
                    );
                }
            }
        );
    };

    return (
        <>
            <PageHeader
                title="Nuevo permiso"
                description="Crear un nuevo permiso del sistema."
            />

            <PermissionForm
                states={states}
                loading={
                    statesLoading ||
                    createPermission.isPending
                }
                onSubmit={handleSubmit}
                onCancel={() =>
                    navigate(
                        "/administration/permissions"
                    )
                }
            />
        </>
    );
}