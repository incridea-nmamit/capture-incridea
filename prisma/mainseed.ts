import { PrismaClient, State } from "@prisma/client";
const prisma = new PrismaClient();

const seed = async () => {
  const cards = [
    {
      cardName: "Events",
      cardState: State.active, // Use the enum value here

    },
    {
      cardName: "Pronite",
      cardState: State.active,

    },
    {
      cardName: "Abode of Memories",
      cardState: State.active,

    },
    {
      cardName: "Behind Incridea",
      cardState: State.active,

    },
    {
      cardName: "Cultural",
      cardState: State.active,

    },
    {
      cardName: "Stories",
      cardState: State.active,

    },
    {
      cardName: "Flashmobs",
      cardState: State.active,

    },
    {
      cardName: "Cultural ",
      cardState: State.active,

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
