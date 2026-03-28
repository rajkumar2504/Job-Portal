package com.jobportal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> home() {
        return ResponseEntity.ok(Map.of(
                "message", "Job Portal backend is running",
                "swagger", "http://localhost:8080/swagger-ui.html",
                "frontend", "http://127.0.0.1:5173"
        ));
    }
}
