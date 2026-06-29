INSERT INTO estado (nombre, descripcion)
VALUES
    ('PROGRAMADA', 'Cita programada pendiente de realizarse'),
    ('CONFIRMADA', 'Cita confirmada por el paciente'),
    ('CANCELADA', 'Cita cancelada'),
    ('COMPLETADA', 'Cita realizada exitosamente'),
    ('NO_ASISTIO', 'Paciente no asistió a la cita');

DROP TABLE estado_cita;