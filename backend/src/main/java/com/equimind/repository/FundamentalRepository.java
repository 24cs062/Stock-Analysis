package com.equimind.repository;

import com.equimind.model.Fundamental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FundamentalRepository extends JpaRepository<Fundamental, Long> {
    List<Fundamental> findByStockId(Long stockId);
}
