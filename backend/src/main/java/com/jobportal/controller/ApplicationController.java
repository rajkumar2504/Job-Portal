package com.jobportal.controller;

import com.jobportal.dto.ApplicationDto;
import com.jobportal.dto.ApplicationStatusUpdateRequest;
import com.jobportal.entity.Application;
import com.jobportal.entity.ApplicationStatus;
import com.jobportal.entity.Job;
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
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<Application> applyForJob(@RequestBody ApplicationDto dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User candidate = userRepository.findByEmail(email).orElseThrow();
        Job job = jobRepository.findById(dto.getJobId()).orElseThrow(() -> new RuntimeException("Job not found"));

        Application app = Application.builder()
                .candidate(candidate)
                .job(job)
                .resumeUrl(dto.getResumeUrl())
                .status(ApplicationStatus.PENDING)
                .build();

        return ResponseEntity.ok(applicationRepository.save(app));
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<List<Application>> getMyApplications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User candidate = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(applicationRepository.findByCandidateId(candidate.getId()));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<Application>> getApplicationsForJob(@PathVariable Long jobId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User recruiter = userRepository.findByEmail(email).orElseThrow();
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new RuntimeException("You can only view applications for your own jobs");
        }

        return ResponseEntity.ok(applicationRepository.findByJobId(jobId));
    }

    @PutMapping("/{applicationId}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Application> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestBody ApplicationStatusUpdateRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User recruiter = userRepository.findByEmail(email).orElseThrow();
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getJob().getRecruiter().getId().equals(recruiter.getId())) {
            throw new RuntimeException("You can only update applications for your own jobs");
        }

        application.setStatus(request.getStatus());
        return ResponseEntity.ok(applicationRepository.save(application));
    }
}
