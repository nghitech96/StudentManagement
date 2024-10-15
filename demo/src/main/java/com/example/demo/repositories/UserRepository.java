package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.User;

public interface UserRepository extends JpaRepository<User, String> {
    User findUserByEmail(String email);

    void deleteByEmailAndPassword(String email, String password);

    void delete(User user);

    User findByUsername(String username);
}
