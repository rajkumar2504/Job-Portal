package com.jobportal.controller;

import com.jobportal.dto.AdminStatsResponse;
import com.jobportal.dto.AdminUserRoleUpdateRequest;
import com.jobportal.entity.Application;
import com.jobportal.entity.Job;
import com.jobportal.entity.Role;
import com.jobportal.entity.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        AdminStatsResponse stats = new AdminStatsResponse(
                userRepository.count(),
                userRepository.countByRole(Role.RECRUITER),
                userRepository.countByRole(Role.CANDIDATE),
                userRepository.countByRole(Role.ADMIN),
                jobRepository.count(),
                applicationRepository.count()
        );

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(userRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getJobs() {
        return ResponseEntity.ok(jobRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/applications")
    public ResponseEntity<List<Application>> getApplications() {
        return ResponseEntity.ok(applicationRepository.findAllByOrderByAppliedDateDesc());
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
        List<Application> applications = applicationRepository.findByJobId(id);

        if (!applications.isEmpty()) {
            applicationRepository.deleteAll(applications);
        }

        jobRepository.delete(job);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestBody AdminUserRoleUpdateRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        String currentAdminEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        if (user.getEmail().equalsIgnoreCase(currentAdminEmail) && request.getRole() != Role.ADMIN) {
            throw new RuntimeException("You cannot remove your own admin access");
        }

        user.setRole(request.getRole());
        return ResponseEntity.ok(userRepository.save(user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        String currentAdminEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        if (user.getEmail().equalsIgnoreCase(currentAdminEmail)) {
            throw new RuntimeException("You cannot delete your own admin account");
        }

        if (user.getRole() == Role.RECRUITER) {
            List<Job> recruiterJobs = jobRepository.findByRecruiterId(user.getId());
            for (Job job : recruiterJobs) {
                List<Application> applications = applicationRepository.findByJobId(job.getId());
                if (!applications.isEmpty()) {
                    applicationRepository.deleteAll(applications);
                }
            }
            jobRepository.deleteByRecruiterId(user.getId());
        }

        if (user.getRole() == Role.CANDIDATE) {
            applicationRepository.deleteByCandidateId(user.getId());
        }

        userRepository.delete(user);
        return ResponseEntity.noContent().build();
    }
}
