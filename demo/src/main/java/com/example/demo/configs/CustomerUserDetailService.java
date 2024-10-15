package com.example.demo.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.services.UserService;

@Service
public class CustomerUserDetailService implements UserDetailsService {
    @Autowired
    private UserService userService;

    // Nghi thử lên mạng tìm xem lỗi đâu giúp mình nha, có gì nhắn tin mình chỉ cho
    // --> nghi cam on nha, co gi nghi nhan hoi nha, cam on Quan nhieu nhieu ̉ôk
    public CustomerUserDetailService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        com.example.demo.model.User user = userService.findUserByEmail(email);
        if (user != null) {

            User authUser = new User(user.getEmail(), user.getPassword(), null);
            return authUser;
        } else {
            throw new UsernameNotFoundException("Login found!");
        }

    }

}