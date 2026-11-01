package com.example.demo.dtos;

import com.example.demo.model.User;

public record UserResponse(String id, String username, String email) {

    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail());
    }
}
