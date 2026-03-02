package com.oceanview.reservation.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "reservations")
public class Reservation {
    @Id
    private String id;
    private String reservationNumber;

    private String user; // Object ID mapping string
    private String room; // Object ID mapping string (optional)

    private Date checkIn;
    private Date checkOut;
    private Double price; // Total price
    private String paymentMethod; // "CARD", "CASH", "BANK"
    private String paymentReceipt;
    private String status = "CONFIRMED"; // "PENDING", "CONFIRMED", "CANCELLED"
    private Integer guests = 1;

    private List<String> experiences;
    private List<String> rentals;
    private Map<String, Object> driverDetails;

    private Date createdAt;
    private Date updatedAt;

}
