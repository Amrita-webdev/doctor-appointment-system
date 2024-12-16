# Docctor Appointent System

## Installation and Setup

Follow the steps below to set up the project locally:

- Prerequisites

    - Node.js and npm:

        - Ensure you have Node.js (version 16 or later) installed. You can download it from Node.js Official Website.

        - npm comes bundled with Node.js.

    -  Git:

        - Install Git to clone the repository. Download it from Git Official Website.

        - Backend Requirements:

Confirm that the backend service dependencies (e.g., database, API endpoints) are set up and running.

### Installation Steps

-  Clone the Repository:

    - git clone <repository-url>
    - cd <repository-folder>

- Install Dependencies:
    - Navigate to both the frontend and backend directories and install dependencies:

    - For the backend:

        - cd apps/backend
        - npm install

    - For the frontend:

        - cd apps/frontend
        - npm install

    - Environment Configuration:

- Create .env files for both frontend and backend, based on the provided .env.example files.

    - Example for Backend:

        - PORT=3000
        - SECRET_KEY=your_secret_key

    - Example for Frontend:

        - REACT_APP_API_BASE_URL=http://localhost:3000/api

- Run the Applications:

### Start the backend:

    cd ../apps/backend
    node server.js

### Start the frontend:

    cd ../apps/frontend
    npm start

### Access the Application:

    Backend will be available at http://localhost:3000

    Frontend will be available at http://localhost:3001


## Design Decisions and Thought Process

### Frontend Design

- Component-Based Architecture:

    The frontend is built using React, with components designed to be reusable and modular.

    A dedicated component is created for shared UI elements like buttons, forms, tables, and modals.

-  State Management:

    Local component state is used for isolated functionality, ensuring simplicity.

    Hooks such as useState manage state transitions efficiently.

- Routing:

    React Router is used to handle navigation between different roles (e.g., Admin and Doctor dashboards).

    Role-based redirection ensures secure access.

- Axios for API Calls:

    Axios is used to handle API requests, with a central authService managing authentication logic.

### Backend Design

- Express Framework:

    The backend is developed using Express.js for simplicity and scalability.

- JWT Authentication:

    JSON Web Tokens are used for secure authentication.

- Role-based access control ensures that only authorized users can access certain endpoints.

- Separation of Concerns:

    Routes, controllers, and utilities are organized into separate files to ensure maintainability.

- Error Handling:

    A consistent error-handling mechanism is implemented to provide clear feedback.

- CORS Configuration:

    Cross-Origin Resource Sharing (CORS) is enabled for frontend-backend communication.

### General Decisions

- Monorepo Structure:

    The project uses a monorepo structure for managing both frontend and backend under a single repository.

    This simplifies development, especially when making changes affecting both parts of the stack.

- Pagination and Search:

    Pagination and search functionalities are built into the table components and backend APIs to handle large datasets efficiently.

- Reusable Utilities:

    Helper functions for API requests and form validation ensure code reusability.

### Thought Process

-   Scalability:

    The architecture ensures that new features can be added without significant refactoring.

    Modular components and organized APIs enable easy scaling.

- Security:

    Implementing role-based access and JWT ensures secure data access.

    Sensitive data like API keys and database URIs are stored in environment variables.

-   Performance:

    Backend pagination optimize performance when dealing with large datasets.
