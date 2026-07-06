package com.leanquitous.iskool.dto.tenant;

import com.leanquitous.iskool.entity.tenant.School;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateSchoolRequest {

    @NotBlank(message = "School name is required")
    private String name;

    private String logoUrl;

    @NotBlank(message = "Subdomain is required")
    private String subdomain;

    private String primaryColor;
    private String secondaryColor;
    private String affiliationId;
    private String address;

    @Email(message = "Invalid contact email")
    private String contactEmail;

    private String contactPhone;

    public School toEntity() {
        return School.builder()
                .name(name)
                .logoUrl(logoUrl)
                .subdomain(subdomain.toLowerCase())
                .primaryColor(primaryColor)
                .secondaryColor(secondaryColor)
                .affiliationId(affiliationId)
                .address(address)
                .contactEmail(contactEmail)
                .contactPhone(contactPhone)
                .build();
    }
}
