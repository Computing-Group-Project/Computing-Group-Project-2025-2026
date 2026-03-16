package com.demeter.backend.config;

import com.demeter.backend.menu.model.*;
import com.demeter.backend.menu.repo.CategoryRepository;
import com.demeter.backend.menu.repo.MenuRepository;
import com.demeter.backend.menu.repo.MenuItemCustomizationRepository;
import com.demeter.backend.users.model.User;
import com.demeter.backend.users.repo.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.math.BigDecimal;

@Configuration
@Profile("dev")
public class DataSeeder {

    @Bean
    CommandLineRunner seedDatabase(CategoryRepository categoryRepo,
                                   MenuRepository menuRepo,
                                   MenuItemCustomizationRepository customizationRepo,
                                   UserRepository userRepo) {

        return args -> {

            // Avoid reseeding if data exists
            if (categoryRepo.count() > 0 || userRepo.count() > 0) {
                return;
            }

            // ---------- Seed Users ----------
            User admin = new User();
            admin.setUsername("admin_user");
            admin.setPassword("admin123");
            admin.setRole("ADMIN");

            User student = new User();
            student.setUsername("student_user");
            student.setPassword("student123");
            student.setRole("STUDENT");

            User staff = new User();
            staff.setUsername("staff_user");
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
                    BigDecimal.valueOf(450.0),
                    rice
            );
            chickenRice.setCafeteriaId(1L);

            Menu icedCoffee = new Menu(
                    "Iced Coffee",
                    "Cold coffee with milk",
                    BigDecimal.valueOf(250.0),
                    beverages
            );
            icedCoffee.setCafeteriaId(1L);

            Menu vegRoll = new Menu(
                    "Vegetable Roll",
                    "Crispy vegetable roll",
                    BigDecimal.valueOf(120.0),
                    snacks
            );
            vegRoll.setCafeteriaId(2L);

            menuRepo.save(chickenRice);
            menuRepo.save(icedCoffee);
            menuRepo.save(vegRoll);

            // ---------- Seed Customizations ----------
            MenuItemCustomization spiceLevel = new MenuItemCustomization(
                    "Spice", "ADD", BigDecimal.ZERO, chickenRice
            );
            customizationRepo.save(spiceLevel);

            MenuItemCustomization sugarLevel = new MenuItemCustomization(
                    "Sugar", "ADD", BigDecimal.ZERO, icedCoffee
            );
            customizationRepo.save(sugarLevel);

            System.out.println("Test data seeded successfully.");
        };
    }
}
