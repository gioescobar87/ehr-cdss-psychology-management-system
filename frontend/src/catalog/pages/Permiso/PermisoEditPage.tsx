import {
    useNavigate,
    useParams
} from "react-router-dom";

import PageHeader from "../../../shared/components/common/PageHeader";
import PermisoForm from "../../components/PermisoForm";

import {
    useGetById,
    useUpdate
} from "../../hooks/usePermiso";

import {
    useGetAllEstados
} from "../../hooks/useEstados";

import type {
    Request
} from "../../types/permiso.types";

export default function PermissionEditPage() {
    const navigate = useNavigate();

    const {
        id
    } = useParams();

    const permissionId =
        Number(id);

    const {
        data: permission,
        isLoading: permissionLoading
    } = useGetById(
        permissionId
    );

    const {
        data: states = [],
        isLoading: statesLoading
    } = useGetAllEstados();

    const updatePermission =
        useUpdate();

    const handleSubmit = (
        request: Request
    ) => {
        updatePermission.mutate(
            {
                id: permissionId,
                request
            },
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
                title="Editar permiso"
                description="Modificar la información del permiso."
            />

            <PermisoForm
                initialData={permission}
                states={states}
                loading={
                    permissionLoading ||
                    statesLoading ||
                    updatePermission.isPending
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