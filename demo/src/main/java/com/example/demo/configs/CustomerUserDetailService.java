package com.example.demo.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collections;

import com.example.demo.services.UserService;

@Service
public class CustomerUserDetailService implements UserDetailsService {
    @Autowired
    private UserService userService;

    public CustomerUserDetailService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        com.example.demo.model.User user = userService.findUserByEmail(email);
        if (user != null) {

            User authUser = new User(user.getEmail(), user.getPassword(), Collections.emptyList());
            return authUser;
        } else {
            throw new UsernameNotFoundException("Login found!");
        }

    }

}