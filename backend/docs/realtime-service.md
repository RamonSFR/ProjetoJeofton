# Realtime Service - Integration Guide

## Overview

The Realtime Service is a WebSocket-based microservice that handles real-time event broadcasting using Socket.io. It consumes events from RabbitMQ (published by the Order Service) and broadcasts them to connected clients via WebSocket.

## Architecture

### How it Works

1. **Event Flow**:
   - Order Service → Publishes events to RabbitMQ (`gestao-pedidos.events` exchange)
   - Realtime Service → Consumes events from RabbitMQ
   - Realtime Service → Broadcasts events via WebSocket to subscribed clients

2. **Key Components**:
   - `server.ts` - HTTP/WebSocket server initialization
   - `socket.ts` - Socket.io connection handling and room management
   - `rabbitmq.ts` - RabbitMQ event consumption
   - `app.ts` - Express app setup

## Running the Service

### Development

```bash
cd backend/realtime-service
npm install
npm run dev
```

The service will start on `http://localhost:3006`

### Production (Docker)

The service is automatically started with the full application stack:

```bash
cd backend
docker-compose up
```

The realtime-service will be available at `http://realtime-service:3006` within the Docker network.

## Environment Variables

Create a `.env` file or set the following variables:

```env
PORT=3006
RABBITMQ_URL=amqp://admin:admin@localhost:5672
NODE_ENV=development
```

## API Endpoints

### Health Check

```
GET /health
```

Returns service status.

## WebSocket Events

### Client → Server Events

#### Subscribe to Order Updates

```javascript
socket.emit("subscribe-order", orderId);
// Example: socket.emit('subscribe-order', '123');
```

Subscribes the client to receive updates for a specific order. The client will join a room named `order-{orderId}`.

#### Unsubscribe from Order Updates

```javascript
socket.emit("unsubscribe-order", orderId);
```

Unsubscribes the client from order updates.

#### Subscribe to Restaurant Updates

```javascript
socket.emit("subscribe-restaurant", restaurantId);
```

Subscribes the client to receive updates for a specific restaurant.

#### Unsubscribe from Restaurant Updates

```javascript
socket.emit("unsubscribe-restaurant", restaurantId);
```

### Server → Client Events

#### Order Created

```javascript
socket.on("order:created", (orderEvent) => {
  console.log("New order:", orderEvent);
  // {
  //   eventId: string,
  //   orderId: number,
  //   restaurantId: number,
  //   customerId: number,
  //   customerName: string,
  //   customerEmail: string,
  //   totalAmount: string,
  //   deliveryAddressSnapshot: string | null,
  //   createdAt: string,
  //   items: OrderItem[]
  // }
});
```

Emitted when a new order is created in the system.

## Frontend Integration

### Install Socket.io Client

```bash
npm install socket.io-client
```

### Example: React Hook for Real-time Orders

```typescript
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface OrderUpdate {
  eventId: string;
  orderId: number;
  restaurantId: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  totalAmount: string;
  deliveryAddressSnapshot: string | null;
  createdAt: string;
  items: any[];
}

export function useOrderRealtime(orderId: string | null) {
  const [order, setOrder] = useState<OrderUpdate | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    // Connect to realtime service
    const REALTIME_URL =
      import.meta.env.VITE_REALTIME_SERVICE_URL || "http://localhost:3006";
    const socket: Socket = io(REALTIME_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Connection handlers
    socket.on("connect", () => {
      console.log("Connected to realtime service");
      setIsConnected(true);
      socket.emit("subscribe-order", orderId);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from realtime service");
      setIsConnected(false);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    // Order events
    socket.on("order:created", (orderData: OrderUpdate) => {
      console.log("Order created:", orderData);
      setOrder(orderData);
    });

    // Cleanup
    return () => {
      if (orderId) {
        socket.emit("unsubscribe-order", orderId);
      }
      socket.disconnect();
    };
  }, [orderId]);

  return { order, isConnected };
}
```

### Usage in Component

```typescript
function OrderPage({ orderId }: { orderId: string }) {
  const { order, isConnected } = useOrderRealtime(orderId);

  return (
    <div>
      <div>
        {isConnected ? (
          <span style={{ color: 'green' }}>● Connected</span>
        ) : (
          <span style={{ color: 'red' }}>● Disconnected</span>
        )}
      </div>

      {order && (
        <div>
          <h2>Order #{order.orderId}</h2>
          <p>Customer: {order.customerName}</p>
          <p>Total: {order.totalAmount}</p>
          <p>Status: {order.status}</p>
        </div>
      )}
    </div>
  );
}
```

### Environment Configuration

In your `.env` file or `.env.local`:

```env
VITE_REALTIME_SERVICE_URL=http://localhost:3006
# In production:
# VITE_REALTIME_SERVICE_URL=http://realtime-service:3006
```

## Debugging

### Check Service Status

```bash
curl http://localhost:3006/health
```

### View Logs

```bash
# In Docker
docker-compose logs realtime-service -f

# In development
# Logs are printed to console automatically
```

### Check RabbitMQ Connection

1. Visit RabbitMQ Management UI: `http://localhost:15672`
2. Username: `admin`
3. Password: `admin`
4. Check the `Queues` section for `realtime-service-orders`

## Troubleshooting

### Socket Connection Issues

**Problem**: Client cannot connect to WebSocket

**Solutions**:

- Verify the service is running: `curl http://localhost:3006/health`
- Check CORS settings in `socket.ts` - currently allows all origins (`*`)
- Ensure firewall allows port 3006
- Check browser console for connection errors

### Missing Order Updates

**Problem**: Order updates are not being received

**Solutions**:

- Verify RabbitMQ is running: `docker-compose logs rabbitmq`
- Check that Order Service is publishing events
- Verify client is subscribed to the correct order ID
- Check realtime-service logs for RabbitMQ connection errors
- Ensure the correct routing key is used (`pedido.criado`)

### High Latency

**Problem**: Delays in receiving updates

**Solutions**:

- Check network latency between client and server
- Monitor RabbitMQ queue depth
- Check if multiple clients are connected
- Consider implementing message batching in high-volume scenarios

## API Gateway Integration

The API Gateway provides the realtime service URL via the `/realtime/info` endpoint:

```bash
curl http://localhost:3000/realtime/info
```

Response:

```json
{
  "url": "http://realtime-service:3006",
  "message": "Connect to this URL for WebSocket realtime events"
}
```

Clients can use this endpoint to dynamically discover the realtime service URL.

## Production Deployment

### Docker Compose

The service is configured in `docker-compose.yml`:

```yaml
realtime-service:
  build: ./realtime-service
  restart: unless-stopped
  ports:
    - "3006:3006"
  environment:
    PORT: "3006"
    RABBITMQ_URL: amqp://admin:admin@rabbitmq:5672
    NODE_ENV: production
  depends_on:
    rabbitmq:
      condition: service_healthy
```

### Scaling Considerations

For high-volume deployments:

1. **Load Balancing**: Use a load balancer (nginx, HAProxy) to distribute WebSocket connections
2. **Redis Adapter**: Consider adding Socket.io Redis adapter for multi-instance deployments
3. **Message Queuing**: Implement acknowledgment mechanisms for reliable event delivery

## License

Proprietary - Jeofton Project
