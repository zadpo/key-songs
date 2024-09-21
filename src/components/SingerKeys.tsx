// import { useEffect, useState } from "react";

// interface Singer {
//   id: string;
//   name: string;
//   keys: { [songTitle: string]: string };
// }

// const fetchSingerKeys = async () => {
//   const response = await fetch("/api/singer-keys");
//   return response.json();
// };

// export default function SingerKeys() {
//   const [singers, setSingers] = useState<Singer[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const getSingers = async () => {
//       const singersData = await fetchSingerKeys();
//       setSingers(singersData);
//       setLoading(false);
//     };
//     getSingers();
//   }, []);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-4">Singers&apos; Keys</h1>
//       <ul>
//         {singers.map((singer) => (
//           <li key={singer.id} className="mb-4">
//             <h2 className="text-xl font-semibold">{singer.name}</h2>
//             <ul>
//               {Object.entries(singer.keys).map(([songTitle, key]) => (
//                 <li key={songTitle} className="text-sm text-gray-600">
//                   {songTitle}: {key}
//                 </li>
//               ))}
//             </ul>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
