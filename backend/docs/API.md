# LHacks Portal Backend API Documentation

## Overview
The LHacks Portal Backend API provides authentication, user management, meal management, and scan management services for the LHacks platform. It's built with Flask and uses Auth0 for OAuth authentication. This API serves as the backend for the LHacks Portal, handling user authentication, session management, meal tracking, event check-ins, and related functionalities.

## Base URL
The base URL for all endpoints is not specified in the provided code. Ensure to prefix all endpoints with your API's base URL, which should be the deployed URL of your LHacks Portal Backend.

## Authentication Endpoints

### 1. Test Endpoint
- **URL**: `/auth/test`
- **Method**: POST
- **Description**: A test endpoint that returns the request object. Useful for debugging and checking API connectivity.
- **Response**: Returns the request object.

### 2. OAuth Callback
- **URL**: `/auth/callback`
- **Method**: GET, POST
- **Description**: Handles the OAuth callback from Auth0. It creates a new user if one doesn't exist, or retrieves an existing user. It then creates a session and redirects to the client application.
- **Response**: Redirects to `{CLIENT_URL}/callback/?uuid={sessionID}`

### 3. Get Token
- **URL**: `/auth/token/<uuid>`
- **Method**: GET
- **Description**: Retrieves a token for a given session UUID. This endpoint is used by the client application to obtain an authentication token after the OAuth flow is complete.
- **Parameters**: 
  - `uuid` (string): The session UUID
- **Response**: 
  - Success: Returns the token information (200 OK)
  - Error: Returns an error message (400 Bad Request or 401 Unauthorized)

### 4. Login
- **URL**: `/auth/login`
- **Method**: GET
- **Description**: Initiates the Auth0 login process for the LHacks Portal.
- **Response**: Redirects to Auth0 for authentication

### 5. Logout
- **URL**: `/auth/logout`
- **Method**: POST
- **Description**: Logs out the user from the LHacks Portal by clearing the session and removing the JWT from lookup.
- **Authentication**: Requires a valid JWT token
- **Response**: 
  - Success: `{ "success": true }` (200 OK)

## Meal Management Endpoints

### 1. Get All Meals
- **URL**: `/meal/`
- **Method**: GET
- **Description**: Retrieves all meals available in the system.
- **Authentication**: Requires a valid JWT token
- **Response**: 
  - Success: Returns a list of meals (200 OK)

### 2. Issue Meal Tokens
- **URL**: `/meal/tokens/issue`
- **Method**: POST
- **Description**: Issues meal tokens to all users for each available meal. Each user receives two tokens per meal.
- **Authentication**: Requires a valid JWT token
- **Response**: 
  - Success: `{"success": true, "tokens_created": <number>}` (201 Created)

### 3. Get Active Meal
- **URL**: `/meal/active`
- **Method**: GET
- **Description**: Retrieves the currently active meal.
- **Authentication**: Requires a valid JWT token
- **Response**: 
  - Success: Returns the active meal information (200 OK)
  - Error: `{"error": "No active meal"}` (500 Internal Server Error)

### 4. Deactivate Meal
- **URL**: `/meal/deactivate/<meal>`
- **Method**: POST
- **Description**: Deactivates a specific meal.
- **Parameters**: 
  - `meal` (string): The identifier of the meal to deactivate
- **Authentication**: Requires a valid JWT token
- **Response**: 
  - Success: Returns the deactivated meal information (200 OK)
  - Error: Returns an error message (500 Internal Server Error)

### 5. Activate Meal
- **URL**: `/meal/activate/<meal>`
- **Method**: POST
- **Description**: Activates a specific meal.
- **Parameters**: 
  - `meal` (string): The identifier of the meal to activate
- **Authentication**: Requires a valid JWT token
- **Response**: 
  - Success: Returns the activated meal information (200 OK)
  - Error: Returns an error message (500 Internal Server Error)

### 6. Get User's Meal Tokens
- **URL**: `/meal/tokens/<email>`
- **Method**: GET
- **Description**: Retrieves the meal tokens for a specific user.
- **Parameters**: 
  - `email` (string): The email of the user
- **Authentication**: Requires a valid JWT token
- **Response**: 
  - Success: Returns a list of the user's meal tokens (200 OK)
  - Error: Returns an error message (500 Internal Server Error)

## Scan Management Endpoints

### 1. Create Scan
- **URL**: `/scan/create`
- **Method**: POST
- **Description**: Creates a new scan for a user, which can be either a check-in or a meal scan.
- **Authentication**: Requires a valid JWT token
- **Request Body**:
  - `userid` (string): The ID of the user
  - `type` (integer): The type of scan (1 for meal, 2 for check-in)
  - `meal` (string, optional): Required for meal scans, the name of the meal
- **Response**: 
  - Success: `{"success": true, "message": "Scan created successfully", "scan": <scan_object>}` (201 Created)
  - Error: Returns an error message with appropriate status code
- **Error Scenarios**:
  - No input data provided (400 Bad Request)
  - Missing required fields (400 Bad Request)
  - No active meal for meal scans (500 Internal Server Error)
  - Meal name not provided for meal scans (500 Internal Server Error)
  - Error spending meal token (500 Internal Server Error)
  - User already checked in for check-in scans (500 Internal Server Error)
  - Any other unexpected errors (500 Internal Server Error)

