package com.leanquitous.iskool.tenant;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(2)
public class TenantContextFilter implements Filter {

    private static final String[] EXCLUDED_PATHS = {
            "/api/schools",
            "/api/auth"
    };

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String path = httpRequest.getRequestURI();

        if (isExcluded(path)) {
            chain.doFilter(request, response);
            return;
        }

        if (TenantContext.getCurrentTenant() == null) {
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            httpResponse.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            httpResponse.setContentType("application/json");
            httpResponse.getWriter().write("{\"error\":\"Tenant context required: please select a school\"}");
            return;
        }

        chain.doFilter(request, response);
    }

    private boolean isExcluded(String path) {
        for (String excluded : EXCLUDED_PATHS) {
            if (path.startsWith(excluded)) {
                return true;
            }
        }
        return false;
    }
}
