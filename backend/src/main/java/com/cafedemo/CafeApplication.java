package com.cafedemo;

import com.cafedemo.model.MenuItem;
import com.cafedemo.model.Role;
import com.cafedemo.model.User;
import com.cafedemo.repository.MenuItemRepository;
import com.cafedemo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class CafeApplication {

    public static void main(String[] args) {
        SpringApplication.run(CafeApplication.class, args);
    }

    /**
     * Seeds the H2 in-memory database with a default admin user and a starter
     * menu so the demo works immediately after startup, with no manual setup.
     */
    @Bean
    CommandLineRunner seedData(UserRepository userRepository,
                                MenuItemRepository menuItemRepository,
                                PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail("admin@cafedemo.com").isEmpty()) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@cafedemo.com");
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
            }

            if (menuItemRepository.count() == 0) {
                menuItemRepository.save(new MenuItem(null, "Chicken Burger", "Juicy grilled chicken patty with fresh veggies", 180.0, "Burger", true,
                        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80"));
                menuItemRepository.save(new MenuItem(null, "Veg Pizza", "Loaded with fresh vegetables and mozzarella", 250.0, "Pizza", true,
                        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80"));
                menuItemRepository.save(new MenuItem(null, "Cappuccino", "Rich espresso with steamed milk foam art", 120.0, "Coffee", true,
                        "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80"));
                menuItemRepository.save(new MenuItem(null, "Pasta", "Creamy Alfredo pasta with herbs", 150.0, "Pasta", true,
                        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80"));
                menuItemRepository.save(new MenuItem(null, "Cafe Latte", "Smooth espresso with steamed milk", 130.0, "Coffee", true,
                        "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=500&q=80"));
                menuItemRepository.save(new MenuItem(null, "Margherita Pizza", "Classic pizza with mozzarella and basil", 220.0, "Pizza", true,
                        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80"));
                menuItemRepository.save(new MenuItem(null, "Club Sandwich", "Triple-decker with chicken, egg and veggies", 190.0, "Snacks", true,
                        "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=500&q=80"));
                menuItemRepository.save(new MenuItem(null, "Chocolate Brownie", "Warm fudge brownie with vanilla ice cream", 140.0, "Desserts", true,
                        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80"));
            }
        };
    }
}
