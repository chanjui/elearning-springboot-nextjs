package com.elearning.user.controller;

import com.elearning.course.dto.CourseDTO;
import com.elearning.course.service.CourseListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/user/courses")
@RequiredArgsConstructor
public class CourseListController {
  private final CourseListService courseListService;

  @GetMapping
  public ResponseEntity<List<CourseDTO>> getAllCourses() {
    return ResponseEntity.ok(courseListService.getAllCourses());
  }

  @GetMapping("/new")
  public ResponseEntity<List<CourseDTO>> getNewCourses() {
    return ResponseEntity.ok(courseListService.getNewCourses());
  }

  @GetMapping("/popular")
  public ResponseEntity<List<CourseDTO>> getPopularCourses() {
    return ResponseEntity.ok(courseListService.getPopularCourses());
  }

  @GetMapping("/free")
  public ResponseEntity<List<CourseDTO>> getFreeCourses() {
    return ResponseEntity.ok(courseListService.getFreeCourses());
  }
}