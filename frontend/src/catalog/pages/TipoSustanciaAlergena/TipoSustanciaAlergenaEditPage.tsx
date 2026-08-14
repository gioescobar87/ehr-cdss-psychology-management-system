import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../../shared/components/common/PageHeader";
import CatalogForm from "../../components/CatalogoForm";

import { useGetById, useUpdate } from "../../hooks/useTipoSustanciaAlergena";

import { useGetAllEstados } from "../../hooks/useEstados";

import type { Request } from "../../types/catalogDTOs.types";

export default function TipoSustanciaAlergenaEditPage() {
  const navigate = useNavigate();

  const path = "/administration/tipo-sustancia-alergena";
  const titleEdit = "Tipo Sustancia Alérgena";
  const descriptionEdit = "Editar la información de " + titleEdit + ".";

  const { id } = useParams();

  const recordId = Number(id);

  const { data: record, isLoading: recordLoading } = useGetById(recordId);

  const { data: states = [], isLoading: statesLoading } = useGetAllEstados();

  const updateRecord = useUpdate();

  const handleSubmit = (request: Request) => {
    updateRecord.mutate(
      {
        id: recordId,
        request,
      },
      {
        onSuccess: () => {
          navigate(path);
        },
      },
    );
  };

  return (
    <>
      <PageHeader title={titleEdit} description={descriptionEdit} />

      <CatalogForm
        initialData={record}
        states={states}
        loading={recordLoading || statesLoading || updateRecord.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate(path)}
      />
    </>
  );
}
