package com.elearning.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "lectureProgress")
@Getter
@NoArgsConstructor
public class LectureProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lectureVideoId", nullable = false)
    private LectureVideo lectureVideo;

    @Column(precision = 5, scale = 2, nullable = false)
    private BigDecimal progress;

    @Column(name = "currentTime", nullable = false)
    private Integer currentTime;

    @Column
    private boolean isCompleted;

    @Column
    private LocalDateTime updatedAt;
} 