# Video Management Web Application

## Overview
This **Video Management Web Application** is a **full-stack platform** built using **Node.js, Express.js, MySQL, and JavaScript**. It allows users to seamlessly **upload, manage, and secure videos**, featuring **JWT-based authentication** and optimized SQL queries for efficient database interactions.

## Features
- **Secure User Authentication**: Implements bcrypt for password hashing and JWT for authentication.
- **Video Upload & Management**: Users can upload and manage video files with ease.
- **Optimized Database Performance**: SQL queries optimized to reduce response times by **30%**.
- **RESTful API Architecture**: Ensures modular and scalable backend development.

## Technologies Used
- **Frontend**: JavaScript, HTML, CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT, bcrypt
- **Environment Configuration**: `.env` file

## Setup Instructions
### **1. Clone the Repository**
```sh
git clone <your-repo-url>
cd video-management-app
```

### **2. Install Dependencies**
```sh
npm install
```

### **3. Configure Environment Variables**
Create a `.env` file in the root directory and fill it with the following details:
```sh
DB_HOST=your-database-host
DB_NAME=your-database-name
DB_USER=your-database-username
DB_PASSWORD=your-database-password
PORT=3000
JWT_SECRET=your-secret-key
```

### **4. Database Setup**
Run the following MySQL command to create the required database:
```sql
CREATE DATABASE video_management;
```
Import the database schema:
```sh
mysql -u <DB_USER> -p <DB_NAME> < database.sql
```

### **5. Run the Application**
Start the server with:
```sh
npm start
```
Access the application in your browser at:
```
http://localhost:3000
```

## API Endpoints
### **User Authentication**
- **POST** `/api/register` - Register a new user
- **POST** `/api/login` - Authenticate user and receive JWT token

### **Video Management**
- **POST** `/api/videos/upload` - Upload a new video
- **GET** `/api/videos` - Fetch all uploaded videos
- **DELETE** `/api/videos/:id` - Delete a video by ID

## Performance Optimizations
- Optimized SQL queries to **reduce response times by 30%**.
- Implemented **pagination** for video retrieval to improve scalability.
- Utilized **caching mechanisms** to reduce redundant database queries.

## Future Enhancements
- Implement **video streaming** instead of downloads.
- Add **role-based access control (RBAC)**.
- Integrate **cloud storage (AWS S3 or Google Cloud Storage)**.


## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

