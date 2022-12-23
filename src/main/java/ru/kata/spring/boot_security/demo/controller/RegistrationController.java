package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;

@Controller
@RequestMapping("/registration")
public class RegistrationController {

    private boolean isUserExist = false;

    private final UserService userService;

    @Autowired
    public RegistrationController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public String registrationPage(@ModelAttribute("user") User user) {
        isUserExist = false;
        return "registration";
    }

    @PostMapping
    public String fillInNewUser(@ModelAttribute("user") @Valid User user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "registration";
        }
        try {
            userService.addUser(user);
        } catch (Exception ex) {
            ex.printStackTrace();
            isUserExist = true;
            return "redirect:/registration";
        }

        return "redirect:/login";
    }

    @ModelAttribute("isUserExist")
    private boolean getErrorMessage() {
        return isUserExist;
    }
}
