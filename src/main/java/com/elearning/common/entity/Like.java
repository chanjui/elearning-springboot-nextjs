package com.elearning.common.entity;

import com.elearning.course.entity.Course;
import com.elearning.instructor.entity.Instructor;
import com.elearning.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "like")
@Getter
@Setter
public class Like {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "userId", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "instructorId")
  private Instructor instructor;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "courseId")
  private Course course;

  @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 1")
  private Integer type = 1;

  @Column(name = "createdDate")
  private LocalDateTime createdDate = LocalDateTime.now();
} 