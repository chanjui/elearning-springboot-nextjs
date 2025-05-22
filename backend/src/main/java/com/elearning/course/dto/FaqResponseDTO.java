package com.elearning.course.dto;

import com.elearning.course.entity.CourseFaq;
import lombok.Data;

@Data
public class FaqResponseDTO {
    private String content;
    private String answer;
    private int visible;

    public FaqResponseDTO(CourseFaq faq) {
        this.content = faq.getContent();
        this.answer = faq.getAnswer();
        this.visible = faq.getVisible();
    }
}