import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const eventNames = Array.from({ length: 20 }, (_, i) => `Event ${i + 1}`);
const descriptions = Array.from({ length: 20 }, (_, i) =>
  `Description for event ${i + 1}. This event is designed to provide insights into various topics and features various activities and discussions that will engage participants and enrich their experience.`
);
const shortDescriptions = Array.from({ length: 20 }, (_, i) =>
  `Short desc for event ${i + 1}.`
);
const imagePath = 'https://utfs.io/f/0yks13NtToBiyD1mo3dKMt25jkdFfWpIvLESBusza14COqm3';

async function main() {
  // Clear existing events
  await prisma.events.deleteMany({});

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

  await Promise.all(eventPromises);

  // Create Gallery Entries
  const galleryPromises = Array.from({ length: 200 }, async () => {
    const eventCategory = Math.random() < 0.5 ? 'events' : 'snaps';
    const eventName = eventCategory === 'events' ? eventNames[Math.floor(Math.random() * eventNames.length)] || 'Default Event' : 'Default Event'; 
  
    return prisma.gallery.create({
      data: {
        image_path: imagePath,
        event_name: eventName,
        event_category: eventCategory,
      },
    });
  });
  
  await Promise.all(galleryPromises);

  // Create Team Entries
  const teamNames = Array.from({ length: 50 }, (_, i) => `Team Member ${i + 1}`);
  const teamPromises = teamNames.map(async (name) => {
    // Determine the committee
    const committee = ['media', 'digital', 'socialmedia', 'developer'][
      Math.floor(Math.random() * 4)
    ] as 'media' | 'digital' | 'socialmedia' | 'developer';

    // Define designation options based on committee
    const designationOptions: Record<typeof committee, string[]> = {
      media: [
        'mediahead', 'mediacohead', 'leadvideographer', 'leadphotographer',
        'photographer', 'videographer', 'aerialvideographer'
      ],
      digital: ['digitalhead', 'digitalcohead', 'digitalteam'],
      socialmedia: ['socialmediahead', 'socialmediacohead', 'socialmediateam'],
      developer: ['frontenddev', 'backenddev', 'fullstackdev']
    };

    // Randomly select a designation based on the committee
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
        | 'digitalhead'
        | 'digitalcohead'
        | 'digitalteam'
        | 'socialmediahead'
        | 'socialmediacohead'
        | 'socialmediateam'
        | 'frontenddev'
        | 'backenddev'
        | 'fullstackdev';

    // Create the team member with the selected committee and designation
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
