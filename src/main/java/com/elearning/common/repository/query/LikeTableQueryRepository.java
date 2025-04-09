package com.elearning.common.repository.query;

public interface LikeTableQueryRepository{

  boolean isFollowing(Long userId, Long instructorId);
}
