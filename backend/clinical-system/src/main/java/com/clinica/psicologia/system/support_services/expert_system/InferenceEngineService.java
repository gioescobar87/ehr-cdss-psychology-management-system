package com.clinica.psicologia.system.support_services.expert_system;

public interface InferenceEngineService {
    InferenceResult inferir(Integer evaluacionId);
}
