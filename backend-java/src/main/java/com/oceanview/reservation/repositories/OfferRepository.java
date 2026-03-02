package com.oceanview.reservation.repositories;

import com.oceanview.reservation.models.Offer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferRepository extends MongoRepository<Offer, String> {
    List<Offer> findByIsActive(Boolean isActive);

    java.util.Optional<Offer> findByDiscountCodeAndIsActive(String discountCode, Boolean isActive);
}
