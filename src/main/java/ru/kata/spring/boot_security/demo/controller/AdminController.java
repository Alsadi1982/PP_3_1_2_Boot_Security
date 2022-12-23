package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;
import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleRepository roleRepository;

    @Autowired
    public AdminController(UserService userService,
                           RoleRepository roleRepository) {
        this.userService = userService;
        this.roleRepository = roleRepository;
    }

    @GetMapping
    public String allUsersPage(Model model, @AuthenticationPrincipal User user) {
        List<User> users = userService.getListOfUsers();
        model.addAttribute("users", users);
        model.addAttribute("user", user);
        return "users";
    }
    @PostMapping("/delete_user/{id}")
    public String removeUser(@PathVariable("id") Long id){
        userService.deleteUserById(id);
        return "redirect:/admin";
    }

    @GetMapping("/edit_user/{id}")
    public String EditUserPage(@PathVariable("id") Long id, Model model, @AuthenticationPrincipal User currentUser) {
        List<Role> roles = roleRepository.findAll();
        model.addAttribute("roles", roles);
        model.addAttribute("user", userService.findUserById(id));
        model.addAttribute("currentUser", currentUser);
        return "user_edit";
    }

    @PostMapping("edit_user/{id}")
    public String editUser(@ModelAttribute("user")  User user, @PathVariable("id") Long id) {

        userService.editUser(user, id);
        return "redirect:/admin";
    }

    @GetMapping("/new_user")
    public String createUserPage(@ModelAttribute("user") User user, @AuthenticationPrincipal User currentUser,  Model model) {

        List<Role> roles = roleRepository.findAll();
        model.addAttribute("roles", roles);
        model.addAttribute("currentUser", currentUser);
        return "user_new";
    }

    @PostMapping("/new_user")
    public String createUser(@ModelAttribute("user") @Valid User user, BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            List<Role> roles = roleRepository.findAll();
            model.addAttribute("roles", roles);
            return "user_new";
        }
        userService.addUser(user);
        return "redirect:/admin";
    }
}
