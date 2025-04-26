package com.elearning.chat.service.inquiry;

import com.elearning.chat.dto.inquiry.AdminChatSessionDetailDTO;
import com.elearning.chat.dto.inquiry.AdminChatSessionListDTO;

import java.util.List;

public interface AdminInquiryRoomService {
  List<AdminChatSessionListDTO> listAllRooms();
  AdminChatSessionDetailDTO getRoomDetail(Long roomId);
  void closeRoom(Long roomId);
  // AdminInquiryRoomService.java
  List<AdminChatSessionListDTO> listAllRooms(String search);
}
