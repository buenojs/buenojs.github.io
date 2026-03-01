---
title: Notifications
description: Send multi-channel notifications — email, SMS, push, and in-app — from a unified API.
layout: docs
section: Infrastructure
sectionOrder: 5
order: 11
---

Bueno's notification module sends messages across multiple channels — email, SMS, push notifications, and in-app — using the same unified API and the template engine.

## Setup

```typescript
import { createNotificationService } from '@buenojs/bueno/notification';

const notify = createNotificationService({
  email: {
    provider: 'smtp',
    host: 'smtp.example.com',
    port: 587,
    auth: { user: Bun.env.SMTP_USER!, pass: Bun.env.SMTP_PASS! },
    from: 'noreply@myapp.com',
  },
  sms: {
    provider: 'twilio',
    accountSid: Bun.env.TWILIO_SID!,
    authToken: Bun.env.TWILIO_TOKEN!,
    from: '+15555555555',
  },
  push: {
    provider: 'fcm',
    serverKey: Bun.env.FCM_SERVER_KEY!,
  },
  templatesDir: './templates',
});
```

## Sending notifications

```typescript
// Send to a single channel
await notify.send({
  to: { email: 'alice@example.com' },
  channel: 'email',
  template: 'welcome',
  data: { name: 'Alice' },
});

// Send to multiple channels simultaneously
await notify.sendAll({
  to: {
    email: 'alice@example.com',
    phone: '+15551234567',
    pushToken: 'fcm_token_here',
  },
  channels: ['email', 'sms', 'push'],
  template: 'order-shipped',
  data: {
    name: 'Alice',
    orderId: '12345',
    trackingUrl: 'https://...',
  },
});
```

## Notification templates

Templates are markdown files with channel-specific variants:

```markdown
<!-- templates/welcome.md -->
---
subject: Welcome to {{ name }}!
---

## Email

Hello **{{ name }}**,

Welcome to our app! Click below to get started.

[Get Started]({{ appUrl }})

---

## SMS

Hi {{ name }}! Welcome to the app: {{ appUrl }}

---

## Push

Welcome, {{ name }}! Tap to get started.
```

## Email providers

| Provider | Value |
|----------|-------|
| SMTP | `'smtp'` |
| Resend | `'resend'` |
| SendGrid | `'sendgrid'` |
| Mailgun | `'mailgun'` |
| Postmark | `'postmark'` |

## SMS providers

| Provider | Value |
|----------|-------|
| Twilio | `'twilio'` |
| AWS SNS | `'sns'` |
| Vonage | `'vonage'` |

## Push providers

| Provider | Value |
|----------|-------|
| Firebase FCM | `'fcm'` |
| Apple APNS | `'apns'` |
| OneSignal | `'onesignal'` |

## In-app notifications

Store notifications in the database and expose them via API:

```typescript
await notify.send({
  to: { userId: 42 },
  channel: 'in-app',
  template: 'mention',
  data: { actor: 'Bob', postTitle: 'Hello World' },
});

// Retrieve for a user
const notifs = await notify.getInApp(42, { unreadOnly: true });
await notify.markRead(42, notifId);
```

## Notification events

```typescript
notify.on('sent', ({ channel, to }) => {
  console.log(`Sent ${channel} to ${to}`);
});

notify.on('failed', ({ channel, to, error }) => {
  console.error(`Failed to send ${channel} to ${to}:`, error);
});
```
