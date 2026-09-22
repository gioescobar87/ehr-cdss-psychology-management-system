-- CLEAN DIAGNOSES TABLES

DELETE FROM paciente_diagnostico WHERE id > 0;
DELETE FROM diagnostico WHERE id > 0;
DELETE FROM arbol_diagnostico WHERE id > 0;
DELETE FROM categoria_diagnostica WHERE id > 0;

-- CHANGE NATURE OF CODIGO DSM
DROP INDEX public.idx_diagnostico_codigo_dsm;

ALTER TABLE public.diagnostico
RENAME COLUMN codigo_dsm TO codigo_icd10cm;

-- ADD ALL DIAGNOSIS CATEGORIES
INSERT INTO public.categoria_diagnostica (nombre, descripcion, estado_id)
VALUES
    ('Disforia de género', NULL, 1),
    ('Disfunciones sexuales', NULL, 1),
    ('Espectro de esquizofrenia y otros trastornos psicóticos', NULL, 1),
    ('Otros trastornos mentales / códigos adicionales', NULL, 1),
    ('TOC y relacionados', NULL, 1),
    ('Trastornos bipolares y relacionados', NULL, 1),
    ('Trastornos de ansiedad', NULL, 1),
    ('Trastornos de la alimentación y conducta alimentaria', NULL, 1),
    ('Trastornos de la eliminación', NULL, 1),
    ('Trastornos de la personalidad', NULL, 1),
    ('Trastornos de síntomas somáticos y relacionados', NULL, 1),
    ('Trastornos del neurodesarrollo', NULL, 1),
    ('Trastornos del sueño-vigilia', NULL, 1),
    ('Trastornos depresivos', NULL, 1),
    ('Trastornos disociativos', NULL, 1),
    ('Trastornos disruptivos, del control de los impulsos y de la conducta', NULL, 1),
    ('Trastornos neurocognitivos', NULL, 1),
    ('Trastornos parafílicos', NULL, 1),
    ('Trastornos relacionados con sustancias y adictivos', NULL, 1),
    ('Trastornos relacionados con trauma y factores de estrés', NULL, 1);


-- ADD ALL DIAGNOSIS THAT BELOONG TO THE 'TRASTORNOS DEL NEURODESARROLLO' CATEGORY
INSERT INTO public.diagnostico (
    categoria_diagnostica_id,
    codigo_icd10cm,
    nombre,
    descripcion,
    estado_id
)
SELECT
    c.id,
    d.codigo_icd10cm,
    d.nombre,
    d.descripcion,
    1
FROM (
    VALUES
        ('F70', 'Discapacidad intelectual (trastorno del desarrollo intelectual), leve', 'Limitaciones en funcionamiento intelectual y adaptativo de intensidad leve.'),
        ('F71', 'Discapacidad intelectual, moderada', 'Limitaciones intelectuales y adaptativas de intensidad moderada.'),
        ('F72', 'Discapacidad intelectual, grave', 'Limitaciones significativas del funcionamiento intelectual y adaptativo.'),
        ('F73', 'Discapacidad intelectual, profunda', 'Limitaciones muy graves del funcionamiento intelectual y adaptativo.'),
        ('F79', 'Discapacidad intelectual no especificada', 'Se presume discapacidad intelectual pero no puede determinarse adecuadamente su gravedad.'),
        ('F88', 'Retraso global del desarrollo', 'Retraso significativo en múltiples áreas del desarrollo, generalmente aplicado en niños pequeños.'),
        ('F80.2', 'Trastorno del lenguaje', 'Dificultades persistentes para adquirir y utilizar lenguaje.'),
        ('F80.0', 'Trastorno de los sonidos del habla', 'Dificultad persistente para producir sonidos del habla correctamente.'),
        ('F80.81', 'Trastorno de la fluidez de inicio en la infancia (tartamudeo)', 'Alteraciones en la fluidez, ritmo y facilidad del habla.'),
        ('F80.82', 'Trastorno de la comunicación social (pragmático)', 'Dificultades para utilizar la comunicación verbal y no verbal socialmente.'),
        ('F80.9', 'Trastorno de la comunicación no especificado', 'Síntomas de comunicación clínicamente significativos que no cumplen otro trastorno específico.'),
        ('F84.0', 'Trastorno del espectro autista', 'Déficits persistentes en comunicación/interacción social y patrones restrictivos o repetitivos.'),
        ('F90.0', 'TDAH, presentación predominantemente inatenta', 'Predominio de síntomas de inatención.'),
        ('F90.1', 'TDAH, presentación predominantemente hiperactiva/impulsiva', 'Predominio de hiperactividad e impulsividad.'),
        ('F90.2', 'TDAH, presentación combinada', 'Cumple criterios de inatención e hiperactividad/impulsividad.'),
        ('F90.8', 'Otro TDAH especificado', 'Síntomas de TDAH clínicamente significativos que no cumplen completamente un subtipo concreto.'),
        ('F90.9', 'TDAH no especificado', 'Síntomas de TDAH cuando no se dispone de información suficiente para especificarlo.'),
        ('F81.0', 'Trastorno específico del aprendizaje, con dificultad en la lectura', 'Dificultades persistentes en precisión, velocidad o comprensión lectora.'),
        ('F81.81', 'Trastorno específico del aprendizaje, con dificultad en la expresión escrita', 'Problemas significativos de ortografía, gramática o expresión escrita.'),
        ('F81.2', 'Trastorno específico del aprendizaje, con dificultad matemática', 'Dificultades persistentes en sentido numérico, cálculo o razonamiento matemático.'),
        ('F82', 'Trastorno del desarrollo de la coordinación', 'Rendimiento motor sustancialmente inferior al esperado para la edad.'),
        ('F98.4', 'Trastorno de movimientos estereotipados', 'Conductas motoras repetitivas aparentemente impulsivas y sin finalidad evidente.')
) AS d(codigo_icd10cm, nombre, descripcion)
JOIN public.categoria_diagnostica c
    ON c.nombre = 'Trastornos del neurodesarrollo';


