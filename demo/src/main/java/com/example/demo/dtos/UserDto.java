package com.example.demo.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class UserDto {
    private String id;
    @NotBlank
    @Size(max = 255)
    private String username;
    @NotBlank
    @Size(min = 8, max = 72)
    private String password;
    @NotBlank
    @Email
    @Size(max = 255)
    private String email;
}
