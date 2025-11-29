import { Kafka, EachMessagePayload, Consumer } from "kafkajs";
import { config } from "./config";
import { handleDomainEvent } from "./events/handlers";

const TOPICS = ["user-events", "ticket-events", "payment-events", "wallet-events"];

export async function startKafkaConsumer(): Promise<Consumer> {
  const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBrokers
  });

  const consumer = kafka.consumer({ groupId: config.kafkaGroupId });
  await consumer.connect();
  await consumer.subscribe({ topics: TOPICS, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }: EachMessagePayload) => {
      const value = message.value?.toString();
      if (!value) {
        return;
      }
      await handleDomainEvent(topic, value);
    }
  });

  return consumer;
}


