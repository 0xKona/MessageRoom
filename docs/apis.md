
# API Schema Documentation

## 1. User Signup

**Endpoint:** `POST /users/signup`

**Description:** Allows users to sign up by providing necessary credentials.

### Request:
- **Headers:**
  - `Content-Type: application/json`

- **Body:**
  ```json
  {
    "UserName": "string (min 2, max 100 characters)",
    "Email": "string (valid email)",
    "Password": "string (min 6 characters)"
  }
  ```

### Response:
- **Status 200:**
  ```json
  {
    "insertedId": "MongoDB object ID for the new user"
  }
  ```

- **Status 400:** (Validation or bad request errors)
  ```json
  {
    "error": "Description of the validation error"
  }
  ```

- **Status 409:** (Email already taken)
  ```json
  {
    "error": "email already taken"
  }
  ```

---

## 2. User Login

**Endpoint:** `POST /users/login`

**Description:** Allows users to log in by providing their email and password.

### Request:
- **Headers:**
  - `Content-Type: application/json`

- **Body:**
  ```json
  {
    "Email": "string (valid email)",
    "Password": "string (valid password)"
  }
  ```

### Response:
- **Status 200:** (Successful login)
  ```json
  {
    "_id": "string",
    "UserName": "string",
    "Email": "string",
    "Token": "JWT token string",
    "RefreshToken": "JWT refresh token string"
  }
  ```

- **Status 400:** (Invalid credentials)
  ```json
  {
    "error": "login or password is incorrect"
  }
  ```

---

## 3. Authentication Middleware

**Description:** This middleware is used to protect routes that require user authentication by validating the JWT token in the request header.

### Usage:
- **Headers:**
  - `Authorization: Bearer <JWT Token>`

### Middleware Behavior:
- If the token is valid, the request proceeds, and the user's `email`, `username`, and `userID` will be set in the context.
- If the token is invalid or not provided, the server responds with:
  - **Status 401:**
    ```json
    {
      "error": "No authorization token provided"
    }
    ```
  - **Status 500:**
    ```json
    {
      "error": "Detailed error message"
    }
    ```

---

## Example Flow

- **Signup:** 
  The frontend sends a `POST` request to `/users/signup` with the user's details. On success, it receives the `insertedId` of the new user.

- **Login:** 
  The frontend sends a `POST` request to `/users/login` with email and password. On success, it receives a `Token` and `RefreshToken`, which should be stored for authenticating future requests.

- **Protected Routes:** 
  Any future requests to protected routes (not shown in the code) would need to include the `Authorization: Bearer <JWT Token>` header for authentication. The backend middleware (`Authentication`) will validate the token.
