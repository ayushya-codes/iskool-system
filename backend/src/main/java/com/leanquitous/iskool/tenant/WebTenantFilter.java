package com.leanquitous.iskool.tenant;

import com.leanquitous.iskool.repositories.tenant.SchoolRepository;
import com.leanquitous.iskool.entity.tenant.School;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.net.URI;

@Component
@Order(1)
@RequiredArgsConstructor
public class WebTenantFilter implements Filter {

    public static final String TENANT_HEADER = "X-School-ID";

    private final SchoolRepository schoolRepository;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String tenantHeader = httpRequest.getHeader(TENANT_HEADER);

        try {
            if (tenantHeader != null && !tenantHeader.isBlank() && TenantContext.getCurrentTenant() == null) {
                TenantContext.setCurrentTenant(Long.valueOf(tenantHeader));
            } else if (TenantContext.getCurrentTenant() == null) {
                String subdomain = extractSubdomain(httpRequest);
                if (subdomain != null) {
                    schoolRepository.findBySubdomain(subdomain)
                            .map(School::getId)
                            .ifPresent(TenantContext::setCurrentTenant);
                }
            }
            chain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }

    private String extractSubdomain(HttpServletRequest request) {
        String origin = request.getHeader("Origin");
        if (!StringUtils.hasText(origin)) {
            origin = request.getHeader("Referer");
        }
        if (!StringUtils.hasText(origin)) {
            return null;
        }
        try {
            URI uri = URI.create(origin);
            String host = uri.getHost();
            if (host == null) return null;
            String[] parts = host.split("\\.");
            if (parts.length >= 3) {
                return parts[0].toLowerCase();
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
}
