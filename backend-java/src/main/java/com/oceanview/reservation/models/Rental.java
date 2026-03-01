package com.oceanview.reservation.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.List;

@Data
@Document(collection = "rentals")
public class Rental {
    @Id
    private String id;
    private String name;
    private String type = "Vehicle";
    private Double price;
    private String image;
    private String description;
    private List<String> features;
    private java.util.Date createdAt;
    private java.util.Date updatedAt;
}
