# RentIt Customer Services

Customer-facing microservice for browsing and viewing vehicle details in the RentIt application.

## Port Configuration
- **Port**: 9093
- **Base URL**: `http://localhost:9093`
- **Development note**: Frontend calls services through the API Gateway at `http://localhost:8080` (e.g., `http://localhost:8080/customer/vehicles`)

## Database
- **Database Name**: `p20_rentit`
- **Connection**: MySQL (localhost:3306)

## Features
1. **Browse Available Vehicles** - View all vehicles available for rent
2. **View Vehicle Details** - Get detailed information about a specific vehicle

## API Endpoints

### 1. Browse All Available Vehicles
- **Method**: GET
- **Endpoint**: `/api/customer/vehicles`
- **Description**: Retrieves all vehicles with status "Available"
- **Response**: List of vehicles with basic information including primary image

**Response Format**:
```json
{
  "success": true,
  "message": "Vehicles retrieved successfully",
  "count": 10,
  "data": [
    {
      "vehicleId": 1,
      "vehicleTypeName": "Sedan",
      "brandName": "Honda",
      "modelName": "City",
      "fuelType": "Petrol",
      "ac": 1,
      "status": "Available",
      "vehicleNumber": "MH01AB1234",
      "rate": 1500.00,
      "priceUnit": "per day",
      "primaryImageBase64": "base64encodedstring..."
    }
  ]
}
```

### 2. Browse Vehicles by Type
- **Method**: GET
- **Endpoint**: `/api/customer/vehicles/type/{vehicleTypeId}`
- **Description**: Retrieves available vehicles filtered by vehicle type
- **Path Parameter**: `vehicleTypeId` - The ID of the vehicle type

### 3. Browse Vehicles by Brand
- **Method**: GET
- **Endpoint**: `/api/customer/vehicles/brand/{brandId}`
- **Description**: Retrieves available vehicles filtered by brand
- **Path Parameter**: `brandId` - The ID of the brand

### 4. Browse Vehicles by Fuel Type
- **Method**: GET
- **Endpoint**: `/api/customer/vehicles/fuel/{fuelTypeId}`
- **Description**: Retrieves available vehicles filtered by fuel type
- **Path Parameter**: `fuelTypeId` - The ID of the fuel type

### 5. Get Vehicle Details
- **Method**: GET
- **Endpoint**: `/api/customer/vehicles/{vehicleId}`
- **Description**: Retrieves detailed information about a specific vehicle
- **Path Parameter**: `vehicleId` - The ID of the vehicle

**Response Format**:
```json
{
  "success": true,
  "message": "Vehicle details retrieved successfully",
  "data": {
    "vehicleId": 1,
    "ownerId": 5,
    "vehicleTypeId": 1,
    "vehicleTypeName": "Sedan",
    "rate": 1500.00,
    "deposit": 5000.00,
    "priceUnit": "per day",
    "modelId": 3,
    "modelName": "City",
    "brandId": 2,
    "brandName": "Honda",
    "fuelTypeId": 1,
    "fuelType": "Petrol",
    "ac": 1,
    "status": "Available",
    "vehicleNumber": "MH01AB1234",
    "vehicleRcNumber": "MH01AB1234RC",
    "description": "Well maintained Honda City, perfect for city drives",
    "images": [
      {
        "vehicleImageId": 1,
        "imageBase64": "base64encodedstring...",
        "isPrimary": 1,
        "createdAt": "2024-01-15T10:30:00"
      }
    ]
  }
}
```

## Project Structure

```
src/main/java/com/rentit/
├── config/
│   └── CorsConfig.java              # CORS configuration
├── controllers/
│   └── VehicleController.java       # REST API endpoints
├── dto/
│   ├── VehicleListDTO.java          # DTO for vehicle list
│   ├── VehicleDetailDTO.java        # DTO for vehicle details
│   └── VehicleImageDTO.java         # DTO for vehicle images
├── entities/
│   ├── Vehicle.java                 # Vehicle entity
│   ├── VehicleType.java             # Vehicle type entity
│   ├── VehicleImage.java            # Vehicle image entity
│   ├── Model.java                   # Model entity
│   ├── Brand.java                   # Brand entity
│   └── FuelType.java                # Fuel type entity
├── repositories/
│   ├── VehicleRepository.java       # Vehicle repository
│   └── VehicleImageRepository.java  # Vehicle image repository
└── services/
    └── VehicleService.java          # Business logic
```

## Dependencies
- Spring Boot 4.0.2
- Spring Data JPA
- Spring Web MVC
- MySQL Connector
- Lombok
- Spring Boot DevTools

## Running the Application

1. Ensure MySQL is running and database `p20_rentit` exists
2. Navigate to project directory:
   ```bash
   cd "C:\Users\Rohit\OneDrive\Desktop\Cdac Project\Git repo\Rent-It\backend\Spring Boot\RentIt_customer_services"
   ```

3. Run with Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
   Or on Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

4. Application will start on port 7001

## Notes
- Token authentication is handled by the API Gateway, not this service
- All images are returned as Base64 encoded strings
- Only vehicles with status "Available" are returned in browse endpoints
- CORS is configured to allow requests from localhost:5173 (frontend)
