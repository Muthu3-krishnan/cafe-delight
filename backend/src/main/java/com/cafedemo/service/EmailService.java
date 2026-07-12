package com.cafedemo.service;

import com.cafedemo.model.CafeOrder;
import com.cafedemo.model.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Sends a plain-text order confirmation email once an order is
     * successfully saved. Any failure here is caught by the caller so it
     * never blocks the order itself from succeeding.
     */
    public void sendOrderConfirmation(CafeOrder order) {
        String to = order.getUser().getEmail();

        StringBuilder body = new StringBuilder();
        body.append("Hi ").append(order.getUser().getName()).append(",\n\n");
        body.append("Thanks for your order! Here are the details:\n\n");
        body.append("Order #").append(order.getId()).append("\n");

        for (OrderItem item : order.getItems()) {
            body.append(String.format("- %s  x%d  $%.2f%n",
                    item.getMenuItem().getName(),
                    item.getQuantity(),
                    item.getPriceAtOrderTime() * item.getQuantity()));
        }

        body.append(String.format("%nTotal: $%.2f%n%n", order.getTotalAmount()));
        body.append("Status: ").append(order.getStatus()).append("\n\n");
        body.append("We'll start preparing it shortly.\n\n");
        body.append("- Cafe & Hotel Demo");

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Order Confirmation - Order #" + order.getId());
        message.setText(body.toString());
        mailSender.send(message);
    }

    /**
     * Sends a short email whenever an admin updates an order's status
     * (e.g. Preparing, Ready, Delivered, Cancelled).
     */
    public void sendStatusUpdate(CafeOrder order) {
        String to = order.getUser().getEmail();

        String body = "Hi " + order.getUser().getName() + ",\n\n" +
                "Your order #" + order.getId() + " status has been updated to: " + order.getStatus() + "\n\n" +
                "Total: $" + String.format("%.2f", order.getTotalAmount()) + "\n\n" +
                "- Cafe & Hotel Demo";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Order #" + order.getId() + " Update: " + order.getStatus());
        message.setText(body);
        mailSender.send(message);
    }
}
