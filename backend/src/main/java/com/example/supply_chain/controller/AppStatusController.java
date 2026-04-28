package com.example.supply_chain.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AppStatusController {

    @GetMapping("/")
    public Map<String, String> root() {
        return Map.of(
                "app", "RawSource backend",
                "status", "ok"
        );
    }

    @GetMapping("/api/health")
    public Map<String, String> health() {
        return Map.of(
                "status", "UP"
        );
    }
}
