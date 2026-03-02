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

    @PostMapping("/resync")
    public ResponseEntity<?> resyncRooms() {
        // A placeholder for the resync rooms logic (if they recreate default rooms).
        // Since we don't have the original node.js hardcoded array, we can just return
        // success.
        return ResponseEntity.ok("Rooms resynced");
    }
}
