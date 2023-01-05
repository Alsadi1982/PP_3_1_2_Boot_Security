package ru.kata.spring.boot_security.demo.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.model.User;

@Controller
@RequestMapping("/user")
public class UserController {

    private boolean isAdmin;

    @GetMapping
    public String userPage(Model model, @AuthenticationPrincipal User currentUser) {
        isAdmin = currentUser.getRoles().stream().anyMatch(x -> x.getName().equals("ROLE_ADMIN"));
        model.addAttribute("currentUser", currentUser);
        model.addAttribute("isAdmin", isAdmin);
        return "user";
    }

}
