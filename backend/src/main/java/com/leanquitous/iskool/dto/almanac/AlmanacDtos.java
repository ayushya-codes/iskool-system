package com.leanquitous.iskool.dto.almanac;

import com.leanquitous.iskool.entity.almanac.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

public class AlmanacDtos {

    // ── AlmanacRemark ──
    @Data @Builder @AllArgsConstructor
    public static class RemarkResponse {
        private Long id; private Long studentId; private String remark; private LocalDate remarkDate; private Long remarkedByUserId;
        public static RemarkResponse from(AlmanacRemark r) {
            return RemarkResponse.builder().id(r.getId()).studentId(r.getStudentId()).remark(r.getRemark())
                    .remarkDate(r.getRemarkDate()).remarkedByUserId(r.getRemarkedByUserId()).build();
        }
    }
    @Data
    public static class RemarkRequest {
        private Long studentId; private String remark; private LocalDate remarkDate; private Long remarkedByUserId;
    }

    // ── Prayer ──
    @Data @Builder @AllArgsConstructor
    public static class PrayerResponse {
        private Long id; private String title; private String language; private String textContent; private String audioUrl;
        public static PrayerResponse from(Prayer p) {
            return PrayerResponse.builder().id(p.getId()).title(p.getTitle()).language(p.getLanguage())
                    .textContent(p.getTextContent()).audioUrl(p.getAudioUrl()).build();
        }
    }
    @Data
    public static class PrayerRequest {
        private String title; private String language; private String textContent; private String audioUrl;
    }
}
