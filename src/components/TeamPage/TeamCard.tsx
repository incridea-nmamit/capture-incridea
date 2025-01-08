import styles from "./TeamCard.module.css";

interface CardProps {
  name: string;
  designation: string;
  imageSrc: string;
  say: string;
  stats: {
    title: string;
    bigText: string;
    regularText: string;
  }[];
}

const TeamCard: React.FC<CardProps> = ({
  name,
  designation,
  imageSrc,
  say,
  stats,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles["top-section"]}>
        <div className={styles.border}></div>
        <div className={styles.icons}>
          <div className={styles.logo}>
            <img
              src={imageSrc}
              alt={name}
              className="h-full w-full rounded-full object-cover" // Added image styling
            />
          </div>
          <div className={styles["social-media"]}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 30 30"
              className={styles.svg}
            >
              <path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z"></path>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className={styles.svg}
            >
              <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div className={styles["bottom-section"]}>
        <h3 className="mb-1 text-center text-lg font-semibold text-white">
          {name}
        </h3>
        <p className="text-center text-sm text-gray-400">{designation}</p>
        <div className="py-2">
          <p className="text-center text-sm text-gray-300">{say}</p>
        </div>
        <div className={styles.row}>
          {stats.map((stat, index) => (
            <div className={styles.item} key={index}>
              <span className={styles["big-text"]}>{stat.bigText}</span>
              <span className={styles["regular-text"]}>{stat.regularText}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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
