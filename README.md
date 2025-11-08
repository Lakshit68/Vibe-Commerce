Vibe-Commerce

A modern ecommerce web application built with cutting-edge front-end and back-end technologies, designed for smooth user experience, real-time functionality and scalable architecture.

🧩 Features

User authentication with email/password and social login (Google / Facebook)

Real-time updates (e.g., product listing, stock changes, order status)

Product catalogue with filtering, sorting, pagination

Shopping cart & checkout flow

Payment gateway integration (or placeholder implementation)

Admin dashboard: product management, order tracking, user management

Responsive design: works across desktop, tablet, and mobile

Secure and performant: follows best practices for data protection and performance

🛠️ Tech Stack

Front-end: React with TypeScript

Styling: Tailwind CSS (custom components, minimal external UI frameworks)

Back-end: Node.js with Express (or whichever you’re using)

Database: PostgreSQL / MySQL (or whichever relational DB)

Real-time: Socket.IO or WebSockets

Deployment: Vercel / Heroku / DigitalOcean (or your preferred platform)

Version control: Git & GitHub

📁 Project Structure
/public                  # Static assets (images, icons, etc.)
/src
   /components           # Reusable UI components
   /pages                # Route-based pages (home, products, cart, profile, admin, etc.)
   /hooks                # Custom React hooks
   /contexts             # React contexts for state management
   /services             # API service modules
   /utils                # Utility functions, constants
   App.tsx               # Entry point of React application
   index.tsx             # DOM root render
/.env                    # Environment variables
/package.json            # Project dependencies & scripts
/tsconfig.json           # TypeScript configuration

🚀 Setup & Running Locally

Follow these steps to get the project running on your local machine:

Clone the repository

git clone https://github.com/Lakshit68/Vibe-Commerce.git
cd Vibe-Commerce


Install dependencies

npm install


Create a .env file in the root directory and add required environment variables (for example):

REACT_APP_API_URL=http://localhost:5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret


Start the development server

npm run dev


Open your browser and go to http://localhost:3000 (or whichever port is configured).

✅ Deployment

Build the production bundle

npm run build


Deploy to your chosen hosting platform (Vercel, Netlify, Heroku, etc.). Ensure your environment variables are set in the hosting dashboard.

(Optional) Set up a custom domain and SSL certificate for secure access.
