// app/our-team/digital/page.tsx
"use client";

import Card from "~/components/Card";

// Adjust the import based on your project structure

const DigitalPage = () => {
  // Sample data for 5 random members
  const teamMembers = [
    { name: "Mayur Shet", designation: "Digital Head", imageSrc: "/images/team/digital/mayur.png" },

  ];

  return (
    <div className="flex flex-col items-center">
      {/* Title Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-cover bg-center" style={{ backgroundImage: "url('/images/digital-bg.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center">Digital Team</h1>
          <p className="mt-2 text-base md:text-lg text-gray-300 max-w-2xl text-center">
            Driving our digital presence with innovative marketing strategies and campaigns.
          </p>
        </div>
      </div>

      {/* Cards Section */}
      <div className="py-6 md:py-12 px-4 md:px-6 flex flex-col md:flex-row flex-wrap justify-center gap-6 md:gap-8">
        {/* Render Card components for each team member */}
        {teamMembers.map((member, index) => (
          <Card
            key={index}
            imageSrc={member.imageSrc} // Replace with actual image path
            name={member.name}
            designation={member.designation}
          />
        ))}
      </div>
    </div>
  );
};

export default DigitalPage;
