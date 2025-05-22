package com.elearning.course.dto;

import com.elearning.course.entity.LectureVideo;
import lombok.Data;

@Data
public class LectureResponseDTO {
    private String title;
    private String videoUrl;
    private int duration;
    private int seq;
    private boolean free;

    public LectureResponseDTO(LectureVideo lecture) {
        this.title = lecture.getTitle();
        this.videoUrl = lecture.getVideoUrl();
        this.duration = lecture.getDuration();
        this.seq = lecture.getSeq();
        this.free = lecture.isFree();
    }
}