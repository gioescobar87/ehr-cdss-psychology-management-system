import { useNavigate } from "react-router-dom";

import PageHeader from "../../../shared/components/common/PageHeader";
import CatalogForm from "../../components/CatalogoForm";

import { useCreate } from "../../hooks/useTipoIntervencion";

import { useGetAllEstados } from "../../hooks/useEstados";

import type { Request } from "../../types/catalogDTOs.types";

export default function TipoIntervencionoCreatePage() {
  const navigate = useNavigate();

  const path = "/administration/tipo-intervencion";
  const titleCreate = "Nuevo Tipo Intervencion";
  const descriptionCreate = "Crear un nuevo registro.";

  const createRecord = useCreate();

  const { data: states = [], isLoading: statesLoading } = useGetAllEstados();

  const handleSubmit = (request: Request) => {
    createRecord.mutate(request, {
      onSuccess: () => {
        navigate(path);
      },
    });
  };

  return (
    <>
      <PageHeader title={titleCreate} description={descriptionCreate} />

      <CatalogForm
        states={states}
        loading={statesLoading || createRecord.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate(path)}
      />
    </>
  );
}
