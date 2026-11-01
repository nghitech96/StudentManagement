package com.example.demo.configs;

import java.time.Duration;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class DraftRateLimitInterceptor implements HandlerInterceptor {

    private static final long WINDOW_MILLIS = Duration.ofMinutes(1).toMillis();
    private static final int MAX_TRACKED_CLIENTS = 10_000;

    private final int requestLimit;
    private final Map<String, RequestWindow> clients = new LinkedHashMap<>();

    public DraftRateLimitInterceptor(
            @org.springframework.beans.factory.annotation.Value("${app.drafts.rate-limit-per-minute:30}") int requestLimit) {
        if (requestLimit < 1) {
            throw new IllegalArgumentException("Draft API rate limit must be at least one request per minute.");
        }
        this.requestLimit = requestLimit;
    }

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler) throws Exception {
        if (!HttpMethod.POST.matches(request.getMethod())) return true;

        String clientAddress = request.getRemoteAddr();
        long now = System.currentTimeMillis();
        long retryAfterSeconds;
        synchronized (clients) {
            removeExpiredWindows(now);
            RequestWindow window = clients.get(clientAddress);
            if (window == null || now - window.startedAt() >= WINDOW_MILLIS) {
                if (window == null && clients.size() >= MAX_TRACKED_CLIENTS) {
                    clients.remove(clients.keySet().iterator().next());
                }
                clients.put(clientAddress, new RequestWindow(now, 1));
                return true;
            }
            if (window.requestCount() < requestLimit) {
                clients.put(clientAddress, new RequestWindow(window.startedAt(), window.requestCount() + 1));
                return true;
            }
            retryAfterSeconds = Math.max(1, (WINDOW_MILLIS - (now - window.startedAt()) + 999) / 1000);
        }

        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setHeader("Retry-After", Long.toString(retryAfterSeconds));
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"message\":\"Too many requests. Try again later.\"}");
        return false;
    }

    private void removeExpiredWindows(long now) {
        Iterator<Map.Entry<String, RequestWindow>> entries = clients.entrySet().iterator();
        while (entries.hasNext()) {
            if (now - entries.next().getValue().startedAt() >= WINDOW_MILLIS) {
                entries.remove();
            }
        }
    }

    private record RequestWindow(long startedAt, int requestCount) {
    }
}
