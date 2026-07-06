package com.leanquitous.iskool.tenant;

public class TenantValidator {

    public static void validateOwnership(Long entitySchoolId) {
        Long currentTenant = TenantContext.getCurrentTenant();
        if (currentTenant != null && !currentTenant.equals(entitySchoolId)) {
            throw new RuntimeException("Access denied: resource does not belong to your school");
        }
    }

    public static void requireTenantContext() {
        if (TenantContext.getCurrentTenant() == null) {
            throw new RuntimeException("Tenant context required: please select a school");
        }
    }
}
