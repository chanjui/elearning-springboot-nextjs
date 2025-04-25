package com.elearning.course.service;

import com.elearning.course.dto.CourseRatingDTO;
import com.elearning.course.dto.CourseRatingRequest;
import com.elearning.course.entity.Course;
import com.elearning.course.entity.CourseRating;
import com.elearning.course.repository.CourseRatingRepository;
import com.elearning.course.repository.CourseRepository;
import com.elearning.user.entity.User;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CourseRatingService {
    private final CourseRatingRepository courseRatingRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public CourseRatingDTO createRating(CourseRatingRequest request) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Course course = courseRepository.findById(request.getCourseId())
            .orElseThrow(() -> new RuntimeException("Course not found"));

        // Check if a rating already exists
        if (courseRatingRepository.existsByUserIdAndCourseId(user.getId(), course.getId())) {
            throw new RuntimeException("You have already rated this course");
        }

        CourseRating rating = new CourseRating();
        rating.setUser(user);
        rating.setCourse(course);
        rating.setRating(request.getRating());
        rating.setContent(request.getContent());

        CourseRating savedRating = courseRatingRepository.save(rating);
        
        return new CourseRatingDTO(
            savedRating.getId(),
            savedRating.getCourse().getId(),
            savedRating.getCourse().getSubject(),
            savedRating.getCourse().getThumbnailUrl(),
            savedRating.getUser().getId(),
            savedRating.getUser().getNickname(),
            savedRating.getUser().getProfileUrl(),
            savedRating.getContent(),
            savedRating.getRating(),
            savedRating.getRegDate()
        );
    }
} 