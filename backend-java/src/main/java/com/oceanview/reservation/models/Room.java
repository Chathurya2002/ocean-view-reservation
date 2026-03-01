package com.oceanview.reservation.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "rooms")
public class Room {
    @Id
    private String id;
    private String roomNumber;
    private String name;
    private String type; // "STANDARD", "DELUXE", "SUITE", "PRESIDENTIAL"
    private Double price;
    private String desc;
    private String image;
    private Boolean isAvailable = true;
}
