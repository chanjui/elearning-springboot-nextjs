package com.elearning.admin.service;

import com.elearning.admin.dto.CourseReviewRequest;
import com.elearning.admin.dto.CourseSummaryDTO;
import com.elearning.admin.dto.PendingCourseDTO;
import com.elearning.admin.dto.coupon.AdminCouponDTO;
import com.elearning.admin.dto.coupon.AdminCouponInfoDTO;
import com.elearning.admin.dto.coupon.AdminUserCouponDTO;
import com.elearning.admin.dto.dashboard.*;
import com.elearning.admin.dto.sales.CategoryRevenueDTO;
import com.elearning.admin.dto.sales.DashboardDTO;
import com.elearning.admin.dto.sales.PaymentDTO;
import com.elearning.admin.dto.sales.SettlementDTO;
import com.elearning.admin.entity.Admin;
import com.elearning.admin.entity.AdminLog;
import com.elearning.admin.repository.AdminLogRepository;
import com.elearning.admin.repository.AdminRepository;
import com.elearning.common.entity.Notification;
import com.elearning.common.entity.Payment;
import com.elearning.common.entity.PaymentHistory;
import com.elearning.common.repository.NotificationRepository;
import com.elearning.course.dto.CourseParticular.CourseInfoDTO;
import com.elearning.course.dto.CourseParticular.CourseRatingDTO;
import com.elearning.course.dto.CourseParticular.CourseSectionDTO;
import com.elearning.course.dto.CourseParticular.LectureVideoDTO;
import com.elearning.course.entity.Course;
import com.elearning.course.repository.*;
import com.elearning.instructor.entity.Instructor;
import com.elearning.instructor.repository.InstructorRepository;
import com.elearning.user.entity.Coupon;
import com.elearning.user.entity.User;
import com.elearning.user.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {
  private final PaymentRepository paymentRepository;
  private final UserRepository userRepository;
  private final CourseRepository courseRepository;
  private final BoardRepository boardRepository;
  private final CourseEnrollmentRepository courseEnrollmentRepository;
  private final CourseRatingRepository courseRatingRepository;
  private final CourseSectionRepository courseSectionRepository;
  private final LectureVideoRepository lectureVideoRepository;
  private final PaymentHistoryRepository paymentHistoryRepository;
  private final InstructorRepository instructorRepository;
  private final AdminLogRepository adminLogRepository;
  private final AdminRepository adminRepository;
  private final NotificationRepository notificationRepository;
  private final CouponRepository couponRepository;

  public long calculateTotalRevenue() {
    Long totalRevenue = paymentRepository.sumByPrice();
    return totalRevenue != null ? totalRevenue : 0L;
  }

  public int totalUsers() {
    return userRepository.countByIsDelFalse();
  }

  public int getUserCountBeforeOneWeek() {
    LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
    return userRepository.countByRegDateBeforeAndIsDelFalse(oneWeekAgo);
  }

  public int totalCourses() {
    return courseRepository.countByIsDelFalse();
  }

  public int getCourseCountBeforeOneWeek() {
    LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
    return courseRepository.countByRegDateBeforeAndIsDelFalse(oneWeekAgo);
  }

  public int unresolvedInquiries() {
    return boardRepository.countUnansweredQuestions();
  }

  public int getBoardCountBeforeOneWeek() {
    LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
    return boardRepository.countByRegDateBeforeAndIsDelFalse(oneWeekAgo);
  }

  // 월별 매출(최근 6개월)
  public List<MonthlyRevenueDTO> calculateMonthlyRevenue() {
    List<MonthlyRevenueDTO> monthlyRevenueList = new ArrayList<>();

    YearMonth currentMonth = YearMonth.now(); // 현재 월
    for (int i = 5; i >= 0; i--) { // 최근 6개월 (과거부터 현재까지)
      YearMonth targetMonth = currentMonth.minusMonths(i);

      // 해당 월의 시작일과 종료일 계산
      LocalDateTime startOfMonth = targetMonth.atDay(1).atStartOfDay();
      LocalDateTime endOfMonth = targetMonth.atEndOfMonth().atTime(LocalTime.MAX);

      // 결제 내역 조회
      List<Payment> payments = paymentRepository.findByRegDateBetweenAndStatus(startOfMonth, endOfMonth, 0);

      // 매출 합계 계산
      BigDecimal revenue = payments.stream()
        .map(payment -> BigDecimal.valueOf(payment.getPrice()))
        .reduce(BigDecimal.ZERO, BigDecimal::add);

      // DTO 생성
      MonthlyRevenueDTO dto = MonthlyRevenueDTO.builder()
        .month(String.valueOf(targetMonth)) // 예: "2025-04"
        .revenue(revenue)
        .build();

      monthlyRevenueList.add(dto);
    }

    return monthlyRevenueList;
  }

  // 최근 5개 판매 강의
  public List<RecentSaleDTO> getRecentSales() {
    List<Payment> recentPayments = paymentRepository.findByRegDateBetweenAndStatus(
      LocalDateTime.now().minusWeeks(1), LocalDateTime.now(), 0);

    return recentPayments.stream()
      .map(payment -> {
        // 결제한 사람과 강의 정보를 가져오기
        User purchaser = payment.getUser(); // 결제한 사람
        Course course = payment.getCourse(); // 결제된 강의

        // 구매 시간 계산 (예: "2시간 전" 등)
        String purchasedAt = calculateTimeAgo(payment.getRegDate());

        return RecentSaleDTO.builder()
          .courseTitle(course != null ? course.getSubject() : "Unknown Course") // 강의 제목
          .purchaserId(purchaser != null ? purchaser.getId() : 0)
          .purchaserName(purchaser != null ? purchaser.getNickname() : "Unknown User") // 결제한 사람 이름
          .profileImg(purchaser != null ? purchaser.getProfileUrl() : "Unknown User") // 결제한 사람 프로필 이미지
          .price(payment.getPrice()) // 결제 금액
          .purchasedAt(purchasedAt) // 결제 시간
          .build();
      })
      .limit(5) // 최근 5개만 가져오기
      .collect(Collectors.toList());
  }

  // 결제 시간으로부터 "2시간 전", "3일 전" 등의 문자열을 계산하는 함수
  private String calculateTimeAgo(LocalDateTime dateTime) {
    LocalDateTime now = LocalDateTime.now();
    long seconds = java.time.Duration.between(dateTime, now).getSeconds();

    if (seconds < 60) {
      return seconds + "초 전";
    } else if (seconds < 3600) {
      return seconds / 60 + "분 전";
    } else if (seconds < 86400) {
      return seconds / 3600 + "시간 전";
    } else if (seconds < 2592000) {
      return seconds / 86400 + "일 전";
    } else {
      return seconds / 2592000 + "개월 전";
    }
  }

  public int getCountPendingCourse() {
    return courseRepository.countByStatus(Course.CourseStatus.PREPARING);
  }

  public List<PopularCategoryDTO> getPopularCategories() {
    List<Object[]> results = courseEnrollmentRepository.findPopularCategoriesRaw();
    return results.stream()
      .map(row -> PopularCategoryDTO.builder()
        .categoryName((String) row[0])
        .usageRate(((Number) row[1]).intValue())
        .build())
      .collect(Collectors.toList());
  }

  public DailyUserRegistrationDTO getTodayUserRegistrationSummary() {
    int todayCount = userRepository.countByRegDateAfter(LocalDateTime.now().toLocalDate().atStartOfDay());

    String lastRegisteredAgo;

    if (todayCount == 0) {
      lastRegisteredAgo = "-";
    } else {
      User lastUser = userRepository.findTopByOrderByRegDateDesc().get();
      LocalDateTime now = LocalDateTime.now();
      Duration duration = Duration.between(lastUser.getRegDate(), now);

      long hoursAgo = duration.toHours();
      lastRegisteredAgo = hoursAgo + "시간전";
    }

    return DailyUserRegistrationDTO.builder()
      .todayCount(todayCount)
      .lastUserRegisteredAgo(lastRegisteredAgo)
      .build();
  }

  public RecentCourseDTO getRecentCourseSummary() {
    Course recentCourse = courseRepository.findTopByOrderByRegDateDesc();

    if (recentCourse == null) {
      return RecentCourseDTO.builder()
        .courseTitle("-")
        .instructorName("-")
        .registeredAgo("-")
        .build();
    }

    LocalDateTime now = LocalDateTime.now();
    Duration duration = Duration.between(recentCourse.getRegDate(), now);
    long hoursAgo = duration.toHours();

    return RecentCourseDTO.builder()
      .courseTitle(recentCourse.getSubject())
      .instructorName(recentCourse.getInstructor().getUser().getNickname())
      .registeredAgo(hoursAgo + "시간 전")
      .build();
  }

  public AdminDashboardDTO getDashboardSummary() {
    return AdminDashboardDTO.builder()
      .totalRevenue(calculateTotalRevenue())

      .totalUsers(totalUsers())
      .userIncreaseFromLastWeek(totalUsers() - getUserCountBeforeOneWeek())

      .totalCourses(totalCourses())
      .courseIncreaseFromLastWeek(totalCourses() - getCourseCountBeforeOneWeek())

      .unresolvedInquiries(unresolvedInquiries())
      .inquiryIncreaseFromLastWeek(unresolvedInquiries() - getBoardCountBeforeOneWeek())

      .monthlyRevenueOverview(calculateMonthlyRevenue())
      .recentSales(getRecentSales())

      .pendingCourse(getCountPendingCourse())
      .popularCategories(getPopularCategories())

      .recentActivity(
        RecentActivityDTO.builder()
          .userRegistrations(getTodayUserRegistrationSummary())
          .recentCourse(getRecentCourseSummary())
          .build()
      )
      .build();
  }

  public List<CourseSummaryDTO> getAllCourses() {
    List<Course> courses = courseRepository.findAll();

    return courses.stream()
      .map(course -> {
        Long courseId = course.getId();

        Long studentCount = courseEnrollmentRepository.countByCourseId(courseId);
        double averageRating = courseRatingRepository.getAverageRatingByCourseId(courseId);

        return CourseSummaryDTO.builder()
          .id(courseId)
          .title(course.getSubject())
          .instructor(course.getInstructor().getUser().getNickname())
          .category(course.getCategory().getName())
          .price(course.getPrice())
          .status(course.getStatus().name())
          .students(Math.toIntExact(studentCount))
          .rating(averageRating)
          .createdAt(course.getRegDate())
          .build();
      })
      .collect(Collectors.toList());
  }

  public CourseInfoDTO getCourseParticular(Long courseId) {
    Course course = courseRepository.findById(courseId).orElse(null);
    if (course == null) {
      return null;
    }

    List<CourseSectionDTO> curriculum = courseSectionRepository.findByCourseIdOrderByOrderNumAsc(courseId).stream().map(
      section -> new CourseSectionDTO(
        section.getId(),
        section.getSubject(),
        lectureVideoRepository.findBySectionIdOrderBySeqAsc(section.getId()).stream().map(
          lecture -> new LectureVideoDTO(
            lecture.getId(),
            lecture.getTitle(),
            lecture.getDuration(),
            lecture.isFree()
          )).collect(Collectors.toList())
      )).collect(Collectors.toList());

    List<CourseRatingDTO> reviews = courseRatingRepository.findByCourseId(courseId).stream().map(
      rating -> new CourseRatingDTO(
        rating.getId(),
        rating.getUser().getId(),
        rating.getUser().getNickname(),
        rating.getUser().getProfileUrl(),
        rating.getRating(),
        rating.getRegDate().toLocalDate(),
        rating.getContent()
      )).collect(Collectors.toList());

    int students = courseEnrollmentRepository.countCourseEnrollmentByCourseId(courseId);
    double averageRating = reviews.stream().mapToInt(CourseRatingDTO::getRating).average().orElse(0.0);
    int totalLectures = curriculum.stream().mapToInt(section -> section.getLectures().size()).sum();
    double totalHours = curriculum.stream().flatMap(section -> section.getLectures().stream()).mapToInt(
      LectureVideoDTO::getDuration).sum() / 60.0;
    totalHours = Math.round(totalHours * 100.0) / 100.0;

    return new CourseInfoDTO(
      course.getId(),
      course.getSubject(),
      course.getDescription(),
      course.getInstructor().getUser().getNickname(),
      course.getInstructor().getId(),
      course.getPrice(),
      averageRating,
      students,
      totalLectures,
      totalHours,
      course.getTarget(),
      course.getUpdateDate().toLocalDate(),
      course.getThumbnailUrl(),
      curriculum,
      reviews,
      null,
      null,
      null// ✅ DTO 에 추가
    );
  }

  public List<PendingCourseDTO> getPendingCourses() {
    List<Course> courses = courseRepository.findAllByStatus(Course.CourseStatus.PREPARING);

    return courses.stream()
      .map(course -> {
        Long courseId = course.getId();

        // 전체 커리큘럼 조회 (섹션 + 강의)
        List<CourseSectionDTO> curriculum = courseSectionRepository.findByCourseIdOrderByOrderNumAsc(courseId).stream()
          .map(section -> new CourseSectionDTO(
            section.getId(),
            section.getSubject(),
            lectureVideoRepository.findBySectionIdOrderBySeqAsc(section.getId()).stream()
              .map(lecture -> new LectureVideoDTO(
                lecture.getId(),
                lecture.getTitle(),
                lecture.getDuration(),
                lecture.isFree()
              ))
              .collect(Collectors.toList())
          ))
          .toList();

        int sectionCount = curriculum.size();

        // 강의 개수 및 전체 시간 계산
        int videoCount = curriculum.stream()
          .mapToInt(section -> section.getLectures().size())
          .sum();

        int totalDuration = curriculum.stream()
          .flatMap(section -> section.getLectures().stream())
          .mapToInt(LectureVideoDTO::getDuration)
          .sum();

        return PendingCourseDTO.builder()
          .id(courseId)
          .title(course.getSubject())
          .instructor(course.getInstructor().getUser().getNickname())
          .instructorEmail(course.getInstructor().getUser().getEmail())
          .category(course.getCategory().getName())
          .description(course.getDescription())
          .price(course.getPrice())
          .createdAt(course.getRegDate().toLocalDate().toString())
          .status(course.getStatus().name().toLowerCase())
          .sections(sectionCount)
          .videos(videoCount)
          .duration(totalDuration)
          .build();
      })
      .collect(Collectors.toList());
  }

  public BigDecimal calculateCommissionRevenue() {
    List<PaymentHistory> historyList = paymentHistoryRepository.findAllByIsDelFalse();

    BigDecimal totalCommission = BigDecimal.ZERO;

    for (PaymentHistory ph : historyList) {
      BigDecimal feeRate = ph.getFeeRate(); // % 값 (예: 30%)
      BigDecimal netAmount = BigDecimal.valueOf(ph.getAmount());

      // 수수료 수익 = 정산금액 * (feeRate / (100 - feeRate))
      BigDecimal commission = netAmount.multiply(feeRate)
        .divide(BigDecimal.valueOf(100).subtract(feeRate), 2, RoundingMode.HALF_UP);

      totalCommission = totalCommission.add(commission);
    }

    return totalCommission;
  }

  public BigDecimal calculateExpectedSettlementAmount() {
    List<PaymentHistory> list = paymentHistoryRepository.findByAmountGreaterThanAndIsDelFalse(BigDecimal.valueOf(0));

    return list.stream()
      .map(ph -> BigDecimal.valueOf(ph.getAmount()))
      .reduce(BigDecimal.ZERO, BigDecimal::add);
  }

  public int calculateExpectedSettlementCount() {
    return paymentHistoryRepository.findByAmountGreaterThanAndIsDelFalse(BigDecimal.valueOf(0)).size();
  }

  public BigDecimal calculateAverageCoursePrice() {
    List<Course> activeCourses = courseRepository.findByStatusAndIsDelFalse(Course.CourseStatus.ACTIVE);
    if (activeCourses.isEmpty()) return BigDecimal.ZERO;

    BigDecimal total = activeCourses.stream()
      .map(course -> BigDecimal.valueOf(course.getPrice()))
      .reduce(BigDecimal.ZERO, BigDecimal::add);

    return total.divide(BigDecimal.valueOf(activeCourses.size()), 2, RoundingMode.HALF_UP);
  }

  public BigDecimal calculateAveragePurchaseAmount() {
    List<Payment> validPayments = paymentRepository.findByStatus(0);
    if (validPayments.isEmpty()) return BigDecimal.ZERO;

    BigDecimal total = validPayments.stream()
      .map(p -> BigDecimal.valueOf(p.getPrice()))
      .reduce(BigDecimal.ZERO, BigDecimal::add);

    return total.divide(BigDecimal.valueOf(validPayments.size()), 2, RoundingMode.HALF_UP);
  }

  public double calculateRefundRate() {
    List<Payment> payments = paymentRepository.findAll();
    if (payments.isEmpty()) return 0.0;

    long refundedCount = payments.stream()
      .filter(p -> p.getStatus() != 0)
      .count();

    double rate = (double) refundedCount / payments.size() * 100;
    return Math.round(rate * 10) / 10.0;  // 소수점 1자리로 반올림
  }


  public double calculateRepurchaseRate() {
    List<Payment> payments = paymentRepository.findAll();
    if (payments.isEmpty()) return 0.0;

    Map<Long, Long> purchaseCountByUser = payments.stream()
      .collect(Collectors.groupingBy(
        p -> p.getUser().getId(),
        Collectors.counting()
      ));

    long repeatBuyers = purchaseCountByUser.values().stream()
      .filter(count -> count > 1)
      .count();

    long uniqueUsers = purchaseCountByUser.size();

    double rate = (double) repeatBuyers / uniqueUsers * 100;
    return Math.round(rate * 10) / 10.0;  // 소수점 1자리로 반올림
  }

  public List<PaymentDTO> getPaymentData() {
    List<Payment> payments = paymentRepository.findAll(); // 전체 결제 목록 조회

    return payments.stream()
      .map(payment -> new PaymentDTO(
        payment.getId().toString(),
        payment.getUser().getNickname(), // 또는 사용자 이름 필드
        payment.getUser().getEmail(),
        payment.getCourse() != null ? payment.getCourse().getSubject() : "알 수 없음",
        BigDecimal.valueOf(payment.getPrice()),
        payment.getStatus() != 0 ? "refunded" : "completed",
        payment.getRegDate(),
        payment.getPaymentMethod()
      ))
      .collect(Collectors.toList());
  }

  public List<SettlementDTO> getSettlementData() {
    List<Instructor> instructors = instructorRepository.findAll();

    return instructors.stream()
      .map(instructor -> {
        List<PaymentHistory> histories = paymentHistoryRepository.findByInstructorId(instructor.getId());

        int courseCount = (int) histories.stream()
          .map(h -> h.getPayment().getCourse())
          .distinct()
          .count();

        BigDecimal totalSales = histories.stream()
          .map(h -> {
            BigDecimal rate = h.getFeeRate().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP); // 수수료율
            return BigDecimal.valueOf(h.getAmount())
              .divide(BigDecimal.ONE.subtract(rate), 2, RoundingMode.HALF_UP);
          })
          .reduce(BigDecimal.ZERO, BigDecimal::add);


        BigDecimal commission = totalSales.multiply(
          histories.isEmpty() ?
            BigDecimal.ZERO :
            histories.get(0).getFeeRate().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
        );

        BigDecimal amount = histories.stream()
          .map(h -> BigDecimal.valueOf(h.getAmount()))
          .reduce(BigDecimal.ZERO, BigDecimal::add);

        String settlementStatus = histories.stream()
          .anyMatch(h -> !h.isDel()) ? "completed" : "pending";

        LocalDate date = histories.stream()
          .map(h -> h.getRegDate().toLocalDate())
          .max(LocalDate::compareTo)
          .orElse(LocalDate.now());

        return new SettlementDTO(
          instructor.getId().toString(),
          instructor.getUser().getNickname(),
          instructor.getUser().getEmail(),
          courseCount,
          totalSales,
          commission,
          amount,
          settlementStatus, // 정산 상태 (추후 상태 관리 로직 연결 가능)
          date
        );
      })
      .collect(Collectors.toList());
  }


  public DashboardDTO getSalesDashboard() {
    // 전체 매출
    BigDecimal totalRevenue = BigDecimal.valueOf(calculateTotalRevenue());

    // 월별 매출 (최근 6개월)
    List<MonthlyRevenueDTO> monthlyRevenueList = calculateMonthlyRevenue();
    MonthlyRevenueDTO lastMonth = monthlyRevenueList.get(monthlyRevenueList.size() - 2); // 전월
    MonthlyRevenueDTO thisMonth = monthlyRevenueList.get(monthlyRevenueList.size() - 1); // 이번달
    BigDecimal currentMonthRevenue = thisMonth.getRevenue();

    double currentMonthGrowth = 0.0;

// lastMonth.getRevenue()가 0일 때, currentMonthRevenue 와 비교하여 적절한 값을 설정
    if (lastMonth.getRevenue().compareTo(BigDecimal.ZERO) != 0) {
      // lastMonth.getRevenue()가 0이 아닐 경우, 변화율 계산
      currentMonthGrowth = (currentMonthRevenue.subtract(lastMonth.getRevenue()))
        .divide(lastMonth.getRevenue(), 4, RoundingMode.HALF_UP)
        .multiply(BigDecimal.valueOf(100))
        .doubleValue();
    } else if (currentMonthRevenue.compareTo(BigDecimal.ZERO) == 0) {
      // lastMonth.getRevenue()가 0이고, currentMonthRevenue 도 0이면 변화율은 0으로 설정
      currentMonthGrowth = 0.0;
    } else {
      // lastMonth.getRevenue()가 0이고, currentMonthRevenue 가 0이 아니면 변화율은 100으로 설정
      currentMonthGrowth = 100.0;
    }

    currentMonthGrowth = Math.round(currentMonthGrowth * 10) / 10.0; // 소수 첫째 자리로 반올림


    // ✅ 전월 대비 이번달 매출 증가율 계산
    double totalRevenueGrowthRate = 0.0;

    if (lastMonth.getRevenue().compareTo(BigDecimal.ZERO) != 0) {
      totalRevenueGrowthRate = (currentMonthRevenue.subtract(lastMonth.getRevenue()))
        .divide(lastMonth.getRevenue(), 4, RoundingMode.HALF_UP)
        .multiply(BigDecimal.valueOf(100))
        .doubleValue();
    } else if (currentMonthRevenue.compareTo(BigDecimal.ZERO) == 0) {
      totalRevenueGrowthRate = 0.0; // 0에서 0으로 변했을 경우
    } else {
      totalRevenueGrowthRate = 100.0; // lastMonth.getRevenue()가 0이고 currentMonthRevenue 가 0이 아닌 경우
    }

    totalRevenueGrowthRate = Math.round(totalRevenueGrowthRate * 10) / 10.0;


    // 수수료 수익 예시 (총 매출의 10%로 가정)
    BigDecimal commissionRevenue = calculateCommissionRevenue();
    double commissionGrowth = currentMonthGrowth; // 수수료 수익 증가율은 매출 증가율과 동일하다고 가정

    // 정산 예시 (임의 값)
    BigDecimal expectedSettlementAmount = calculateExpectedSettlementAmount(); // 예: 정산 예정 금액
    int expectedSettlementCount = calculateExpectedSettlementCount();

    // 통계 지표 예시
    BigDecimal averageCoursePrice = calculateAverageCoursePrice(); // 강의 평균 가격
    BigDecimal averagePurchaseAmount = calculateAveragePurchaseAmount(); // 1인당 평균 구매 금액
    double repurchaseRate = calculateRepurchaseRate();

    double refundRate = calculateRefundRate();

    // 카테고리 매출 데이터, 결제 데이터, 정산 데이터 → 여기선 빈 리스트 또는 서비스에서 추후 구현
    List<CategoryRevenueDTO> categoryRevenueData;
    List<Object[]> results = courseEnrollmentRepository.findPopularCategoriesRaw();
    categoryRevenueData = results.stream()
      .map(row -> CategoryRevenueDTO.builder()
        .name((String) row[0])
        .value((BigDecimal) row[1])
        .build())
      .collect(Collectors.toList());
    List<PaymentDTO> paymentData = getPaymentData();
    List<SettlementDTO> settlementData = getSettlementData();

    return new DashboardDTO(
      totalRevenue,
      totalRevenueGrowthRate, // 전체 매출 증가율 예시
      currentMonthRevenue,
      currentMonthGrowth,
      expectedSettlementAmount,
      expectedSettlementCount,
      commissionRevenue,
      commissionGrowth,
      averageCoursePrice,
      averagePurchaseAmount,
      repurchaseRate,
      refundRate,
      monthlyRevenueList,
      categoryRevenueData,
      paymentData,
      settlementData
    );
  }


  public boolean deactivateCourse(Long courseId, String reason, String adminId) {
    Course course = courseRepository.findById(courseId)
      .orElseThrow(() -> new IllegalArgumentException("해당 강의가 존재하지 않습니다."));

    // 1. 강의 정지 처리
    course.setStatus(Course.CourseStatus.CLOSED); // 정지 처리
    course.setDel(true); // 삭제 처리

    // 2. 관리자 정보 조회
    Admin admin = adminRepository.findById(Long.parseLong(adminId))
      .orElseThrow(() -> new IllegalArgumentException("해당 관리자가 존재하지 않습니다."));

    // 3. 알림 생성 및 저장 (강사에게)
    Notification notification = new Notification();
    notification.setUser(course.getInstructor().getUser()); // 강사의 User 엔티티
    notification.setTitle("강의 비활성화 알림");
    notification.setMessage("강의 '" + course.getSubject() + "' 이(가) 다음과 같은 사유로 비활성화되었습니다: " + reason);
    notification.setNotificationType(Notification.NotificationType.WARNING);
    notification.setCreatedAt(LocalDateTime.now());

    // 4. AdminLog 생성 및 저장
    AdminLog log = new AdminLog();
    log.setAdmin(admin);
    log.setUser(course.getInstructor().getUser());
    log.setActivityType("COURSE_DEACTIVATE");
    log.setDescription("사유: " + reason);
    log.setCreatedAt(LocalDateTime.now());

    courseRepository.save(course);
    adminLogRepository.save(log);
    notificationRepository.save(notification); // ⭐ 알림 저장 추가

    return true;
  }

  public boolean reviewCourse(CourseReviewRequest request, String adminId) {
    Course course = courseRepository.findById(request.getCourseId())
      .orElseThrow(() -> new IllegalArgumentException("해당 강의가 존재하지 않습니다."));

    Admin admin = adminRepository.findById(Long.parseLong(adminId))
      .orElseThrow(() -> new IllegalArgumentException("해당 관리자가 존재하지 않습니다."));

    // 강의 상태 처리
    String action = request.getAction();
    if ("approve".equalsIgnoreCase(action)) {
      course.setStatus(Course.CourseStatus.ACTIVE);
    } else if ("reject".equalsIgnoreCase(action)) {
      course.setStatus(Course.CourseStatus.REJECT);
    } else {
      throw new IllegalArgumentException("올바르지 않은 작업 요청입니다. (approve 또는 reject)");
    }

    // 알림 메시지 구성
    String title = "강의 " + ("approve".equalsIgnoreCase(action) ? "승인 완료" : "거부 알림");
    String message = "강의 '" + course.getSubject() + "' 이(가) "
      + ("approve".equalsIgnoreCase(action) ? "승인되었습니다." : "거부되었습니다. 사유: " + request.getFeedback());

    // 알림 생성
    Notification notification = new Notification();
    notification.setUser(course.getInstructor().getUser());
    notification.setTitle(title);
    notification.setMessage(message);
    notification.setNotificationType(
      "approve".equalsIgnoreCase(action) ? Notification.NotificationType.INFO : Notification.NotificationType.WARNING
    );
    notification.setCreatedAt(LocalDateTime.now());

    // 관리자 로그 생성
    AdminLog log = new AdminLog();
    log.setAdmin(admin);
    log.setUser(course.getInstructor().getUser());
    log.setActivityType("COURSE_REVIEW_" + action.toUpperCase());
    log.setDescription("강의 리뷰 처리: " + action + ", 사유: " + request.getFeedback());
    log.setCreatedAt(LocalDateTime.now());

    courseRepository.save(course);
    notificationRepository.save(notification);
    adminLogRepository.save(log);

    return true;
  }

  public List<AdminCouponDTO> getAllCoupons() {
    List<Coupon> coupons = couponRepository.findAll();

    return coupons.stream()
      .map(coupon -> AdminCouponDTO.builder()
        .id(coupon.getId())
        .code(coupon.getCode())
        .name(coupon.getName())
        .value(coupon.getDiscount())
        .courseId(coupon.getCourse() != null ? coupon.getCourse().getId().toString() : null)
        .courseName(coupon.getCourse() != null ? coupon.getCourse().getSubject() : null)
        .expiryDate(coupon.getExpiryDate().toLocalDate())
        .status(coupon.getExpiryDate().isBefore(LocalDateTime.now()) ? "expired" : "active")
        .createdAt(coupon.getRegDate().toLocalDate())
        .build())
      .collect(Collectors.toList());
  }

  public List<AdminUserCouponDTO> getAllUsersForCoupon() {
    return userRepository.findAll().stream()
      .map(user -> new AdminUserCouponDTO(
        String.valueOf(user.getId()),
        user.getNickname(),
        user.getEmail(),
        user.getIsInstructor() ? "instructor" : "student",
        user.getIsDel() ? "inactive" : "active"
      ))
      .collect(Collectors.toList());
  }
  
  public AdminCouponInfoDTO getAdminCouponInfo() {
    List<AdminCouponDTO> couponList = getAllCoupons();
    List<AdminUserCouponDTO> userCouponList = getAllUsersForCoupon();

    AdminCouponInfoDTO adminCouponInfoDTO = new AdminCouponInfoDTO();

    adminCouponInfoDTO.setCoupons(couponList);
    adminCouponInfoDTO.setUserCoupons(userCouponList);

    return adminCouponInfoDTO;
  }


}