-- ADD ALL DIAGNOSIS THAT BELOONG TO THE 'Espectro de esquizofrenia y otros trastornos psicóticos' CATEGORY
INSERT INTO public.diagnostico (
    categoria_diagnostica_id,
    codigo_icd10cm,
    nombre,
    descripcion,
    estado_id
)
SELECT
    c.id,
    d.codigo_icd10cm,
    d.nombre,
    d.descripcion,
    1
FROM (
    VALUES
        ('F23', 'Trastorno psicótico breve', 'Episodio psicótico de duración limitada, con recuperación posterior.'),
        ('F20.81', 'Trastorno esquizofreniforme', 'Síntomas característicos de esquizofrenia con duración intermedia.'),
        ('F20.9', 'Esquizofrenia, sin especificación', 'Alteraciones persistentes de pensamiento, percepción, conducta, afecto y funcionamiento.'),
        ('F25.0', 'Trastorno esquizoafectivo, tipo bipolar', 'Episodios afectivos junto con síntomas psicóticos, incluyendo períodos de psicosis sin episodio afectivo.'),
        ('F25.1', 'Trastorno esquizoafectivo, tipo depresivo', 'Síntomas depresivos y psicóticos con el patrón temporal requerido.'),
        ('F22', 'Trastorno delirante', 'Presencia de uno o más delirios persistentes sin el cuadro global típico de esquizofrenia.'),
        ('F21', 'Trastorno de la personalidad esquizotípica', 'Patrón persistente de malestar social, cogniciones extrañas y comportamiento excéntrico.'),
        ('F06.1', 'Catatonía asociada a otra afección médica', 'Síndrome de alteraciones psicomotoras asociado a una condición médica.'),
        ('F06.1', 'Catatonía asociada a otro trastorno mental', 'Catatonía que aparece en el contexto de otro trastorno mental.'),
        ('F06.1', 'Catatonía no especificada', 'Catatonía clínicamente significativa cuando no puede determinarse adecuadamente su causa.'),
        ('F06.2', 'Trastorno psicótico debido a otra afección médica', 'Psicosis causada directamente por una condición médica.'),
        ('F28', 'Otro trastorno del espectro de la esquizofrenia y otro trastorno psicótico especificado', 'Síntomas psicóticos clínicamente significativos que no cumplen completamente otro diagnóstico.'),
        ('F29', 'Trastorno del espectro de la esquizofrenia y otro trastorno psicótico no especificado', 'Síntomas psicóticos significativos sin información suficiente para especificar el diagnóstico.')
) AS d(codigo_icd10cm, nombre, descripcion)
JOIN public.categoria_diagnostica c
    ON c.nombre = 'Espectro de esquizofrenia y otros trastornos psicóticos';


-- ADD ALL DIAGNOSIS THAT BELOONG TO THE 'Trastornos bipolares y relacionados' CATEGORY
INSERT INTO public.diagnostico (
    categoria_diagnostica_id,
    codigo_icd10cm,
    nombre,
    descripcion,
    estado_id
)
SELECT
    c.id,
    d.codigo_icd10cm,
    d.nombre,
    d.descripcion,
    1
FROM (
    VALUES
        ('F31.0', 'Trastorno bipolar I, episodio más reciente hipomaníaco', 'Se presenta un episodio hipomaníaco actual o más reciente dentro del curso del trastorno bipolar I.'),
        ('F31.11', 'Trastorno bipolar I, episodio más reciente maníaco, leve', 'Episodio maníaco actual o más reciente de intensidad leve, sin características psicóticas.'),
        ('F31.12', 'Trastorno bipolar I, episodio más reciente maníaco, moderado', 'Episodio maníaco de intensidad moderada, sin características psicóticas.'),
        ('F31.13', 'Trastorno bipolar I, episodio más reciente maníaco, grave, sin características psicóticas', 'Episodio maníaco grave sin síntomas psicóticos.'),
        ('F31.2', 'Trastorno bipolar I, episodio más reciente maníaco, grave, con características psicóticas', 'Episodio maníaco grave acompañado de características psicóticas.'),
        ('F31.30', 'Trastorno bipolar I, episodio más reciente depresivo, gravedad no especificada', 'Episodio depresivo mayor actual o más reciente cuya gravedad no se especifica.'),
        ('F31.31', 'Trastorno bipolar I, episodio más reciente depresivo, leve', 'Episodio depresivo mayor leve.'),
        ('F31.32', 'Trastorno bipolar I, episodio más reciente depresivo, moderado', 'Episodio depresivo mayor moderado.'),
        ('F31.4', 'Trastorno bipolar I, episodio más reciente depresivo, grave, sin características psicóticas', 'Episodio depresivo mayor grave sin psicosis.'),
        ('F31.5', 'Trastorno bipolar I, episodio más reciente depresivo, grave, con características psicóticas', 'Episodio depresivo mayor grave acompañado de síntomas psicóticos.'),
        ('F31.60', 'Trastorno bipolar I, episodio más reciente con características mixtas, gravedad no especificada', 'Episodio con características mixtas cuya gravedad no se especifica.'),
        ('F31.61', 'Trastorno bipolar I, episodio más reciente con características mixtas, leve', 'Presentación con características mixtas de intensidad leve.'),
        ('F31.62', 'Trastorno bipolar I, episodio más reciente con características mixtas, moderado', 'Presentación con características mixtas de intensidad moderada.'),
        ('F31.63', 'Trastorno bipolar I, episodio más reciente con características mixtas, grave, sin características psicóticas', 'Presentación grave sin psicosis.'),
        ('F31.64', 'Trastorno bipolar I, episodio más reciente con características mixtas, grave, con características psicóticas', 'Presentación grave acompañada de síntomas psicóticos.'),
        ('F31.71', 'Trastorno bipolar I, en remisión parcial, episodio más reciente hipomaníaco', 'Se cumplen criterios de remisión parcial después de un episodio hipomaníaco.'),
        ('F31.72', 'Trastorno bipolar I, en remisión total, episodio más reciente hipomaníaco', 'El episodio hipomaníaco se encuentra en remisión total.'),
        ('F31.73', 'Trastorno bipolar I, en remisión parcial, episodio más reciente maníaco', 'Remisión parcial después del episodio maníaco.'),
        ('F31.74', 'Trastorno bipolar I, en remisión total, episodio más reciente maníaco', 'Remisión total del episodio maníaco.'),
        ('F31.75', 'Trastorno bipolar I, en remisión parcial, episodio más reciente depresivo', 'Remisión parcial después del episodio depresivo.'),
        ('F31.76', 'Trastorno bipolar I, en remisión total, episodio más reciente depresivo', 'Remisión total del episodio depresivo.'),
        ('F31.77', 'Trastorno bipolar I, en remisión parcial, episodio más reciente con características mixtas', 'Remisión parcial después de un episodio con características mixtas.'),
        ('F31.78', 'Trastorno bipolar I, en remisión total, episodio más reciente con características mixtas', 'Remisión total después del episodio con características mixtas.'),
        ('F31.81', 'Trastorno bipolar II', 'Episodios hipomaníacos y depresivos mayores, sin episodio maníaco completo.'),
        ('F34.0', 'Trastorno ciclotímico', 'Fluctuaciones crónicas de síntomas hipomaníacos y depresivos que no cumplen episodios completos.'),
        ('F31.89', 'Otro trastorno bipolar y relacionado especificado', 'Síntomas bipolares clínicamente significativos que no cumplen otro diagnóstico completo.'),
        ('F31.9', 'Trastorno bipolar y relacionado no especificado', 'Síntomas bipolares cuando no existe información suficiente para especificarlos.')
) AS d(codigo_icd10cm, nombre, descripcion)
JOIN public.categoria_diagnostica c
    ON c.nombre = 'Trastornos bipolares y relacionados';


