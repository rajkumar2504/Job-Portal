package com.jobportal.dto;

import com.jobportal.entity.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminUserRoleUpdateRequest {
    @NotNull
    private Role role;
}
