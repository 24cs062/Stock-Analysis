package com.equimind.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = "http://localhost:3000")
public class PortfolioController {

    @GetMapping
    public ResponseEntity<List<String>> getPortfolio() {
        // Stub implementation
        return ResponseEntity.ok(List.of("AAPL", "GOOGL"));
    }
}
