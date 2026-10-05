# \# Disaster Volunteering Network (DVN)

# 

# A full-stack disaster response and volunteer coordination platform that connects volunteers, NGOs, and system administrators through a centralized platform for managing disaster-relief activities.

# 

# \## Overview

# 

# The Disaster Volunteering Network (DVN) is designed to improve coordination between volunteers and NGOs during disaster-response activities.

# 

# The platform allows volunteers to discover and apply for disaster-relief tasks, NGOs to create and manage tasks and verify volunteer contributions, and administrators to monitor users, activities, and system operations.

# 

# \## Key Features

# 

# \### Volunteer Module

# 

# \* Volunteer registration and login

# \* Volunteer profile management

# \* Skill-based task matching

# \* Disaster task browsing and application

# \* Task check-in

# \* Proof and volunteer-hour submission

# \* Volunteer points and badge generation

# \* Personal reminders and activity tracking

# 

# \### NGO Module

# 

# \* NGO registration and verification

# \* NGO dashboard

# \* Create and manage disaster-relief tasks

# \* Review volunteer applications

# \* Approve or reject volunteer requests

# \* Verify volunteer proof submissions

# \* Track volunteer activities

# \* View operational reports

# 

# \### Admin Module

# 

# \* Monitor system statistics

# \* Manage and verify users

# \* Monitor disaster-relief activities

# \* View system audit logs

# \* Manage emergency broadcast information

# \* Monitor platform-wide operations

# 

# \## Technology Stack

# 

# \### Frontend

# 

# \* HTML5

# \* CSS3

# \* JavaScript

# \* AngularJS

# 

# \### Backend

# 

# \* Node.js

# \* Express.js

# \* REST APIs

# 

# \### Database

# 

# \* MongoDB

# \* Mongoose

# \* MongoDB Compass

# 

# \## Project Structure

# 

# ```text

# Disaster-Volunteering-Network/

# │

# ├── backend/

# │   ├── config/

# │   ├── models/

# │   ├── routes/

# │   ├── seeds/

# │   ├── package.json

# │   └── server.js

# │

# ├── frontend/

# │   ├── css/

# │   ├── js/

# │   ├── volunteer/

# │   ├── ngo/

# │   ├── admin/

# │   ├── assets/

# │   ├── index.html

# │   ├── login.html

# │   └── register.html

# │

# ├── .gitignore

# ├── README.md

# └── start.bat

# ```

# 

# \## Application Workflow

# 

# ```text

# Volunteer / NGO

# &#x20;      │

# &#x20;      ▼

# &#x20;Registration / Login

# &#x20;      │

# &#x20;      ▼

# &#x20;Role-Based Portal

# &#x20;      │

# &#x20;┌─────┼──────────┐

# &#x20;▼     ▼          ▼

# Volunteer   NGO    Admin

# &#x20;  │          │       │

# &#x20;  ▼          ▼       ▼

# Find Tasks  Create   Monitor

# Apply       Tasks    Users

# Check-In    Verify   Activities

# Submit      Proofs   Audit Logs

# Proof

# &#x20;  │

# &#x20;  ▼

# MongoDB

# ```

# 

# \## Database

# 

# The application uses MongoDB for storing users, tasks, volunteer requests, proofs, system logs, broadcasts, reminders, and community highlights.

# 

# Default local MongoDB connection:

# 

# ```text

# mongodb://127.0.0.1:27017

# ```

# 

# Database:

# 

# ```text

# disaster\_volunteering\_network

# ```

# 

# \## Installation

# 

# \### 1. Clone the Repository

# 

# ```bash

# git clone https://github.com/kaviyav-cpu/Disaster-Volunteering-Network.git

# cd Disaster-Volunteering-Network

# ```

# 

# \### 2. Install Backend Dependencies

# 

# ```bash

# cd backend

# npm install

# ```

# 

# \### 3. Configure MongoDB

# 

# Make sure MongoDB is running locally and configure the required environment variables in the backend `.env` file.

# 

# Do not commit sensitive credentials or secret keys to GitHub.

# 

# \### 4. Start the Backend

# 

# ```bash

# node server.js

# ```

# 

# The backend runs on:

# 

# ```text

# http://localhost:5000

# ```

# 

# \### 5. Access the Application

# 

# Open the application through the frontend or the backend server according to the project configuration.

# 

# \## Data Flow

# 

# 1\. A volunteer or NGO registers on the platform.

# 2\. User information is stored in MongoDB.

# 3\. NGOs can be verified by the administrator.

# 4\. Verified NGOs can create disaster-relief tasks.

# 5\. Volunteers can view available tasks based on their skills.

# 6\. Volunteers can apply for suitable tasks.

# 7\. NGOs can approve or reject volunteer applications.

# 8\. Approved volunteers can check in for assigned tasks.

# 9\. Volunteers can submit proof of completed activities.

# 10\. NGOs can verify submitted proofs.

# 11\. Verified volunteer contributions are reflected in the volunteer profile.

# 12\. Administrators can monitor users, tasks, proofs, and system activity.

# 

# \## Purpose

# 

# The main objective of DVN is to provide a centralized digital platform for improving volunteer mobilization, NGO coordination, task management, and transparency during disaster-relief operations.

# 

# \## CI/CD Pipeline

# 

# The Disaster Volunteering Network implements an automated Continuous Integration and Continuous Deployment (CI/CD) pipeline:

# 

# 1\. Continuous Integration (CI) uses GitHub Actions.

# 2\. The CI workflow runs on pushes and pull requests to the `main` branch.

# 3\. CI sets up Node.js 20 and installs backend dependencies using `npm ci`.

# 4\. CI checks backend server syntax using `node --check server.js`.

# 5\. Continuous Deployment (CD) runs automatically after a successful push to the `main` branch.

# 6\. Pull requests do not trigger deployment.

# 7\. GitHub Actions triggers a Render Deploy Hook via a POST request.

# 8\. Render automatically builds and deploys the backend Web Service.

# 9\. Deployment secrets (`RENDER_DEPLOY_HOOK`) are securely stored in GitHub Actions Secrets.

# 10\. Production environment variables are stored securely in the Render dashboard environment configuration.

# 

# \## Future Enhancements

# 

# \* Cloud deployment

# \* Real-time notifications

# \* Location-based volunteer matching

# \* Mobile application

# \* Advanced disaster analytics

# \* Automated monitoring and reporting

# \* CI/CD-based automated deployment

# 

# \## License

# 

# This project is developed for academic and educational purposes.



