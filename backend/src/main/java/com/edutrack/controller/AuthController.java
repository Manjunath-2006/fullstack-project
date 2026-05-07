package com.edutrack.controller;

import com.edutrack.dto.AdminRegister;
import com.edutrack.dto.LoginRequest;
import com.edutrack.model.User;
import com.edutrack.security.JwtService;
import com.edutrack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> user = userService.authenticate(request.getEmail(), request.getPassword());
        if (user.isPresent()) {
            User u = user.get();
            String token = jwtService.generateToken(u);
            Map<String, Object> response = new HashMap<>();
            response.put("id", u.getId());
            response.put("name", u.getName());
            response.put("email", u.getEmail());
            response.put("role", u.getRole());
            response.put("subject", u.getSubject());
            response.put("grade", u.getGrade());
            response.put("phone", u.getPhone());
            response.put("roll_number", u.getRollNumber());
            response.put("token", token);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@RequestBody AdminRegister request) {
        if (userService.getAllUsers().stream().anyMatch(u -> u.getEmail().equals(request.getEmail()))) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered");
        }
        User admin = userService.createAdmin(request);
        Map<String, Object> response = new HashMap<>();
        response.put("id", admin.getId());
        response.put("name", admin.getName());
        response.put("email", admin.getEmail());
        response.put("role", admin.getRole());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
