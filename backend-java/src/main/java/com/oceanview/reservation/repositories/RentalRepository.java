package com.oceanview.reservation.repositories;

import com.oceanview.reservation.models.Rental;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RentalRepository extends MongoRepository<Rental, String> {
}
