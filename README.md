# Hotel-Booking-API

By,

*   GG Ashwin Prabhu
*   Sharan Kumar
*   Rimika Bhaumik
*   Sthuthi B
*   Harshvardhan Jaiswal

This project is a distributed system for managing hotel bookings, including services for authentication, payments, and feedback. Each service runs independently to ensure scalability and modularity.

##All the Endpoints in this API is built using REST principles

---
# Steps to run the API
1. run   `npm run start:auth` to start the auth service
2. run   `npm run start:payment` to start the payment service
2. run   `npm run start:feedback` to start the feedback service

[Link to SwaggerHub](https://app.swaggerhub.com/apis/ASHWINPRABHU2001/Hotel_Booking_API/1.0.0)


# Auth Service Documentation

## Overview

The Auth Service provides endpoints for user registration, login, token verification, and user profile management.

## Endpoints

### 1. Register a New User

- **URL:** `/auth/register`
- **Method:** `POST`
- **Summary:** Register a new user.
- **Request Body:**
  ```json
  {
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "password": "string",
    "role": "TRAVELER | HOTEL_MANAGER"
  }
  ```
- **Responses:**
  - `201 Created`: User registered successfully.
  - `400 Bad Request`: Invalid input data.
  - `500 Internal Server Error`: Server error.

### 2. User Login

- **URL:** `/auth/login`
- **Method:** `POST`
- **Summary:** User login.
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Responses:**
  - `200 OK`: Login successful, token returned.
   ```json
    {
      "token": string,
      "userId": "string"
    }
    ```
  - `400 Bad Request`: User not found or invalid credentials.
  - `500 Internal Server Error`: Server error.

### 3. Verify Authentication Token

- **URL:** `/auth/verify`
- **Method:** `POST`
- **Summary:** Verify authentication token.
- **Security:** Bearer Token
- **Responses:**
  - `200 OK`: Token is valid.
    ```json
    {
      "isValid": true,
      "userId": "string",
      "role": "string"
    }
    ```
  - `401 Unauthorized`: Invalid token.

### 4. Get User Profile

- **URL:** `/api/users/{user_id}`
- **Method:** `GET`
- **Summary:** Retrieve user profile by ID.
- **Security:** Bearer Token
- **Path Parameters:**
  - `user_id` (string): The ID of the user.
- **Responses:**
  - `200 OK`: User profile information.
  - `403 Forbidden`: Unauthorized access.
  - `404 Not Found`: User not found.
  - `500 Internal Server Error`: Server error.

### 5. Update User Profile

- **URL:** `/api/users/{user_id}`
- **Method:** `PUT`
- **Summary:** Update user profile information.
- **Security:** Bearer Token
- **Path Parameters:**
  - `user_id` (string): The ID of the user.
- **Request Body:**
  ```json
  {
    "first_name": "string",
    "last_name": "string",
    "password": "string"
  }
  ```
- **Responses:**
  - `200 OK`: Profile updated successfully.
  - `403 Forbidden`: Unauthorized access.
  - `404 Not Found`: User not found.
  - `500 Internal Server Error`: Server error.

## Authentication

All endpoints requiring user authentication use a Bearer Token passed in the `Authorization` header.

## Models

### User Object

```json
{
  "id": "string",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "role": "TRAVELER | HOTEL_MANAGER",
  "createdAt": "string",
  "updatedAt": "string"
}
```

# User Endpoints

This section describes the User-related API endpoints.

## 1. Get User Profile

- **URL:** `/api/users/{user_id}`
- **Method:** `GET`
- **Description:** Retrieve user profile information by user ID.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **URL Parameters:**
  - `user_id` (string) - The ID of the user.
- **Security:** Bearer Authentication
- **Responses:**
  - `200 OK`
    - **Description:** User profile information.
    - **Response Body:**
      ```json
      {
        "id": "12345",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "role": "TRAVELER"
      }
      ```
  - `403 Forbidden`
    - **Description:** Unauthorized access.
  - `404 Not Found`
    - **Description:** User not found.
  - `500 Internal Server Error`
    - **Description:** Server error.

## 2. Update User Profile

- **URL:** `/api/users/{user_id}`
- **Method:** `PUT`
- **Description:** Update user profile information.
- **Request Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **URL Parameters:**
  - `user_id` (string) - The ID of the user.
- **Request Body:**
  - Example:
    ```json
    {
      "first_name": "John",
      "last_name": "Smith",
      "password": "newPassword123"
    }
    ```
- **Security:** Bearer Authentication
- **Responses:**
  - `200 OK`
    - **Description:** Profile updated successfully.
    - **Response Body:**
      ```json
      {
        "id": "12345",
        "first_name": "John",
        "last_name": "Smith",
        "email": "john.doe@example.com",
        "role": "TRAVELER"
      }
      ```
  - `403 Forbidden`
    - **Description:** Unauthorized access.
  - `404 Not Found`
    - **Description:** User not found.
  - `500 Internal Server Error`
    - **Description:** Server error.

## 3. Delete User Account

- **URL:** `/api/users/{user_id}`
- **Method:** `DELETE`
- **Description:** Delete a user account by user ID.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **URL Parameters:**
  - `user_id` (string) - The ID of the user.
- **Security:** Bearer Authentication
- **Responses:**
  - `200 OK`
    - **Description:** User deleted successfully.
    - **Response Body:**
      ```json
      {
        "message": "User deleted successfully"
      }
      ```
  - `403 Forbidden`
    - **Description:** Unauthorized access.
    - **Response Body:**
      ```json
      {
        "error": "Unauthorized access"
      }
      ```
  - `404 Not Found`
    - **Description:** User not found.
    - **Response Body:**
      ```json
      {
        "error": "User not found"
      }
      ```
  - `500 Internal Server Error`
    - **Description:** Server error.
    - **Response Body:**
      ```json
      {
        "error": "Server error"
      }
      ```


# Payment API Documentation

This Payment API is part of the Hotel Booking System, enabling payment management for bookings. The API supports operations like making payments, retrieving payment details, checking payment status, retrying failed payments, and more.

## Prerequisites

### Authentication & Authorization
All endpoints require an **Authorization token** in the `Authorization` header:
- Token format: `Bearer <JWT_TOKEN>`
- Tokens are validated using the `Auth Service`.

### Roles
Access is restricted based on user roles:
- **TRAVELER**: Regular user making payments.
- **HOTEL_MANAGER**: Administrator managing payments across the system.

---

## Endpoints
### 1. Retrieve a list of payments with optional filters.
### **GET /api/payments/**

**Required Token:**  
`TRAVELER` (only their payments) or `HOTEL_MANAGER` (any payment).

#### Query Parameters:
| Parameter    | Type     | Description                                                   |
|--------------|----------|---------------------------------------------------------------|
| `payment_id` | `string` | Filter by payment ID.                                         |
| `traveler_id`| `string` | Filter by traveler ID (HOTEL_MANAGER only).                   |
| `status`     | `string` | Filter by payment status (`IN_PROGRESS`, `FAILED`, `COMPLETED`). |
| `order_by`   | `string` | Order results by column (default: `created_at`).              |
| `order`      | `string` | Order direction (`ASC` or `DESC`, default: `ASC`).            |

---

### 2. Retrieve all payment statuses (HOTEL_MANAGER only).
### **GET /api/payments/status**

**Required Token:**  
`HOTEL_MANAGER`

#### Response:
- List of payments with `payment_id`, `traveler_id`, and `status`.

---

### 3. Make a new payment.
### **POST /api/payments/**

**Required Token:**  
`TRAVELER`

#### Request Body:
| Field           | Type     | Description                         |
|------------------|----------|-------------------------------------|
| `user_id`        | `string` | ID of the user making the payment.  |
| `amount`         | `number` | Payment amount (must be positive).  |
| `payment_method` | `string` | Payment method (`CREDIT` or `UPI`). |

---

### 4. Retrieve a specific payment by its ID.
### **GET /api/payments/:id**

**Required Token:**  
`TRAVELER` (only their payments) or `HOTEL_MANAGER` (any payment).

#### Path Parameters:
| Parameter | Type     | Description               |
|-----------|----------|---------------------------|
| `id`      | `string` | ID of the payment to fetch.|

---

### 5. Retrieve the status of a specific payment.
### **GET /api/payments/:id/status**

**Required Token:**  
`TRAVELER` (only their payments) or `HOTEL_MANAGER` (any payment).

#### Path Parameters:
| Parameter | Type     | Description               |
|-----------|----------|---------------------------|
| `id`      | `string` | ID of the payment to fetch.|

---

### 6. Retrieve all payments for a specific traveler.
### **GET /api/payments/traveler/:traveler_id**

**Required Token:**  
`TRAVELER` (only their payments) or `HOTEL_MANAGER` (any payment).

#### Path Parameters:
| Parameter     | Type     | Description                      |
|---------------|----------|----------------------------------|
| `traveler_id` | `string` | ID of the traveler to retrieve payments for.|

---

### 7. Retry a failed payment.
### **POST /api/payments/:id/retry**

**Required Token:**  
`TRAVELER`

#### Path Parameters:
| Parameter | Type     | Description                     |
|-----------|----------|---------------------------------|
| `id`      | `string` | ID of the payment to retry.     |

#### Notes:
- Only payments in `FAILED` status can be retried.

---

## Error Handling
- **401 Unauthorized:** Invalid or missing token.
- **403 Forbidden:** Insufficient permissions.
- **404 Not Found:** Resource not found.
- **500 Internal Server Error:** Unexpected server issue.

---

## Simulated Payment Processing
Payments initially have the status `IN_PROGRESS`. After a short delay, the status is updated to:
- `COMPLETED` (80% chance)
- `FAILED` (20% chance)
