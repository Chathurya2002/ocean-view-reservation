package com.oceanview.reservation.controllers;

import com.oceanview.reservation.models.Experience;
import com.oceanview.reservation.repositories.ExperienceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/experiences")
public class ExperienceController {

    @Autowired
    private ExperienceRepository experienceRepository;

    @GetMapping
    public ResponseEntity<List<Experience>> getAllExperiences() {
        return ResponseEntity.ok(experienceRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getExperienceById(@PathVariable String id) {
        Optional<Experience> experience = experienceRepository.findById(id);
        if (experience.isPresent()) {
            return ResponseEntity.ok(experience.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Experience not found");
    }

    @PostMapping
    public ResponseEntity<?> createExperience(@RequestBody Experience experience) {
        Experience savedExperience = experienceRepository.save(experience);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedExperience);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExperience(@PathVariable String id, @RequestBody Experience updatedExperience) {
        Optional<Experience> expOpt = experienceRepository.findById(id);
        if (expOpt.isPresent()) {
            Experience existing = expOpt.get();
            if (updatedExperience.getName() != null)
                existing.setName(updatedExperience.getName());
            if (updatedExperience.getPrice() != null)
                existing.setPrice(updatedExperience.getPrice());
            if (updatedExperience.getIsAvailable() != null)
                existing.setIsAvailable(updatedExperience.getIsAvailable());
            experienceRepository.save(existing);
            return ResponseEntity.ok(existing);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Experience not found");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExperience(@PathVariable String id) {
        if (experienceRepository.existsById(id)) {
            experienceRepository.deleteById(id);
            return ResponseEntity.ok("Experience deleted");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Experience not found");
    }
}