-- ADD ALL DIAGNOSIS THAT BELOONG TO THE 'Trastornos depresivos' CATEGORY
INSERT INTO public.diagnostico (
    categoria_diagnostica_id,
    codigo_icd10cm,
    nombre,
    descripcion,
    estado_id
)
SELECT
    c.id,
    d.codigo_icd10cm,
    d.nombre,
    d.descripcion,
    1
FROM (
    VALUES
        ('F32.0', 'Trastorno depresivo mayor, episodio único, leve', 'Episodio depresivo mayor con intensidad leve.'),
        ('F32.1', 'Trastorno depresivo mayor, episodio único, moderado', 'Episodio depresivo mayor de intensidad moderada.'),
        ('F32.2', 'Trastorno depresivo mayor, episodio único, grave sin características psicóticas', 'Episodio depresivo grave sin psicosis.'),
        ('F32.3', 'Trastorno depresivo mayor, episodio único, grave con características psicóticas', 'Episodio depresivo grave acompañado de síntomas psicóticos.'),
        ('F32.4', 'Trastorno depresivo mayor, episodio único, en remisión parcial', 'Persisten algunos síntomas después del episodio.'),
        ('F32.5', 'Trastorno depresivo mayor, episodio único, en remisión total', 'No se cumplen actualmente los criterios del episodio.'),
        ('F33.0', 'Trastorno depresivo mayor, recurrente, leve', 'Episodios depresivos mayores recurrentes de intensidad leve.'),
        ('F33.1', 'Trastorno depresivo mayor, recurrente, moderado', 'Episodios recurrentes de intensidad moderada.'),
        ('F33.2', 'Trastorno depresivo mayor, recurrente, grave sin características psicóticas', 'Episodios recurrentes graves sin psicosis.'),
        ('F33.3', 'Trastorno depresivo mayor, recurrente, grave con características psicóticas', 'Episodios recurrentes graves con síntomas psicóticos.'),
        ('F33.41', 'Trastorno depresivo mayor, recurrente, en remisión parcial', 'Algunos síntomas persisten después de un episodio recurrente.'),
        ('F33.42', 'Trastorno depresivo mayor, recurrente, en remisión total', 'Remisión completa del episodio recurrente.'),
        ('F34.1', 'Trastorno depresivo persistente (distimia)', 'Estado de ánimo deprimido crónico durante períodos prolongados.'),
        ('F32.81', 'Trastorno disfórico premenstrual', 'Síntomas afectivos y físicos recurrentes asociados al ciclo menstrual.'),
        ('F32.89', 'Otro trastorno depresivo especificado', 'Síntomas depresivos clínicamente significativos que no cumplen otro diagnóstico completo.'),
        ('F32.A', 'Trastorno depresivo no especificado', 'Síntomas depresivos significativos sin información suficiente para especificar.')
) AS d(codigo_icd10cm, nombre, descripcion)
JOIN public.categoria_diagnostica c
    ON c.nombre = 'Trastornos depresivos';

-- ADD ALL DIAGNOSIS THAT BELOONG TO THE 'Trastornos de ansiedad' CATEGORY
INSERT INTO public.diagnostico (
    categoria_diagnostica_id,
    codigo_icd10cm,
    nombre,
    descripcion,
    estado_id
)
SELECT
    c.id,
    d.codigo_icd10cm,
    d.nombre,
    d.descripcion,
    1
