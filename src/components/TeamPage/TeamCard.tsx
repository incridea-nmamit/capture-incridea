interface CardProps {
  name: string;
  designation: string;
  imageSrc: string;
  say: string;
}

const TeamCard: React.FC<CardProps> = ({ name, designation, imageSrc, say }) => {
//   return (
//     <div className="border border-gray-600 rounded-lg p-4 shadow-2xl transition-transform transform hover:scale-105 h-72 w-52 bg-gradient-to-b from-gray-800 to-gray-700">
//       <div className="relative w-40 h-40 overflow-hidden rounded-full mx-auto mb-4">
//         <img 
//           src={imageSrc} 
//           alt={name} 
//            
//           objectFit="cover" 
//           className="rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110" 
//         />
//       </div>
//       <h3 className="text-3xl font-semibold text-white text-center mb-1">{name}</h3>
//       <p className="text-gray-400 text-center text-sm">{designation}</p>
//       <p className="text-gray-200 text-center text-xs py-2">{say}</p>
//     </div>
//   );
// };


// return (
//   <div className="border-2 border-gray-600 rounded-lg p-4 shadow-md transition-transform transform hover:scale-105 h-72 w-52 bg-transparent">
//     <div className="relative w-40 h-40 overflow-hidden rounded-full border-2 border-gray-600 mx-auto mb-4">
//       <img 
//         src={imageSrc} 
//         alt={name} 
//          
//         objectFit="cover" 
//         className="rounded-full" 
//       />
//     </div>
//     <h3 className="text-2xl font-bold text-gray-200 text-center mb-1">{name}</h3>
//     <p className="text-gray-300 text-center text-sm">{designation}</p>
//     <p className="text-gray-400 text-center text-xs py-2">{say}</p>
//   </div>
// );
// };


// return (
//   <div className="border border-gray-600 rounded-lg p-4 shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-2xl h-72 w-52 bg-gray-800">
//     <div className="relative w-40 h-40 overflow-hidden rounded-md mx-auto mb-4">
//       <img 
//         src={imageSrc} 
//         alt={name} 
//          
//         objectFit="cover" 
//         className="transition-transform duration-300 ease-in-out transform hover:scale-110" 
//       />
//     </div>
//     <h3 className="text-2xl font-semibold text-white text-center mb-1">{name}</h3>
//     <p className="text-gray-300 text-center text-sm">{designation}</p>
//     <p className="text-gray-200 text-center text-xs py-2">{say}</p>
//   </div>
// );
// };
// return (
//   <div className="rounded-lg p-4 shadow-lg transition-transform transform hover:scale-105 h-72 w-52 bg-gray-900">
//     <div className="relative w-40 h-40 overflow-hidden rounded-lg mx-auto mb-4">
//       <img 
//         src={imageSrc} 
//         alt={name} 
//          
//         objectFit="cover" 
//         className="rounded-lg" 
//       />
//     </div>
//     <h3 className="text-2xl font-semibold text-gray-200 text-center mb-1">{name}</h3>
//     <p className="text-gray-400 text-center text-sm">{designation}</p>
//     <p className="text-gray-300 text-center text-xs py-2">{say}</p>
//   </div>
// );
// };

// return (
//   <div className="transform transition-transform hover:-translate-y-2 hover:scale-105 h-72 w-52 bg-gray-800 rounded-lg shadow-lg p-4">
//     <div className="relative w-40 h-40 overflow-hidden rounded-full mx-auto mb-4">
//       <img 
//         src={imageSrc} 
//         alt={name} 
//          
//         objectFit="cover" 
//         className="rounded-full" 
//       />
//     </div>
//     <h3 className="text-3xl font-bold text-white text-center mb-1">{name}</h3>
//     <p className="text-gray-300 text-center text-sm">{designation}</p>
//     <p className="text-gray-200 text-center text-xs py-2">{say}</p>
//   </div>
// );
// };

return (
  <div className="transform transition-transform hover:rotate-3 hover:scale-105 h-96 w-72 bg-gray-800 rounded-lg shadow-lg p-4">
    <div className="relative w-56 h-56 overflow-hidden rounded-md mx-auto mb-4">
      <img 
        src={imageSrc} 
        alt={name} 
        className="rounded-md transition-transform duration-300 ease-in-out transform hover:scale-110" 
      />
    </div>
    <h3 className="text-2xl font-Trap-Black text-white text-center mb-1">{name}</h3>
    <p className="text-gray-400 text-center font-Trap-Regular text-sm">{designation}</p>
    <div className="flex flex-wrap justify-center py-2">     
      <p className="text-gray-300 text-center font-Trap-Regular text-sm py-2"> {say} </p>
    </div>
  </div>
);
};

// return (
//   <div className="relative h-72 w-52 rounded-lg overflow-hidden group">
//     <div className="absolute inset-0 bg-gray-900 bg-opacity-70 transition-opacity duration-300 group-hover:opacity-100"></div>
//     <div className="relative h-full w-full p-4">
//       <div className="relative w-40 h-40 overflow-hidden rounded-md mx-auto mb-4">
//         <img 
//           src={imageSrc} 
//           alt={name} 
//            
//           objectFit="cover" 
//           className="rounded-md" 
//         />
//       </div>
//       <h3 className="text-3xl font-bold text-white text-center mb-1">{name}</h3>
//       <p className="text-gray-300 text-center text-sm">{designation}</p>
//       <p className="text-gray-200 text-center text-xs py-2">{say}</p>
//     </div>
//   </div>
// );
// };
export default TeamCard;
