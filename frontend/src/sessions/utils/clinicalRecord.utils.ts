import type {
  ClinicalContextDiagnosis,
  ClinicalContextObjective,
  ClinicalContextPsychologicalTest,
  ClinicalContextRisk,
  ClinicalContextSession,
  ClinicalSessionContext,
} from "../types/clinicalSessionContext.types";

import type {
  ClinicalActivity,
  ClinicalEncounter,
} from "../types/clinicalRecord.types";

function createObservationActivity(
  session: ClinicalContextSession,
): ClinicalActivity {
  return {
    id: `observation-${session.id}`,
    type: "observation",
    title: "Observaciones",
    sessionId: session.id,
  };
}

function createRiskActivity(
  risk: ClinicalContextRisk,
): ClinicalActivity | null {
  if (risk.sesionId === null) {
    return null;
  }

  return {
    id: `risk-${risk.id}`,
    type: "risk",
    title: risk.tipoRiesgo ?? "Evaluación de riesgo",
    sessionId: risk.sesionId,
    riskId: risk.id,
  };
}

function createPsychologicalTestActivity(
  test: ClinicalContextPsychologicalTest,
): ClinicalActivity | null {
  if (test.sesionId === null) {
    return null;
  }

  return {
    id: `psychological-test-${test.id}`,
    type: "psychological-test",
    title: test.pruebaNombre ?? "Prueba psicológica",
    sessionId: test.sesionId,
    testId: test.id,
  };
}

function createDiagnosisActivity(
  diagnosis: ClinicalContextDiagnosis,
): ClinicalActivity {
  return {
    id: `diagnosis-${diagnosis.id}`,
    type: "diagnosis",
    title: diagnosis.nombre,
    sessionId: diagnosis.sesionId,
    diagnosisId: diagnosis.id,
  };
}

function createObjectiveActivity(
  objective: ClinicalContextObjective,
  sessionId: number,
): ClinicalActivity {
  return {
    id: `objective-${objective.id}`,
    type: "objective",
    title: objective.descripcion,
    sessionId,
    objectiveId: objective.id,
  };
}

export function buildClinicalEncounters(
  context: ClinicalSessionContext,
): ClinicalEncounter[] {
  const encounterMap = new Map<number, ClinicalEncounter>();

  const allSessions = [
    context.currentSession,
    ...context.recentSessions.items,
  ];

  /*
   * Each session becomes an encounter.
   *
   * The session itself is not a ClinicalActivity.
   */
  for (const session of allSessions) {
    if (encounterMap.has(session.id)) {
      continue;
    }

    encounterMap.set(session.id, {
      sessionId: session.id,
      date: session.fechaSesion,
      sessionType: session.tipoSesion,
      reason: session.motivoCita,
      activities: [
        createObservationActivity(session),
      ],
    });
  }

  /*
   * Risk evaluations are directly associated
   * with a session.
   */
  for (const risk of context.risks.items) {
    if (risk.sesionId === null) {
      continue;
    }

    const encounter = encounterMap.get(risk.sesionId);

    if (!encounter) {
      continue;
    }

    const activity = createRiskActivity(risk);

    if (activity) {
      encounter.activities.push(activity);
    }
  }

  /*
   * Psychological test applications are directly
   * associated with a session.
   */
  for (const test of context.psychologicalTests.items) {
    if (test.sesionId === null) {
      continue;
    }

    const encounter = encounterMap.get(test.sesionId);

    if (!encounter) {
      continue;
    }

    const activity =
      createPsychologicalTestActivity(test);

    if (activity) {
      encounter.activities.push(activity);
    }
  }

  /*
   * Diagnoses are directly associated with a session.
   */
  for (const diagnosis of context.diagnoses) {
    const encounter = encounterMap.get(
      diagnosis.sesionId,
    );

    if (!encounter) {
      continue;
    }

    const activity =
      createDiagnosisActivity(diagnosis);

    encounter.activities.push(activity);
  }

  /*
   * Objectives are currently associated with an
   * encounter by their start date.
   */
  for (const objective of context.objectives.items) {
    const encounter = findEncounterForDate(
      encounterMap,
      objective.fechaInicio,
    );

    if (!encounter) {
      continue;
    }

    const activity = createObjectiveActivity(
      objective,
      encounter.sessionId,
    );

    encounter.activities.push(activity);
  }

  return Array.from(encounterMap.values()).sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime(),
  );
}

function findEncounterForDate(
  encounterMap: Map<number, ClinicalEncounter>,
  date: string,
): ClinicalEncounter | null {
  const targetDate = date.substring(0, 10);

  for (const encounter of encounterMap.values()) {
    const encounterDate =
      encounter.date.substring(0, 10);

    if (encounterDate === targetDate) {
      return encounter;
    }
  }

  return null;
}

export function getDefaultClinicalActivity(
  encounters: ClinicalEncounter[],
  currentSessionId: number,
): ClinicalActivity | null {
  const currentEncounter = encounters.find(
    (encounter) =>
      encounter.sessionId === currentSessionId,
  );

  if (currentEncounter) {
    return (
      currentEncounter.activities.find(
        (activity) =>
          activity.type === "observation",
      ) ??
      currentEncounter.activities[0] ??
      null
    );
  }

  return encounters[0]?.activities[0] ?? null;
}