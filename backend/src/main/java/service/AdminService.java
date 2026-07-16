package com.exam.onlineexamsystem.service;

import com.exam.onlineexamsystem.entity.Admin;
import com.exam.onlineexamsystem.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    // Register Admin
    public Admin registerAdmin(Admin admin) {

        if (adminRepository.existsByEmail(admin.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        return adminRepository.save(admin);
    }

    // Admin Login
    public Admin loginAdmin(String email, String password) {

        Optional<Admin> admin =
                adminRepository.findByEmailAndPassword(email, password);

        if (admin.isPresent()) {
            return admin.get();
        } else {
            throw new RuntimeException("Invalid Email or Password");
        }
    }

    // Save Admin
    public Admin saveAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    // Get All Admins
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    // Get Admin By ID
    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    // Delete Admin
    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }
}