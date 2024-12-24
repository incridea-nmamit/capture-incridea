import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const eventNames = Array.from({ length: 20 }, (_, i) => `Event ${i + 1}`);
const descriptions = Array.from({ length: 20 }, (_, i) =>
  `Description for event ${i + 1}. This event is designed to provide insights into various topics and features various activities and discussions that will engage participants and enrich their experience.`
);
const shortDescriptions = Array.from({ length: 20 }, (_, i) =>
  `Short desc for event ${i + 1}.`
);
const imagePath = 'https://utfs.io/f/0yks13NtToBin0vAAUF56OIDvu2PeYJ4icMh7aBfCbHQRAoq';

// Gallery images
const galleryImages: string[] = [
  'https://utfs.io/f/0yks13NtToBiPdGGXXsu8SvNgVL69KsUPy21WpGfn4lrhZCA',
  'https://utfs.io/f/0yks13NtToBiLbQMFGmgsTC1Ne2Iapcmz9LhH4YD6ZQuJVRX',
  'https://utfs.io/f/0yks13NtToBiqInGu16XZ2ECWgjGtRJM7BdbKQ8DYaV1rw4c',
];

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

const galleryPromises = createdEvents.flatMap((event) =>
  Array.from({ length: 30 }, () => {
    // Randomly select an event name from the predefined list
    const randomEventName = eventCategories[Math.floor(Math.random() * eventCategories.length)];

    const randomImage = galleryImages[Math.floor(Math.random() * galleryImages.length)] || 'default-image-url';

    return prisma.gallery.create({
      data: {
        image_path: randomImage,
        event_name: randomEventName, // Use the random event name here
        event_category: 'events',
        state: "approved",
        upload_type: "direct"
      },
    });
  })
);

await Promise.all(galleryPromises);

  // Create Team Entries
  const teamNames = Array.from({ length: 50 }, (_, i) => `Team Member ${i + 1}`);
  const teamPromises = teamNames.map(async (name) => {
    const committee = ['media', 'socialmedia', 'developer'][
      Math.floor(Math.random() * 3) // Fix: Changed 4 to 3 since there are only 3 committees
    ] as 'media' | 'socialmedia' | 'developer';
  
    const designationOptions: Record<typeof committee, string[]> = {
      media: [
        'mediahead', 'mediacohead', 'leadvideographer', 'leadphotographer',
        'photographer', 'videographer', 'aerialvideographer',
      ],
      socialmedia: ['socialmediahead', 'socialmediacohead', 'socialmediateam'],
      developer: ['frontenddev', 'backenddev', 'fullstackdev'], // Ensure 'developer' is a valid key
    };
  
    const designation =
      designationOptions[committee][
        Math.floor(Math.random() * designationOptions[committee].length)
      ] as
        | 'mediahead'
        | 'mediacohead'
        | 'leadvideographer'
        | 'leadphotographer'
        | 'photographer'
        | 'videographer'
        | 'aerialvideographer'
        | 'socialmediahead'
        | 'socialmediacohead'
        | 'socialmediateam'
        | 'frontenddev'
        | 'backenddev'
        | 'fullstackdev';
  
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
