package com.leanquitous.iskool.services.holiday;

import com.leanquitous.iskool.dto.holiday.HolidayDtos.*;
import com.leanquitous.iskool.entity.holiday.Holiday;
import com.leanquitous.iskool.repositories.holiday.HolidayRepository;
import com.leanquitous.iskool.tenant.TenantContext;
import com.leanquitous.iskool.tenant.TenantValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HolidayService {

    private final HolidayRepository holidayRepo;

    public HolidayResponse create(HolidayRequest req) {
        Holiday holiday = Holiday.builder()
                .name(req.getName())
                .holidayDate(req.getHolidayDate())
                .type(req.getType())
                .description(req.getDescription())
                .schoolId(TenantContext.getCurrentTenant())
                .build();
        return HolidayResponse.from(holidayRepo.save(holiday));
    }

    public List<HolidayResponse> bulkCreate(HolidayBulkRequest req) {
        Long schoolId = TenantContext.getCurrentTenant();
        List<Holiday> holidays = req.getHolidays().stream()
                .<Holiday>map(h -> Holiday.builder()
                        .name(h.getName())
                        .holidayDate(h.getHolidayDate())
                        .type(h.getType())
                        .description(h.getDescription())
                        .schoolId(schoolId)
                        .build())
                .toList();
        return holidayRepo.saveAll(holidays).stream().map(HolidayResponse::from).toList();
    }

    public List<HolidayResponse> getAll() {
        return holidayRepo.findBySchoolIdOrderByHolidayDateAsc(TenantContext.getCurrentTenant())
                .stream().map(HolidayResponse::from).toList();
    }

    public List<HolidayResponse> getByDateRange(LocalDate start, LocalDate end) {
        return holidayRepo.findBySchoolIdAndHolidayDateBetween(TenantContext.getCurrentTenant(), start, end)
                .stream().map(HolidayResponse::from).toList();
    }

    public void delete(Long id) {
        Holiday holiday = holidayRepo.findById(id).orElseThrow(() -> new RuntimeException("Holiday not found"));
        TenantValidator.validateOwnership(holiday.getSchoolId());
        holidayRepo.delete(holiday);
    }
}
