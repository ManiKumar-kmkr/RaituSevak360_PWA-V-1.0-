# Manual Test Cases & Acceptance Criteria

| ID | Module | Scenario | Expected Result |
|---|---|---|---|
| TC-001 | Auth | Farmer logs in with valid 10-digit mobile number and OTP | Redirected to `/dashboard` with valid JWT in local storage |
| TC-002 | Crops | Farmer records new crop with sowing date and acreage | Crop appears in crop management listing |
| TC-003 | AI Advisory | Farmer submits crop stage and soil type | Returns AI recommended agronomy practices and fertilizer advice |
| TC-004 | Weather | Farmer opens weather module | Returns live temperature and precipitation alerts for their district |
| TC-005 | Machinery | Farmer requests tractor rental | Booking record created with 'pending' status |
