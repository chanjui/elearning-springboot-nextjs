package com.elearning.course.controller;

import com.elearning.course.dto.CourseRatingDTO;
import com.elearning.course.dto.CourseRatingRequest;
import com.elearning.course.service.CourseRatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/course/rating")
@RequiredArgsConstructor
public class CourseRatingController {
    private final CourseRatingService courseRatingService;

    @PostMapping
    public ResponseEntity<CourseRatingDTO> createRating(@RequestBody CourseRatingRequest request) {
        CourseRatingDTO rating = courseRatingService.createRating(request);
        return ResponseEntity.ok(rating);
    }
} 