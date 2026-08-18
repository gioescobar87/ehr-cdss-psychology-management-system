INSERT INTO public.prueba_psicologica (
    nombre,
    descripcion,
    objetivo_prueba,
    instrucciones_aplicacion,
    consideraciones,
    estado_id
)
SELECT
    seed.nombre,
    seed.descripcion,
    seed.objetivo_prueba,
    seed.instrucciones_aplicacion,
    seed.consideraciones,
    e.id
FROM (
    VALUES
        (
            'Inventario de Ansiedad de Beck (BAI)',
            'Instrumento de autoinforme diseñado para evaluar la intensidad de los síntomas de ansiedad, especialmente los relacionados con manifestaciones somáticas y subjetivas de ansiedad.',
            'Evaluar la intensidad de los síntomas de ansiedad presentes en la persona evaluada.',
            'Solicitar al paciente que responda cada afirmación considerando cuánto le ha afectado cada síntoma durante el período indicado por el instrumento. Explicar que debe responder de acuerdo con su experiencia personal y solicitar que complete todos los reactivos.',
            'La puntuación debe interpretarse considerando la entrevista clínica y otros antecedentes relevantes. No debe utilizarse como único fundamento para establecer un diagnóstico clínico.'
        ),
        (
            'Inventario de Depresión de Beck-II (BDI-II)',
            'Instrumento de autoinforme utilizado para evaluar la presencia e intensidad de síntomas asociados con la depresión.',
            'Evaluar la intensidad de los síntomas depresivos experimentados por la persona evaluada.',
            'Explicar al paciente que debe seleccionar, para cada grupo de afirmaciones, la opción que mejor describa cómo se ha sentido durante el período establecido por el instrumento. Procurar que responda de manera independiente y sin presión.',
            'Los resultados deben integrarse con la entrevista clínica, antecedentes y observaciones profesionales. Una puntuación elevada no constituye por sí misma un diagnóstico de trastorno depresivo.'
        ),
        (
            'Escala de Depresión del Centro de Estudios Epidemiológicos (CES-D)',
            'Escala de autoinforme orientada a identificar la frecuencia de síntomas relacionados con depresión durante un período reciente.',
            'Identificar la frecuencia e intensidad de manifestaciones emocionales, cognitivas y conductuales relacionadas con síntomas depresivos.',
            'Indicar al paciente que lea cada afirmación y seleccione la respuesta que represente con mayor precisión la frecuencia con la que ha experimentado cada situación durante el período indicado.',
            'Es principalmente un instrumento de detección y valoración de síntomas. Los resultados requieren interpretación clínica y no deben considerarse equivalentes a un diagnóstico.'
        ),
        (
            'Escala de Ansiedad y Depresión Hospitalaria (HADS)',
            'Instrumento de autoinforme diseñado para identificar síntomas de ansiedad y depresión, especialmente en contextos de atención sanitaria.',
            'Evaluar la presencia e intensidad de síntomas de ansiedad y depresión mediante dos dimensiones diferenciadas.',
            'Solicitar al paciente que responda cada afirmación seleccionando la alternativa que describa mejor su experiencia durante el período indicado. Evitar influir en sus respuestas.',
            'Debe considerarse el contexto clínico en el que se administra. No está diseñada para sustituir una evaluación diagnóstica integral.'
        ),
        (
            'Cuestionario de Salud del Paciente-9 (PHQ-9)',
            'Cuestionario breve de autoinforme utilizado para valorar la frecuencia de síntomas asociados con depresión.',
            'Identificar y estimar la severidad de síntomas depresivos recientes.',
            'Explicar al paciente que debe indicar con qué frecuencia ha experimentado cada síntoma durante el período establecido. Revisar posteriormente las respuestas y explorar clínicamente cualquier resultado relevante.',
            'Puede utilizarse para detección y seguimiento de síntomas. Las respuestas relacionadas con ideación suicida requieren valoración clínica inmediata y no deben interpretarse únicamente mediante la puntuación total.'
        ),
        (
            'Cuestionario de Salud del Paciente-15 (PHQ-15)',
            'Instrumento de autoinforme destinado a valorar la intensidad de síntomas físicos y somáticos frecuentes.',
            'Evaluar la carga y severidad de síntomas somáticos reportados por la persona durante el período de referencia.',
            'Solicitar al paciente que indique el grado en que cada síntoma le ha afectado durante el período indicado. Aclarar que debe considerar su experiencia reciente y responder todos los elementos aplicables.',
            'Los síntomas físicos deben valorarse también desde una perspectiva médica. La puntuación no permite determinar por sí sola si los síntomas tienen origen psicológico u orgánico.'
        ),
        (
            'Escala de Estrés Percibido (PSS)',
            'Escala de autoinforme utilizada para evaluar el grado en que una persona percibe determinadas situaciones de su vida como estresantes.',
            'Valorar la percepción subjetiva de estrés y la sensación de control sobre situaciones recientes.',
            'Indicar al paciente que responda cada afirmación considerando el período de referencia especificado por el instrumento. Debe seleccionar la alternativa que mejor represente su experiencia.',
            'Evalúa percepción de estrés y no constituye una medida directa de acontecimientos objetivos ni un diagnóstico de un trastorno específico.'
        ),
        (
            'Escala de Autoestima de Rosenberg',
            'Instrumento breve de autoinforme orientado a valorar la percepción global que una persona tiene de su propio valor y aceptación.',
            'Explorar el nivel de autoestima global y la valoración general que la persona realiza de sí misma.',
            'Solicitar al paciente que lea cada afirmación y seleccione el nivel de acuerdo que mejor represente su opinión personal. Promover respuestas espontáneas.',
            'La autoestima puede variar según contexto y etapa vital. Los resultados deben interpretarse junto con la historia personal y la evaluación clínica.'
        ),
        (
            'Inventario de Ansiedad Estado-Rasgo (STAI)',
            'Instrumento diseñado para diferenciar la ansiedad experimentada como estado temporal de la tendencia relativamente estable a experimentar ansiedad.',
            'Evaluar la ansiedad como estado emocional transitorio y como característica relativamente estable de la persona.',
            'Explicar las instrucciones correspondientes a cada sección. Solicitar que responda de acuerdo con cómo se siente en el momento de la evaluación y, posteriormente, de acuerdo con cómo se siente habitualmente, según corresponda.',
            'Debe respetarse el procedimiento de aplicación y corrección establecido para el instrumento. La interpretación debe considerar el contexto actual del paciente.'
        ),
        (
            'Escala de Desesperanza de Beck',
            'Instrumento de autoinforme utilizado para explorar expectativas negativas respecto al futuro y percepciones asociadas con desesperanza.',
            'Evaluar el nivel de pensamientos y expectativas negativas relacionados con el futuro.',
            'Explicar al paciente que debe responder cada afirmación de acuerdo con lo que considere que refleja mejor sus pensamientos y expectativas. Garantizar un ambiente privado y adecuado para la evaluación.',
            'Los resultados relacionados con desesperanza deben integrarse con una evaluación específica del riesgo suicida cuando exista cualquier indicador clínico de riesgo. No debe utilizarse de manera aislada para determinar riesgo.'
        ),
        (
            'Escala de Impulsividad de Barratt (BIS-11)',
            'Instrumento de autoinforme orientado a evaluar diferentes dimensiones de la impulsividad, incluyendo aspectos atencionales, motores y relacionados con la planificación.',
            'Explorar patrones de impulsividad y características relacionadas con el control de respuestas y la planificación de conductas.',
            'Solicitar al paciente que responda cada afirmación considerando su comportamiento habitual. Explicar que no existen respuestas correctas o incorrectas y fomentar respuestas sinceras.',
            'La impulsividad debe interpretarse considerando edad, contexto, antecedentes y funcionamiento general. Los resultados no establecen por sí mismos un diagnóstico.'
        ),
        (
            'Cuestionario de Capacidades y Dificultades (SDQ)',
            'Instrumento de cribado utilizado principalmente en población infantil y adolescente para explorar dificultades emocionales, conductuales y de interacción social, así como fortalezas prosociales.',
            'Identificar posibles dificultades emocionales y conductuales y explorar capacidades prosociales en niños y adolescentes.',
            'Aplicar la versión correspondiente a la edad y al informante disponible. Explicar las instrucciones y solicitar que las respuestas reflejen el comportamiento habitual del niño o adolescente durante el período indicado.',
            'Debe utilizarse la versión apropiada para la edad y el informante. Los resultados deben complementarse con información de padres, cuidadores, docentes y entrevista clínica cuando corresponda.'
        ),
        (
            'Inventario de Depresión Infantil (CDI)',
            'Instrumento de evaluación orientado a explorar síntomas depresivos en población infantil y adolescente.',
            'Evaluar la presencia e intensidad de síntomas emocionales, cognitivos y conductuales relacionados con depresión en niños y adolescentes.',
            'Explicar al menor que debe responder de acuerdo con cómo se ha sentido recientemente. Utilizar lenguaje comprensible para su edad y verificar que comprenda las instrucciones sin influir en las respuestas.',
            'Debe utilizarse con población y condiciones compatibles con la versión administrada. Los resultados requieren integración con entrevista clínica, información de cuidadores y contexto del menor.'
        ),
        (
            'Escala de Ansiedad Infantil de Spence (SCAS)',
            'Instrumento de autoinforme diseñado para explorar diferentes manifestaciones de ansiedad en niños y adolescentes.',
            'Evaluar la frecuencia de síntomas relacionados con diferentes dimensiones de ansiedad en población infantil y adolescente.',
            'Explicar al menor que debe responder cada afirmación indicando con qué frecuencia experimenta las situaciones descritas. Utilizar instrucciones adecuadas para su edad y permitir que responda de manera independiente.',
            'Debe seleccionarse la versión correspondiente a la población evaluada. Los resultados deben interpretarse considerando el desarrollo, contexto familiar, escolar y antecedentes clínicos.'
        ),
        (
            'Lista de Síntomas de Hopkins-25 (HSCL-25)',
            'Instrumento de autoinforme utilizado para explorar síntomas de ansiedad y depresión mediante la frecuencia e intensidad percibida de diferentes manifestaciones.',
            'Identificar y estimar la intensidad de síntomas relacionados con ansiedad y depresión.',
            'Solicitar al paciente que valore cada síntoma según la frecuencia o intensidad indicada por las instrucciones del instrumento durante el período de referencia.',
            'Es una herramienta de valoración de síntomas y no sustituye una evaluación diagnóstica completa. La interpretación debe considerar el contexto clínico y sociocultural del paciente.'
        )
    ) AS seed(
        nombre,
        descripcion,
        objetivo_prueba,
        instrucciones_aplicacion,
        consideraciones
    )
CROSS JOIN (
    SELECT id
    FROM public.estado
    WHERE LOWER(nombre) = 'activo'
    LIMIT 1
) e;