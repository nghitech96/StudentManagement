package com.example.demo.configs;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class DraftRateLimitInterceptorTests {

    @Test
    void allowsThirtyRequestsPerMinuteAndRejectsTheNextFromSameAddress() throws Exception {
        DraftRateLimitInterceptor interceptor = new DraftRateLimitInterceptor(30);
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/drafts");
        request.setRemoteAddr("203.0.113.10");

        for (int attempt = 0; attempt < 30; attempt++) {
            assertTrue(interceptor.preHandle(request, new MockHttpServletResponse(), new Object()));
        }

        MockHttpServletResponse limitedResponse = new MockHttpServletResponse();
        assertFalse(interceptor.preHandle(request, limitedResponse, new Object()));
        assertEquals(429, limitedResponse.getStatus());
        assertTrue(Integer.parseInt(limitedResponse.getHeader("Retry-After")) >= 1);
        assertTrue(limitedResponse.getContentAsString().contains("Too many requests"));
    }

    @Test
    void usesIndependentLimitForEachRemoteAddress() throws Exception {
        DraftRateLimitInterceptor interceptor = new DraftRateLimitInterceptor(1);
        MockHttpServletRequest firstClient = new MockHttpServletRequest("POST", "/api/drafts");
        firstClient.setRemoteAddr("203.0.113.10");
        MockHttpServletRequest secondClient = new MockHttpServletRequest("POST", "/api/drafts");
        secondClient.setRemoteAddr("203.0.113.11");

        assertTrue(interceptor.preHandle(firstClient, new MockHttpServletResponse(), new Object()));
        assertTrue(interceptor.preHandle(secondClient, new MockHttpServletResponse(), new Object()));
    }
}
