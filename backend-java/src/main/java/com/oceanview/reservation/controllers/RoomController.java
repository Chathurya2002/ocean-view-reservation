package com.oceanview.reservation.controllers;

import com.oceanview.reservation.models.Room;
import com.oceanview.reservation.repositories.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailableRooms() {
        List<Room> availableRooms = roomRepository.findAll().stream()
                .filter(Room::getIsAvailable)
                .collect(Collectors.toList());
        return ResponseEntity.ok(availableRooms);
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRoomById(@PathVariable(name = "id") String id) {
        Optional<Room> room = roomRepository.findById(id);
        if (room.isPresent()) {
            return ResponseEntity.ok(room.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
    }

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody Room room) {
        Room savedRoom = roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
    }

    @Autowired
    private com.oceanview.reservation.repositories.ReservationRepository reservationRepository;

    @PostMapping("/resync")
    public ResponseEntity<?> resyncRooms() {
        try {
            List<Room> allRooms = roomRepository.findAll();
            List<com.oceanview.reservation.models.Reservation> allReservations = reservationRepository.findAll();
            java.util.Date now = new java.util.Date();

            for (Room room : allRooms) {
                boolean isOccupied = false;
                for (com.oceanview.reservation.models.Reservation res : allReservations) {
                    if (room.getId().equals(res.getRoom()) && "CONFIRMED".equalsIgnoreCase(res.getStatus())) {
                        if (res.getCheckIn() != null && res.getCheckOut() != null) {
                            // If current time is within checkIn and checkOut
                            if (!now.before(res.getCheckIn()) && now.before(res.getCheckOut())) {
                                isOccupied = true;
                                break;
                            }
                        }
                    }
                }
                room.setIsAvailable(!isOccupied);
            }
            roomRepository.saveAll(allRooms);
            return ResponseEntity.ok(java.util.Collections.singletonMap("message",
                    "Room statuses successfully synced with active reservations!"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Collections.singletonMap("message", "Failed to sync rooms."));
        }
    }
}
