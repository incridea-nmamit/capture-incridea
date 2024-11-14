import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const seed = async () => {
  const cards = [
    {
      cardName: "Events",
      cardState: "active",
      cardRtime: new Date(),
    },
    {
      cardName: "Pronight",
      cardState: "active",
      cardRtime: new Date(),
    },
    {
      cardName: "Your Snaps",
      cardState: "active",
      cardRtime: new Date(),
    },
    {
      cardName: "Behind Incridea",
      cardState: "active",
      cardRtime: new Date(),
    },
    {
      cardName: "Cultural",
      cardState: "active",
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
    await prisma.$disconnect();
  });
