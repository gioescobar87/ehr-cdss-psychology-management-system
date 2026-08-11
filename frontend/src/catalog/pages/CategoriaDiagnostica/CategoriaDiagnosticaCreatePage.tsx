import {
    useNavigate
} from "react-router-dom";

import PageHeader from "../../../shared/components/common/PageHeader";
import PermissionForm from "../../components/CategoriaDiagnosticaForm";

import {
    useCreate
} from "../../hooks/useCategoriaDiagnostica";

import {
    useGetAllCategorias
} from "../../hooks/useCategoriaDiagnostica";

import type {
    Request
} from "../../types/categoriaDiagnostica.types";

export default function CategoriaDiagnosticaCreatePage() {
    const navigate = useNavigate();

    const createPermission =
        useCreate();

    const {
        data: states = [],
        isLoading: statesLoading
    } = useGetAllCategorias();

    const handleSubmit = (
        request: Request
    ) => {
        createPermission.mutate(
            request,
            {
                onSuccess: () => {
                    navigate(
                        "/administration/categoria-diagnostica"
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