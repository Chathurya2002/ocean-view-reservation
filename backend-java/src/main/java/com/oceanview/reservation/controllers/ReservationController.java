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
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import com.oceanview.reservation.models.User;
import com.oceanview.reservation.models.Experience;
import com.oceanview.reservation.models.Rental;
import com.oceanview.reservation.repositories.UserRepository;
import com.oceanview.reservation.repositories.ExperienceRepository;
import com.oceanview.reservation.repositories.RentalRepository;
import com.oceanview.reservation.services.EmailService;
import java.text.SimpleDateFormat;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(originPatterns = "*", allowedHeaders = "*")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ExperienceRepository experienceRepository;

    @Autowired
    private RentalRepository rentalRepository;

    @Autowired
    private EmailService emailService;

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

        // Send Email Confirmation
        try {
            if (userId != null) {
                Optional<User> userOpt = userRepository.findById(userId);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    String roomName = "N/A";
                    if (reservation.getRoom() != null) {
                        Optional<Room> rOpt = roomRepository.findById(reservation.getRoom());
                        if (rOpt.isPresent())
                            roomName = rOpt.get().getName();
                    }

                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    String checkInStr = reservation.getCheckIn() != null ? sdf.format(reservation.getCheckIn()) : "N/A";
                    String checkOutStr = reservation.getCheckOut() != null ? sdf.format(reservation.getCheckOut())
                            : "N/A";

                    emailService.sendBookingConfirmation(
                            user.getEmail(),
                            user.getName(),
                            savedReservation.getReservationNumber(),
                            roomName,
                            checkInStr,
                            checkOutStr,
                            savedReservation.getPrice() != null ? savedReservation.getPrice() : 0.0);
                }
            }
        } catch (Exception e) {
            System.err.println("Error triggering email: " + e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(savedReservation);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyReservations(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User ID is required");
        }

        List<Reservation> reservations = reservationRepository.findByUser(userId);
        return ResponseEntity.ok(populateReservations(reservations));
    }

    @GetMapping
    public ResponseEntity<?> getAllReservations() {
        List<Reservation> reservations = reservationRepository.findAll();
        return ResponseEntity.ok(populateReservations(reservations));
    }

    private List<Map<String, Object>> populateReservations(List<Reservation> reservations) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Reservation res : reservations) {
            Map<String, Object> map = new HashMap<>();
            map.put("_id", res.getId());
            map.put("reservationNumber", res.getReservationNumber());
            map.put("checkIn", res.getCheckIn());
            map.put("checkOut", res.getCheckOut());
            map.put("price", res.getPrice());
            map.put("paymentMethod", res.getPaymentMethod());
            map.put("paymentReceipt", res.getPaymentReceipt());
            map.put("status", res.getStatus());
            map.put("guests", res.getGuests());

            if (res.getExperiences() != null && !res.getExperiences().isEmpty()) {
                List<Map<String, Object>> expList = new ArrayList<>();
                for (String expId : res.getExperiences()) {
                    Optional<Experience> expOpt = experienceRepository.findById(expId);
                    if (expOpt.isPresent()) {
                        Experience ex = expOpt.get();
                        Map<String, Object> ebMap = new HashMap<>();
                        Map<String, Object> innerExp = new HashMap<>();
                        innerExp.put("_id", ex.getId());
                        innerExp.put("name", ex.getName());
                        innerExp.put("price", ex.getPrice());
                        innerExp.put("duration", ex.getDuration());
                        ebMap.put("experience", innerExp);
                        ebMap.put("date", res.getCreatedAt()); // Since the nested object is deleted, defaulting to
                                                               // created date for display
                        expList.add(ebMap);
                    }
                }
                map.put("experiences", expList);
            } else {
                map.put("experiences", null);
            }

            if (res.getRentals() != null && !res.getRentals().isEmpty()) {
                List<Map<String, Object>> renList = new ArrayList<>();
                for (String renId : res.getRentals()) {
                    Optional<Rental> renOpt = rentalRepository.findById(renId);
                    if (renOpt.isPresent()) {
                        Rental r = renOpt.get();
                        Map<String, Object> rbMap = new HashMap<>();
                        Map<String, Object> innerRen = new HashMap<>();
                        innerRen.put("_id", r.getId());
                        innerRen.put("name", r.getName());
                        innerRen.put("price", r.getPrice());
                        innerRen.put("type", r.getType());
                        rbMap.put("rental", innerRen);
                        rbMap.put("startDate", res.getCheckIn()); // Defaults for display since nested class removed
                        rbMap.put("endDate", res.getCheckOut());
                        rbMap.put("days", 1);
                        renList.add(rbMap);
                    }
                }
                map.put("rentals", renList);
            } else {
                map.put("rentals", null);
            }

            if (res.getDriverDetails() != null) {
                map.put("driverDetails", res.getDriverDetails());
            } else {
                map.put("driverDetails", null);
            }

            map.put("createdAt", res.getCreatedAt());
            map.put("updatedAt", res.getUpdatedAt());

            if (res.getUser() != null) {
                Optional<User> uOpt = userRepository.findById(res.getUser());
                if (uOpt.isPresent()) {
                    User u = uOpt.get();
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("_id", u.getId());
                    userMap.put("name", u.getName());
                    userMap.put("email", u.getEmail());
                    userMap.put("contactNumber", u.getContactNumber());
                    map.put("user", userMap);
                } else {
                    map.put("user", res.getUser());
                }
            }

            if (res.getRoom() != null) {
                Optional<Room> rOpt = roomRepository.findById(res.getRoom());
                if (rOpt.isPresent()) {
                    Room r = rOpt.get();
                    Map<String, Object> roomMap = new HashMap<>();
                    roomMap.put("_id", r.getId());
                    roomMap.put("name", r.getName());
                    roomMap.put("roomNumber", r.getRoomNumber());
                    roomMap.put("price", r.getPrice());
                    roomMap.put("image", r.getImage());
                    map.put("room", roomMap);
                } else {
                    map.put("room", res.getRoom());
                }
            }
            result.add(map);
        }
        return result;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReservation(@PathVariable(name = "id") String id) {
        Optional<Reservation> reservation = reservationRepository.findById(id);
        if (reservation.isPresent()) {
            List<Reservation> singleList = new ArrayList<>();
            singleList.add(reservation.get());
            List<Map<String, Object>> populated = populateReservations(singleList);
            return ResponseEntity.ok(populated.get(0));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reservation not found");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReservation(@PathVariable(name = "id") String id,
            @RequestBody Reservation updatedReservation) {
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
    public ResponseEntity<?> deleteReservation(@PathVariable(name = "id") String id) {
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
