package com.oceanview.reservation.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.Date;
import java.util.List;

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

    private List<ExperienceBooking> experiences;
    private List<RentalBooking> rentals;
    private DriverDetails driverDetails;

    private Date createdAt;
    private Date updatedAt;

    @Data
    public static class ExperienceBooking {
        private String experience; // Object ID mapping string
        private Date date;
    }

    @Data
    public static class RentalBooking {
        private String rental; // Object ID mapping string
        private Date startDate;
        private Date endDate;
        private Integer days;
    }

    @Data
    public static class DriverDetails {
        private String name;
        private String contact;
        private String vehicleNo;
        private String status = "PENDING"; // "PENDING", "ASSIGNED"
    }
}
