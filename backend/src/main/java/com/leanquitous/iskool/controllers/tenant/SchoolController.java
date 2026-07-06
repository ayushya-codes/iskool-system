package com.leanquitous.iskool.controllers.tenant;

import com.leanquitous.iskool.dto.tenant.CreateSchoolRequest;
import com.leanquitous.iskool.dto.tenant.SchoolResponse;
import com.leanquitous.iskool.dto.tenant.UpdateSchoolRequest;
import com.leanquitous.iskool.services.tenant.SchoolService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schools")
@RequiredArgsConstructor
public class SchoolController {

    private final SchoolService schoolService;

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<SchoolResponse> create(@Valid @RequestBody CreateSchoolRequest request) {
        return ResponseEntity.ok(schoolService.create(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<SchoolResponse>> getAll() {
        return ResponseEntity.ok(schoolService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<SchoolResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(schoolService.getById(id));
    }

    @GetMapping("/subdomain/{subdomain}")
    public ResponseEntity<SchoolResponse> getBySubdomain(@PathVariable String subdomain) {
        return ResponseEntity.ok(schoolService.getBySubdomain(subdomain));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<SchoolResponse> update(@PathVariable Long id,
                                                 @Valid @RequestBody UpdateSchoolRequest request) {
        return ResponseEntity.ok(schoolService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        schoolService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
