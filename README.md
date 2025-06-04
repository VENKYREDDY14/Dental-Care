# Dental Checkup System

This is a full-stack web application designed for managing dental checkups. It facilitates patient appointments, allows doctors to manage appointments and their profiles, and provides functionality for both patients and doctors to interact with the system.

---
**Live Link https://oral-vis-venkys-projects-6be83651.vercel.app/

## **Objective**

The goal of this project is to develop a Dental Checkup System that handles:

- Patient appointments and management.
- Doctor management and appointment scheduling.
- A responsive user interface for both patients and doctors.
- Efficient backend for handling business logic and data processing.

---

## **Features**

### **Patient Features**

- **Create Account**:
  - Patients can create an account with their details such as name, email, phone number, etc.
- **Book Appointment**:
  - Patients can book appointments with doctors, providing relevant details.
- **View Appointment History**:
  - Patients can view their appointment history, including status and doctor's details.
- **Download Appointment Details**:
   - Patients can download appointment details in pdf format

### **Doctor Features**

- **Create Account**:
  - Doctors can create their account with their details such as name, email, phone number, etc.
- **Manage Appointments**:
  - Doctors can view and manage their scheduled appointments.
- **Update Availability**:
  - Doctors can update their availability for appointments.

### **Admin Features**

- **User Management**:
  - Admins can view and manage patients and doctors.
- **Appointment Management**:
  - Admins can view and manage all appointments in the system.
- **Report Generation**:
  - Admins can generate reports on appointments and user activity.

---

## **Setup Instructions**

### **Prerequisites**

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### **Steps to Run the Project**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/VENKYREDDY14/OralVis.git
   cd OralVis
2.Install Dependencies: Navigate to the frontend and backend directories and install dependencies:
  # For backend
cd backend
npm install

# For frontend
cd ../frontend
npm install
3.Set Up Environment Variables: Create a .env file in the backend directory with the following content:
MONGODB_URI='mongodb+srv://venkyreddy:venkyreddy@agro.umqae6c.mongodb.net/OralVis'
JWT_SECRET='oralvis'
EMAIL_USER='venkyreddy2031@gmail.com'
EMAIL_PASS='xlrl lhxl xusg pkxz'
CLOUDINARY_NAME='dsad92ak9'
CLOUDINARY_API_KEY='269325178652367'
CLOUDINARY_SECRET_KEY='skiUay9_yGFQUhRYOXZQE8kNbXM'
Create a .env file in the frontend directory with the following content:
REACT_APP_BACKEND_URL='https://oralvis-i2kt.onrender.com'
REACT_APP_ADMIN_GMAIL='admin@gmail.com'
REACT_APP_ADMIN_PASSWORD='admin@password'
4.Start the Backend Server:
cd backend
npm start
5.Start the Frontend Development Server:
cd ../frontend
npm start
6.Access the Application:
Open your browser and navigate to http://localhost:3000.
Database Mock Data
Users Collection
{
  "_id": "680af426349ec4c4fd6054de",
  "name": "venkyreddy14",
  "email": "ro200212@rguktong.ac.in",
  "password": "$2b$10$TrSH9Hjk8slK4n3whDYemeRW5r4sTormRQnhxkZsB7PUz62S11wh6",
  "phoneNumber": "7416723924",
  "role": "patient",
  "otp": null,
  "otpExpiresAt": null,
  "createdAt": "2025-04-25T02:32:06.581Z"
}
Doctors Collection
{
  "_id": "680af7b97da25e402ce50028",
  "name": "rahul",
  "email": "venkyreddyy2004@gmail.com",
  "password": "$2b$10$kyXiFeJk5S.A8zIyP.jgb.kQxpDIpfJae7mLrGoOH0E/KrXXAMfni",
  "phoneNumber": "7799447698",
  "speciality": "wertyui",
  "role": "doctor",
  "otp": null,
  "otpExpiresAt": null,
  "createdAt": "2025-04-25T02:47:21.744Z"
}
Appointments Collection
{
  "_id": "680b03434e14be44bdeeac7a",
  "userId": "680af426349ec4c4fd6054de",
  "doctorId": "680af7b97da25e402ce50028",
  "status": "completed",
  "date": "2025-04-25T03:36:35.542Z",
  "createdAt": "2025-04-25T03:36:35.556Z",
  "updatedAt": "2025-04-25T05:02:21.709Z"
}
API Endpoints
User Routes

Method	Endpoint	Description
POST	/register	Register a new user
POST	/verify-user	Verify user OTP
POST	/login	Login a user
POST	/book-appointment	Book an appointment
GET	/appointments	Get all appointments
Doctor Routes

Method	Endpoint	Description
POST	/register	Register a new doctor
POST	/login	Login a doctor
GET	/appointments	Get appointments for the doctor
PUT	/update-appointment	Update appointments status
Technologies Used
Frontend
React.js

Tailwind CSS

Axios

React Router

Backend
Node.js

Express.js

MongoDB (Mongoose)

JWT (for authentication)

Learning Outcomes
By completing this project, the following skills were developed:

Frontend Development
Building responsive and user-friendly interfaces using React.js and Tailwind CSS.

Backend Development
Developing RESTful APIs using Node.js and Express.js.

Implementing authentication and authorization using JWT.

Database Management
Designing and managing a MongoDB database with Mongoose.

File Uploads
Handling image and file uploads using Cloudinary and Multer.

Deployment
Deploying the application to a production environment (e.g., Heroku or AWS)

Contributing
This project was developed as part of an assignment. Contributions are not expected, but feel free to fork the repository for learning purposes.


