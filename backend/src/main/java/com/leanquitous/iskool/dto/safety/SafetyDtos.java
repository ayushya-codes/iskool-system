package com.leanquitous.iskool.dto.safety;

import com.leanquitous.iskool.entity.safety.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

public class SafetyDtos {

    // ── GatePass ──
    @Data @Builder @AllArgsConstructor
    public static class GatePassResponse {
        private Long id; private Long studentId; private String studentName; private String passCode; private LocalDate validDate; private Boolean isUsed;
        private String pickupPersonName; private String pickupPersonPhone; private String relationship; private String reason;
        private String qrCodeBase64;
        private String studentPhotoUrl; private LocalDate studentDateOfBirth; private String studentGender;
        public static GatePassResponse from(GatePass g) {
            return GatePassResponse.builder().id(g.getId()).studentId(g.getStudentId()).passCode(g.getPassCode())
                    .validDate(g.getValidDate()).isUsed(g.getIsUsed())
                    .pickupPersonName(g.getPickupPersonName()).pickupPersonPhone(g.getPickupPersonPhone())
                    .relationship(g.getRelationship()).reason(g.getReason()).build();
        }
    }
    @Data
    public static class GatePassRequest {
        private Long studentId; private LocalDate validDate;
        private String pickupPersonName; private String pickupPersonPhone; private String relationship; private String reason;
        private Long createdByUserId;
    }

    // ── ProxyPickup ──
    @Data @Builder @AllArgsConstructor
    public static class ProxyPickupResponse {
        private Long id; private Long studentId; private String pickupPersonName;
        private String pickupPersonPhotoUrl; private LocalDate validDate;
        public static ProxyPickupResponse from(ProxyPickup p) {
            return ProxyPickupResponse.builder().id(p.getId()).studentId(p.getStudentId()).pickupPersonName(p.getPickupPersonName())
                    .pickupPersonPhotoUrl(p.getPickupPersonPhotoUrl()).validDate(p.getValidDate()).build();
        }
    }
    @Data
    public static class ProxyPickupRequest {
        private Long studentId; private String pickupPersonName; private String pickupPersonPhotoUrl; private LocalDate validDate;
    }
}
