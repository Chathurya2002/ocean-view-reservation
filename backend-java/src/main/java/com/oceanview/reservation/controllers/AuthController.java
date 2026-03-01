package com.oceanview.reservation.controllers;

import com.oceanview.reservation.models.User;
import com.oceanview.reservation.repositories.UserRepository;
import com.oceanview.reservation.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "User already exists");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        Map<String, Object> response = new HashMap<>();

        // Create nested user object specifically for frontend expectation
        Map<String, Object> userJson = new HashMap<>();
        userJson.put("_id", savedUser.getId());
        userJson.put("name", savedUser.getName());
        userJson.put("email", savedUser.getEmail());
        userJson.put("role", savedUser.getRole());

        response.put("user", userJson);
        response.put("token", jwtUtil.generateToken(savedUser.getId()));

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds) {
        String email = creds.get("email");
        String password = creds.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            User user = userOpt.get();
            Map<String, Object> response = new HashMap<>();

            // Create nested user object specifically for frontend expectation
            Map<String, Object> userJson = new HashMap<>();
            userJson.put("_id", user.getId());
            userJson.put("name", user.getName());
            userJson.put("email", user.getEmail());
            userJson.put("role", user.getRole());

            response.put("user", userJson);
            response.put("token", jwtUtil.generateToken(user.getId()));
            return ResponseEntity.ok(response);
        }

        Map<String, String> error = new HashMap<>();
        error.put("message", "Invalid email or password");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(HttpServletRequest request, @ModelAttribute User updatedInfo) {
        String userId = (String) request.getAttribute("userId");
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (updatedInfo.getName() != null)
                user.setName(updatedInfo.getName());
            if (updatedInfo.getWhatsapp() != null)
                user.setWhatsapp(updatedInfo.getWhatsapp());
            if (updatedInfo.getContactNumber() != null)
                user.setContactNumber(updatedInfo.getContactNumber());
            if (updatedInfo.getIdNumber() != null)
                user.setIdNumber(updatedInfo.getIdNumber());
            if (updatedInfo.getAddress() != null)
                user.setAddress(updatedInfo.getAddress());

            userRepository.save(user);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
