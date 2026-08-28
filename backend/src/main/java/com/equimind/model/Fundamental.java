package com.equimind.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "fundamentals")
public class Fundamental {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;
    
    @Column(name = "period", nullable = false, length = 20)
    private String period;
    
    @Column(name = "period_date")
    private LocalDate periodDate;
    
    @Column(name = "revenue")
    private Long revenue;
    
    @Column(name = "net_income")
    private Long netIncome;
    
    @Column(name = "eps", precision = 10, scale = 4)
    private BigDecimal eps;
    
    @Column(name = "gross_margin", precision = 8, scale = 4)
    private BigDecimal grossMargin;
    
    @Column(name = "net_margin", precision = 8, scale = 4)
    private BigDecimal netMargin;
    
    @Column(name = "roe", precision = 8, scale = 4)
    private BigDecimal roe;
    
    @Column(name = "roa", precision = 8, scale = 4)
    private BigDecimal roa;
    
    @Column(name = "pe_ratio", precision = 10, scale = 4)
    private BigDecimal peRatio;
    
    @Column(name = "pb_ratio", precision = 10, scale = 4)
    private BigDecimal pbRatio;
    
    @Column(name = "ps_ratio", precision = 10, scale = 4)
    private BigDecimal psRatio;
    
    @Column(name = "ev_to_ebitda", precision = 10, scale = 4)
    private BigDecimal evToEbitda;
    
    @Column(name = "revenue_growth", precision = 8, scale = 4)
    private BigDecimal revenueGrowth;
    
    @Column(name = "earnings_growth", precision = 8, scale = 4)
    private BigDecimal earningsGrowth;
    
    @Column(name = "debt_to_equity", precision = 8, scale = 4)
    private BigDecimal debtToEquity;
    
    @Column(name = "current_ratio", precision = 8, scale = 4)
    private BigDecimal currentRatio;
    
    @Column(name = "dividend_yield", precision = 8, scale = 4)
    private BigDecimal dividendYield;
    
    @Column(name = "data_source", length = 50)
    private String dataSource;
    
    @Column(name = "fetched_at")
    private LocalDateTime fetchedAt;
}
