package services;

import models.Reservation;
import models.Room;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class FileManager {
    private static final String ROOMS_FILE = "rooms.txt";
    private static final String RESERVATIONS_FILE = "reservations.txt";

    // Initialize files with default data if they don't exist
    public void initializeFiles() {
        File roomsFile = new File(ROOMS_FILE);
        if (!roomsFile.exists()) {
            try (PrintWriter writer = new PrintWriter(new FileWriter(roomsFile))) {
                writer.println("R001,Standard,100.0,true");
                writer.println("R002,Standard,100.0,true");
                writer.println("R003,Deluxe,150.0,true");
                writer.println("R004,Deluxe,150.0,true");
                writer.println("R005,Suite,250.0,true");
                System.out.println("rooms.txt created with default data.");
            } catch (IOException e) {
                System.out.println("Error initializing rooms: " + e.getMessage());
            }
        }

        File reservationsFile = new File(RESERVATIONS_FILE);
        if (!reservationsFile.exists()) {
            try {
                reservationsFile.createNewFile();
                System.out.println("reservations.txt created.");
            } catch (IOException e) {
                System.out.println("Error creating reservations file: " + e.getMessage());
            }
        }
    }

    // ------------------- Room Methods ------------------- //
    public List<Room> loadRooms() {
        List<Room> rooms = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(ROOMS_FILE))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length == 4) {
                    Room room = new Room(parts[0], parts[1], Double.parseDouble(parts[2]), Boolean.parseBoolean(parts[3]));
                    rooms.add(room);
                }
            }
        } catch (IOException e) {
            System.out.println("Error loading rooms: " + e.getMessage());
        }
        return rooms;
    }

    public void saveRooms(List<Room> rooms) {
        try (PrintWriter writer = new PrintWriter(new FileWriter(ROOMS_FILE))) {
            for (Room room : rooms) {
                writer.println(room.toFileString());
            }
        } catch (IOException e) {
            System.out.println("Error saving rooms: " + e.getMessage());
        }
    }

    // ------------------- Reservation Methods ------------------- //
    public List<Reservation> loadReservations() {
        List<Reservation> reservations = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(RESERVATIONS_FILE))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length == 4) {
                    Reservation reservation = new Reservation(parts[0], parts[1], parts[2], parts[3]);
                    reservations.add(reservation);
                }
            }
        } catch (IOException e) {
            System.out.println("Error loading reservations: " + e.getMessage());
        }
        return reservations;
    }

    public void saveReservations(List<Reservation> reservations) {
        try (PrintWriter writer = new PrintWriter(new FileWriter(RESERVATIONS_FILE))) {
            for (Reservation reservation : reservations) {
                writer.println(reservation.toFileString());
            }
        } catch (IOException e) {
            System.out.println("Error saving reservations: " + e.getMessage());
        }
    }
}
