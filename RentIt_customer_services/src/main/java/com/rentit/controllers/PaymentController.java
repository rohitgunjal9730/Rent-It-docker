package com.rentit.controllers;

import com.rentit.entities.Payment;
import com.rentit.services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customer/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/pay")
    public ResponseEntity<?> makePayment(@RequestBody Map<String, Object> payload) {
        try {
            int bookingId = (int) payload.get("bookingId");
            double amount = Double.parseDouble(payload.get("amount").toString());
            String method = (String) payload.get("paymentMethod");

            Payment payment = paymentService.processPayment(bookingId, amount, method);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Payment failed: " + e.getMessage());
        }
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<Payment>> getPaymentHistory(@PathVariable int userId) {
        return ResponseEntity.ok(paymentService.getPaymentHistory(userId));
    }

    @GetMapping("/refund/{bookingId}")
    public ResponseEntity<?> getRefundAmount(@PathVariable int bookingId) {
        BigDecimal refund = paymentService.calculateRefund(bookingId);
        return ResponseEntity.ok(Map.of("refundableAmount", refund));
    }
}
