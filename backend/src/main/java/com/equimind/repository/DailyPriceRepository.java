package com.equimind.repository;

import com.equimind.model.DailyPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DailyPriceRepository extends JpaRepository<DailyPrice, Long> {
    List<DailyPrice> findByStockIdOrderByPriceDateDesc(Long stockId);
}
