package com.leanquitous.iskool.dto.safety;

import com.leanquitous.iskool.entity.safety.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

public class SafetyDtos {

    // ── GatePass ──
    @Data @Builder @AllArgsConstructor
    public static class GatePassResponse {
        private Long id; private Long studentId; private String passCode; private LocalDate validDate; private Boolean isUsed;
        public static GatePassResponse from(GatePass g) {
            return GatePassResponse.builder().id(g.getId()).studentId(g.getStudentId()).passCode(g.getPassCode())
                    .validDate(g.getValidDate()).isUsed(g.getIsUsed()).build();
        }
    }
    @Data
    public static class GatePassRequest {
        private Long studentId; private String passCode; private LocalDate validDate;
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
