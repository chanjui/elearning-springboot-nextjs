package com.elearning.user.service.Home;

import com.elearning.common.entity.LikeTable;
import com.elearning.common.repository.LikeTableRepository;
import com.elearning.instructor.repository.InstructorRepository;
import com.elearning.user.dto.FollowDTO;
import com.elearning.user.dto.Home.UserHomePostDTO;
import com.elearning.user.dto.Home.UserHomeProfileDTO;
import com.elearning.user.entity.User;
import com.elearning.user.repository.UserHomeRepository;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserHomeService {

  private final UserHomeRepository userHomeRepository;
  private final UserRepository userRepository;
  private final LikeTableRepository likeTableRepository;
  private final InstructorRepository instructorRepository;

  // 사용자 프로필 정보 조회
  public UserHomeProfileDTO getUserProfile(Long userId) {
    return userHomeRepository.findUserProfile(userId);
  }

  // 사용자가 작성한 '질문 및 답변' 게시글 조회
  public List<UserHomePostDTO> getUserPosts(Long userId) {
    return userHomeRepository.findUserPosts(userId);
  }

  // 사용자의 팔로워 수 조회
  public int getFollowerCount(Long userId) {
    Long count = likeTableRepository.countByTargetUserIdAndType(userId, 2);
    return count != null ? count.intValue() : 0;
  }

  // 로그인 사용자가 특정 사용자를 팔로우하고 있는지 조회
  public boolean isFollowing(Long loginUserId, Long targetUserId) {
    return likeTableRepository.existsByUserIdAndTargetUserIdAndType(loginUserId, targetUserId, 2);
  }

  // 팔로우 상태 + 팔로워 수 함께 조회
  public FollowDTO getFollowInfo(Long loginUserId, Long targetUserId) {
    boolean isFollowing = userHomeRepository.isFollowing(loginUserId, targetUserId);
    int followerCount = userHomeRepository.countFollowers(targetUserId);
    return new FollowDTO(targetUserId, isFollowing, followerCount);
  }

  // 팔로우 추가
  @Transactional
  public void addFollow(Long loginUserId, Long targetUserId) {
    User fromUser = userRepository.findById(loginUserId)
      .orElseThrow(() -> new IllegalArgumentException("로그인 사용자 정보가 존재하지 않습니다."));
    User targetUser = userRepository.findById(targetUserId)
      .orElseThrow(() -> new IllegalArgumentException("팔로우 대상 사용자 정보가 존재하지 않습니다."));

    LikeTable follow = new LikeTable();
    follow.setUser(fromUser);
    follow.setTargetUser(targetUser);
    follow.setType(2); // 2 = 사용자 팔로우 타입

    likeTableRepository.save(follow);
  }

  // 팔로우 취소
  @Transactional
  public void cancelFollow(Long loginUserId, Long targetUserId) {
    likeTableRepository.deleteByUserIdAndTargetUserIdAndType(loginUserId, targetUserId, 2);
  }

  // 사용자 소개글(bio) 수정
  @Transactional
  public void updateBio(Long userId, String bio) {
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new IllegalArgumentException("사용자 정보가 존재하지 않습니다."));
    user.setBio(bio);
    userRepository.save(user);
  }

  // 특정 userId에 해당하는 사용자가 강사로 등록되어 있는지 확인
  public boolean checkInstructorStatus(Long userId) {
    return instructorRepository.findByUserId(userId).isPresent();
  }
}
