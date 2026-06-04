package com.clinica.psicologia.system.util.encryption;

import java.security.SecureRandom;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

public class AesEncryptionUtil {

    private static final String AES = "AES";
    private static final String AES_GCM = "AES/GCM/NoPadding";
    private static final int IV_LENGTH = 12;
    private static final int TAG_LENGTH = 128;
    private static final int KEY_LENGTH = 256;
    private static final int ITERATIONS = 65536;

    private static SecretKey getKeyFromPassword(String password, byte[] salt) throws Exception {
        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, ITERATIONS, KEY_LENGTH);
        SecretKey tmp = factory.generateSecret(spec);
        return new SecretKeySpec(tmp.getEncoded(), AES);
    }

    public static String encrypt(String value, String password){
        try {
            byte[] iv = new byte[IV_LENGTH];
            byte[] salt = new byte[16];

            SecureRandom random = new SecureRandom();
            random.nextBytes(iv);
            random.nextBytes(salt);

            SecretKey key = getKeyFromPassword(password, salt);

            Cipher cipher = Cipher.getInstance(AES_GCM);
            GCMParameterSpec spec = new GCMParameterSpec(TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE,key, spec);

            byte[] encrypted = cipher.doFinal(value.getBytes("UTF-8"));

            // Combine salt + iv + ciphertext
            byte[] combined = new byte[salt.length + iv.length + encrypted.length];
            System.arraycopy(salt, 0, combined, 0, salt.length);
            System.arraycopy(iv, 0, combined, salt.length, iv.length);
            System.arraycopy(encrypted, 0, combined, salt.length + iv.length, encrypted.length);

            return Base64.getEncoder().encodeToString(combined);

        } catch (Exception e) {
            throw new RuntimeException("Error encrypting data", e);
        }
    }

    public static String decrypt(String encrypted, String password) {
        try {
            byte[] decoded = Base64.getDecoder().decode(encrypted);

            byte[] salt = new byte[16];
            byte[] iv = new byte[IV_LENGTH];
            byte[] ciphertext = new byte[decoded.length - 16 - IV_LENGTH];

            System.arraycopy(decoded, 0, salt, 0, 16);
            System.arraycopy(decoded, 16, iv, 0, IV_LENGTH);
            System.arraycopy(decoded, 16 + IV_LENGTH, ciphertext, 0, ciphertext.length);

            SecretKey key = getKeyFromPassword(password, salt);

            Cipher cipher = Cipher.getInstance(AES_GCM);
            GCMParameterSpec spec = new GCMParameterSpec(TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, key, spec);

            byte[] decrypted = cipher.doFinal(ciphertext);

            return new String(decrypted, "UTF-8");

        } catch (Exception e) {
            throw new RuntimeException("Error decrypting data", e);
        }
    }
}