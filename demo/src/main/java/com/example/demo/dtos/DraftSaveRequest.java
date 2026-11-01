package com.example.demo.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record DraftSaveRequest(
        @NotBlank @Size(max = 64) String applicationId,
        @NotBlank @Pattern(regexp = "HOME_LOAN") String productType,
        @NotNull @Valid Customer customer,
        @NotNull @Valid LoanInformation loanInformation,
        @NotBlank @Pattern(regexp = "DRAFT") String status) {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Customer(
            @NotBlank @Size(max = 200) String customerName,
            @NotBlank @Size(max = 50) String identityNumber,
            @NotBlank @Pattern(regexp = "CCCD|CMND|PASSPORT") String identityType,
            @NotBlank @Pattern(regexp = "[0-9+().\\-\\s]{8,20}") String phoneNumber,
            @Email @Size(max = 254) String email,
            @Past LocalDate dateOfBirth,
            @Valid Address address) {
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Address(
            @Size(max = 255) String street,
            @Size(max = 120) String ward,
            @Size(max = 120) String district,
            @Size(max = 120) String city,
            @Size(max = 120) String country) {
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record LoanInformation(
            @NotNull @DecimalMin(value = "100000000") BigDecimal loanAmount,
            @NotBlank @Pattern(regexp = "VND|USD") String currency,
            @NotNull @Min(1) Integer tenor,
            @NotBlank @Pattern(regexp = "MONTH|YEAR") String tenorUnit,
            @DecimalMin(value = "0.0") BigDecimal interestRate,
            @Pattern(regexp = "HOUSE_PURCHASE|REFINANCE|RENOVATION") String purpose) {
    }
}
