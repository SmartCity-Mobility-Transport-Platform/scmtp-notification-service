## scmtp-notification-service

Node.js + TypeScript notification microservice for the SC MTP platform.

### Responsibilities

- **Consume domain events from Kafka**:
  - `user-events` (e.g., `UserRegistered`)
  - `ticket-events` (e.g., `TicketBooked`, `TicketCancelled`)
  - `payment-events` (e.g., `PaymentCompleted`, `PaymentFailed`)
  - `wallet-events` (e.g., `WalletTopupCompleted`, `WalletDebited`, `WalletCredited`)
- **Send notifications** via mocked channels:
  - `EMAIL` (welcome emails, payment receipts)
  - `SMS` (short alerts)
  - `PUSH` (ticket and wallet updates)
- **Expose admin-friendly REST endpoints**:
  - `GET /health` – health check for Kubernetes / API Gateway.
  - `GET /notifications` – last notifications (in-memory, for demo).

### Tech stack

- **Runtime**: Node.js, TypeScript.
- **Framework**: `express` for REST.
- **Messaging**: Kafka via `kafkajs`.

### Configuration

Environment variables:

- **`PORT`**: HTTP port (default `4005`).
- **`KAFKA_BROKERS`**: Comma-separated list of Kafka brokers, e.g. `kafka:9092`.
- **`KAFKA_CLIENT_ID`**: Kafka client id (default `scmtp-notification-service`).
- **`KAFKA_GROUP_ID`**: Kafka consumer group (default `scmtp-notification-consumers`).

### Local development

```bash
cd scmtp-notification-service
npm install
npm run dev
```

The service will:

- Start an HTTP server on `PORT`.
- Connect to Kafka and subscribe to the topics listed above.

### Docker

Build and run the image:

```bash
docker build -t scmtp-notification-service .
docker run --rm -p 4005:4005 \
  -e KAFKA_BROKERS=kafka:9092 \
  scmtp-notification-service
```

In Kubernetes (via `scmtp-infra`), you would typically:

- **Deployment**: reference the pushed image and set env vars for `KAFKA_BROKERS`.
- **Service**: expose port `4005` as `ClusterIP`.
- **Ingress / API Gateway**: route `/api/notifications` or health checks to this service.

### Integration with other services

- **Upstream producers**:
  - `scmtp-user-service` publishes to `user-events`.
  - `scmtp-ticketing-service` publishes to `ticket-events`.
  - `scmtp-payment-service` publishes to `payment-events`.
  - `scmtp-wallet-service` publishes to `wallet-events`.
- **Downstream consumers**:
  - External email/SMS/push providers (mocked in `src/channels`).
  - Admin tools / dashboards via REST API to inspect notifications.

