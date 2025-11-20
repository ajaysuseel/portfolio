# Dynamic Portfolio

A modern, dynamic portfolio website built with **React**, **Vite**, and **Firebase**. This application features a public-facing portfolio and a secure Admin Dashboard that allows for real-time content management without touching the code.

**Live Site:** [https://portfolio2030.vercel.app/](https://portfolio2030.vercel.app/)

## Features

### 🎨 Public Portfolio
-   **Dynamic Hero Section**: Displays Title, Bio, and Profile Image managed via the Admin panel.
-   **Skills Showcase**: Visual list of technical skills with proficiency levels.
-   **Project Gallery**: Showcase of projects with descriptions, images, and links (GitHub/Live).
-   **Responsive Design**: Fully optimized for all devices.
-   **Dark Mode**: Sleek, premium dark theme.

### 🛠️ Admin Dashboard
-   **Secure Authentication**: Firebase Authentication for admin login.
-   **Profile Management**: Edit Hero Title, Bio, Profile Image, and Navbar Logo.
-   **Skill Management**: Add, remove, and update skills with custom icons.
-   **Project Management**: Add, edit, and delete projects.
-   **Visual Feedback**: "Saved" vs "Unsaved Changes" indicators for better UX.

## Tech Stack
-   **Frontend**: React, Vite
-   **Styling**: CSS Variables, Lucide React (Icons)
-   **Backend**: Firebase (Firestore Database, Authentication)
-   **Deployment**: Vercel

## Local Development Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/ajaysuseel/portfolio.git
    cd portfolio
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your Firebase credentials:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Build for Production

To create a production-ready build:
```bash
npm run build
```
This will generate a `dist` folder suitable for deployment.

## Deployment (Vercel)
1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Add the Environment Variables (from your `.env` file) in the Vercel Project Settings.
4.  Deploy!
