package com.oceanview.reservation.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String role = "user"; // "user", "admin"
    private String whatsapp;
    private String contactNumber;
    private String idNumber;
    private String idImage;
    private String address;
    private java.util.Date createdAt;
    private java.util.Date updatedAt;
}
