import { config } from "./config";
import { createHttpServer } from "./api/server";
import { startKafkaConsumer } from "./kafka";

async function bootstrap() {
  const app = createHttpServer();

  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Notification service listening on port ${config.port}`);
  });

  try {
    await startKafkaConsumer();
    // eslint-disable-next-line no-console
    console.log("Kafka consumer started for notification service");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to start Kafka consumer", err);
  }
}

void bootstrap();