FROM (
    VALUES
        ('F93.0', 'Trastorno de ansiedad por separación', 'Ansiedad excesiva ante separación de figuras de apego.'),
        ('F94.0', 'Mutismo selectivo', 'Incapacidad persistente para hablar en determinadas situaciones sociales pese a poder hablar en otras.'),
        ('F40.218', 'Fobia específica, tipo animal', 'Miedo intenso y persistente a animales.'),
        ('F40.228', 'Fobia específica, entorno natural', 'Miedo intenso a situaciones del entorno natural.'),
        ('F40.230', 'Fobia específica, tipo sangre', 'Miedo intenso y persistente provocado por la exposición a sangre.'),
        ('F40.231', 'Fobia específica, tipo inyecciones y transfusiones', 'Miedo intenso ante inyecciones, agujas o transfusiones.'),
        ('F40.232', 'Fobia específica, tipo otra atención médica', 'Miedo intenso relacionado con otras situaciones de atención médica.'),
        ('F40.233', 'Fobia específica, tipo lesiones', 'Miedo intenso ante heridas o lesiones físicas.'),
        ('F40.248', 'Fobia específica, situacional', 'Miedo intenso ante determinadas situaciones, como volar o conducir.'),
        ('F40.298', 'Fobia específica, otro tipo', 'Fobia específica que no encaja en las categorías anteriores.'),
        ('F40.10', 'Trastorno de ansiedad social', 'Miedo intenso a situaciones sociales o de evaluación.'),
        ('F41.0', 'Trastorno de pánico', 'Ataques de pánico recurrentes e inesperados y preocupación/conductas asociadas.'),
        ('F40.00', 'Agorafobia', 'Miedo intenso a situaciones de las que escapar o recibir ayuda podría ser difícil.'),
        ('F41.1', 'Trastorno de ansiedad generalizada', 'Preocupación excesiva y persistente sobre múltiples áreas de la vida.'),
        ('F41.8', 'Otro trastorno de ansiedad especificado', 'Ansiedad clínicamente significativa que no cumple completamente otro diagnóstico.'),
        ('F41.9', 'Trastorno de ansiedad no especificado', 'Ansiedad significativa sin información suficiente para especificarla.')
) AS d(codigo_icd10cm, nombre, descripcion)
JOIN public.categoria_diagnostica c
    ON c.nombre = 'Trastornos de ansiedad';


-- ADD ALL DIAGNOSIS THAT BELOONG TO THE 'TOC y relacionados' CATEGORY
INSERT INTO public.diagnostico (
    categoria_diagnostica_id,
    codigo_icd10cm,
    nombre,
    descripcion,
    estado_id
)
SELECT
    c.id,
    d.codigo_icd10cm,
    d.nombre,
    d.descripcion,
    1
FROM (
    VALUES
        ('F42.2', 'Trastorno obsesivo-compulsivo', 'Obsesiones y/o compulsiones recurrentes, excesivas y difíciles de controlar.'),
        ('F42.4', 'Trastorno de excoriación (rascarse la piel)', 'Lesiones cutáneas producidas por rascado repetitivo difícil de controlar.'),
        ('F63.3', 'Trastorno de arrancarse el pelo (tricotilomanía)', 'Arrancamiento recurrente del cabello con pérdida del mismo.'),
        ('F45.22', 'Trastorno dismórfico corporal', 'Preocupación intensa por defectos o imperfecciones percibidas en la apariencia.'),
        ('F42.3', 'Trastorno de acumulación', 'Dificultad persistente para descartar posesiones debido a una necesidad percibida de conservarlas.'),
        ('F42.8', 'Otro TOC y relacionado especificado', 'Síntomas significativos que no cumplen completamente otro diagnóstico.'),
        ('F42.9', 'TOC y relacionado no especificado', 'Síntomas clínicamente significativos sin suficiente información.')
) AS d(codigo_icd10cm, nombre, descripcion)
JOIN public.categoria_diagnostica c
    ON c.nombre = 'TOC y relacionados';


-- ADD ALL DIAGNOSIS THAT BELOONG TO THE 'Trastornos relacionados con trauma y factores de estrés' CATEGORY
INSERT INTO public.diagnostico (
    categoria_diagnostica_id,
    codigo_icd10cm,
    nombre,
    descripcion,
    estado_id
)
SELECT
    c.id,
    d.codigo_icd10cm,
    d.nombre,
    d.descripcion,
    1
FROM (
    VALUES
        ('F43.0', 'Trastorno de estrés agudo', 'Respuesta de estrés postraumático que aparece después de un evento traumático y dura un período limitado.'),
        ('F43.10', 'Trastorno de estrés postraumático (TEPT)', 'Síntomas persistentes de intrusión, evitación, alteraciones cognitivas/emocionales y activación después de trauma.'),
        ('F43.81', 'Trastorno de duelo prolongado', 'Duelo persistente e incapacitante tras la muerte de una persona significativa.'),
        ('F43.21', 'Trastorno de adaptación con estado de ánimo deprimido', 'Respuesta emocional depresiva desproporcionada a un estresor identificable.'),
        ('F43.22', 'Trastorno de adaptación con ansiedad', 'Respuesta predominantemente ansiosa ante un estresor identificable.'),
        ('F43.23', 'Trastorno de adaptación con ansiedad y estado de ánimo deprimido', 'Combinación de síntomas ansiosos y depresivos ante un estresor.'),
        ('F43.24', 'Trastorno de adaptación con alteración de la conducta', 'Respuesta caracterizada principalmente por problemas conductuales.'),
        ('F43.25', 'Trastorno de adaptación con alteración mixta de emociones y conducta', 'Síntomas emocionales junto con alteraciones conductuales.'),
        ('F43.20', 'Trastorno de adaptación no especificado', 'Reacción clínicamente significativa a un estresor que no encaja en los subtipos anteriores.'),
        ('F43.89', 'Otro trastorno relacionado con trauma y factores de estrés especificado', 'Síntomas relacionados con trauma/estrés que no cumplen otro diagnóstico.'),
        ('F43.9', 'Trastorno relacionado con trauma y factores de estrés no especificado', 'Síntomas significativos sin información suficiente para especificarlos.')
) AS d(codigo_icd10cm, nombre, descripcion)
JOIN public.categoria_diagnostica c
    ON c.nombre = 'Trastornos relacionados con trauma y factores de estrés';


