# Database Schema Specifications

## Collections Overview

| Collection | Key Fields | Purpose |
|---|---|---|
| `users` | `phoneNumber`, `name`, `role`, `language`, `isVerified` | Auth & Identity |
| `farmers` | `userId`, `village`, `district`, `totalLandAcres`, `primaryCrops` | Farmer Demographics |
| `farms` | `farmerId`, `sizeInAcres`, `soilType`, `location` (GeoJSON) | Land & Geo-plots |
| `crops` | `farmId`, `cropName`, `season`, `sowingDate`, `currentStage`, `healthStatus` | Crop Cycles |
| `soils` | `farmId`, `phLevel`, `nitrogen`, `phosphorus`, `potassium` | Soil Nutrient Tests |
| `weathers` | `location`, `temperatureCelsius`, `humidityPercentage`, `forecastDays` | Weather Cache |
| `labours` | `fullName`, `skills`, `dailyWageRate`, `location` | Labour Registry |
| `machineries` | `modelName`, `machineryType`, `hourlyRate`, `location` | Machinery Registry |
| `bookings` | `farmerId`, `bookingType`, `serviceRefId`, `status`, `totalAmount` | Service Bookings |
| `products` | `sellerId`, `name`, `category`, `pricePerUnit`, `availableQuantity` | Marketplace Items |
| `orders` | `buyerId`, `sellerId`, `items`, `totalAmount`, `orderStatus` | Marketplace Orders |
| `notifications` | `recipientId`, `title`, `message`, `type`, `isRead` | User Notifications |
