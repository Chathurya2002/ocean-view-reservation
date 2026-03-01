package com.oceanview.reservation.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey key;
    private final long expiration;

    public JwtUtil(@Value("${jwt.secret:supersecret123supersecret123supersecret123}") String secret) {
        // Ensure the secret is long enough, fallback if not
        if (secret.length() < 32) {
            secret = "supersecret123supersecret123supersecret123";
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expiration = 1000 * 60 * 60 * 24 * 30L; // 30 days
    }

    public String generateToken(String userId) {
        return Jwts.builder()
                .claim("id", userId) // Match Node.js format
                .setSubject(userId) // Keep subject for standard JWT compatibility
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String validateTokenAndGetUserId(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // First check if 'id' exists (from Node.js)
            String id = claims.get("id", String.class);
            if (id != null) {
                return id;
            }

            // Fallback to subject (from Java Spring)
            return claims.getSubject();
        } catch (Exception e) {
            return null; // Invalid token
        }
    }
}
