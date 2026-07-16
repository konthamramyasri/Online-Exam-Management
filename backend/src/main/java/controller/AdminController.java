package com.exam.onlineexamsystem.controller;

import com.exam.onlineexamsystem.entity.Admin;
import com.exam.onlineexamsystem.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admins")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Register Admin
    @PostMapping("/register")
    public Admin registerAdmin(@RequestBody Admin admin) {
        return adminService.registerAdmin(admin);
    }

    // Admin Login
    @PostMapping("/login")
    public Admin loginAdmin(@RequestBody Admin admin) {
        return adminService.loginAdmin(
                admin.getEmail(),
                admin.getPassword()
        );
    }

    // Save Admin
    @PostMapping
    public Admin saveAdmin(@RequestBody Admin admin) {
        return adminService.saveAdmin(admin);
    }

    // Get All Admins
    @GetMapping
    public List<Admin> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    // Get Admin By ID
    @GetMapping("/{id}")
    public Optional<Admin> getAdminById(@PathVariable Long id) {
        return adminService.getAdminById(id);
    }

    // Delete Admin
    @DeleteMapping("/{id}")
    public String deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
        return "Admin deleted successfully!";
    }
}