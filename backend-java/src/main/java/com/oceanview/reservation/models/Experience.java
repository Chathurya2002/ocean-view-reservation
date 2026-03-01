package com.oceanview.reservation.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.List;

@Data
@Document(collection = "experiences")
public class Experience {
    @Id
    private String id;
    private String name;
    private String category;
    private Double price;
    private String duration;
    private String desc;
    private List<String> includes;
    private String notes;
    private String image;
    private Boolean isAvailable = true;
    private java.util.Date createdAt;
    private java.util.Date updatedAt;
}
