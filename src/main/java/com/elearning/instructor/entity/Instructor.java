package com.elearning.instructor.entity;

import com.elearning.common.entity.BaseEntity;
import com.elearning.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "instructor")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Instructor extends BaseEntity {
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "expertiseId")
    private Expertise expertise;

    @OneToMany(mappedBy = "instructor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InstructorCategoryMapping> desiredFields = new ArrayList<>();

    @Column(name = "referralSource")
    private String referralSource;

} 