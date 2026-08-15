-- EMPTY SEGUIMIENTO_OBJETIVO TO BE ABLE TO EMPTY SESION
DELETE FROM seguimiento_objetivo WHERE id > 0;

DELETE FROM sesion WHERE id > 0;

-- ADD CITA_ID INTO SESION

ALTER TABLE public.sesion
ADD COLUMN cita_id INTEGER NOT NULL;

ALTER TABLE public.sesion
ADD CONSTRAINT fk_sesion_cita
    FOREIGN KEY (cita_id)
    REFERENCES public.cita(id);

CREATE INDEX idx_sesion_cita_id
    ON public.sesion(cita_id);