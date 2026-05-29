# VyomXpress Backend

Production-ready Node.js REST API with JWT Authentication, MySQL, Sequelize ORM, and Discord Bot integration.

---

## Tech Stack

| Layer          | Technology        |
| -------------- | ----------------- |
| Runtime        | Node.js           |
| Framework      | Express.js        |
| Database       | MySQL + Sequelize |
| Authentication | JWT + bcryptjs    |
| Discord Bot    | discord.js        |
| API Docs       | Swagger           |
| Deployment     | Docker            |

---

## Features

* JWT Authentication
* REST API with Express.js
* MySQL Database
* Discord Slash Commands
* Swagger Documentation
* Docker Support
* RBAC Authorization
* Input Validation & Error Handling

---

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/vyomxpress-backend.git
cd vyomxpress-backend
npm install
```

---

## Environment Variables

Create a `.env` file in the root folder:

```env
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=vyomxpress
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Discord Bot
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_GUILD_ID=your_discord_server_id
```

---

## Run Project

```bash
# Development
npm run dev

# Production
npm start
```

Server URL:

```bash
http://localhost:3000
```

Swagger Docs:

```bash
http://localhost:3000/api-docs
```

---

## Discord Commands

| Command            | Description       |
| ------------------ | ----------------- |
| `/ppcreateuser`    | Create a new user |
| `/ppcreateservice` | Create a service  |
| `/ppgetuser`       | Get user details  |

---

## API Endpoints

### Authentication

* `POST /auth/signup`
* `POST /auth/login`
* `GET /auth/me`

### Users

* `GET /users`
* `GET /users/:id`
* `PUT /users/:id`
* `DELETE /users/:id`

### Services

* `POST /services`
* `GET /services`
* `GET /services/:id`
* `PUT /services/:id`
* `DELETE /services/:id`

---

## Docker

```bash
docker-compose up --build
```

---

## Security

* bcryptjs Password Hashing
* JWT Authentication
* Helmet Security
* Rate Limiting
* Input Validation
* RBAC Authorization

---
