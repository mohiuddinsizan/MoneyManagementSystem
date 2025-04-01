# Money Management System

## Overview
The **Money Management System** is a full-stack web application that helps users track their debts and owed amounts. Users can register, log in, add debts, update transactions, and view their transaction history. The backend is built using **Node.js, Express, and MongoDB**, with user authentication and image uploads supported via **Cloudinary**.

## Features
- **User Authentication**: Sign up and log in with JWT-based authentication.
- **Transaction Management**: Add, update, and delete debts and owed amounts.
- **Transaction History**: View the last 100 transactions.
- **Profile Management**: Upload profile pictures using Cloudinary.

## Tech Stack
- **Frontend**: React.js (to be implemented)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Token)
- **File Uploads**: Cloudinary for profile images
- **Middleware**: Multer for handling file uploads

## Installation & Setup
### Prerequisites
- **Node.js** and **npm** installed
- **MongoDB** database running
- **Cloudinary Account** (for image uploads)

### Steps
#### 1. Clone the Repository
```sh
git clone https://github.com/mohiuddinsizan/MoneyManagementSystem.git
cd MoneyManagementSystem
```
#### 2. Install Dependencies
##### Backend
```sh
cd backend
npm install
```
##### Frontend (if applicable)
```sh
cd ../frontend
npm install
```

#### 3. Environment Variables
Create a **.env** file in the `backend` folder with the following variables:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### 4. Start the Server
```sh
cd backend
npm start
```

## API Endpoints
### **Auth Routes**
| Method | Endpoint       | Description         |
|--------|--------------|---------------------|
| POST   | `/api/users/signup` | Register a new user |
| POST   | `/api/users/login` | Log in and get a token |

### **User Profile & Image Upload**
| Method | Endpoint       | Description         |
|--------|--------------|---------------------|
| GET    | `/api/users/profile` | Get user profile details |
| POST   | `/api/users/upload-image` | Upload a profile picture |

### **Transaction Routes**
| Method | Endpoint       | Description         |
|--------|--------------|---------------------|
| GET    | `/api/users/transaction-history` | Get the last 100 transactions |
| POST   | `/api/users/add-debt` | Add a debt |
| POST   | `/api/users/add-owed` | Add an owed amount |
| PUT    | `/api/users/update-debt/:id` | Update a debt |
| PUT    | `/api/users/update-owed/:id` | Update an owed amount |
| DELETE | `/api/users/delete-debt/:id` | Delete a debt |
| DELETE | `/api/users/delete-owed/:id` | Delete an owed amount |

## Future Improvements
- Implement a React frontend.
- Add expense categorization.
- Integrate email notifications.

## License
This project is open-source under the MIT License.

## Author
Developed by [Mohiuddin Sizan](https://github.com/mohiuddinsizan).

