package com.khan.EComm.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String toEmail, String name, double amount) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("🛍️ Payment Successful – Thank You for Your Purchase!");

        message.setText(
                "Hi " + name + ",\n\n" +
                        "🎉 Thank you for your order! We're excited to let you know that your payment of ₹" + amount + " was successful.\n\n" +
                        "🧾 Order Summary:\n" +
                        "• Customer Name: " + name + "\n" +
                        "• Total Amount: ₹" + amount + "\n\n" +
                        "Your items are now being packed with care and will be on their way to you soon! 🚚✨\n\n" +
                        "If you have any questions, feel free to reply to this email or contact our support team anytime.\n\n" +
                        "Thanks for shopping with us ❤️\n" +
                        "— The EComm Team\n\n" +
                        "📦 Track your order: Coming Soon...."
        );
        mailSender.send(message);
    }
}
