package com.cafedemo.controller;

import com.cafedemo.dto.OrderRequest;
import com.cafedemo.model.CafeOrder;
import com.cafedemo.model.User;
import com.cafedemo.repository.OrderRepository;
import com.cafedemo.repository.UserRepository;
import com.cafedemo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> placeOrder(Authentication authentication, @RequestBody OrderRequest request) {
        User user = currentUser(authentication);
        try {
            CafeOrder order = orderService.placeOrder(user, request);
            return ResponseEntity.ok(Map.of(
                    "message", "Order placed successfully. A confirmation email has been sent to " + user.getEmail(),
                    "orderId", order.getId(),
                    "total", order.getTotalAmount(),
                    "status", order.getStatus()
            ));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @GetMapping("/my")
    public List<CafeOrder> myOrders(Authentication authentication) {
        User user = currentUser(authentication);
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    private User currentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
    }
}
