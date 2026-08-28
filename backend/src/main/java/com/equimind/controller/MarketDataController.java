package com.equimind.controller;

import com.equimind.model.DailyPrice;
import com.equimind.repository.DailyPriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/market-data")
@CrossOrigin(origins = "http://localhost:3000")
public class MarketDataController {

    @Autowired
    private DailyPriceRepository dailyPriceRepository;

    @GetMapping("/{stockId}/prices")
    public ResponseEntity<List<DailyPrice>> getPrices(@PathVariable Long stockId) {
        return ResponseEntity.ok(dailyPriceRepository.findByStockIdOrderByPriceDateDesc(stockId));
    }
}
