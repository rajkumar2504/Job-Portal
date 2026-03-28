package com.jobportal.config;

import com.jobportal.entity.Role;
import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DemoAccountSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        upsertDemoUser("Default Admin", "admin@test.com", Role.ADMIN);
        upsertDemoUser("Default Recruiter", "recruiter@test.com", Role.RECRUITER);
        upsertDemoUser("Default Candidate", "candidate@test.com", Role.CANDIDATE);
    }

    private void upsertDemoUser(String name, String email, Role role) {
        User user = userRepository.findByEmail(email)
                .orElseGet(User::new);

        user.setName(name);
        user.setEmail(email);
        user.setRole(role);
        user.setPassword(passwordEncoder.encode("123456"));

        userRepository.save(user);
    }
}
