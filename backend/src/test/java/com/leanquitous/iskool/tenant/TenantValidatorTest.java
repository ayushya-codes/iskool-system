package com.leanquitous.iskool.tenant;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("TenantValidator ownership and context checks")
class TenantValidatorTest {

    @AfterEach
    void cleanup() {
        TenantContext.clear();
    }

    @Test
    @DisplayName("validateOwnership passes when entity belongs to current tenant")
    void validateOwnershipPassesForSameTenant() {
        TenantContext.setCurrentTenant(1L);
        assertDoesNotThrow(() -> TenantValidator.validateOwnership(1L));
    }

    @Test
    @DisplayName("validateOwnership throws when entity belongs to different tenant")
    void validateOwnershipThrowsForDifferentTenant() {
        TenantContext.setCurrentTenant(1L);
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> TenantValidator.validateOwnership(2L));
        assertTrue(ex.getMessage().contains("Access denied"));
    }

    @Test
    @DisplayName("validateOwnership does not throw when tenant context is null (SA mode)")
    void validateOwnershipAllowsWhenContextIsNull() {
        TenantContext.clear();
        assertDoesNotThrow(() -> TenantValidator.validateOwnership(999L));
    }

    @Test
    @DisplayName("requireTenantContext throws when no tenant is set")
    void requireTenantContextThrowsWhenNull() {
        TenantContext.clear();
        RuntimeException ex = assertThrows(RuntimeException.class,
                TenantValidator::requireTenantContext);
        assertTrue(ex.getMessage().contains("Tenant context required"));
    }

    @Test
    @DisplayName("requireTenantContext passes when tenant is set")
    void requireTenantContextPassesWhenSet() {
        TenantContext.setCurrentTenant(5L);
        assertDoesNotThrow(TenantValidator::requireTenantContext);
    }
}
