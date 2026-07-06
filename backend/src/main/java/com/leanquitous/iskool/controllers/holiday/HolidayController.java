package com.leanquitous.iskool.controllers.holiday;

import com.leanquitous.iskool.dto.holiday.HolidayDtos.*;
import com.leanquitous.iskool.services.holiday.HolidayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/holidays")
@RequiredArgsConstructor
public class HolidayController {

    private final HolidayService holidayService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SUPERVISOR')")
    public ResponseEntity<HolidayResponse> create(@RequestBody HolidayRequest req) {
        return ResponseEntity.ok(holidayService.create(req));
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SUPERVISOR')")
    public ResponseEntity<List<HolidayResponse>> bulkCreate(@RequestBody HolidayBulkRequest req) {
        return ResponseEntity.ok(holidayService.bulkCreate(req));
    }

    @GetMapping
    public ResponseEntity<List<HolidayResponse>> getAll(
            @RequestParam(required = false) LocalDate start,
            @RequestParam(required = false) LocalDate end) {
        if (start != null && end != null) {
            return ResponseEntity.ok(holidayService.getByDateRange(start, end));
        }
        return ResponseEntity.ok(holidayService.getAll());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        holidayService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
