import { PrismaClient, CardState } from "@prisma/client";
const prisma = new PrismaClient();

const seed = async () => {
  const cards = [
    {
      cardName: "Events",
      cardState: CardState.active, // Use the enum value here
      cardRtime: new Date(),
    },
    {
      cardName: "Pronight",
      cardState: CardState.active,
      cardRtime: new Date(),
    },
    {
      cardName: "Your Snaps",
      cardState: CardState.active,
      cardRtime: new Date(),
    },
    {
      cardName: "Behind Incridea",
      cardState: CardState.active,
      cardRtime: new Date(),
    },
    {
      cardName: "Cultural",
      cardState: CardState.active,
      cardRtime: new Date(),
    },
  ];

  for (const card of cards) {
    await prisma.captureCard.create({
      data: card,
    });
  }
  const variables = [
    { key: "Day-1", value: "2024-11-12" },
    { key: "Day-2", value: "2024-11-13" },
    { key: "Day-3", value: "2024-11-14" },
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
