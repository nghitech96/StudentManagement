package com.example.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.demo.dtos.UserDto;
import com.example.demo.services.AuthService;

@Controller
@RequestMapping("auth")
public class AuthController {
    AuthService authService;

    @GetMapping("/register1")
    public String viewRegister(Model model) {
        model.addAttribute("userdto", new UserDto());
        return "register";
    }

    @PostMapping("/register")
    public String register(UserDto userDto, Model model) {
        try {
            authService.register(userDto);
            return "redirect:/auth/register";
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            return "redirect:/auth/register";
        }
    }

}
