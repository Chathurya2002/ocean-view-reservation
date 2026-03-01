# Ocean View Reservation - Java Spring Boot Backend

This directory contains the migrated Java Spring Boot backend for the Ocean View Reservation system. It replaces the original Node.js Express backend and connects to the identical MongoDB database.

## Prerequisites
- **Java 17** or higher installed.
- An IDE with Java and Maven support (e.g., **IntelliJ IDEA**, **Eclipse**, or **VS Code** with the 'Extension Pack for Java').

## How to Run

1. **Stop the existing Node.js Backend**: 
   Since this Java backend also uses Port 5000, make sure to stop the existing Node.js backend if it is running.

2. **Open in Your IDE**:
   Open this `backend-java` folder in your preferred Java IDE. 

3. **Resolve Dependencies**:
   Allow your IDE to download the dependencies listed in the `pom.xml` file (Spring Web, Spring Data MongoDB, jjwt, Lombok).

4. **Run the Application**:
   Run the `OceanViewApplication.java` file (located in `src/main/java/com/oceanview/reservation/OceanViewApplication.java`).
   
5. **Verify**:
   The backend will start on `http://localhost:5000`. You can now run your React frontend as usual, and it will communicate with this new Java backend perfectly!
