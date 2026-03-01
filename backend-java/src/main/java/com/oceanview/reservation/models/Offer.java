package com.oceanview.reservation.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "offers")
public class Offer {
    @Id
    private String id;
    private String title;
    private String description;
    private String discountCode;
    private Boolean isActive = true;
    private java.util.Date createdAt = new java.util.Date();
}
