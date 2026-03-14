package com.jobportal.dto;
import lombok.Data;
@Data
public class JobDto {
    private String title;
    private String description;
    private String location;
    private Double salary;
    private String company;
}
