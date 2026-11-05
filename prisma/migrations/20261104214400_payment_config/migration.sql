-- CreateTable
CREATE TABLE "PaymentConfig" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "stripeSecretKey" TEXT NOT NULL DEFAULT '',
    "stripePublishableKey" TEXT NOT NULL DEFAULT '',
    "stripeWebhookSecret" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentConfig_pkey" PRIMARY KEY ("id")
);

INSERT INTO "PaymentConfig" ("id") VALUES ('default');
