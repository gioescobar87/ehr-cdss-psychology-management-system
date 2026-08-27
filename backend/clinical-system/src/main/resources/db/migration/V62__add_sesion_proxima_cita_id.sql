ALTER TABLE sesion 
    ADD COLUMN proxima_cita_id INT,
    ADD CONSTRAINT fk_sesion_proxima_cita 
        FOREIGN KEY (proxima_cita_id) REFERENCES cita(id);
