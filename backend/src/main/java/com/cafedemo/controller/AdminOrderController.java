package com.cafedemo.controller;

import com.cafedemo.dto.OrderStatusUpdateRequest;
import com.cafedemo.model.CafeOrder;
import com.cafedemo.model.OrderStatus;
import com.cafedemo.repository.OrderRepository;
import com.cafedemo.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<CafeOrder> allOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusUpdateRequest request) {
        try {
            OrderStatus newStatus = OrderStatus.valueOf(request.getStatus().trim().toUpperCase());
            CafeOrder updated = orderService.updateStatus(id, newStatus);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid status or order id: " + ex.getMessage()));
        }
    }
}
