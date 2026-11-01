package com.example.demo;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

@SpringBootTest(properties = {
        "app.drafts.rate-limit-per-minute=2",
        "app.cors.allowed-origins=https://nghitech96.github.io"
})
@AutoConfigureMockMvc
@ActiveProfiles("production")
class PublicDraftApiTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void allowsAnonymousDraftPostsButKeepsUserListProtectedAndAppliesRateLimit() throws Exception {
        String validDraft = """
                {
                  "applicationId": "HL202610310001",
                  "productType": "HOME_LOAN",
                  "customer": {
                    "customerName": "NGUYEN VAN AN",
                    "identityNumber": "079999000001",
                    "identityType": "CCCD",
                    "phoneNumber": "0900000001"
                  },
                  "loanInformation": {
                    "loanAmount": 2500000000,
                    "currency": "VND",
                    "tenor": 240,
                    "tenorUnit": "MONTH"
                  },
                  "status": "DRAFT"
                }
                """;
        RequestPostProcessor clientAddress = request -> {
            request.setRemoteAddr("203.0.113.45");
            return request;
        };

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/drafts"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/drafts")
                        .with(clientAddress)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validDraft))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/drafts")
                        .with(clientAddress)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validDraft))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/drafts")
                        .with(clientAddress)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validDraft))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().exists("Retry-After"));
    }

    @Test
    void allowsCorsOnlyFromTheConfiguredGitHubPagesOrigin() throws Exception {
        mockMvc.perform(options("/api/drafts")
                        .header("Origin", "https://nghitech96.github.io")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://nghitech96.github.io"));

        mockMvc.perform(options("/api/drafts")
                        .header("Origin", "https://untrusted.example")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isForbidden());
    }
}
