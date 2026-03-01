package models;

public class Reservation {
    private String reservationId;
    private String roomId;
    private String customerName;
    private String customerPhone;

    public Reservation(String reservationId, String roomId, String customerName, String customerPhone) {
        this.reservationId = reservationId;
        this.roomId = roomId;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
    }

    public String getReservationId() { return reservationId; }
    public void setReservationId(String reservationId) { this.reservationId = reservationId; }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    // Format for saving to text file
    public String toFileString() {
        return reservationId + "," + roomId + "," + customerName + "," + customerPhone;
    }

    // Format for showing to the user
    @Override
    public String toString() {
        return "Reservation ID: " + reservationId + " | Room: " + roomId + " | Customer: " + customerName + " | Phone: " + customerPhone;
    }
}
