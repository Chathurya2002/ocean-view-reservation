package com.oceanview.reservation.controllers;

import com.oceanview.reservation.models.Reservation;
import com.oceanview.reservation.models.Room;
import com.oceanview.reservation.repositories.ReservationRepository;
import com.oceanview.reservation.repositories.RoomRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RoomRepository roomRepository;

    @PostMapping
    public ResponseEntity<?> createReservation(HttpServletRequest request, @RequestBody Reservation reservation) {
        String userId = (String) request.getAttribute("userId");
        if (userId != null) {
            reservation.setUser(userId);
        }

        reservation.setReservationNumber("RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        reservation.setCreatedAt(new Date());

        // Process Room Availability logic if booking a room
        if (reservation.getRoom() != null) {
            Optional<Room> roomOpt = roomRepository.findById(reservation.getRoom());
            if (roomOpt.isPresent()) {
                Room room = roomOpt.get();
                if (room.getIsAvailable()) {
                    room.setIsAvailable(false);
                    roomRepository.save(room);
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Room is no longer available");
                }
            }
        }

        Reservation savedReservation = reservationRepository.save(reservation);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReservation);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyReservations(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User ID is required");
        }

        List<Reservation> reservations = reservationRepository.findByUser(userId);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReservation(@PathVariable String id) {
        Optional<Reservation> reservation = reservationRepository.findById(id);
        if (reservation.isPresent()) {
            return ResponseEntity.ok(reservation.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reservation not found");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReservation(@PathVariable String id, @RequestBody Reservation updatedReservation) {
        Optional<Reservation> resOpt = reservationRepository.findById(id);
        if (resOpt.isPresent()) {
            Reservation existing = resOpt.get();
            if (updatedReservation.getStatus() != null) {
                existing.setStatus(updatedReservation.getStatus());
            }
            existing.setUpdatedAt(new Date());
            reservationRepository.save(existing);
            return ResponseEntity.ok(existing);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reservation not found");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable String id) {
        Optional<Reservation> resOpt = reservationRepository.findById(id);
        if (resOpt.isPresent()) {
            // Revert room state
            Reservation res = resOpt.get();
            if (res.getRoom() != null) {
                Optional<Room> roomOpt = roomRepository.findById(res.getRoom());
                if (roomOpt.isPresent()) {
                    Room room = roomOpt.get();
                    room.setIsAvailable(true);
                    roomRepository.save(room);
                }
            }
            reservationRepository.deleteById(id);
            return ResponseEntity.ok("Reservation deleted");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reservation not found");
    }
}
