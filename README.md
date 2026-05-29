# VyomXpress Backend

Production-grade Node.js REST API with JWT Authentication, MySQL/Sequelize ORM, and Discord Bot integration.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express.js |
| Database | MySQL 8 + Sequelize ORM |
| Auth | JWT + bcryptjs |
| Discord | discord.js v14 |
| Docs | Swagger / OpenAPI 3.0 |
| Containerization | Docker + Docker Compose |

---

## Project Structure

```
vyomxpress/
├── src/
│   ├── app.js                    # Entry point
│   ├── config/
│   │   ├── database.js           # Sequelize connection
│   │   └── swagger.js            # Swagger spec config
│   ├── models/
│   │   ├── index.js              # Model associations
│   │   ├── User.js
│   │   └── Service.js
│   ├── middleware/
│   │   ├── auth.js               # JWT verify + RBAC
│   │   ├── validate.js           # express-validator errors
│   │   └── errorHandler.js       # Global error handler
│   ├── services/
│   │   ├── authService.js
│   │   ├── userService.js
│   │   └── serviceService.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── serviceController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── services.js
│   ├── utils/
│   │   ├── logger.js             # Winston logger
│   │   └── response.js           # JSON response helpers
│   └── discord/
│       ├── bot.js                # Discord client setup
│       └── commands/
│           ├── ppcreateuser.js
│           ├── ppcreateservice.js
│           └── ppgetuser.js
├── scripts/
│   └── registerCommands.js       # One-time slash command registration
├── .env.example
├── docker-compose.yml
├── Dockerfile
└── package.json
```

---

## Environment Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/vyomxpress-backend.git
cd vyomxpress-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in all values:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=vyomxpress
DB_USER=root
DB_PASSWORD=yourpassword

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# Discord
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_application_client_id
DISCORD_GUILD_ID=your_discord_server_guild_id
```

### 4. Set up MySQL database

**Option A — Docker (recommended):**
```bash
docker-compose up mysql -d
```

**Option B — Manual MySQL:**
```sql
CREATE DATABASE vyomxpress;
CREATE USER 'vyomuser'@'localhost' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON vyomxpress.* TO 'vyomuser'@'localhost';
FLUSH PRIVILEGES;
```

### 5. Start the server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The server starts at `http://localhost:3000`  
Swagger docs are at `http://localhost:3000/api-docs`

---

## Discord Bot Setup

### Step 1 — Create a Discord Application

1. Go to https://discord.com/developers/applications
2. Click **New Application** → give it a name
3. Copy the **Application ID** → set as `DISCORD_CLIENT_ID` in `.env`

### Step 2 — Create a Bot

1. Go to **Bot** section → click **Add Bot**
2. Under **Token**, click **Reset Token** → copy it → set as `DISCORD_TOKEN` in `.env`
3. Enable **Server Members Intent** and **Message Content Intent**

### Step 3 — Invite the Bot to your server

Use this URL (replace `CLIENT_ID`):
```
https://discord.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot+applications.commands&permissions=2048
```

### Step 4 — Get your Guild (Server) ID

1. Enable Developer Mode in Discord (Settings → Advanced)
2. Right-click your server → **Copy Server ID** → set as `DISCORD_GUILD_ID` in `.env`

### Step 5 — Register slash commands

```bash
npm run register-commands
```

You should see:
```
✔ Loaded command: ppcreateuser
✔ Loaded command: ppcreateservice
✔ Loaded command: ppgetuser

Registering 3 slash command(s) to Discord...
✅ Successfully registered 3 command(s).
```

### Step 6 — Start the bot

The bot starts automatically with the server (`npm run dev` or `npm start`).

---

## Discord Slash Commands

| Command | Description |
|---|---|
| `/ppcreateuser` | Create a new user (username, email, password, role) |
| `/ppcreateservice` | Create a new service (name, price, description, category) |
| `/ppgetuser` | Fetch user by ID or username with their services |

---

## REST API Reference

Base URL: `http://localhost:3000/api/v1`

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | None | Register new user |
| POST | `/auth/login` | None | Login, get JWT |
| GET | `/auth/me` | Bearer JWT | Get current user |

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/users` | Admin | List all users |
| GET | `/users/:id` | JWT | Get user by ID |
| PUT | `/users/:id` | JWT (own) | Update user |
| DELETE | `/users/:id` | Admin | Delete user |

### Services

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/services` | JWT | Create service |
| GET | `/services` | None | List all services |
| GET | `/services/:id` | None | Get service by ID |
| PUT | `/services/:id` | JWT (owner) | Update service |
| DELETE | `/services/:id` | JWT (owner) | Delete service |

---

## Example API Usage

### Signup
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"secret123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"secret123"}'
```

### Create Service (authenticated)
```bash
curl -X POST http://localhost:3000/api/v1/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Web Dev","price":5000,"category":"Tech","description":"Full-stack development"}'
```

---

## Docker Deployment

```bash
# Build and start everything
docker-compose up --build -d

# View logs
docker-compose logs -f app

# Stop all
docker-compose down
```

---

## Security Features

- **bcryptjs** with salt rounds = 12 for password hashing
- **JWT** with configurable expiry
- **helmet** — sets secure HTTP headers
- **express-rate-limit** — 100 req / 15 min per IP
- **express-validator** — all inputs validated & sanitized
- **RBAC** — admin-only routes enforced via middleware
- Passwords never returned in any API response
- Discord commands reply as **ephemeral** (only visible to the executor)

---

## Swagger Documentation

Visit `http://localhost:3000/api-docs` after starting the server to explore and test all endpoints interactively.

---

## License

MIT
