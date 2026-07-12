package com.cafedemo.controller;

import com.cafedemo.model.MenuItem;
import com.cafedemo.repository.MenuItemRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class MenuController {

    @Autowired
    private MenuItemRepository menuItemRepository;

    // ---- Public: anyone can browse the menu ----
    @GetMapping("/api/menu")
    public List<MenuItem> getMenu() {
        return menuItemRepository.findAll();
    }

    // ---- Admin only: manage menu items ----
    @PostMapping("/api/admin/menu")
    public ResponseEntity<?> addItem(@Valid @RequestBody MenuItem item) {
        item.setId(null);
        return ResponseEntity.ok(menuItemRepository.save(item));
    }

    @PutMapping("/api/admin/menu/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @Valid @RequestBody MenuItem updated) {
        return menuItemRepository.findById(id)
                .map(existing -> {
                    existing.setName(updated.getName());
                    existing.setDescription(updated.getDescription());
                    existing.setPrice(updated.getPrice());
                    existing.setCategory(updated.getCategory());
                    existing.setAvailable(updated.isAvailable());
                    existing.setImageUrl(updated.getImageUrl());
                    return ResponseEntity.ok(menuItemRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/api/admin/menu/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        if (!menuItemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        menuItemRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Menu item deleted"));
    }
}
