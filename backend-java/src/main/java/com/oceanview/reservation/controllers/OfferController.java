package com.oceanview.reservation.controllers;

import com.oceanview.reservation.models.Offer;
import com.oceanview.reservation.repositories.OfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    @Autowired
    private OfferRepository offerRepository;

    @GetMapping
    public ResponseEntity<List<Offer>> getAllOffers() {
        return ResponseEntity.ok(offerRepository.findAll());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Offer>> getActiveOffers() {
        return ResponseEntity.ok(offerRepository.findByIsActive(true));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOfferById(@PathVariable(name = "id") String id) {
        Optional<Offer> offer = offerRepository.findById(id);
        if (offer.isPresent()) {
            return ResponseEntity.ok(offer.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Offer not found");
    }

    @GetMapping("/validate/{code}")
    public ResponseEntity<?> validateOffer(@PathVariable(name = "code") String code) {
        Optional<Offer> offer = offerRepository.findAll().stream()
                .filter(o -> Boolean.TRUE.equals(o.getIsActive()) && code.equalsIgnoreCase(o.getDiscountCode()))
                .findFirst();
        if (offer.isPresent()) {
            return ResponseEntity.ok(offer.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(java.util.Collections.singletonMap("message", "Invalid or inactive discount code"));
    }

    @PostMapping
    public ResponseEntity<?> createOffer(@RequestBody Offer offer) {
        Offer savedOffer = offerRepository.save(offer);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOffer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOffer(@PathVariable(name = "id") String id, @RequestBody Offer updatedOffer) {
        Optional<Offer> offerOpt = offerRepository.findById(id);
        if (offerOpt.isPresent()) {
            Offer existing = offerOpt.get();
            if (updatedOffer.getTitle() != null)
                existing.setTitle(updatedOffer.getTitle());
            if (updatedOffer.getDescription() != null)
                existing.setDescription(updatedOffer.getDescription());
            if (updatedOffer.getDiscountCode() != null)
                existing.setDiscountCode(updatedOffer.getDiscountCode());
            if (updatedOffer.getDiscountPercentage() != null)
                existing.setDiscountPercentage(updatedOffer.getDiscountPercentage());
            if (updatedOffer.getIsActive() != null)
                existing.setIsActive(updatedOffer.getIsActive());
            offerRepository.save(existing);
            return ResponseEntity.ok(existing);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Offer not found");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOffer(@PathVariable(name = "id") String id) {
        if (offerRepository.existsById(id)) {
            offerRepository.deleteById(id);
            return ResponseEntity.ok("Offer deleted");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Offer not found");
    }
}
