package com.example.demo.services.Impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dtos.CreateUserDTO;
import com.example.demo.dtos.UpdateUserDTO;
import com.example.demo.dtos.UserDto;
import com.example.demo.model.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.UserService;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserRepository userRepository;

    @Override
    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public User createUser(CreateUserDTO dto) {
        var user = new User(dto.getUsername(), dto.getPassword(), null);
        // hashpass word

        return userRepository.save(user);
    }

    @Override
    public String updateUser(UpdateUserDTO dto) {
        return null;
    }

    @Override
    public String deleteUserById(String id) {
        return null;
    }

    @Override
    public Boolean checkUserByEmail(String email) {
        User user = userRepository.findUserByEmail(email);
        if (user == null)
            return false;
        return true;
    }

    @Override
    public void create(UserDto userDto) {
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        userRepository.save(user);
    }

    @Override
    public User findUserByEmail(String email) {
        User user = userRepository.findByUsername(email);
        return user;
    }

}
