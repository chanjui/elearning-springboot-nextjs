package com.elearning.user.service;

import com.elearning.course.dto.dashboard.*;
import com.elearning.course.entity.Course;
import com.elearning.course.entity.Course.CourseStatus;
import com.elearning.course.entity.CourseSection;
import com.elearning.course.repository.CourseRepository;
import com.elearning.user.entity.CourseEnrollment;
import com.elearning.user.entity.User;
import com.elearning.user.repository.CourseEnrollmentRepository;
import com.elearning.user.repository.UserRepository;
import com.elearning.common.entity.LectureProgress;
import com.elearning.common.repository.LectureProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyLearningDashboardService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CourseEnrollmentRepository courseEnrollmentRepository;
    private final LectureProgressRepository lectureProgressRepository;

    public DashboardResponseDto getDashboardData(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 마지막으로 학습한 강의
        CourseDto lastLearningCourse = getLastLearningCourse(user);

        // 수강 중인 강의 목록
        List<CourseDto> enrolledCourses = getEnrolledCourses(user);

        // 수강 완료한 강의 목록
        List<CourseDto> completedCourses = getCompletedCourses(user);

        // 추천 강의 목록
        List<CourseDto> recommendedCourses = getRecommendedCourses(user);

        // 학습 통계
        LearningStatsDto learningStats = createLearningStats(user);

        // 학습 목표
        LearningGoalsDto learningGoals = createLearningGoals(user);

        return DashboardResponseDto.builder()
                .lastLearningCourse(lastLearningCourse)
                .enrolledCourses(enrolledCourses)
                .completedCourses(completedCourses)
                .recommendedCourses(recommendedCourses)
                .learningStats(learningStats)
                .learningGoals(learningGoals)
                .build();
    }

    private CourseDto getLastLearningCourse(User user) {
        LectureProgress lastProgress = lectureProgressRepository.findTopByUserIdOrderByUpdatedAtDesc(user.getId());
        if (lastProgress == null) {
            return null;
        }

        CourseSection section = lastProgress.getLectureVideo().getSection();
        Course course = section.getCourse();
        CourseEnrollment enrollment = courseEnrollmentRepository.findByUserIdAndCourseId(user.getId(), course.getId());

        return createCourseDto(course, enrollment);
    }

    private List<CourseDto> getEnrolledCourses(User user) {
        List<CourseEnrollment> enrollments = courseEnrollmentRepository.findByUserIdAndCompletionStatusFalse(user.getId());
        return enrollments.stream()
                .map(enrollment -> createCourseDto(enrollment.getCourse(), enrollment))
                .collect(Collectors.toList());
    }

    private List<CourseDto> getCompletedCourses(User user) {
        List<CourseEnrollment> enrollments = courseEnrollmentRepository.findByUserIdAndCompletionStatusTrue(user.getId());
        return enrollments.stream()
                .map(enrollment -> createCourseDto(enrollment.getCourse(), enrollment))
                .collect(Collectors.toList());
    }

    private List<CourseDto> getRecommendedCourses(User user) {
        // 추천 강의 로직 구현 (예: 최신 강의 3개)
        List<Course> courses = courseRepository.findTop5ByStatusOrderByRegDateDesc(CourseStatus.ACTIVE);
        return courses.stream()
                .limit(3)
                .map(course -> createCourseDto(course, null))
                .collect(Collectors.toList());
    }

    private LearningStatsDto createLearningStats(User user) {
        LocalDateTime weekStart = LocalDateTime.now().minusWeeks(1);
        LocalDateTime monthStart = LocalDateTime.now().minusMonths(1);

        Double weeklyStudyTime = lectureProgressRepository.calculateWeeklyStudyTime(user.getId(), weekStart);
        Double monthlyStudyTime = lectureProgressRepository.calculateMonthlyStudyTime(user.getId(), monthStart);

        List<CourseEnrollment> enrollments = courseEnrollmentRepository.findByUserId(user.getId());
        int totalCourses = enrollments.size();
        int completedCourses = (int) enrollments.stream().filter(CourseEnrollment::isCompletionStatus).count();
        double completionRate = totalCourses > 0 ? (double) completedCourses / totalCourses * 100 : 0.0;

        // 임시 값 설정 (실제 구현에서는 퀴즈 점수와 스트릭 정보를 가져와야 함)
        double averageQuizScore = 85.0;
        int studyStreak = 5;
        int totalCertificates = completedCourses;

        return LearningStatsDto.builder()
                .weeklyStudyTime(weeklyStudyTime != null ? weeklyStudyTime.intValue() : 0)
                .monthlyStudyTime(monthlyStudyTime != null ? monthlyStudyTime.intValue() : 0)
                .completionRate(completionRate)
                .averageQuizScore(averageQuizScore)
                .studyStreak(studyStreak)
                .totalCertificates(totalCertificates)
                .build();
    }

    private LearningGoalsDto createLearningGoals(User user) {
        // 임시 값 설정 (실제 구현에서는 사용자의 목표 정보를 가져와야 함)
        int weeklyGoal = 5;
        int weeklyProgress = 3;
        int courseGoal = 3;
        int courseProgress = 1;

        GoalDto weekly = GoalDto.builder()
                .target(weeklyGoal)
                .current(weeklyProgress)
                .progress(calculateProgress(weeklyProgress, weeklyGoal))
                .build();

        GoalDto courses = GoalDto.builder()
                .target(courseGoal)
                .current(courseProgress)
                .progress(calculateProgress(courseProgress, courseGoal))
                .build();

        return LearningGoalsDto.builder()
                .weekly(weekly)
                .courses(courses)
                .build();
    }

    private CourseDto createCourseDto(Course course, CourseEnrollment enrollment) {
        CourseDto.CourseDtoBuilder builder = CourseDto.builder()
                .id(course.getId())
                .title(course.getSubject())
                .instructor(course.getInstructor().getUser().getNickname())
                .imageUrl(course.getThumbnailUrl())
                .slug("course-" + course.getId())
                .category(course.getCategory().getName())
                .courseStatus(course.getStatus().name())
                .rating(4.5) // 임시 값
                .students(100) // 임시 값
                .level("중급") // 임시 값
                .relatedTo("프로그래밍"); // 임시 값

        if (enrollment != null) {
            LectureProgress lastProgress = lectureProgressRepository.findTopByUserIdAndCourseIdOrderByUpdatedAtDesc(
                enrollment.getUser().getId(), course.getId());
            
            builder.progress(enrollment.getProgress().intValue())
                    .lastAccessed(formatDateTime(lastProgress != null ? lastProgress.getUpdatedAt() : enrollment.getEnrolledAt()))
                    .completed(enrollment.isCompletionStatus())
                    .completedDate(enrollment.isCompletionStatus() && lastProgress != null ? formatDateTime(lastProgress.getUpdatedAt()) : null)
                    .certificateAvailable(enrollment.isCompletionStatus());
        }

        // 임시 값 설정
        builder.totalLectures(10)
                .completedLectures(5)
                .nextLecture("다음 강의 제목")
                .estimatedTimeLeft("5시간")
                .lastStudyDate(formatDateTime(LocalDateTime.now().minusDays(1)))
                .courseProgress("50%");

        return builder.build();
    }

    private Integer calculateProgress(Integer current, Integer target) {
        if (target == 0) return 0;
        return (int) ((double) current / target * 100);
    }

    private String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
    }
} 