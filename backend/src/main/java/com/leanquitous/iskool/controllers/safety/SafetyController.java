package com.leanquitous.iskool.controllers.safety;

import com.leanquitous.iskool.dto.safety.SafetyDtos.*;
import com.leanquitous.iskool.services.safety.SafetyService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/safety")
@RequiredArgsConstructor
public class SafetyController {

    private final SafetyService safetyService;

    @PostMapping("/gate-passes")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<GatePassResponse> createGatePass(@RequestBody GatePassRequest req) {
        return ResponseEntity.ok(safetyService.createGatePass(req));
    }

    @PostMapping("/gate-passes/verify")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'GATE_KEEPER')")
    public ResponseEntity<GatePassResponse> verifyGatePass(@RequestParam String passCode,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate validDate) {
        return ResponseEntity.ok(safetyService.verifyGatePass(passCode, validDate));
    }

    @GetMapping("/gate-passes/student/{studentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'PARENT')")
    public ResponseEntity<List<GatePassResponse>> getGatePassesByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(safetyService.getGatePassesByStudent(studentId));
    }

    @PostMapping("/proxy-pickups")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'PARENT')")
    public ResponseEntity<ProxyPickupResponse> createProxyPickup(@RequestBody ProxyPickupRequest req) {
        return ResponseEntity.ok(safetyService.createProxyPickup(req));
    }

    @GetMapping("/proxy-pickups/date/{validDate}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<List<ProxyPickupResponse>> getProxyPickupsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate validDate) {
        return ResponseEntity.ok(safetyService.getProxyPickupsByDate(validDate));
    }

    @GetMapping("/proxy-pickups/student/{studentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'PARENT')")
    public ResponseEntity<List<ProxyPickupResponse>> getProxyPickupsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(safetyService.getProxyPickupsByStudent(studentId));
    }
}
