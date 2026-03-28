package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalUsers;
    private long totalRecruiters;
    private long totalCandidates;
    private long totalAdmins;
    private long totalJobs;
    private long totalApplications;
}
