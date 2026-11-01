package com.example.demo;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

@SpringBootTest(properties = {
        "app.drafts.rate-limit-per-minute=2",
        "app.cors.allowed-origins=https://nghitech96.github.io",
        "spring.datasource.url=jdbc:h2:mem:public_draft_tests;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.flyway.enabled=false"
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
                .andExpect(header().string("Access-Control-Allow-Origin", "https://nghitech96.github.io"))
                .andExpect(header().string("Access-Control-Allow-Credentials", "true"));

        mockMvc.perform(options("/api/drafts")
                        .header("Origin", "https://untrusted.example")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isForbidden());
    }

    @Test
    void allowsCredentialedCorsRequestsToLogin() throws Exception {
        mockMvc.perform(options("/api/auth/login")
                        .header("Origin", "https://nghitech96.github.io")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "content-type"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://nghitech96.github.io"))
                .andExpect(header().string("Access-Control-Allow-Credentials", "true"));
    }

    @Test
    void loginAllowsCredentialedCorsAndCreatesServerSession() throws Exception {
        String accountId = UUID.randomUUID().toString();
        String email = "student-" + accountId + "@example.test";
        String password = "LocalTest123!";

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "student-%s",
                                  "email": "%s",
                                  "password": "%s"
                                }
                                """.formatted(accountId, email, password)))
                .andExpect(status().isCreated());

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .header("Origin", "https://nghitech96.github.io")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "%s",
                                  "password": "%s"
                                }
                                """.formatted(email, password)))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://nghitech96.github.io"))
                .andExpect(header().string("Access-Control-Allow-Credentials", "true"))
                .andReturn();

        assertNotNull(loginResult.getRequest().getSession(false));
        mockMvc.perform(get("/api/users")
                        .session((MockHttpSession) loginResult.getRequest().getSession(false)))
                .andExpect(status().isOk());
    }
}
