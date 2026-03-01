---
title: WebSocket
description: Real-time bidirectional communication with Bueno's WebSocket server and typed message handling.
layout: docs
section: Infrastructure
sectionOrder: 5
order: 3
---

Bueno's WebSocket support builds on `Bun.serve()`'s native WebSocket capabilities, adding typed message handlers and a room/broadcast system.

## Basic server

```typescript
import { createWebSocketServer } from '@buenojs/bueno/websocket';

const wss = createWebSocketServer({
  path: '/ws',
  onOpen(ws) {
    console.log('Client connected');
    ws.send(JSON.stringify({ type: 'connected', message: 'Welcome!' }));
  },
  onMessage(ws, message) {
    const data = JSON.parse(message.toString());
    console.log('Received:', data);
    ws.send(JSON.stringify({ type: 'echo', payload: data }));
  },
  onClose(ws) {
    console.log('Client disconnected');
  },
});
```

## Typed message handlers

Define a message schema for type-safe communication:

```typescript
import { createWebSocketServer, defineMessage } from '@buenojs/bueno/websocket';

type ClientMessage =
  | { type: 'chat'; text: string; room: string }
  | { type: 'join'; room: string }
  | { type: 'leave'; room: string };

const wss = createWebSocketServer<ClientMessage>({
  path: '/ws',
  onMessage(ws, message) {
    switch (message.type) {
      case 'chat':
        wss.broadcast(message.room, JSON.stringify({
          type: 'message',
          from: ws.data.userId,
          text: message.text,
        }));
        break;
      case 'join':
        ws.subscribe(message.room);
        break;
      case 'leave':
        ws.unsubscribe(message.room);
        break;
    }
  },
});
```

## Rooms and broadcasting

```typescript
// Subscribe a client to a room
ws.subscribe('room:general');

// Broadcast to all clients in a room
wss.broadcast('room:general', JSON.stringify({ type: 'announcement', text: '...' }));

// Broadcast to all connected clients
wss.broadcastAll(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }));

// Unsubscribe
ws.unsubscribe('room:general');
```

## Authentication

Validate the upgrade request before allowing the WebSocket connection:

```typescript
const wss = createWebSocketServer({
  path: '/ws',
  async onUpgrade(request) {
    const token = new URL(request.url).searchParams.get('token');
    const payload = await verifyJwt(token, process.env.JWT_SECRET!);
    if (!payload) return false;  // Reject connection
    return { userId: payload.userId };  // Attached as ws.data
  },
  onOpen(ws) {
    console.log(`User ${ws.data.userId} connected`);
  },
});
```

## Attaching to an existing app

```typescript
import { Bueno } from '@buenojs/bueno';

const app = new Bueno();
app.attachWebSocket(wss);
app.listen(3000);
```

WebSocket connections to `/ws` are handled by `wss`; all other routes are handled by the HTTP router.

## Client usage

```typescript
const ws = new WebSocket('ws://localhost:3000/ws?token=...');

ws.onopen = () => ws.send(JSON.stringify({ type: 'join', room: 'general' }));
ws.onmessage = (event) => console.log(JSON.parse(event.data));
```
