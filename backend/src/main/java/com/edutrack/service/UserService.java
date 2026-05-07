package com.edutrack.service;

import com.edutrack.dto.AdminRegister;
import com.edutrack.dto.StudentCreate;
import com.edutrack.dto.TeacherCreate;
import com.edutrack.model.Role;
import com.edutrack.model.User;
import com.edutrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    public User createStudent(StudentCreate request) {
        User user = new User();
        user.setRollNumber(request.getRollNumber());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setGrade(request.getGrade());
        user.setPhone(request.getPhone());
        user.setEnrollmentDate(LocalDate.now());
        user.setRole(Role.STUDENT);
        user.setPassword(passwordEncoder.encode(request.getPassword() != null ? request.getPassword() : "student123"));
        return userRepository.save(user);
    }

    public User createTeacher(TeacherCreate request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setGrade(request.getSubject()); // Assuming grade is used for subject
        user.setPhone(request.getPhone());
        user.setEnrollmentDate(LocalDate.now());
        user.setRole(Role.TEACHER);
        user.setPassword(passwordEncoder.encode(request.getPassword() != null ? request.getPassword() : "teacher123"));
        return userRepository.save(user);
    }

    public User createAdmin(AdminRegister request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setEnrollmentDate(LocalDate.now());
        user.setRole(Role.ADMIN);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> authenticate(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return userOpt;
        }
        return Optional.empty();
    }
}