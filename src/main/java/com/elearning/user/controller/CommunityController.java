package com.elearning.user.controller;

import com.elearning.common.ResultData;
import com.elearning.course.dto.Community.CommunityBoardOneDTO;
import com.elearning.course.dto.Community.CommunityCommentRequestDTO;
import com.elearning.course.dto.Community.CommunityInfoDTO;
import com.elearning.course.service.Community.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {
  private final CommunityService communityService;
  private final String message = "success";

  @GetMapping
  public ResultData<CommunityInfoDTO> getCommunityBoard() {
    return ResultData.of(1, message, communityService.getCommunityInfo());
  }

  @PostMapping("/{boardId}/view")
  public ResultData<Boolean> incrementView(@PathVariable Long boardId) {
    return ResultData.of(1, message, communityService.incrementViewCount(boardId));
  }

  @GetMapping("/{boardId}")
  public ResultData<CommunityBoardOneDTO> getBoardDetail(@PathVariable Long boardId) {
    return ResultData.of(1, message, communityService.getBoardDetail(boardId));
  }

  @PostMapping("/{boardId}/addComments")
  public ResultData<Boolean> addComment(@PathVariable Long boardId, @RequestBody CommunityCommentRequestDTO requestDTO) {
    requestDTO.setBoardId(boardId);
    return ResultData.of(1, message, communityService.addComment(requestDTO));
  }

  @PostMapping("/{commentId}/editComments")
  public ResultData<Boolean> editComment(
    @PathVariable Long commentId,
    @RequestBody CommunityCommentRequestDTO requestDTO
  ) {
    return ResultData.of(1, message, communityService.editComment(commentId, requestDTO));
  }


}