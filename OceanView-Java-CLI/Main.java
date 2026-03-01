import models.Reservation;
import models.Room;
import services.FileManager;
import java.util.List;
import java.util.Scanner;
import java.util.UUID;

public class Main {
    private static FileManager fileManager = new FileManager();
    private static List<Room> rooms;
    private static List<Reservation> reservations;
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        // Initialize files and load data
        fileManager.initializeFiles();
        rooms = fileManager.loadRooms();
        reservations = fileManager.loadReservations();

        boolean running = true;
        System.out.println("\n===============================================");
        System.out.println("   Welcome to Ocean View Reservation System    ");
        System.out.println("===============================================");

        while (running) {
            System.out.println("\n--- Main Menu ---");
            System.out.println("1. View All Rooms");
            System.out.println("2. View Available Rooms");
            System.out.println("3. Book a Room");
            System.out.println("4. View All Reservations");
            System.out.println("5. Cancel a Reservation");
            System.out.println("6. Exit Menu");
            System.out.print("Please select an option (1-6): ");

            if (!scanner.hasNextInt()) {
                System.out.println("\n[Error] Invalid input. Please enter a valid number.");
                scanner.next(); // Clear invalid input
                continue;
            }

            int choice = scanner.nextInt();
            scanner.nextLine(); // Clear newline

            switch (choice) {
                case 1:
                    viewAllRooms();
                    break;
                case 2:
                    viewAvailableRooms();
                    break;
                case 3:
                    bookRoom();
                    break;
                case 4:
                    viewAllReservations();
                    break;
                case 5:
                    cancelReservation();
                    break;
                case 6:
                    System.out.println("\nThank you for using Ocean View Reservation System! Goodbye.");
                    running = false;
                    break;
                default:
                    System.out.println("\n[Error] Invalid option. Please select a number between 1 and 6.");
            }
        }

        scanner.close();
    }

    private static void viewAllRooms() {
        System.out.println("\n--- All Rooms ---");
        if (rooms.isEmpty()) {
            System.out.println("No rooms available.");
            return;
        }
        for (Room room : rooms) {
            System.out.println(room.toString());
        }
    }

    private static void viewAvailableRooms() {
        System.out.println("\n--- Available Rooms ---");
        boolean found = false;
        for (Room room : rooms) {
            if (room.isAvailable()) {
                System.out.println(room.toString());
                found = true;
            }
        }
        if (!found) {
            System.out.println("No rooms are currently available.");
        }
    }

    private static void bookRoom() {
        System.out.println("\n--- Book a Room ---");
        viewAvailableRooms();
        System.out.print("\nEnter the Room ID you want to book (e.g., R001): ");
        String roomId = scanner.nextLine().toUpperCase();

        Room selectedRoom = getRoomById(roomId);
        if (selectedRoom == null) {
            System.out.println("[Error] Room not found.");
            return;
        }

        if (!selectedRoom.isAvailable()) {
            System.out.println("[Error] Room is already booked.");
            return;
        }

        System.out.print("Enter Customer Name: ");
        String name = scanner.nextLine();
        System.out.print("Enter Customer Phone Number: ");
        String phone = scanner.nextLine();

        // Generate simple ID
        String resId = "RES-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        Reservation newRes = new Reservation(resId, roomId, name, phone);
        
        // Update Room Status
        selectedRoom.setAvailable(false);
        reservations.add(newRes);

        // Save Data to Files
        fileManager.saveRooms(rooms);
        fileManager.saveReservations(reservations);

        System.out.println("\n[Success] Room booked successfully!");
        System.out.println("Your Reservation ID is: " + resId);
    }

    private static void viewAllReservations() {
        System.out.println("\n--- All Reservations ---");
        if (reservations.isEmpty()) {
            System.out.println("No reservations found.");
            return;
        }
        for (Reservation res : reservations) {
            System.out.println(res.toString());
        }
    }

    private static void cancelReservation() {
        System.out.println("\n--- Cancel a Reservation ---");
        System.out.print("Enter your Reservation ID to cancel: ");
        String resId = scanner.nextLine().toUpperCase();

        Reservation targetRes = null;
        for (Reservation res : reservations) {
            if (res.getReservationId().equals(resId)) {
                targetRes = res;
                break;
            }
        }

        if (targetRes == null) {
            System.out.println("[Error] Reservation not found.");
            return;
        }

        // Make the room available again
        Room roomToFree = getRoomById(targetRes.getRoomId());
        if (roomToFree != null) {
            roomToFree.setAvailable(true);
        }

        // Remove and save
        reservations.remove(targetRes);
        fileManager.saveRooms(rooms);
        fileManager.saveReservations(reservations);

        System.out.println("\n[Success] Reservation canceled successfully.");
    }

    private static Room getRoomById(String roomId) {
        for (Room room : rooms) {
            if (room.getRoomId().equals(roomId)) {
                return room;
            }
        }
        return null;
    }
}
