package ru.kata.spring.boot_security.demo.service;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    private void initBD() {
        if (roleRepository.findAll().isEmpty()) {
            Role role1 = new Role(1L, "ROLE_USER");
            Role role2 = new Role(2L, "ROLE_ADMIN");
            roleRepository.saveAllAndFlush(Stream.of(role1, role2).collect(Collectors.toList()));

            User user = new User("user", "user", "user@mail.ru", "user", passwordEncoder.encode("user"), 23);
            User admin = new User("admin", "admin", "admin@mail.ru", "admin", passwordEncoder.encode("admin"), 35);
            user.setRoles(Stream.of(role1).collect(Collectors.toList()));
            admin.setRoles(Stream.of(role2).collect(Collectors.toList()));
            userRepository.saveAllAndFlush(Stream.of(user, admin).collect(Collectors.toList()));
        }
    }

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> getListOfUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public void addUser(User user) {
        if (user.getRoles().isEmpty()) {
            Role role = roleRepository.getById(1L);
            user.setRoles(Stream.of(role).collect(Collectors.toList()));
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User findUserById(Long id) {
        return userRepository.findUserById(id);
    }

    @Override
    @Transactional
    public void editUser(User user, Long id) {
        User updateableUser = findUserById(id);
        updateableUser.setFirstName(user.getFirstName());
        updateableUser.setLastName(user.getLastName());
        updateableUser.setEmail(user.getEmail());
        updateableUser.setAge(user.getAge());
        updateableUser.setUsername(user.getUsername());
        updateableUser.setRoles(user.getRoles());
    }
    @Transactional
    public User findByUserName(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = findByUserName(username);

        if (user == null) {
            throw new UsernameNotFoundException(String.format("User '%s' not found" + username));
        }

        Hibernate.initialize(user.getAuthorities());
        return user;
    }
}