-- ADD ALL DIAGNOSIS THAT BELOONG TO THE 'Trastornos disociativos' CATEGORY
INSERT INTO public.diagnostico (
    categoria_diagnostica_id,
    codigo_icd10cm,
    nombre,
    descripcion,
    estado_id
)
SELECT
    c.id,
    d.codigo_icd10cm,
    d.nombre,
    d.descripcion,
    1
FROM (
    VALUES
        ('F44.81', 'Trastorno de identidad disociativo', 'Alteración de identidad con estados de personalidad diferenciados y discontinuidad de experiencia.'),
        ('F44.0', 'Amnesia disociativa', 'Incapacidad para recordar información autobiográfica importante.'),
        ('F44.1', 'Amnesia disociativa con fuga disociativa', 'Amnesia acompañada de desplazamiento o confusión respecto de la identidad.'),
        ('F48.1', 'Trastorno de despersonalización/desrealización', 'Experiencias persistentes de sentirse separado de uno mismo o de percibir el entorno como irreal.'),
        ('F44.89', 'Otro trastorno disociativo especificado', 'Fenómenos disociativos clínicamente significativos que no cumplen otro diagnóstico.'),
        ('F44.9', 'Trastorno disociativo no especificado', 'Síntomas disociativos significativos sin información suficiente.')
) AS d(codigo_icd10cm, nombre, descripcion)
JOIN public.categoria_diagnostica c
    ON c.nombre = 'Trastornos disociativos';


-- ADD ALL DIAGNOSIS THAT BELOONG TO THE 'Trastornos de síntomas somáticos y relacionados' CATEGORY
INSERT INTO public.diagnostico (
    categoria_diagnostica_id,
    codigo_icd10cm,
    nombre,
    descripcion,
    estado_id
)
SELECT
    c.id,
    d.codigo_icd10cm,
    d.nombre,
    d.descripcion,
    1
FROM (
    VALUES
        ('F45.1', 'Trastorno de síntomas somáticos', 'Síntomas físicos acompañados de pensamientos, sentimientos o conductas excesivas relacionadas con ellos.'),
        ('F45.1', 'Trastorno de ansiedad por enfermedad', 'Preocupación persistente por padecer o adquirir una enfermedad grave.'),
        ('F68.10', 'Trastorno facticio', 'Falsificación o producción deliberada de síntomas para asumir el papel de enfermo.'),
        ('F45.8', 'Otro trastorno de síntomas somáticos especificado', 'Presentaciones somáticas significativas que no cumplen otro diagnóstico.'),
        ('F45.9', 'Trastorno de síntomas somáticos no especificado', 'Síntomas somáticos clínicamente significativos sin información suficiente.')
) AS d(codigo_icd10cm, nombre, descripcion)
JOIN public.categoria_diagnostica c
    ON c.nombre = 'Trastornos de síntomas somáticos y relacionados';


-- ADD ALL DIAGNOSIS THAT BELOONG TO THE 'Trastornos de la alimentación y conducta alimentaria' CATEGORY
INSERT INTO public.diagnostico (
    categoria_diagnostica_id,
    codigo_icd10cm,
    nombre,
    descripcion,
    estado_id
)
SELECT
    c.id,
    d.codigo_icd10cm,
    d.nombre,
    d.descripcion,
    1
FROM (
    VALUES
        ('F50.83', 'Pica en adultos', 'Ingestión persistente de sustancias sin valor nutritivo en adultos.'),
        ('F98.3', 'Pica en niños/adolescentes', 'Ingestión persistente de sustancias sin valor nutritivo en niños y adolescentes.'),
        ('F50.84', 'Trastorno de rumiación en adultos', 'Regurgitación repetida de alimentos que posteriormente pueden volver a masticarse, tragarse o escupirse en adultos.'),
        ('F98.21', 'Trastorno de rumiación en niños/adolescents', 'Regurgitación repetida de alimentos que posteriormente pueden volver a masticarse, tragarse o escupirse en niños y adolescentes.'),
        ('F50.82', 'Trastorno evitativo/restrictivo de la ingesta de alimentos (ARFID)', 'Restricción alimentaria por falta de interés, características sensoriales o consecuencias aversivas.'),
        ('F50.019', 'Anorexia nerviosa, tipo restrictivo', 'Restricción de ingesta, bajo peso y alteración de la percepción/persistencia del miedo relacionado con el peso.'),
        ('F50.029', 'Anorexia nerviosa, tipo con atracones/purgas', 'Anorexia con episodios recurrentes de atracones o conductas purgativas.'),
        ('F50.20', 'Bulimia nerviosa', 'Atracones recurrentes acompañados de conductas compensatorias inapropiadas.'),
        ('F50.819', 'Trastorno por atracones', 'Episodios recurrentes de atracones sin conductas compensatorias regulares.'),
        ('F50.89', 'Otro trastorno alimentario o de la ingestión de alimentos especificado', 'Presentación clínicamente significativa que no cumple completamente otro diagnóstico.'),
        ('F50.9', 'Trastorno alimentario o de la ingestión de alimentos no especificado', 'Síntomas significativos sin información suficiente para especificarlos.')
) AS d(codigo_icd10cm, nombre, descripcion)
JOIN public.categoria_diagnostica c
    ON c.nombre = 'Trastornos de la alimentación y conducta alimentaria';


-- ADD ALL DIAGNOSIS THAT BELOONG TO THE 'Trastornos de la eliminación' CATEGORY
INSERT INTO public.diagnostico (
    categoria_diagnostica_id,
    codigo_icd10cm,
    nombre,
    descripcion,
    estado_id
)
SELECT
    c.id,
    d.codigo_icd10cm,
    d.nombre,
    d.descripcion,
    1
