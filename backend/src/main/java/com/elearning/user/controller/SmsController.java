package com.elearning.user.controller;


import com.elearning.common.ResultData;
import com.elearning.user.dto.FindIDPW.PhoneAuthDTO;
import com.elearning.user.dto.FindIDPW.SmsRequestDTO;
import com.elearning.user.service.FindIDPW.FindIdService;
import com.elearning.user.service.FindIDPW.SmsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class SmsController {

  private final SmsService smsService;
  private final FindIdService findIdService;

  @PostMapping("/send-sms")
  public ResultData<String> sendSms(@RequestBody SmsRequestDTO requestDTO) {
    smsService.sendMessage(requestDTO.getTo(), requestDTO.getContent());
    return ResultData.of(1, "문자 발송 성공");
  }

  // 인증번호 발송
  @PostMapping("/send-auth-code")
  public ResultData<String> sendAuthCode(@RequestParam String phone) {
    findIdService.sendAuthCode(phone);
    return ResultData.of(1, "인증번호 발송 성공");
  }

  // 인증번호 검증 후 아이디(이메일) 반환
  @PostMapping("/verify-auth-code")
  public ResultData<String> verifyAuthCode(@RequestBody PhoneAuthDTO requestDTO) {
    String email = findIdService.verifyAuthCode(requestDTO.getPhone(), requestDTO.getAuthCode());
    return ResultData.of(1, "아이디(이메일) 조회 성공", email);
  }
}
