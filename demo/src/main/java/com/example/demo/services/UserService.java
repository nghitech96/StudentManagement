package com.example.demo.services;

import java.util.List;

import com.example.demo.dtos.CreateUserDTO;
import com.example.demo.dtos.UpdateUserDTO;
import com.example.demo.dtos.UserDto;
import com.example.demo.model.User;

public interface UserService {
    List<User> getAllUser();

    Boolean checkUserByEmail(String email);

    User getUserById(String id);

    User getUserByUsername(String username);

    User createUser(CreateUserDTO dto);

    void create(UserDto userDto);

    String updateUser(UpdateUserDTO dto);

    String deleteUserById(String id);

    User findUserByEmail(String email);
}
