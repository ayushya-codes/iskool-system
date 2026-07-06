package com.leanquitous.iskool.dto.tenant;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateSchoolRequest {

    private String name;
    private String logoUrl;
    private String primaryColor;
    private String secondaryColor;
    private String affiliationId;
    private String address;

    @Email(message = "Invalid contact email")
    private String contactEmail;

    private String contactPhone;
}
