import { useNavigate } from "react-router-dom";

import PageHeader from "../../../shared/components/common/PageHeader";
import CatalogForm from "../../components/CatalogoForm";

import { useCreate } from "../../hooks/useNivelSeveridadAlergia";

import { useGetAllEstados } from "../../hooks/useEstados";

import type { Request } from "../../types/catalogDTOs.types";

export default function NivelSeveridadAlergiaCreatePage() {
  const navigate = useNavigate();

  const path = "/administration/nivel-severidad-alergia";
  const titleCreate = "Nuevo Nivel Severidad Alergia";
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
