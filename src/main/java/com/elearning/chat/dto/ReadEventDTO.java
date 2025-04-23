package com.elearning.chat.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReadEventDTO {

  Long roomId;
  Long userId;
  List<Long> messageIds;
}
