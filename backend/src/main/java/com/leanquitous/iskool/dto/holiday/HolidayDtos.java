package com.leanquitous.iskool.dto.holiday;

import com.leanquitous.iskool.entity.holiday.Holiday;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

public class HolidayDtos {

    @Data
    @Builder
    @AllArgsConstructor
    public static class HolidayResponse {
        private Long id;
        private String name;
        private LocalDate holidayDate;
        private Holiday.HolidayType type;
        private String description;

        public static HolidayResponse from(Holiday h) {
            return HolidayResponse.builder()
                    .id(h.getId())
                    .name(h.getName())
                    .holidayDate(h.getHolidayDate())
                    .type(h.getType())
                    .description(h.getDescription())
                    .build();
        }
    }

    @Data
    public static class HolidayRequest {
        private String name;
        private LocalDate holidayDate;
        private Holiday.HolidayType type;
        private String description;
    }

    @Data
    public static class HolidayBulkRequest {
        private List<HolidayRequest> holidays;
    }
}
