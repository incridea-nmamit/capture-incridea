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
