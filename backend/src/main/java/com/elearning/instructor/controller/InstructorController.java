package com.elearning.instructor.controller;

import com.elearning.common.ResultData;
import com.elearning.course.dto.CategoryDTO;
import com.elearning.course.repository.CategoryRepository;
import com.elearning.instructor.dto.ExpertiseDTO;
import com.elearning.instructor.dto.InstructorDTO;
import com.elearning.instructor.repository.ExpertiseRepository;
import com.elearning.instructor.service.InstructorService;
import com.elearning.user.entity.User;
import com.elearning.user.repository.UserRepository;
import com.elearning.common.config.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/instructor")
@RequiredArgsConstructor
public class InstructorController {

  private final InstructorService instructorService;
  private final JwtProvider jwtProvider;
  private final UserRepository userRepository;
  private final ExpertiseRepository expertiseRepository;
  private final CategoryRepository categoryRepository;

  // 강사 전환(가입)
  @PostMapping("/signup")
  public ResultData<Map<String, String>> signupInstructor(HttpServletRequest request, @RequestBody InstructorDTO dto) {
    Long userId = Long.valueOf(String.valueOf(request.getAttribute("userId")));

    User user = userRepository.findById(userId)
      .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    if (user.getIsInstructor()) {
      return ResultData.of(0, "이미 강사로 등록된 사용자입니다.");
    }

    InstructorDTO created = instructorService.createInstructor(userId, dto);

    Map<String, Object> claims = new HashMap<>();
    claims.put("id", user.getId());
    claims.put("email", user.getEmail());
    claims.put("nickname", user.getNickname());
    claims.put("isInstructor", true);

    String newAccessToken = jwtProvider.getAccessToken(claims);

    return ResultData.of(1, "강사 등록 완료", Map.of("accessToken", newAccessToken));
  }

  // 강사 가입 시 전문분야 조회
  @GetMapping("/meta/expertise")
  public ResultData<List<ExpertiseDTO>> getAllExpertise() {
    List<ExpertiseDTO> list = expertiseRepository.findAll().stream()
      .map(e -> new ExpertiseDTO(e.getId(), e.getName()))
      .collect(Collectors.toList());

    return ResultData.of(1, "전문 분야 조회 성공", list);
  }

  // 강사 가입 시 카테고리 조회
  @GetMapping("/meta/categories")
  public ResultData<List<CategoryDTO>> getAllCategories() {
    List<CategoryDTO> list = categoryRepository.findAll().stream()
      .map(c -> new CategoryDTO(c.getId(), c.getName()))
      .collect(Collectors.toList());

    return ResultData.of(1, "카테고리 조회 성공", list);
  }
}
