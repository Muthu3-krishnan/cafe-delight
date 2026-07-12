package com.cafedemo.repository;

import com.cafedemo.model.CafeOrder;
import com.cafedemo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<CafeOrder, Long> {
    List<CafeOrder> findByUserOrderByCreatedAtDesc(User user);
    List<CafeOrder> findAllByOrderByCreatedAtDesc();
}