FROM (
    VALUES
        ('F98.0', 'Enuresis', 'Emisión repetida de orina en lugares inapropiados.'),
        ('F98.1', 'Encopresis', 'Evacuación repetida de heces en lugares inapropiados.')
) AS d(codigo_icd10cm, nombre, descripcion)
JOIN public.categoria_diagnostica c
    ON c.nombre = 'Trastornos de la eliminación';


-- ADD ALL DIAGNOSIS THAT BELOONG TO THE 'Trastornos del sueño-vigilia' CATEGORY
INSERT INTO public.diagnostico (
    categoria_diagnostica_id,
    codigo_icd10cm,
    nombre,
    descripcion,
    estado_id
)
SELECT
    c.id,
    d.codigo_icd10cm,
    d.nombre,
    d.descripcion,
    1
FROM (
    VALUES
        ('G47.00', 'Trastorno de insomnio', 'Dificultad persistente para iniciar o mantener el sueño o despertar demasiado temprano, con deterioro diurno.'),
        ('G47.10', 'Trastorno de hipersomnolencia', 'Somnolencia excesiva pese a oportunidades adecuadas para dormir.'),
        ('G47.411', 'Narcolepsia con cataplexia', 'Somnolencia diurna y ataques de sueño, típicamente acompañados de cataplexia.'),
        ('G47.419', 'Narcolepsia sin cataplexia', 'Narcolepsia sin episodios de cataplexia.'),
        ('G47.33', 'Apnea/hipopnea obstructiva del sueño', 'Alteraciones respiratorias durante el sueño por obstrucción de la vía aérea.'),
        ('G47.31', 'Apnea central del sueño', 'Pausas respiratorias durante el sueño por ausencia o reducción del impulso respiratorio.'),
        ('G25.81', 'Síndrome de piernas inquietas', 'Necesidad imperiosa de mover las piernas, especialmente durante reposo y por la noche.'),
        ('F51.4', 'Trastorno de terrores nocturnos', 'Episodios de despertar parcial con miedo intenso durante el sueño.'),
        ('F51.3', 'Trastorno de sonambulismo', 'Episodios recurrentes de levantarse y caminar durante el sueño.'),
        ('F51.5', 'Trastorno de pesadillas', 'Episodios repetidos de sueños extremadamente disfóricos que suelen recordarse.'),
        ('F51.8', 'Otro trastorno del sueño-vigilia especificado', 'Alteración clínicamente significativa que no cumple otro diagnóstico específico.'),
        ('G47.9', 'Trastorno del sueño-vigilia no especificado', 'Alteración significativa del sueño sin información suficiente para especificarla.')
) AS d(codigo_icd10cm, nombre, descripcion)
JOIN public.categoria_diagnostica c
    ON c.nombre = 'Trastornos del sueño-vigilia';


-- ADD ALL DIAGNOSIS THAT BELOONG TO THE 'Disfunciones sexuales' CATEGORY
INSERT INTO public.diagnostico (
    categoria_diagnostica_id,
    codigo_icd10cm,
    nombre,
    descripcion,
    estado_id
)
SELECT
    c.id,
    d.codigo_icd10cm,
    d.nombre,
    d.descripcion,
    1
FROM (
    VALUES
        ('F52.32', 'Eyaculación retardada', 'Retraso marcado o ausencia de eyaculación.'),
        ('F52.21', 'Trastorno eréctil', 'Dificultad persistente para lograr o mantener una erección adecuada.'),
        ('F52.31', 'Trastorno orgásmico femenino', 'Dificultad significativa para alcanzar el orgasmo.'),
        ('F52.22', 'Trastorno del interés/excitación sexual femenino', 'Reducción significativa del interés o excitación sexual.'),
        ('F52.0', 'Trastorno de deseo sexual hipoactivo masculino', 'Disminución persistente del deseo sexual masculino.'),
        ('F52.6', 'Trastorno de dolor genitopélvico/penetración', 'Dificultad, dolor o temor relacionado con penetración vaginal.'),
        ('F52.4', 'Eyaculación precoz', 'Eyaculación que ocurre persistentemente antes de lo deseado.'),
        ('F52.8', 'Otra disfunción sexual especificada', 'Disfunción clínicamente significativa que no cumple otro diagnóstico.'),
        ('F52.9', 'Disfunción sexual no especificada', 'Disfunción significativa sin información suficiente para especificarla.')
) AS d(codigo_icd10cm, nombre, descripcion)
JOIN public.categoria_diagnostica c
    ON c.nombre = 'Disfunciones sexuales';


-- ADD ALL DIAGNOSIS THAT BELOONG TO THE 'Disforia de género' CATEGORY
INSERT INTO public.diagnostico (
    categoria_diagnostica_id,
    codigo_icd10cm,
    nombre,
    descripcion,
    estado_id
)
SELECT
    c.id,
    d.codigo_icd10cm,
    d.nombre,
    d.descripcion,
    1
FROM (
    VALUES
        ('F64.0', 'Disforia de género en niños', 'Malestar clínicamente significativo relacionado con incongruencia entre sexo asignado y género experimentado en niños.'),
        ('F64.0', 'Disforia de género en adolescentes y adultos', 'Malestar clínicamente significativo relacionado con incongruencia entre sexo asignado y género experimentado en adolescentes/adultos.')
) AS d(codigo_icd10cm, nombre, descripcion)
JOIN public.categoria_diagnostica c
    ON c.nombre = 'Disforia de género';


-- ADD ALL DIAGNOSIS THAT BELOONG TO THE 'Trastornos disruptivos, del control de los impulsos y de la conducta' CATEGORY
INSERT INTO public.diagnostico (
    categoria_diagnostica_id,
    codigo_icd10cm,
    nombre,
    descripcion,
    estado_id
)
SELECT
    c.id,
    d.codigo_icd10cm,
    d.nombre,
    d.descripcion,
    1
