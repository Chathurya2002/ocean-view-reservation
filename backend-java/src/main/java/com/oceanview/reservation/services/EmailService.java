package com.oceanview.reservation.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendBookingConfirmation(String toEmail, String guestName, String reservationNo, String roomName,
            String checkIn, String checkOut, double totalAmount) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("hjcchathurya@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Booking Confirmation - Ocean View Resort");

        String emailBody = "Dear " + guestName + ",\n\n"
                + "Thank you for choosing Ocean View Resort! Your booking has been successfully confirmed.\n\n"
                + "Reservation Details:\n"
                + "Reservation Number: " + reservationNo + "\n"
                + "Room: " + roomName + "\n"
                + "Check-in Date: " + checkIn + "\n"
                + "Check-out Date: " + checkOut + "\n"
                + "Total Amount: LKR " + String.format("%,.2f", totalAmount) + "\n\n"
                + "We look forward to hosting you. If you have any questions, please contact our support team.\n\n"
                + "Best Regards,\n"
                + "Ocean View Resort Team";

        message.setText(emailBody);

        try {
            mailSender.send(message);
            System.out.println("Confirmation email sent to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
        }
    }
}
