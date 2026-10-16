
INSERT INTO public.categoria_diagnostica (
    nombre,
    descripcion,
    estado_id
)
VALUES (
    'Diferencia técnica del modelo',
    'Categoría técnica para registrar un resultado específico de la comparación entre el diagnóstico seleccionado por el profesional y el sugerido por el sistema experto.',
    1
);

INSERT INTO public.diagnostico (
    categoria_diagnostica_id,
    codigo_icd10cm,
    nombre,
    descripcion,
    estado_id
)
SELECT
    cd.id,
    NULL,
    'El diagnóstico seleccionado ya fue modelado, pero no cumple con las reglas definidas',
    'Resultado técnico que indica que el diagnóstico seleccionado por el profesional, aunque ya fue modelado, no coincide con las reglas abstraídas del DSM-5-TR. NO UTILIZAR COMO DIAGNÓSTICO.',
    1
FROM public.categoria_diagnostica cd
WHERE cd.nombre = 'Diferencia técnica del modelo'
  AND NOT EXISTS (
      SELECT 1
      FROM public.diagnostico d
      WHERE d.categoria_diagnostica_id = cd.id
        AND d.nombre = 'El diagnóstico seleccionado ya fue modelado, pero no cumple con las reglas definidas'
  );
