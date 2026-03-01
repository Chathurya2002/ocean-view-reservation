package com.oceanview.reservation.controllers;

import com.oceanview.reservation.models.Rental;
import com.oceanview.reservation.repositories.RentalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rentals")
public class RentalController {

    @Autowired
    private RentalRepository rentalRepository;

    @GetMapping
    public ResponseEntity<List<Rental>> getAllRentals() {
        return ResponseEntity.ok(rentalRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRentalById(@PathVariable String id) {
        Optional<Rental> rental = rentalRepository.findById(id);
        if (rental.isPresent()) {
            return ResponseEntity.ok(rental.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rental not found");
    }

    @PostMapping
    public ResponseEntity<?> createRental(@RequestBody Rental rental) {
        Rental savedRental = rentalRepository.save(rental);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRental);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRental(@PathVariable String id, @RequestBody Rental updatedRental) {
        Optional<Rental> rentalOpt = rentalRepository.findById(id);
        if (rentalOpt.isPresent()) {
            Rental existing = rentalOpt.get();
            if (updatedRental.getName() != null)
                existing.setName(updatedRental.getName());
            if (updatedRental.getPrice() != null)
                existing.setPrice(updatedRental.getPrice());
            rentalRepository.save(existing);
            return ResponseEntity.ok(existing);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rental not found");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRental(@PathVariable String id) {
        if (rentalRepository.existsById(id)) {
            rentalRepository.deleteById(id);
            return ResponseEntity.ok("Rental deleted");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rental not found");
    }
}
