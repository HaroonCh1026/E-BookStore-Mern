📚 E-Book Store – MERN Stack Project
A full-stack MERN (MongoDB, Express, React, Node.js) application for buying and managing e-books. Users can sign up, browse books, add to favorites/cart, and place orders. Admins can manage the book catalog and view all orders.

🔗 Live Demo
🌐 Project Link: https://e-bookstore-mern-frontend.onrender.com/

🛠️ Admin Credentials (For Demo Purposes Only)
Email: haroon2@gmail.com
Password: koko1234

🔥 Features
👥 User
Register & Login (JWT-based authentication)
View list of available books
View detailed book information
Add books to Favorites or Cart
View Cart and Order status

🛠️ Admin
Add new books to the catalog
Edit or delete book details
View all customer orders

🧑‍💻 Getting Started
📁 Folder Structure
root/
│
├── backend/         # Express server
└── frontend/        # React vite app

📦 Backend Setup
cd backend
npm install

Run the server:
node app.js
# or if using nodemon:
nodemon app.js

🌐 Frontend Setup
cd frontend
npm install
npm run dev

⚙️ .env Configuration
Create a .env file inside the backend/ directory:
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

🛠️ How to Run After Forking
Clone this repository.
Navigate to both backend/ and frontend/ folders.
Run npm install in each.
Create the .env file inside backend/ with the above variables.
Start the backend: node app.js or nodemon app.js.
Start the frontend: npm run dev.

