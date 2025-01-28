import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const seed = async () => {
  const cards = [
    {
      cardName: "Events",
      cardState: true, // Use the enum value here

    },
    {
      cardName: "Pronite",
      cardState: true,

    },
    {
      cardName: "Abode of Memories",
      cardState: true,

    },
    {
      cardName: "Behind Incridea",
      cardState: true,

    },
    {
      cardName: "Cultural",
      cardState: true,

    },
    {
      cardName: "Stories",
      cardState: true,

    },
    {
      cardName: "Flashmobs",
      cardState: true,

    },
    {
      cardName: "Cultural ",
      cardState: true,

    },
  ];

  for (const card of cards) {
    await prisma.captureCard.create({
      data: card,
    });
  }
  const variables = [
    { key: "CountDown-Capture", value: "2024-11-09T14:13:00Z" },
    { key: "capture-auto-request", value: "ON" },
  ];

  // Create entries in the Variables table
  for (const variable of variables) {
    await prisma.variables.create({
      data: variable,
    });
  }

};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Seeding completed.');
    await prisma.$disconnect();
  });
