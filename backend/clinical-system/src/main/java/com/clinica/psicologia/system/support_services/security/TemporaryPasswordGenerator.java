package com.clinica.psicologia.system.support_services.security;

import java.security.SecureRandom;

import org.springframework.stereotype.Component;

@Component
public class TemporaryPasswordGenerator {
    private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWERCASE = "abcdefghijkmnopqrstuvwxyz";
    private static final String DIGITS = "23456789";
    private static final String SPECIAL = "!@#$%*";

    private static final String ALL_CHARACTERS = UPPERCASE + LOWERCASE + DIGITS + SPECIAL;
    private static final int PASSWORD_LENGTH = 14;
    private final SecureRandom secureRandom = new SecureRandom();

    public String generate() {
        StringBuilder password = new StringBuilder(PASSWORD_LENGTH);

        password.append(randomCharacter(UPPERCASE));
        password.append(randomCharacter(LOWERCASE));
        password.append(randomCharacter(DIGITS));
        password.append(randomCharacter(SPECIAL));

        for (int i = password.length(); i < PASSWORD_LENGTH; i++) {
            password.append(randomCharacter(ALL_CHARACTERS));
        }
        return shuffle(password);
    }

    private char randomCharacter(String characters) {
        return characters.charAt(secureRandom.nextInt(characters.length()));
    }

    private String shuffle(StringBuilder password) {
        char[] characters = password.toString().toCharArray();

        for (int i = characters.length -1; i > 0; i--){
            int randomIndex = secureRandom.nextInt(i + 1);

            char temporary = characters[i];
            characters[i] = characters[randomIndex];
            characters[randomIndex] = temporary;
        }
        return new String(characters);
    }
}
