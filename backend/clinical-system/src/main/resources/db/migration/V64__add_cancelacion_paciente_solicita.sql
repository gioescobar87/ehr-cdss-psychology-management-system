DELETE FROM cancelacion WHERE id > 0;

ALTER TABLE cancelacion 
	ADD column solicitud_paciente BOOLEAN;