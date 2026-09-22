# Database Architecture (MongoDB + Mongoose)

- **Database Engine**: MongoDB.
- **ODM**: Mongoose with TypeScript schemas.
- **Geospatial Indexing**: `2dsphere` indexes enabled on `Farm` and `Weather` coordinates for proximity searches (e.g. nearby tractors, local weather stations).
- **Core Entities**:
  - `User`, `Farmer`, `Farm`, `Crop`, `Soil`, `Weather`, `Labour`, `Machinery`, `Booking`, `Product`, `Order`, `Notification`.
