package com.example.demo;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class DraftControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void acceptsValidDraftWithExpectedResponseShape() throws Exception {
        mockMvc.perform(post("/api/drafts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validDraft()))
                .andExpect(status().isCreated())
                .andExpect(header().string("Cache-Control", "no-store"))
                .andExpect(jsonPath("$.message").value("Draft saved successfully."))
                .andExpect(jsonPath("$.data.applicationId").value("HL202610310001"))
                .andExpect(jsonPath("$.data.productType").value("HOME_LOAN"))
                .andExpect(jsonPath("$.data.customer.customerName").value("NGUYEN VAN AN"))
                .andExpect(jsonPath("$.data.loanInformation.loanAmount").value(2500000000L))
                .andExpect(jsonPath("$.data.status").value("DRAFT"));
    }

    @Test
    void acceptsMinimumLoanAmountAndOptionalCustomerFields() throws Exception {
        mockMvc.perform(post("/api/drafts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "applicationId": "HL202610310002",
                                  "productType": "HOME_LOAN",
                                  "customer": {
                                    "customerName": "TRAN VAN BINH",
                                    "identityNumber": "079999000002",
                                    "identityType": "CCCD",
                                    "phoneNumber": "0900000002",
                                    "email": "tranvanbinh@example.com"
                                  },
                                  "loanInformation": {
                                    "loanAmount": 100000000,
                                    "currency": "VND",
                                    "tenor": 120,
                                    "tenorUnit": "MONTH",
                                    "purpose": "HOUSE_PURCHASE"
                                  },
                                  "status": "DRAFT"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.loanInformation.loanAmount").value(100000000))
                .andExpect(jsonPath("$.data.customer.dateOfBirth").doesNotExist())
                .andExpect(jsonPath("$.data.loanInformation.interestRate").doesNotExist());
    }

    @Test
    void rejectsNegativeLoanAmount() throws Exception {
        mockMvc.perform(post("/api/drafts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(draftWith("""
                                "loanAmount": -100000000,
                                "currency": "VND",
                                "tenor": 240,
                                "tenorUnit": "MONTH"
                                """)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rejectsMissingCustomerName() throws Exception {
        mockMvc.perform(post("/api/drafts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(draftWith("""
                                "loanAmount": 2500000000,
                                "currency": "VND",
                                "tenor": 240,
                                "tenorUnit": "MONTH"
                                """).replace("\"customerName\": \"NGUYEN VAN AN\"", "\"customerName\": \"\"")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rejectsZeroLoanTenor() throws Exception {
        mockMvc.perform(post("/api/drafts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(draftWith("""
                                "loanAmount": 2500000000,
                                "currency": "VND",
                                "tenor": 0,
                                "tenorUnit": "MONTH"
                                """)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rejectsMissingApplicationId() throws Exception {
        mockMvc.perform(post("/api/drafts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validDraft().replace("\"applicationId\": \"HL202610310001\",\n", "")))
                .andExpect(status().isBadRequest());
    }

    private String validDraft() {
        return """
                {
                  "applicationId": "HL202610310001",
                  "productType": "HOME_LOAN",
                  "customer": {
                    "customerName": "NGUYEN VAN AN",
                    "identityNumber": "079999000001",
                    "identityType": "CCCD",
                    "phoneNumber": "0900000001",
                    "email": "nguyenvanan@example.com",
                    "dateOfBirth": "1995-05-15",
                    "address": {
                      "street": "123 Nguyen Trai",
                      "ward": "Ben Thanh",
                      "district": "District 1",
                      "city": "Ho Chi Minh",
                      "country": "Vietnam"
                    }
                  },
                  "loanInformation": {
                    "loanAmount": 2500000000,
                    "currency": "VND",
                    "tenor": 240,
                    "tenorUnit": "MONTH",
                    "interestRate": 8.5,
                    "purpose": "HOUSE_PURCHASE"
                  },
                  "status": "DRAFT"
                }
                """;
    }

    private String draftWith(String loanInformation) {
        return """
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
                    %s
                  },
                  "status": "DRAFT"
                }
                """.formatted(loanInformation);
    }
}
