# Report-It

Report-It is a full-stack web application for reporting, tracking, and managing issues in a community or organization. It features role-based access for citizens, moderators, and administrators, and provides real-time updates, analytics, and a modern UI.

## Features

- **User Authentication:** Secure login/register with support for Google OAuth.
- **Issue Reporting:** Citizens can report issues with details and attachments.
- **Issue Tracking:** Track status and progress of reported issues.
- **Role Management:** Admins, moderators, and citizens have different dashboards and permissions.
- **Comments & Feedback:** Users can comment on issues for updates and discussion.
- **Analytics & Statistics:** Visual dashboards for admins and moderators.
- **Real-time Updates:** Uses sockets for live notifications and updates.
- **File Uploads:** Attach images or documents to issues.

## Project Structure

```
backend/    # Node.js/Express server, API, DB, authentication
frontend/   # React app, UI components, pages, context
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (or your configured database)

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables (e.g., `.env` for DB, Cloudinary, etc.).
4. Start the server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Folder Overview

- **backend/config/**: Configuration files (DB, Cloudinary, Passport, etc.)
- **backend/controllers/**: Express controllers for business logic
- **backend/models/**: Mongoose models for MongoDB
- **backend/routes/**: API route definitions
- **backend/middleware/**: Express middleware (auth, roles)
- **frontend/src/components/**: Reusable React components
- **frontend/src/pages/**: Page-level React components (admin, citizen, moderator)
- **frontend/src/contexts/**: React context providers
- **frontend/src/hooks/**: Custom React hooks
- **frontend/src/lib/**: Utility functions
- **frontend/src/socket/**: Socket.io client setup

## Technologies Used
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** Passport.js, Google OAuth
- **File Uploads:** Cloudinary
- **Real-time:** Socket.io

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
