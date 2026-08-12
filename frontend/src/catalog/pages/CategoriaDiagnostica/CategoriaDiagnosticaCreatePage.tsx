import {
    useNavigate
} from "react-router-dom";

import PageHeader from "../../../shared/components/common/PageHeader";
import PermissionForm from "../../components/CatalogoForm";

import {
    useCreate
} from "../../hooks/useCategoriaDiagnostica";

import {
    useGetAllEstados
} from "../../hooks/useEstados";

import type {
    Request
} from "../../types/catalogDTOs.types";

export default function CategoriaDiagnosticaCreatePage() {
    const navigate = useNavigate();

    const path = "/administration/categoria-diagnostica"
    const titleCreate = "Categoría Diagnostica";
    const descriptionCreate = "Crear una nueva " + titleCreate + "."

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
                    navigate(path);
                }
            }
        );
    };

    return (
        <>
            <PageHeader
                title={titleCreate}
                description={descriptionCreate}
            />

            <PermissionForm
                states={states}
                loading={
                    statesLoading ||
                    createPermission.isPending
                }
                onSubmit={handleSubmit}
                onCancel={() =>
                    navigate(path)
                }
            />
        </>
    );
}