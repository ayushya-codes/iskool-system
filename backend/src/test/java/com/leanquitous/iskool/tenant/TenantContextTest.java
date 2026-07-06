package com.leanquitous.iskool.tenant;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("TenantContext ThreadLocal behavior")
class TenantContextTest {

    @AfterEach
    void cleanup() {
        TenantContext.clear();
    }

    @Test
    @DisplayName("getCurrentTenant returns null when not set")
    void returnsNullWhenNotSet() {
        assertNull(TenantContext.getCurrentTenant());
    }

    @Test
    @DisplayName("setCurrentTenant stores value in ThreadLocal")
    void storesValueInThreadLocal() {
        TenantContext.setCurrentTenant(100L);
        assertEquals(100L, TenantContext.getCurrentTenant());
    }

    @Test
    @DisplayName("clear removes the ThreadLocal value")
    void clearRemovesValue() {
        TenantContext.setCurrentTenant(200L);
        TenantContext.clear();
        assertNull(TenantContext.getCurrentTenant());
    }

    @Test
    @DisplayName("tenant context is isolated per thread")
    void isolatedPerThread() throws InterruptedException {
        TenantContext.setCurrentTenant(1L);

        Thread t = new Thread(() -> {
            assertNull(TenantContext.getCurrentTenant(),
                    "New thread should not inherit parent's tenant context");
            TenantContext.setCurrentTenant(2L);
            assertEquals(2L, TenantContext.getCurrentTenant());
        });
        t.start();
        t.join();

        assertEquals(1L, TenantContext.getCurrentTenant(),
                "Parent thread context should be unchanged after child thread modifies its own");
    }
}
