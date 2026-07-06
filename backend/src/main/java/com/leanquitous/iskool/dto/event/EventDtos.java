package com.leanquitous.iskool.dto.event;

import com.leanquitous.iskool.entity.event.SchoolEvent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

public class EventDtos {

    @Data
    @Builder
    @AllArgsConstructor
    public static class EventResponse {
        private Long id;
        private String name;
        private String description;
        private LocalDate eventDate;
        private LocalDate endDate;
        private SchoolEvent.EventType eventType;
        private String venue;
        private Integer targetClassLevel;
        private Long targetDivisionId;
        private Long managedByUserId;

        public static EventResponse from(SchoolEvent e) {
            return EventResponse.builder()
                    .id(e.getId())
                    .name(e.getName())
                    .description(e.getDescription())
                    .eventDate(e.getEventDate())
                    .endDate(e.getEndDate())
                    .eventType(e.getEventType())
                    .venue(e.getVenue())
                    .targetClassLevel(e.getTargetClassLevel())
                    .targetDivisionId(e.getTargetDivisionId())
                    .managedByUserId(e.getManagedByUserId())
                    .build();
        }
    }

    @Data
    public static class EventRequest {
        private String name;
        private String description;
        private LocalDate eventDate;
        private LocalDate endDate;
        private SchoolEvent.EventType eventType;
        private String venue;
        private Integer targetClassLevel;
        private Long targetDivisionId;
        private Long managedByUserId;
    }
}
