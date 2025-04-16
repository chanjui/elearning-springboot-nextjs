package com.elearning.user.controller;

import com.elearning.common.ResultData;
import com.elearning.user.dto.Payment.PaymentDetailDTO;
import com.elearning.user.dto.Payment.PurchaseHistoryDTO;
import com.elearning.user.service.Payment.PurchaseHistoryService;
import com.siot.IamportRestClient.exception.IamportResponseException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class PurchaseController {

  private final PurchaseHistoryService purchaseHistoryService;

  // 구매 내역을 조회
  @GetMapping("/api/purchases")
  public List<PurchaseHistoryDTO> getPurchaseHistory(@RequestParam Long userId) {
    return purchaseHistoryService.getPurchaseHistory(userId);
  }

  // 구매 내역 -> 상세 내역 조회
  @GetMapping("/api/purchases/{impUid}")
  public ResultData<List<PaymentDetailDTO>> getPurchaseDetail(@PathVariable String impUid) throws IamportResponseException, IOException {
    List<PaymentDetailDTO> details = purchaseHistoryService.getPaymentDetailByImpUid(impUid);
    return ResultData.of(1, "success", details);
  }
}
