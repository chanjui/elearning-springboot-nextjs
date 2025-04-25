package com.elearning.user.service;

import com.elearning.course.dto.dashboard.*;
import com.elearning.course.entity.Course;
import com.elearning.course.entity.Course.CourseStatus;
import com.elearning.course.entity.CourseSection;
import com.elearning.course.entity.LectureVideo;
import com.elearning.course.repository.CourseRatingRepository;
import com.elearning.course.repository.CourseRepository;
import com.elearning.course.repository.LectureVideoRepository;
import com.elearning.user.entity.CourseEnrollment;
import com.elearning.user.entity.User;
import com.elearning.user.repository.CourseEnrollmentRepository;
import com.elearning.user.repository.UserRepository;
import com.elearning.common.entity.LectureProgress;
import com.elearning.common.repository.LectureProgressRepository;
import com.elearning.coding.entity.Submissions;
import com.elearning.coding.repository.SubmissionRepository;
import com.elearning.coding.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyLearningDashboardService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CourseEnrollmentRepository courseEnrollmentRepository;
    private final LectureProgressRepository lectureProgressRepository;
    private final LectureVideoRepository lectureVideoRepository;
    private final CourseRatingRepository courseRatingRepository;
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;

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

        // 월별 학습시간 데이터
        List<StudyTimeByMonthDto> studyTimeByMonth = getStudyTimeByMonth(user);

        // 학습한 날짜 목록
        List<String> studyDates = getStudyDates(user);

        // 코딩 테스트 통계
        CodingTestStatsDto codingTestStats = getCodingTestStats(user);

        return DashboardResponseDto.builder()
                .lastLearningCourse(lastLearningCourse)
                .enrolledCourses(enrolledCourses)
                .completedCourses(completedCourses)
                .recommendedCourses(recommendedCourses)
                .learningStats(learningStats)
                .learningGoals(learningGoals)
                .studyTimeByMonth(studyTimeByMonth)
                .studyDates(studyDates)
                .codingTestStats(codingTestStats)
                .build();
    }

    private CourseDto getLastLearningCourse(User user) {
        List<LectureProgress> progressList = lectureProgressRepository.findTopByUserIdOrderByUpdatedAtDesc(user.getId());
        if (progressList.isEmpty()) {
            return null;
        }

        LectureProgress lastProgress = progressList.get(0);
        CourseSection section = lastProgress.getLectureVideo().getSection();
        Course course = section.getCourse();
        List<CourseEnrollment> enrollments = courseEnrollmentRepository.findByUserIdAndCourseId(user.getId(), course.getId());
        CourseEnrollment enrollment = enrollments.isEmpty() ? null : enrollments.get(0);

        return createCourseDto(course, enrollment);
    }

    private List<CourseDto> getEnrolledCourses(User user) {
        List<CourseEnrollment> enrollments = courseEnrollmentRepository.findByUserIdAndCompletionStatusFalse(user.getId());
        return enrollments.stream()
                .filter(enrollment -> enrollment.getPayment().getStatus() == 0)
                .map(enrollment -> createCourseDto(enrollment.getCourse(), enrollment))
                .collect(Collectors.toList());
    }

    private List<CourseDto> getCompletedCourses(User user) {
        List<CourseEnrollment> enrollments = courseEnrollmentRepository.findByUserIdAndCompletionStatusTrue(user.getId());
        return enrollments.stream()
                .filter(enrollment -> enrollment.getPayment().getStatus() == 0)
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

        // 수강 중인 강의와 완료한 강의를 각각 가져옴
        List<CourseEnrollment> enrolledCourses = courseEnrollmentRepository.findByUserIdAndCompletionStatusFalse(user.getId());
        List<CourseEnrollment> completedCourses = courseEnrollmentRepository.findByUserIdAndCompletionStatusTrue(user.getId());
        
        // 결제가 완료된 강의만 필터링
        enrolledCourses = enrolledCourses.stream()
            .filter(enrollment -> enrollment.getPayment().getStatus() == 0)
            .collect(Collectors.toList());
            
        completedCourses = completedCourses.stream()
            .filter(enrollment -> enrollment.getPayment().getStatus() == 0)
            .collect(Collectors.toList());
            
        int totalCourses = enrolledCourses.size() + completedCourses.size();
        int completedCount = completedCourses.size();
        double completionRate = totalCourses > 0 ? (double) completedCount / totalCourses * 100 : 0.0;

        return LearningStatsDto.builder()
                .weeklyStudyTime(weeklyStudyTime != null ? weeklyStudyTime.intValue() : 0)
                .monthlyStudyTime(monthlyStudyTime != null ? monthlyStudyTime.intValue() : 0)
                .completionRate(completionRate)
                .averageQuizScore(0.0)
                .studyStreak(0)
                .totalCertificates(completedCount)
                .build();
    }

    private LearningGoalsDto createLearningGoals(User user) {
        // 실제 데이터를 기반으로 목표 설정
        List<CourseEnrollment> enrollments = courseEnrollmentRepository.findByUserId(user.getId());
        int totalCourses = enrollments.size();
        int completedCourses = (int) enrollments.stream().filter(CourseEnrollment::isCompletionStatus).count();
        
        // 현재 진행 중인 강의 수
        int currentEnrolledCourses = (int) enrollments.stream().filter(e -> !e.isCompletionStatus()).count();
        
        // 목표는 현재 진행 중인 강의 수 + 1로 설정
        int courseGoal = currentEnrolledCourses + 1;
        int courseProgress = currentEnrolledCourses;
        
        // 주간 목표는 현재 진행 중인 강의 수로 설정
        int weeklyGoal = currentEnrolledCourses;
        int weeklyProgress = currentEnrolledCourses;

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
        // Check if user has already rated this course
        boolean hasRating = false;
        if (enrollment != null) {
            hasRating = courseRatingRepository.existsByUserIdAndCourseId(enrollment.getUser().getId(), course.getId());
        }

        return CourseDto.builder()
            .id(course.getId())
            .title(course.getSubject())
            .instructor(course.getInstructor().getUser().getNickname())
            .progress(enrollment != null ? enrollment.getProgress().intValue() : 0)
            .lastAccessed(enrollment != null && enrollment.getEnrolledAt() != null ? enrollment.getEnrolledAt().toString() : null)
            .imageUrl(course.getThumbnailUrl())
            .completed(enrollment != null && enrollment.isCompletionStatus())
            .completedDate(enrollment != null && enrollment.getEnrolledAt() != null ? enrollment.getEnrolledAt().toString() : null)
            .certificateAvailable(enrollment != null && enrollment.isCompletionStatus())
            .courseStatus(course.getStatus().name())
            .courseProgress(enrollment != null ? String.valueOf(enrollment.getProgress()) : "0")
            .rating(courseRatingRepository.getAverageRatingByCourseId(course.getId()))
            .students(courseEnrollmentRepository.countByCourseId(course.getId()).intValue())
            .hasRating(hasRating)
            .build();
    }

    private String calculateCourseProgress(Long completedLectures, Long totalLectures) {
        if (totalLectures == null || totalLectures == 0) return "0%";
        double progress = (double) completedLectures / totalLectures * 100;
        return String.format("%.0f%%", progress);
    }

    private Integer calculateProgress(Integer current, Integer target) {
        if (target == 0) return 0;
        return (int) ((double) current / target * 100);
    }

    private String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
    }

    private List<StudyTimeByMonthDto> getStudyTimeByMonth(User user) {
        LocalDateTime now = LocalDateTime.now();
        List<StudyTimeByMonthDto> result = new ArrayList<>();
        
        // 최근 6개월 데이터
        for (int i = 5; i >= 0; i--) {
            LocalDateTime monthStart = now.minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime monthEnd = monthStart.plusMonths(1);
            
            Double studyTime = lectureProgressRepository.calculateStudyTimeBetweenDates(
                user.getId(), 
                monthStart, 
                monthEnd
            );
            
            result.add(StudyTimeByMonthDto.builder()
                .month(monthStart.format(DateTimeFormatter.ofPattern("yyyy-MM")))
                .hours(studyTime != null ? studyTime.intValue() : 0)
                .build());
        }
        
        return result;
    }

    private List<String> getStudyDates(User user) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startDate = now.minusMonths(1).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        
        List<LectureProgress> progressList = lectureProgressRepository.findByUserIdAndUpdatedAtAfter(
            user.getId(), 
            startDate
        );
        
        return progressList.stream()
            .map(progress -> progress.getUpdatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
            .distinct()
            .collect(Collectors.toList());
    }

    private CodingTestStatsDto getCodingTestStats(User user) {
        // 전체 문제 수 가져오기
        Long totalProblems = problemRepository.count();
        
        // 해결한 문제 수 가져오기
        Long solvedProblems = submissionRepository.countDistinctProblemsByUserIdAndStatus(
            user.getId(), 
            Submissions.SubmissionStatus.ACCEPTED
        );
        
        // 완료율 계산
        double completionRate = totalProblems > 0 ? (double) solvedProblems / totalProblems * 100 : 0.0;
        
        // 언어별 통계 계산
        List<Submissions> userSubmissions = submissionRepository.findAll().stream()
            .filter(s -> s.getUser().getId().equals(user.getId()) && 
                       s.getStatus() == Submissions.SubmissionStatus.ACCEPTED)
            .collect(Collectors.toList());
            
        Map<String, Long> languageCountMap = userSubmissions.stream()
            .collect(Collectors.groupingBy(
                s -> s.getLanguage().name(),
                Collectors.counting()
            ));
            
        // 전체 해결한 문제 수 계산 (중복 포함)
        long totalSolvedWithDuplicates = userSubmissions.size();
        
        // 언어별 통계 DTO 생성
        List<LanguageStatsDto> languageStats = languageCountMap.entrySet().stream()
            .map(entry -> LanguageStatsDto.builder()
                .language(entry.getKey())
                .count(entry.getValue().intValue())
                .percentage(totalSolvedWithDuplicates > 0 ? 
                    (double) entry.getValue() / totalSolvedWithDuplicates * 100 : 0.0)
                .build())
            .collect(Collectors.toList());

        return CodingTestStatsDto.builder()
                .totalProblems(totalProblems != null ? totalProblems.intValue() : 0)
                .solvedProblems(solvedProblems != null ? solvedProblems.intValue() : 0)
                .completionRate(completionRate)
                .languageStats(languageStats)
                .build();
    }
} 