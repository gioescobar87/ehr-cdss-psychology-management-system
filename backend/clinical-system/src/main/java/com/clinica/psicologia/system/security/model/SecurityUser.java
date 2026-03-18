package com.clinica.psicologia.system.security.model;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.clinica.psicologia.system.model.security.Usuario;

public class SecurityUser implements UserDetails{

    private final Usuario usuario;
    private final Collection<? extends GrantedAuthority> authorities;
    
    public SecurityUser(Usuario usuario, Collection<? extends GrantedAuthority> authorities){
        this.usuario = usuario;
        this.authorities = authorities;
    }

    public Usuario getUsuario(){
        return usuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities(){
        return authorities;
    }

    @Override
    public String getPassword(){
        return usuario.getPassword();
    }

    @Override
    public String getUsername(){
        return usuario.getUsername();
    }

    @Override
    public boolean isEnabled(){
        return usuario.getIdEstado() == 1;
    }

    @Override
    public boolean isAccountNonExpired(){
        return true;
    }

    @Override
    public boolean isAccountNonLocked(){
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired(){
        return true;
    }
}
