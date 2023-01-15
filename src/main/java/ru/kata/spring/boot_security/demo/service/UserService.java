package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService extends UserDetailsService {

    List<User> getListOfUsers();
    void addUser(User user);
    void deleteUserById(Long id);
    User findUserById(Long id);

    User editUser(User user, Long id);
}