### 2. Get User Scans
- **URL**: `/scan/filter/<email>/<type>`
- **Method**: GET
- **Description**: Retrieves all scans of a specific type for a given user.
- **Parameters**: 
  - `email` (string): The email of the user
  - `type` (integer): The type of scan to retrieve
- **Authentication**: Requires a valid JWT token
- **Response**: 
  - Success: `{"scans": [<scan_objects>]}` (200 OK)
  - Error: `{"error": "User doesn't exist"}` (500 Internal Server Error)

## Authentication
The LHacks Portal Backend API uses JWT (JSON Web Tokens) for authentication. The `validate_jwt` decorator is used to protect routes that require authentication. Clients should include the JWT in the Authorization header of their requests to authenticated endpoints.

## User Management
User management is handled by the `UserManager` class. The API automatically creates new users when they first authenticate through Auth0, storing their email and name.

## Session Management
Session management is handled by the `AuthManager` class. It creates and manages sessions, associating them with JWTs and user information.

## Meal Management
Meal management is handled by the `MealManager` class. It provides functionality to:
- Retrieve all meals
- Issue meal tokens to users
- Activate and deactivate meals
- Manage meal tokens for users

## Scan Management
Scan management is handled by the `ScanManager` class. It provides functionality to:
- Create new scans (check-ins or meal scans)
- Retrieve scans for a specific user and type
- Handle meal token spending for meal scans
- Prevent duplicate check-ins

### Scan Types
- Meal Scan (Type 1): Used for tracking meal consumption. Requires an active meal and spends a meal token.
- Check-In Scan (Type 2): Used for general event check-ins. Prevents duplicate check-ins for the same user.

### Meal Scan Process
1. Checks if there's an active meal
2. Verifies that a meal name is provided
3. Attempts to spend a meal token for the user
4. Creates and adds the scan if all checks pass

### Check-In Scan Process
1. Checks if the user has already checked in
2. Creates and adds the scan if it's the user's first check-in
3. Prevents duplicate check-ins

## Cross-Origin Resource Sharing (CORS)
Several endpoints, particularly in meal management and scan management, are configured to allow cross-origin requests using the `@cross_origin()` decorator. This is important for frontend applications hosted on different domains to interact with these endpoints.

## Error Handling
Errors are returned with appropriate HTTP status codes and error messages in the response body. Common error scenarios include:
- Invalid tokens (401 Unauthorized)
- Session not found (400 Bad Request)
- User not found (500 Internal Server Error)
- No active meal (500 Internal Server Error)
- Errors during meal activation/deactivation (500 Internal Server Error)
- Missing required fields in requests (400 Bad Request)
- Duplicate check-ins (500 Internal Server Error)
- Other server errors (500 Internal Server Error)

Scan management endpoints use a combination of specific error messages and general exception handling:
- Input validation errors return 400 Bad Request
- Most operational errors (e.g., no active meal, duplicate check-in) return 500 Internal Server Error
- Unexpected exceptions are caught, logged, and return 500 Internal Server Error

## Dependencies
- Flask: Web framework
- flask_cors: Handling Cross-Origin Resource Sharing (CORS)
- Auth0: OAuth authentication provider
- Custom modules:
  - lhacks.db: Database session management
  - lhacks.services.usermanager: User management functionality
  - lhacks.services.auth: Authentication and session management
  - lhacks.decorators.validate_jwt: JWT validation decorator
  - lhacks.services.mealmanager: Provides the `Meal` and `MealManager` classes for meal-related operations
  - lhacks.services.scanmanager: Provides the `ScanManager` class for scan-related operations
  - lhacks.schema.scan: Defines the `Scan` and `ScanType` classes

## Environment Variables
- `CLIENT_URL`: The URL of the LHacks Portal frontend application

## Development and Deployment Notes
- Ensure all required environment variables are set before running the API.
- The API uses CORS for several endpoints, which is crucial for allowing the frontend application to make requests to the backend.
- When deploying, make sure to configure the Auth0 application settings to match your production URLs.
- Regularly review and update the Auth0 configuration to ensure security best practices are followed.
- When testing and deploying, ensure that the meal management and scan management functionalities work correctly with the authentication system.
- Consider implementing a more granular error handling system, using appropriate HTTP status codes (e.g., 404 for not found, 403 for forbidden actions) instead of using 500 for all errors.
- Implement logging for authentication, meal management, and scan management actions to track usage and troubleshoot issues.
- Optimize database queries, especially for checking existing scans in the check-in process.
- Implement proper locking or transactions to prevent race conditions in meal token spending and scan creation.

## Security Considerations
- All sensitive operations should be performed over HTTPS.
- Regularly rotate secrets and keys used in the application.
- Implement rate limiting to prevent abuse of the API endpoints.
- Regularly audit the user management and authentication processes for potential vulnerabilities.
- All meal management and scan management endpoints require authentication, ensuring that only authorized users can access and modify information.
- Implement additional authorization checks to ensure that only users with appropriate roles (e.g., administrators) can perform certain actions like activating/deactivating meals, issuing tokens, or viewing scans for other users.
- Validate and sanitize all input data to prevent injection attacks.
- User existence is verified before processing scans.