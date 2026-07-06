package com.leanquitous.iskool.services.tenant;

import com.leanquitous.iskool.dto.tenant.CreateSchoolRequest;
import com.leanquitous.iskool.dto.tenant.SchoolResponse;
import com.leanquitous.iskool.dto.tenant.UpdateSchoolRequest;
import com.leanquitous.iskool.entity.tenant.School;
import com.leanquitous.iskool.repositories.tenant.SchoolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SchoolService {

    private final SchoolRepository schoolRepository;

    public SchoolResponse create(CreateSchoolRequest request) {
        if (schoolRepository.existsBySubdomain(request.getSubdomain())) {
            throw new RuntimeException("Subdomain already taken");
        }
        School school = request.toEntity();
        school = schoolRepository.save(school);
        return SchoolResponse.from(school);
    }

    public SchoolResponse getById(Long id) {
        School school = schoolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("School not found"));
        return SchoolResponse.from(school);
    }

    public SchoolResponse getBySubdomain(String subdomain) {
        School school = schoolRepository.findBySubdomain(subdomain.toLowerCase())
                .orElseThrow(() -> new RuntimeException("School not found for subdomain: " + subdomain));
        return SchoolResponse.from(school);
    }

    public List<SchoolResponse> getAll() {
        return schoolRepository.findAll().stream()
                .map(SchoolResponse::from)
                .toList();
    }

    public SchoolResponse update(Long id, UpdateSchoolRequest request) {
        School school = schoolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("School not found"));
        applyUpdates(school, request);
        school = schoolRepository.save(school);
        return SchoolResponse.from(school);
    }

    public void delete(Long id) {
        if (!schoolRepository.existsById(id)) {
            throw new RuntimeException("School not found");
        }
        schoolRepository.deleteById(id);
    }

    public Long resolveSchoolIdBySubdomain(String subdomain) {
        return schoolRepository.findBySubdomain(subdomain.toLowerCase())
                .map(School::getId)
                .orElseThrow(() -> new RuntimeException("School not found for subdomain: " + subdomain));
    }

    private void applyUpdates(School school, UpdateSchoolRequest request) {
        if (request.getName() != null) school.setName(request.getName());
        if (request.getLogoUrl() != null) school.setLogoUrl(request.getLogoUrl());
        if (request.getPrimaryColor() != null) school.setPrimaryColor(request.getPrimaryColor());
        if (request.getSecondaryColor() != null) school.setSecondaryColor(request.getSecondaryColor());
        if (request.getAffiliationId() != null) school.setAffiliationId(request.getAffiliationId());
        if (request.getAddress() != null) school.setAddress(request.getAddress());
        if (request.getContactEmail() != null) school.setContactEmail(request.getContactEmail());
        if (request.getContactPhone() != null) school.setContactPhone(request.getContactPhone());
    }
}
