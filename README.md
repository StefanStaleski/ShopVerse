# ShopVerse E-Commerce Platform

## Description
ShopVerse is a full-stack e-commerce platform built with React (TypeScript) for the frontend and Node.js/Express (TypeScript) for the backend.

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Project Structure
```
shopverse/
├── client/          # Frontend React application
└── server/          # Backend Express API
    ├── src/
    │   ├── config/      # Configuration files
    │   ├── controllers/ # Request handlers
    │   ├── models/      # Database models
    │   ├── routes/      # API routes
    │   ├── middlewares/ # Custom middlewares
    │   ├── utils/       # Helper functions
    │   └── types/       # TypeScript interfaces
    └── tests/          # Test files
```

## Getting Started

### Database Setup
1. Access PostgreSQL command prompt:
```bash
sudo -u postgres psql
```

2. Create database and user:
```sql
CREATE USER stefan WITH PASSWORD 'your_password';
CREATE DATABASE shopverse;
GRANT ALL PRIVILEGES ON DATABASE shopverse TO stefan;
```

### Backend Setup
1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
NODE_ENV=development
PORT=5000
DB_NAME=shopverse
DB_USER=stefan
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

4. Start the development server:
```bash
npm run dev
```

### Frontend Setup
1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Available Scripts

### Backend
```bash
# Start development server with hot-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Frontend
```bash
# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL with Sequelize ORM
- JWT for authentication
- Morgan for logging
- Helmet for security

### Frontend
- React 18
- TypeScript
- Vite
- [Additional frontend libraries will be added as needed]

## API Endpoints

Documentation for API endpoints will be available at:
```
http://localhost:5000/healthcheck
```

## Development

### Git Branches
- `main` - production ready code
- `develop` - development branch
- Feature branches should be created from `develop`

### Commit Messages
Please follow conventional commits:
- `feat:` - new features
- `fix:` - bug fixes
- `docs:` - documentation changes
- `style:` - formatting, missing semicolons, etc.
- `refactor:` - code changes that neither fixes a bug nor adds a feature

## Contributing
1. Create a new branch from `develop`
2. Make your changes
3. Submit a pull request