FROM (
    VALUES
        ('F91.3', 'Trastorno negativista desafiante', 'Patrón persistente de ánimo irritable, comportamiento desafiante y actitud vengativa.'),
        ('F91.1', 'Trastorno de conducta, inicio infantil', 'Patrón persistente de violación de derechos de otros o normas, con inicio infantil.'),
        ('F91.2', 'Trastorno de conducta, inicio adolescente', 'Mismo patrón, con inicio en la adolescencia.'),
        ('F91.9', 'Trastorno de conducta, inicio no especificado', 'No puede determinarse adecuadamente la edad de inicio.'),
        ('F63.81', 'Trastorno explosivo intermitente', 'Episodios recurrentes de agresividad impulsiva desproporcionada.'),
        ('F63.89', 'Otro trastorno disruptivo, del control de los impulsos y de la conducta especificado', 'Síntomas clínicamente significativos que no cumplen otro diagnóstico.'),
        ('F63.9', 'Trastorno disruptivo, del control de los impulsos y de la conducta no especificado', 'Síntomas significativos sin información suficiente.')
) AS d(codigo_icd10cm, nombre, descripcion)
JOIN public.categoria_diagnostica c
    ON c.nombre = 'Trastornos disruptivos, del control de los impulsos y de la conducta';


-- ADD ALL DIAGNOSIS THAT BELOONG TO THE 'Trastornos relacionados con sustancias y adictivos' CATEGORY
INSERT INTO public.diagnostico (
    categoria_diagnostica_id,
    codigo_icd10cm,
    nombre,
    descripcion,
    estado_id
)
SELECT
    c.id,
    d.codigo_icd10cm,
    d.nombre,
    d.descripcion,
    1
FROM (
    VALUES
        ('F10.10', 'Trastorno por consumo de alcohol, leve', 'Patrón problemático de consumo que cumple criterios de trastorno leve.'),
        ('F10.11', 'Trastorno por consumo de alcohol, leve, en remisión', 'Trastorno previamente leve que se encuentra en remisión.'),
        ('F10.20', 'Trastorno por consumo de alcohol, moderado o grave', 'Patrón de consumo problemático que cumple criterios de gravedad moderada o grave.'),
        ('F10.21', 'Trastorno por consumo de alcohol, moderado o grave, en remisión', 'Trastorno previamente moderado/grave que se encuentra en remisión.'),
        ('F11.10', 'Trastorno por consumo de opioides, leve', 'Patrón problemático de consumo de opioides de gravedad leve.'),
        ('F11.11', 'Trastorno por consumo de opioides, leve, en remisión', 'Trastorno leve en remisión.'),
        ('F11.20', 'Trastorno por consumo de opioides, moderado o grave', 'Patrón problemático de consumo de opioides de gravedad moderada o grave.'),
        ('F11.21', 'Trastorno por consumo de opioides, moderado o grave, en remisión', 'Trastorno moderado/grave en remisión.'),
        ('F12.10', 'Trastorno por consumo de cannabis, leve', 'Patrón problemático de consumo de cannabis de gravedad leve.'),
        ('F12.11', 'Trastorno por consumo de cannabis, leve, en remisión', 'Trastorno leve en remisión.'),
        ('F12.20', 'Trastorno por consumo de cannabis, moderado o grave', 'Patrón problemático de consumo de cannabis de gravedad moderada o grave.'),
        ('F12.21', 'Trastorno por consumo de cannabis, moderado o grave, en remisión', 'Trastorno moderado/grave en remisión.'),
        ('F13.10', 'Trastorno por consumo de sedantes, hipnóticos o ansiolíticos, leve', 'Patrón problemático de consumo de gravedad leve.'),
        ('F13.11', 'Trastorno por consumo de sedantes, hipnóticos o ansiolíticos, leve, en remisión', 'Trastorno leve en remisión.'),
        ('F13.20', 'Trastorno por consumo de sedantes, hipnóticos o ansiolíticos, moderado o grave', 'Patrón problemático de gravedad moderada o grave.'),
        ('F13.21', 'Trastorno por consumo de sedantes, hipnóticos o ansiolíticos, moderado o grave, en remisión', 'Trastorno moderado/grave en remisión.'),
        ('F14.10', 'Trastorno por consumo de cocaína, leve', 'Patrón problemático de consumo de cocaína de gravedad leve.'),
        ('F14.11', 'Trastorno por consumo de cocaína, leve, en remisión', 'Trastorno leve en remisión.'),
        ('F14.20', 'Trastorno por consumo de cocaína, moderado o grave', 'Patrón problemático de consumo de cocaína de gravedad moderada o grave.'),
        ('F14.21', 'Trastorno por consumo de cocaína, moderado o grave, en remisión', 'Trastorno moderado/grave en remisión.'),
        ('F15.10', 'Trastorno por consumo de otros estimulantes, leve', 'Patrón problemático de consumo de estimulantes de gravedad leve.'),
        ('F15.11', 'Trastorno por consumo de otros estimulantes, leve, en remisión', 'Trastorno leve en remisión.'),
        ('F15.20', 'Trastorno por consumo de otros estimulantes, moderado o grave', 'Patrón problemático de gravedad moderada o grave.'),
        ('F15.21', 'Trastorno por consumo de otros estimulantes, moderado o grave, en remisión', 'Trastorno moderado/grave en remisión.'),
        ('F16.10', 'Trastorno por consumo de alucinógenos, leve', 'Patrón problemático de consumo de alucinógenos de gravedad leve.'),
        ('F16.11', 'Trastorno por consumo de alucinógenos, leve, en remisión', 'Trastorno leve en remisión.'),
        ('F16.20', 'Trastorno por consumo de alucinógenos, moderado o grave', 'Patrón problemático de gravedad moderada o grave.'),
        ('F16.21', 'Trastorno por consumo de alucinógenos, moderado o grave, en remisión', 'Trastorno moderado/grave en remisión.'),
        ('F17.200', 'Trastorno por consumo de tabaco, no especificado', 'Uso problemático de tabaco sin especificar estado de remisión.'),
        ('F17.201', 'Trastorno por consumo de tabaco, en remisión', 'Trastorno por consumo de tabaco en remisión.'),
        ('F17.210', 'Trastorno por consumo de tabaco, leve/moderado/grave', 'Trastorno por consumo de tabaco con gravedad determinada clínicamente.'),
        ('F17.211', 'Trastorno por consumo de tabaco, en remisión', 'Trastorno por consumo de tabaco en remisión.'),
        ('F18.10', 'Trastorno por consumo de inhalantes, leve', 'Patrón problemático de consumo de inhalantes de gravedad leve.'),
        ('F18.11', 'Trastorno por consumo de inhalantes, leve, en remisión', 'Trastorno leve en remisión.'),
        ('F18.20', 'Trastorno por consumo de inhalantes, moderado o grave', 'Patrón problemático de gravedad moderada o grave.'),
        ('F18.21', 'Trastorno por consumo de inhalantes, moderado o grave, en remisión', 'Trastorno moderado/grave en remisión.'),
        ('F19.10', 'Trastorno por consumo de otras sustancias psicoactivas, leve', 'Patrón problemático de consumo de múltiples/otras sustancias de gravedad leve.'),
        ('F19.11', 'Trastorno por consumo de otras sustancias psicoactivas, leve, en remisión', 'Trastorno leve en remisión.'),
        ('F19.20', 'Trastorno por consumo de otras sustancias psicoactivas, moderado o grave', 'Patrón problemático de gravedad moderada o grave.'),
        ('F19.21', 'Trastorno por consumo de otras sustancias psicoactivas, moderado o grave, en remisión', 'Trastorno moderado/grave en remisión.'),
        ('F63.0', 'Trastorno por juego de apuestas', 'Patrón persistente y problemático de apuestas con pérdida de control y consecuencias negativas.')
) AS d(codigo_icd10cm, nombre, descripcion)
JOIN public.categoria_diagnostica c
    ON c.nombre = 'Trastornos relacionados con sustancias y adictivos';


