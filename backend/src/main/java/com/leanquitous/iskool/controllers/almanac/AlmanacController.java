package com.leanquitous.iskool.controllers.almanac;

import com.leanquitous.iskool.dto.almanac.AlmanacDtos.*;
import com.leanquitous.iskool.services.almanac.AlmanacService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/almanac")
@RequiredArgsConstructor
public class AlmanacController {

    private final AlmanacService almanacService;

    @PostMapping("/remarks")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<RemarkResponse> addRemark(@RequestBody RemarkRequest req) {
        return ResponseEntity.ok(almanacService.addRemark(req));
    }

    @GetMapping("/remarks/student/{studentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY', 'PARENT')")
    public ResponseEntity<List<RemarkResponse>> getRemarksByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(almanacService.getRemarksByStudent(studentId));
    }

    @PostMapping("/prayers")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<PrayerResponse> createPrayer(@RequestBody PrayerRequest req) {
        return ResponseEntity.ok(almanacService.createPrayer(req));
    }

    @GetMapping("/prayers")
    public ResponseEntity<List<PrayerResponse>> getAllPrayers() {
        return ResponseEntity.ok(almanacService.getAllPrayers());
    }

    @DeleteMapping("/prayers/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deletePrayer(@PathVariable Long id) {
        almanacService.deletePrayer(id);
        return ResponseEntity.noContent().build();
    }
}
