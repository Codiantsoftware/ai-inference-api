# Secure AI-Inference API

A secure Node.js service that provides an AI inference endpoint with JWT authentication, logging, and containerization.

## Features

- JWT-based authentication
- Request logging with timestamps
- Rate limiting
- Security headers with Helmet
- CORS support
- Health check endpoint
- Docker containerization with health check
- Unit tests

## Prerequisites

- Node.js 22 or higher
- Docker (for containerization)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-inference-api
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Local Development

1. Start the development server:
```bash
npm run dev
```

2. Generate a JWT token:
```bash
npm run generate-token
```

3. Make a request to the inference endpoint:
```bash
curl -X POST http://localhost:3000/infer \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world"}'
```

### Docker

1. Build the Docker image:
```bash
docker build -t ai-inference-api .
```

2. Run the container:
```bash
docker run -p 3000:3000 ai-inference-api
```

### Docker Compose

The project includes a `docker-compose.yml` file that provides an easy way to run both the application and tests:

1. Run the application:
```bash
docker-compose up app
```

2. Run the tests:
```bash
docker-compose up test
```

The docker-compose configuration includes:
- Environment files for production and test environments
- Health check configuration
- Port mapping
- Rate limiting settings
- CORS configuration
- JWT settings

## Testing

Run the test suite:
```bash
npm test
```

## API Endpoints

### POST /infer
Process text through the AI model.

**Headers:**
- Authorization: Bearer <jwt-token>
- Content-Type: application/json

**Request Body:**
```json
{
  "text": "Hello world"
}
```

**Response:**
```json
{
  "result": "dlrow olleH"
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

## Security Features

- JWT token validation
- Rate limiting (100 requests per 15 minutes per IP)
- Security headers with Helmet
- CORS protection
- Input validation
- Error handling

## Docker Health Check

The container includes a health check that:
- Runs every 30 seconds
- Times out after 3 seconds
- Allows 3 retries
- Has a 5-second start period

## Environment Variables

The project uses environment files for configuration. To get started:

1. Copy the example environment file:
```bash
cp .env.example .env
cp .env.example .env.test
```

2. Update the values in `.env` and `.env.test` according to your environment:

`.env` - Production environment:
```env
# Server Configuration
PORT=3000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=1h

# Security Configuration
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

`.env.test` - Test environment:
```env
# Server Configuration
PORT=3001
NODE_ENV=test

# JWT Configuration
JWT_SECRET=test-secret-key
JWT_EXPIRES_IN=1h

# Security Configuration
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

Add these files to your `.gitignore`:
```gitignore
.env
.env.test
```

Note: Never commit your actual `.env` or `.env.test` files to version control. Only commit the `.env.example` template.

## Docker Configuration

The project uses a multi-stage Docker build process:
1. Build stage: Installs all dependencies and builds the application
2. Test stage: Runs the test suite
3. Production stage: Creates the final production image with only production dependencies

The Docker image is based on `node:22-alpine` for optimal performance and minimal size.

## License

MIT 