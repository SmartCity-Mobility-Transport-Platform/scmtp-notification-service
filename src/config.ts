export interface ServiceConfig {
  port: number;
  kafkaBrokers: string[];
  kafkaClientId: string;
  kafkaGroupId: string;
}

export const config: ServiceConfig = {
  port: Number(process.env.PORT) || 4005,
  kafkaBrokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
  kafkaClientId: process.env.KAFKA_CLIENT_ID || "scmtp-notification-service",
  kafkaGroupId: process.env.KAFKA_GROUP_ID || "scmtp-notification-consumers"
};


