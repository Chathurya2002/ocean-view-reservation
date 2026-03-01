package models;

public class Room {
    private String roomId;
    private String type;
    private double price;
    private boolean isAvailable;

    public Room(String roomId, String type, double price, boolean isAvailable) {
        this.roomId = roomId;
        this.type = type;
        this.price = price;
        this.isAvailable = isAvailable;
    }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }

    // Format for saving to text file
    public String toFileString() {
        return roomId + "," + type + "," + price + "," + isAvailable;
    }

    // Format for showing to the user
    @Override
    public String toString() {
        return "Room ID: " + roomId + " | Type: " + type + " | Price: $" + price + " | Status: " + (isAvailable ? "Available" : "Booked");
    }
}
