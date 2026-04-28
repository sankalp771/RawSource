package com.example.supply_chain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.supply_chain.entity.QualityRating;
import com.example.supply_chain.entity.RawMaterial;
import com.example.supply_chain.entity.Supplier;

import java.util.Optional;

public interface QualityRatingRepository extends JpaRepository<QualityRating, Long> {
    Optional<QualityRating> findBySupplierAndMaterial(Supplier supplier, RawMaterial material);
}