-- ADD ALL DIAGNOSIS THAT BELOONG TO THE 'Trastornos de la personalidad' CATEGORY
INSERT INTO public.diagnostico (
    categoria_diagnostica_id,
    codigo_icd10cm,
    nombre,
    descripcion,
    estado_id
)
SELECT
    c.id,
    d.codigo_icd10cm,
    d.nombre,
    d.descripcion,
    1
FROM (
    VALUES
        ('F60.0', 'Trastorno de la personalidad paranoide', 'Desconfianza y suspicacia generalizadas hacia otras personas.'),
        ('F60.1', 'Trastorno de la personalidad esquizoide', 'Desapego de relaciones sociales y rango limitado de expresión emocional.'),
        ('F60.2', 'Trastorno de la personalidad antisocial', 'Desprecio persistente por derechos y normas sociales.'),
        ('F60.3', 'Trastorno límite de la personalidad', 'Inestabilidad interpersonal, afectiva, de identidad e impulsividad.'),
        ('F60.4', 'Trastorno de la personalidad histriónica', 'Emotividad excesiva y búsqueda persistente de atención.'),
        ('F60.81', 'Trastorno de la personalidad narcisista', 'Grandiosidad, necesidad de admiración y falta de empatía.'),
        ('F60.6', 'Trastorno de la personalidad evitativa', 'Inhibición social, sentimientos de ineptitud e hipersensibilidad al rechazo.'),
        ('F60.7', 'Trastorno de la personalidad dependiente', 'Necesidad excesiva de cuidado y dificultad para funcionar independientemente.'),
        ('F60.5', 'Trastorno de la personalidad obsesivo-compulsiva', 'Preocupación por orden, perfeccionismo y control a costa de flexibilidad.'),
        ('F60.89', 'Otro trastorno de la personalidad especificado', 'Patrón de personalidad clínicamente significativo que no cumple otro trastorno.'),
        ('F60.9', 'Trastorno de la personalidad no especificado', 'Alteración de personalidad significativa sin información suficiente para especificarla.')
) AS d(codigo_icd10cm, nombre, descripcion)
JOIN public.categoria_diagnostica c
    ON c.nombre = 'Trastornos de la personalidad';


-- ADD ALL DIAGNOSIS THAT BELOONG TO THE 'Trastornos parafílicos' CATEGORY
INSERT INTO public.diagnostico (
    categoria_diagnostica_id,
    codigo_icd10cm,
    nombre,
    descripcion,
    estado_id
)
SELECT
    c.id,
    d.codigo_icd10cm,
    d.nombre,
    d.descripcion,
    1
FROM (
    VALUES
        ('F65.4', 'Trastorno de exhibicionismo', 'Excitación sexual recurrente relacionada con exposición de genitales a personas sin consentimiento.'),
        ('F65.3', 'Trastorno de voyeurismo', 'Excitación sexual relacionada con observar personas sin su consentimiento en situaciones íntimas.'),
        ('F65.2', 'Trastorno de pedofilia', 'Atracción sexual persistente hacia niños prepúberes, con los criterios clínicos establecidos.'),
        ('F65.51', 'Trastorno de masoquismo sexual', 'Excitación sexual relacionada con ser humillado, golpeado, atado o sometido.'),
        ('F65.52', 'Trastorno de sadismo sexual', 'Excitación sexual relacionada con infligir sufrimiento físico o psicológico.'),
        ('F65.81', 'Trastorno de froteurismo', 'Excitación sexual relacionada con tocar o rozarse contra una persona sin consentimiento.'),
        ('F65.89', 'Otro trastorno parafílico especificado', 'Parafilia clínicamente significativa que no cumple otro diagnóstico específico.'),
        ('F65.9', 'Trastorno parafílico no especificado', 'Parafilia clínicamente significativa sin información suficiente para especificarla.')
) AS d(codigo_icd10cm, nombre, descripcion)
JOIN public.categoria_diagnostica c
    ON c.nombre = 'Trastornos parafílicos';