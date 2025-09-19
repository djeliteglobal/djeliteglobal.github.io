// GENERADOR DE IMÁGENES DE DJs
// Usa Unsplash API para obtener fotos reales de DJs

const DJ_SEARCH_TERMS = [
  'dj mixing',
  'dj turntables', 
  'dj headphones',
  'electronic music dj',
  'nightclub dj',
  'festival dj',
  'dj performance',
  'dj booth'
];

// IDs verificados de fotos de DJs en Unsplash
const VERIFIED_DJ_PHOTOS = [
  'photo-1493225457124-a3eb161ffa5f',
  'photo-1571019613454-1cb2f99b2d8b', 
  'photo-1516450360452-9312f5e86fc7',
  'photo-1598488035139-bdbb2231ce04',
  'photo-1514525253161-7a46d19cd819',
  'photo-1516975080664-ed2fc6a32937',
  'photo-1493225457124-a3eb161ffa5f',
  'photo-1571019613454-1cb2f99b2d8b'
];

export const getRandomDJImage = () => {
  const randomPhoto = VERIFIED_DJ_PHOTOS[Math.floor(Math.random() * VERIFIED_DJ_PHOTOS.length)];
  return `https://images.unsplash.com/${randomPhoto}?w=400&h=400&fit=crop&q=80`;
};

export const getDJImageSet = (count = 3) => {
  const shuffled = [...VERIFIED_DJ_PHOTOS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(id => 
    `https://images.unsplash.com/${id}?w=400&h=400&fit=crop&q=80`
  );
};