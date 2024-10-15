package com.example.demo.services.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dtos.UserDto;
import com.example.demo.services.AuthService;
import com.example.demo.services.UserService;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserService userService;

    private String encodeString(String pass) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.encode(pass);
    }

    public void register(UserDto userDto) {
        if (Boolean.TRUE.equals(userService.checkUserByEmail(userDto.getEmail()))) {
            throw new RuntimeException("email da ton tai");
        }
        userDto.setPassword(this.encodeString(userDto.getPassword()));
        userService.create(userDto);

    }
}
