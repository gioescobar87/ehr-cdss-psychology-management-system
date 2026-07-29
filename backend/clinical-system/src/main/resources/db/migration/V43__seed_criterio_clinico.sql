INSERT INTO criterio_clinico
(categoria_criterio_clinico_id, codigo, nombre, descripcion, estado_id)
VALUES

-------------------------------------------------------
-- ESTADO DE ÁNIMO
-------------------------------------------------------

(1,'DEPRESION_2_SEMANAS',
'Estado de ánimo deprimido durante la mayor parte del día por al menos dos semanas',
'Criterio DSM-5-TR para episodio depresivo mayor.',
1),

(1,'ANHEDONIA_2_SEMANAS',
'Disminución marcada del interés o placer durante al menos dos semanas',
'Criterio DSM-5-TR para episodio depresivo mayor.',
1),

(1,'IRRITABILIDAD_PERSISTENTE',
'Irritabilidad persistente clínicamente significativa',
'Estado de ánimo irritable observado de forma persistente.',
1),

(1,'CULPA_EXCESIVA',
'Sentimientos excesivos o inapropiados de culpa',
'Culpa desproporcionada respecto a la situación.',
1),

(1,'INUTILIDAD',
'Sentimientos persistentes de inutilidad',
'Percepción continua de carecer de valor personal.',
1),

(1,'DESESPERANZA',
'Sentimientos persistentes de desesperanza',
'Expectativa negativa constante sobre el futuro.',
1),

-------------------------------------------------------
-- ANSIEDAD
-------------------------------------------------------

(2,'ANSIEDAD_EXCESIVA_6_MESES',
'Ansiedad y preocupación excesivas durante al menos seis meses',
'Criterio DSM-5-TR para trastorno de ansiedad generalizada.',
1),

(2,'DIFICULTAD_CONTROLAR_PREOCUPACION',
'Dificultad para controlar la preocupación',
'La persona refiere incapacidad para controlar la preocupación.',
1),

(2,'INQUIETUD',
'Inquietud o sensación de estar con los nervios de punta',
'Criterio asociado a ansiedad generalizada.',
1),

(2,'FATIGA_ANSIEDAD',
'Fatigabilidad asociada a ansiedad',
'La ansiedad provoca cansancio frecuente.',
1),

(2,'TENSION_MUSCULAR',
'Tensión muscular persistente',
'Rigidez o contracturas relacionadas con ansiedad.',
1),

(2,'EVITACION',
'Conductas persistentes de evitación',
'Evita situaciones asociadas al miedo o ansiedad.',
1),

(2,'ATAQUES_PANICO',
'Ataques de pánico recurrentes',
'Episodios repentinos de miedo intenso.',
1),

-------------------------------------------------------
-- COGNICIÓN
-------------------------------------------------------

(3,'DIFICULTAD_CONCENTRACION',
'Dificultad para concentrarse',
'Problemas persistentes de atención.',
1),

(3,'INDECISION',
'Indecisión persistente',
'Dificultad clínicamente significativa para tomar decisiones.',
1),

(3,'PENSAMIENTOS_NEGATIVOS',
'Pensamientos negativos persistentes',
'Contenido cognitivo predominantemente negativo.',
1),

-------------------------------------------------------
-- SUEÑO
-------------------------------------------------------

(4,'INSOMNIO',
'Insomnio clínicamente significativo',
'Dificultad para iniciar o mantener el sueño.',
1),

(4,'HIPERSOMNIA',
'Hipersomnia',
'Necesidad excesiva de dormir.',
1),

-------------------------------------------------------
-- APETITO Y PESO
-------------------------------------------------------

(5,'DISMINUCION_APETITO',
'Disminución significativa del apetito',
'Reducción importante del apetito.',
1),

(5,'AUMENTO_APETITO',
'Aumento significativo del apetito',
'Incremento importante del apetito.',
1),

(5,'PERDIDA_PESO',
'Pérdida significativa de peso',
'Pérdida involuntaria clínicamente relevante.',
1),

(5,'AUMENTO_PESO',
'Aumento significativo de peso',
'Incremento involuntario clínicamente relevante.',
1),

-------------------------------------------------------
-- ENERGÍA
-------------------------------------------------------

(6,'FATIGA',
'Fatiga o pérdida de energía casi todos los días',
'Criterio DSM-5-TR para episodio depresivo mayor.',
1),

(6,'DISMINUCION_ENERGIA',
'Disminución persistente de energía',
'Reducción importante del nivel habitual de energía.',
1),

-------------------------------------------------------
-- PSICOMOTOR
-------------------------------------------------------

(7,'AGITACION_PSICOMOTORA',
'Agitación psicomotora observable',
'Incremento observable de actividad motora.',
1),

(7,'ENLENTECIMIENTO_PSICOMOTOR',
'Enlentecimiento psicomotor observable',
'Disminución observable de actividad motora.',
1),

-------------------------------------------------------
-- CONDUCTA
-------------------------------------------------------

(8,'IMPULSIVIDAD',
'Impulsividad clínicamente significativa',
'Dificultad persistente para controlar impulsos.',
1),

(8,'AGRESIVIDAD',
'Conducta agresiva recurrente',
'Agresión hacia personas o animales.',
1),

(8,'DESAFIO_AUTORIDAD',
'Patrón persistente de desafío a figuras de autoridad',
'Criterio compatible con trastorno negativista desafiante.',
1),

(8,'INCUMPLIMIENTO_NORMAS',
'Incumplimiento repetido de normas',
'Violación recurrente de reglas sociales o escolares.',
1),

(8,'CRUELDAD_PERSONAS_ANIMALES',
'Crueldad hacia personas o animales',
'Conducta deliberadamente dañina.',
1),

(8,'ROBO',
'Robo deliberado',
'Apropiación de bienes ajenos.',
1),

-------------------------------------------------------
-- RIESGO
-------------------------------------------------------

(9,'IDEACION_SUICIDA',
'Ideación suicida',
'Pensamientos recurrentes relacionados con la muerte o el suicidio.',
1),

(9,'AUTOLESIONES',
'Conductas autolesivas',
'Daño físico autoinfligido.',
1),

(9,'IDEACION_HOMICIDA',
'Ideación homicida',
'Pensamientos persistentes de causar daño a otras personas.',
1),

-------------------------------------------------------
-- FUNCIONAMIENTO SOCIAL
-------------------------------------------------------

(10,'AISLAMIENTO_SOCIAL',
'Aislamiento social persistente',
'Reducción significativa de la interacción social.',
1),

(10,'DETERIORO_FUNCIONAL',
'Deterioro clínicamente significativo del funcionamiento social, laboral o académico',
'El cuadro clínico produce un deterioro importante en el funcionamiento diario.',
1);