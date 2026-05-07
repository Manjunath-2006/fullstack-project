package com.edutrack.controller;

import com.edutrack.dto.StudentCreate;
import com.edutrack.dto.TeacherCreate;
import com.edutrack.model.Role;
import com.edutrack.model.User;
import com.edutrack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<Map<String, Object>> getStudents() {
        return userService.getUsersByRole(Role.STUDENT).stream()
                .map(this::userToMap)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudent(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        if (user.isPresent() && user.get().getRole() == Role.STUDENT) {
            return ResponseEntity.ok(userToMap(user.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> createStudent(@RequestBody StudentCreate request) {
        User student = userService.createStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(userToMap(student));
    }

    private Map<String, Object> userToMap(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("roll_number", user.getRollNumber());
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("grade", user.getGrade());
        map.put("phone", user.getPhone());
        map.put("enrollment_date", user.getEnrollmentDate());
        map.put("role", user.getRole());
        return map;
    }
}

@RestController
@RequestMapping("/teachers")
class TeacherController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<Map<String, Object>> getTeachers() {
        return userService.getUsersByRole(Role.TEACHER).stream()
                .map(this::userToMap)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> createTeacher(@RequestBody TeacherCreate request) {
        User teacher = userService.createTeacher(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(userToMap(teacher));
    }

    private Map<String, Object> userToMap(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("subject", user.getGrade()); // Assuming grade is subject
        map.put("phone", user.getPhone());
        map.put("enrollment_date", user.getEnrollmentDate());
        map.put("role", user.getRole());
        return map;
    }
}