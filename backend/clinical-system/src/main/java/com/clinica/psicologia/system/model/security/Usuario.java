package com.clinica.psicologia.system.model.security;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "usuario",
       uniqueConstraints = {
           @UniqueConstraint(name = "uq_usuario_username", columnNames = "username"),
           @UniqueConstraint(name = "uq_usuario_correo", columnNames = "correo")
       })
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(nullable = false, length = 100)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String password;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false, length = 150)
    private String apellido;

    @Column(nullable = false, length = 200)
    private String correo;

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    private java.time.LocalDateTime fechaCreacion;

    @Column(name = "fecha_modificacion")
    private java.time.LocalDateTime fechaModificacion;

    @Column(name = "id_estado", nullable = false)
    private Integer idEstado;

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public java.time.LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(java.time.LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public java.time.LocalDateTime getFechaModificacion() {
        return fechaModificacion;
    }

    public void setFechaModificacion(java.time.LocalDateTime fechaModificacion) {
        this.fechaModificacion = fechaModificacion;
    }

    public Integer getIdEstado() {
        return idEstado;
    }

    public void setIdEstado(Integer idEstado) {
        this.idEstado = idEstado;
    }
}