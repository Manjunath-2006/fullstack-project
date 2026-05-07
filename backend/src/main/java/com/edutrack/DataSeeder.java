package com.edutrack;

import com.edutrack.model.Role;
import com.edutrack.model.User;
import com.edutrack.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepo;

    public DataSeeder(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public void run(String... args) {
        if (userRepo.count() > 0) return;

        // Seed only the first admin so someone can log in and create real data
        String adminPwd = new BCryptPasswordEncoder().encode("admin123");
        userRepo.save(new User(null, "Admin", "admin@school.edu", null, null, LocalDate.now(), Role.ADMIN, adminPwd));

        System.out.println("✅ Default admin created: admin@school.edu / admin123");
    }
}
