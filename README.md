SigmaGPT - Full-Stack AI Chat API
This repository contains the complete backend API implementation for SigmaGPT, a feature-rich, multi-user AI chat application inspired by ChatGPT. The API is built with Node.js, Express.js, and MongoDB, providing a secure and scalable foundation for the chat application.

Key Features
Secure User Authentication: Full JWT-based authentication (signup, login, logout) with bcrypt password hashing.

Protected Routes: Middleware ensures that chat-related endpoints are accessible only by authenticated users.

Real-Time Streaming: Integrates with the OpenAI API using Server-Sent Events (SSE) to stream AI responses word-by-word for a real-time experience.

Complete Chat Management: Full CRUD (Create, Read, Update, Delete) functionality for managing user-specific chat threads.

State Persistence Logic: Includes endpoints to manage chat titles and pinning status for a persistent user experience.

API Endpoints
Authentication (/api/auth)
Method

Endpoint

Description

Protected

POST

/signup

Registers a new user.

No

POST

/login

Logs in an existing user.

No

POST

/logout

Logs out the current user.

No

Chat (/api/chat)
Method

Endpoint

Description

Protected

GET

/

Get all chat threads for the logged-in user.

Yes

POST

/

Start a new chat or continue an existing one (streams the response).

Yes

GET

/:id

Get all messages for a specific chat thread.

Yes

PUT

/:id

Update a chat's title or pinned status.

Yes

DELETE

/:id

Delete a specific chat thread.

Yes

Technologies Used
Runtime: Node.js

Framework: Express.js

Database: MongoDB with Mongoose

Authentication: JSON Web Tokens (JWT), bcrypt

Real-time: Server-Sent Events (SSE)

External APIs: OpenAI API

Setup and Installation
To run this project locally, follow these steps:

Clone the repository:

git clone [Your Repository URL]
cd sigmagpt-api/backend

Install dependencies:

npm install

Create a .env file in the backend directory and add the following environment variables:

PORT=8080
MONGODB_URI=<Your_MongoDB_Connection_String>
JWT_SECRET=<Your_JWT_Secret_Key>
OPENAI_API_KEY=<Your_OpenAI_API_Key>

Start the server:

npm start 
# Or for development with nodemon
npm run dev

The API will be running at http://localhost:8080.
