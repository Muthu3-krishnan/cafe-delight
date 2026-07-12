package com.cafedemo.service;

import com.cafedemo.dto.OrderRequest;
import com.cafedemo.model.*;
import com.cafedemo.repository.MenuItemRepository;
import com.cafedemo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public CafeOrder placeOrder(User user, OrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        CafeOrder order = new CafeOrder();
        order.setUser(user);

        List<OrderItem> orderItems = new ArrayList<>();
        double total = 0.0;

        for (OrderRequest.OrderLine line : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(line.getMenuItemId())
                    .orElseThrow(() -> new IllegalArgumentException("Menu item not found: " + line.getMenuItemId()));

            if (!menuItem.isAvailable()) {
                throw new IllegalArgumentException(menuItem.getName() + " is currently unavailable");
            }
            if (line.getQuantity() < 1) {
                throw new IllegalArgumentException("Quantity must be at least 1");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(line.getQuantity());
            orderItem.setPriceAtOrderTime(menuItem.getPrice());

            orderItems.add(orderItem);
            total += menuItem.getPrice() * line.getQuantity();
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);
        order.setStatus(OrderStatus.PENDING);

        CafeOrder saved = orderRepository.save(order);

        // Order placement must succeed even if the email provider is
        // unreachable or misconfigured (e.g. demo SMTP creds not set up yet).
        try {
            emailService.sendOrderConfirmation(saved);
        } catch (Exception ex) {
            System.err.println("Order #" + saved.getId() + " placed, but confirmation email failed: " + ex.getMessage());
        }

        return saved;
    }

    @Transactional
    public CafeOrder updateStatus(Long orderId, OrderStatus newStatus) {
        CafeOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        order.setStatus(newStatus);
        CafeOrder saved = orderRepository.save(order);

        try {
            emailService.sendStatusUpdate(saved);
        } catch (Exception ex) {
            System.err.println("Order #" + saved.getId() + " updated, but status email failed: " + ex.getMessage());
        }

        return saved;
    }
}
