import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const eventNames = Array.from({ length: 20 }, (_, i) => `Event ${i + 1}`);
const descriptions = Array.from({ length: 20 }, (_, i) =>
  `Description for event ${i + 1}. This event is designed to provide insights into various topics and features various activities and discussions that will engage participants and enrich their experience.`
);
const shortDescriptions = Array.from({ length: 20 }, (_, i) =>
  `Short desc for event ${i + 1}.`
);
const imagePath = 'https://utfs.io/f/0yks13NtToBi1xtbPur8wcI2p1glzqhUDTRZKsnaoO3SCLJx';
// Gallery images


async function main() {
  // Clear existing events, gallery, and team data
  await prisma.events.deleteMany({});
  await prisma.gallery.deleteMany({});
  await prisma.team.deleteMany({});

  // Create Events
  const eventPromises = eventNames.map((name, index) =>
    prisma.events.create({
      data: {
        name,
        description: descriptions[index] || '',
        shortDescription: shortDescriptions[index] || '',
        image: imagePath,
        type: ['core', 'technical', 'nontechnical', 'special'][Math.floor(Math.random() * 4)] as 'core' | 'technical' | 'nontechnical' | 'special',
        day: ['day1', 'day2', 'day3'][Math.floor(Math.random() * 3)] as 'day1' | 'day2' | 'day3',
        visibility: Math.random() < 0.8 ? 'active' : 'inactive',
      },
    })
  );

  const createdEvents = await Promise.all(eventPromises);
  const eventCategories = ['events', 'pronite', 'cultural', 'snaps', 'behindincridea'];
  // Create 100 Random Gallery Entries Per Event
  const imagePairs = [
    {
      imagePath: "https://utfs.io/f/0yks13NtToBiLV71kwYmgsTC1Ne2Iapcmz9LhH4YD6ZQuJVR",
      compressedPath: "https://utfs.io/f/0yks13NtToBicrPv8USkW2MdjiZvyGTcCxb6qFDfSmzUa731",
    },
    {
      imagePath: "https://utfs.io/f/0yks13NtToBiAmO1iUyysDlBgTvxSE49eUkcFGPA1Yjh5wIK",
      compressedPath: "https://utfs.io/f/0yks13NtToBiyv22ozdKMt25jkdFfWpIvLESBusza14COqm3",
    },
    {
      imagePath: "https://utfs.io/f/0yks13NtToBi08UXhNtToBiULsc4C1KNaJSf9je8Rp2kXmIG",
      compressedPath: "https://utfs.io/f/0yks13NtToBiCk9Y4q3RzHN1TXo4nrp8tmVULEZAqBQOKbM6",
    },
  ];
  
  // Ensure imagePairs is not empty to prevent undefined errors
  if (imagePairs.length === 0) {
    throw new Error("No image pairs are defined.");
  }
  
  const galleryPromises = createdEvents.flatMap((event) =>
    Array.from({ length: 100 }, () => {
      const randomEventCategory = eventCategories[Math.floor(Math.random() * eventCategories.length)];
      const randomIndex = Math.floor(Math.random() * imagePairs.length);
      const randomImagePair = imagePairs[randomIndex];
  
      if (!randomImagePair) {
        throw new Error(`Invalid randomImagePair selection at index ${randomIndex}`);
      }
  
      return prisma.gallery.create({
        data: {
          image_path: randomImagePair.imagePath,
          compressed_path: randomImagePair.compressedPath,
          event_name: randomEventCategory !== "events" ? null : event.name,
          event_category: randomEventCategory || "",
          state: "approved",
          upload_type: "direct",
        },
      });
    })
  );
  
  await Promise.all(galleryPromises);  

  // Create Team Entries
  const teamNames = Array.from({ length: 50 }, (_, i) => `Team Member ${i + 1}`);
  const teamPromises = teamNames.map(async (name) => {
    const committee = ['media', 'socialmedia', 'developer'][
      Math.floor(Math.random() * 3)
    ] as 'media' | 'socialmedia' | 'developer';
  
    const designationOptions: Record<typeof committee, string[]> = {
      media: [
        'Media Head', 'Media Co-Head', 'Videography', 'Photographer', 'Aerial Videographer'],
      socialmedia: ['Social Media Head', 'Social Media Co-Head', 'Social Media Team'],
      developer: ['Front End Dev', 'Back End Dev', 'Full Stack Dev', 'Team Lead | Full Stack Dev'], 
    };
  
    const designation =
      designationOptions[committee][
        Math.floor(Math.random() * designationOptions[committee].length)
      ] as
        | 'Media Head'
        | 'Media Co-Head'
        | 'Videography'
        | 'Photographer'
        | 'Aerial Videographer'
        | 'Social Media Head'
        | 'Social Media Co-Head'
        | 'Social Media Team'
        | 'Front End Dev'
        | 'Back End Dev'
        | 'Full Stack Dev'
        | 'Team Lead | Full Stack Dev';
  
    return prisma.team.create({
      data: {
        name,
        committee,
        designation,
        image: imagePath,
        say: `I am proud to be a ${designation} in the ${committee} committee!`,
      },
    });
  });
  

  await Promise.all(teamPromises);

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
