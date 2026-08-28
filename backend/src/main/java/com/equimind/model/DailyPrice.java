package com.equimind.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "daily_prices")
public class DailyPrice {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;
    
    @Column(name = "price_date", nullable = false)
    private LocalDate priceDate;
    
    @Column(name = "open_price", precision = 12, scale = 4)
    private BigDecimal openPrice;
    
    @Column(name = "high_price", precision = 12, scale = 4)
    private BigDecimal highPrice;
    
    @Column(name = "low_price", precision = 12, scale = 4)
    private BigDecimal lowPrice;
    
    @Column(name = "close_price", precision = 12, scale = 4)
    private BigDecimal closePrice;
    
    @Column(name = "adj_close", precision = 12, scale = 4)
    private BigDecimal adjClose;
    
    @Column(name = "volume")
    private Long volume;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
