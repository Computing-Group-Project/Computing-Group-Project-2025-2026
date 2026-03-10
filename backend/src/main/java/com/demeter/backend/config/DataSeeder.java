package com.demeter.backend.config;

import com.demeter.backend.menu.model.*;
import com.demeter.backend.menu.repo.CategoryRepository;
import com.demeter.backend.menu.repo.MenuRepository;
import com.demeter.backend.menu.repo.CustomizationRepository;
import com.demeter.backend.users.model.User;
import com.demeter.backend.users.repo.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDatabase(CategoryRepository categoryRepo,
                                   MenuRepository menuRepo,
                                   CustomizationRepository customizationRepo,
                                   UserRepository userRepo) {

        return args -> {

            // Avoid reseeding if data exists
            if (categoryRepo.count() > 0 || userRepo.count() > 0) {
                return;
            }

            // ---------- Seed Users ----------
            User admin = new User();
            admin.setEmail("admin@demeter.com");
            admin.setPassword("admin123");
            admin.setRole("ADMIN");

            User student = new User();
            student.setEmail("student@demeter.com");
            student.setPassword("student123");
            student.setRole("STUDENT");

            User staff = new User();
            staff.setEmail("staff@demeter.com");
            staff.setPassword("staff123");
            staff.setRole("STAFF");

            userRepo.save(admin);
            userRepo.save(student);
            userRepo.save(staff);

            // ---------- Seed Categories ----------
            Category rice = new Category("Rice & Curry");
            Category beverages = new Category("Beverages");
            Category snacks = new Category("Snacks");

            categoryRepo.save(rice);
            categoryRepo.save(beverages);
            categoryRepo.save(snacks);

            // ---------- Seed Menu Items ----------
            Menu chickenRice = new Menu(
                    "Chicken Rice",
                    "Sri Lankan chicken rice and curry",
                    450.0,
                    rice
            );

            Menu icedCoffee = new Menu(
                    "Iced Coffee",
                    "Cold coffee with milk",
                    250.0,
                    beverages
            );

            Menu vegRoll = new Menu(
                    "Vegetable Roll",
                    "Crispy vegetable roll",
                    120.0,
                    snacks
            );

            menuRepo.save(chickenRice);
            menuRepo.save(icedCoffee);
            menuRepo.save(vegRoll);

            // ---------- Seed Customizations ----------
            Customization spiceLevel = new Customization("Spice Level", chickenRice);
            customizationRepo.save(spiceLevel);

            Customization sugarLevel = new Customization("Sugar Level", icedCoffee);
            customizationRepo.save(sugarLevel);

            System.out.println("Test data seeded successfully.");
        };
    }
}