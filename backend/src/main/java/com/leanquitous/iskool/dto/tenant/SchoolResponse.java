package com.leanquitous.iskool.dto.tenant;

import com.leanquitous.iskool.entity.tenant.School;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class SchoolResponse {

    private Long id;
    private String name;
    private String logoUrl;
    private String subdomain;
    private String primaryColor;
    private String secondaryColor;
    private String affiliationId;
    private String address;
    private String contactEmail;
    private String contactPhone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static SchoolResponse from(School school) {
        return SchoolResponse.builder()
                .id(school.getId())
                .name(school.getName())
                .logoUrl(school.getLogoUrl())
                .subdomain(school.getSubdomain())
                .primaryColor(school.getPrimaryColor())
                .secondaryColor(school.getSecondaryColor())
                .affiliationId(school.getAffiliationId())
                .address(school.getAddress())
                .contactEmail(school.getContactEmail())
                .contactPhone(school.getContactPhone())
                .createdAt(school.getCreatedAt())
                .updatedAt(school.getUpdatedAt())
                .build();
    }
}
