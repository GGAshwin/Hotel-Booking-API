# Hotel-Booking-API

By,

*   GG Ashwin Prabhu
*   Sharan Kumar
*   Rimika Bhaumik
*   Sthuthi B
*   Harshvardhan Jaiswal

This project is a distributed system for managing hotel bookings, including services for authentication, payments, and feedback. Each service runs independently to ensure scalability and modularity.

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
