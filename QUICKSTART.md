# Jeofton Application - Quick Start Guide

## Prerequisites

- Node.js 18+ (for local development)
- Docker & Docker Compose
- Git

## Option 1: Full Stack with Docker (Recommended)

### 1. Start all microservices

```bash
cd backend
docker compose up --build
```

This will start:

- **API Gateway**: http://localhost:3000
- **User Service**: http://localhost:3001 (internal)
- **Restaurant Service**: http://localhost:3002 (internal)
- **Order Service**: http://localhost:3003 (internal)
- **Notification Service**: http://localhost:3004 (internal)
- **Realtime Service**: http://localhost:3006 (WebSocket)
- **RabbitMQ**: http://localhost:15672 (admin/admin)

### 2. Test the backend

```bash
# Health check
curl http://localhost:3000/test

# Get realtime service info
curl http://localhost:3000/realtime/info
```

### 3. Start the frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: http://localhost:5173

## Option 2: Development (Local Services)

### Backend

Terminal 1 - Start RabbitMQ:

```bash
cd backend
docker compose up rabbitmq
```

Terminal 2 - User Service:

```bash
cd backend/user-service
npm install
npm run dev
```

Terminal 3 - Restaurant Service:

```bash
cd backend/restaurant-service
npm install
npm run dev
```

Terminal 4 - Order Service:

```bash
cd backend/order-service
npm install
npm run dev
```

Terminal 5 - Notification Service:

```bash
cd backend/notification-service
npm install
npm run dev
```

Terminal 6 - Realtime Service:

```bash
cd backend/realtime-service
npm install
npm run dev
```

Terminal 7 - API Gateway:

```bash
cd backend/api-gateway
npm install
npm run dev
```

### Frontend

Terminal 8:

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Through API Gateway

- `GET /test` - Health check
- `GET /users` - List users
- `POST /users` - Create user
- `GET /restaurants` - List restaurants
- `POST /restaurants` - Create restaurant
- `GET /orders` - List orders
- `POST /orders` - Create order
- `GET /realtime/info` - Get realtime service URL

### Direct Services (when running locally)

- User Service: `http://localhost:3001`
- Restaurant Service: `http://localhost:3002`
- Order Service: `http://localhost:3003`
- Notification Service: `http://localhost:3004`
- Realtime Service: `http://localhost:3006`

## WebSocket Connection (Realtime Events)

See [backend/docs/realtime-service.md](./backend/docs/realtime-service.md) for detailed Socket.io integration examples.

Quick example:

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3006");

socket.on("connect", () => {
  console.log("Connected to realtime service");
  socket.emit("subscribe-order", "123"); // Subscribe to order updates
});

socket.on("order:created", (orderData) => {
  console.log("Order created:", orderData);
});
```

## Environment Variables

### Backend Services

See `.env.example` files in each service directory:

- `backend/realtime-service/.env.example`
- `backend/api-gateway/.env.example`
- `backend/order-service/.env.example`
- etc.

### Frontend

Create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3000
VITE_REALTIME_SERVICE_URL=http://localhost:3006
```

## Monitoring

### RabbitMQ Management UI

- URL: http://localhost:15672
- Username: `admin`
- Password: `admin`

View queues, exchanges, and message flow.

### Docker Compose Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f realtime-service

# Last 50 lines
docker compose logs -f --tail=50 realtime-service
```

## Troubleshooting

### Port Already in Use

If you get port conflicts, modify `docker-compose.yml` port mappings:

```yaml
services:
  api-gateway:
    ports:
      - "3010:3000" # Change host port from 3000 to 3010
```

### RabbitMQ Connection Issues

```bash
# Check if RabbitMQ is running
curl http://localhost:15672

# View RabbitMQ logs
docker compose logs rabbitmq
```

### Database Issues

```bash
# Reset all databases
docker compose down -v
docker compose up --build
```

### Realtime Service Not Connecting

1. Verify service is running: `curl http://localhost:3006/health`
2. Check RabbitMQ is healthy: `docker compose logs rabbitmq`
3. Review realtime-service logs: `docker compose logs realtime-service`

## Common Tasks

### Create a test order

```bash
# Create user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@example.com"}'

# Create restaurant
curl -X POST http://localhost:3000/restaurants \
  -H "Content-Type: application/json" \
  -d '{"name":"Pizzaria X","email":"contact@pizzaria.com"}'

# Create order
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": 1,
    "customerId": 1,
    "items": [{"productId": 1, "productName": "Pizza", "quantity": 2, "unitPrice": "25.00"}],
    "totalAmount": "50.00",
    "deliveryAddressSnapshot": "Rua Principal 123"
  }'
```

### View order events in RabbitMQ

1. Go to http://localhost:15672
2. Navigate to "Queues"
3. Click on `realtime-service-orders`
4. View messages (they'll be consumed by the realtime service)

## Documentation

- [Backend README](./backend/README.md)
- [Realtime Service Guide](./backend/docs/realtime-service.md)
- [Order Service](./backend/docs/order-service.md)
- [Restaurant Service](./backend/docs/restaurant-service.md)
- [User Service](./backend/docs/user-service.md)

## Support

For issues, check:

1. Service logs: `docker compose logs [service-name]`
2. RabbitMQ Management UI for message flow
3. Browser console for frontend errors
4. Individual service `.env.example` files for configuration

---

**Last Updated**: May 2026
**Application Version**: 1.0.0
