package com.clinica.psicologia.system.util.encryption;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class StringEncryptConverter implements AttributeConverter<String,String> {
    
    @Override
    public String convertToDatabaseColumn(String attribute){
        if(attribute == null) return null;
        return AesEncryptionUtil.encrypt(attribute, EncryptionKeyHolder.getSecret());
    }

    @Override
    public String convertToEntityAttribute(String dbData){
        if(dbData == null) return null;
        return AesEncryptionUtil.decrypt(dbData, EncryptionKeyHolder.getSecret());
    }
}
