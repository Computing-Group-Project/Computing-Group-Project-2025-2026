/**
 * Maps menu item names to relevant Unsplash food images.
 * Used as fallback when items have no image_url from the database.
 */

const IMG = (id, w = 400, h = 300) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

// Keyword → image mappings (checked in order, first match wins)
const keywordImages = [
  // Salads & greens
  { keywords: ["salad", "greens"], images: [IMG("1512621776951-a57141f2eefd"), IMG("1540420773420-3366772f4999"), IMG("1607532941433-304659e8198a")] },
  // Bowls
  { keywords: ["bowl", "platter"], images: [IMG("1546069901-ba9599a7e63c"), IMG("1512621776951-a57141f2eefd"), IMG("1490645935967-10de6ba17061")] },
  // Wraps
  { keywords: ["wrap"], images: [IMG("1626700051175-6818013e1d4f"), IMG("1551504734-5ee1c4a1479b")] },
  // Juice & smoothie
  { keywords: ["juice", "smoothie"], images: [IMG("1622597467836-f3285f2131b8"), IMG("1534353473418-4cfa6c56fd38")] },
  // Burgers & sliders
  { keywords: ["burger", "slider"], images: [IMG("1568901346375-23c9450c58cd"), IMG("1550547660-d9450f859349"), IMG("1586190848861-99aa4a171e90")] },
  // Fries
  { keywords: ["fries"], images: [IMG("1573080496219-bb080dd4f877"), IMG("1630384060421-cb20d0e0649d")] },
  // Tacos
  { keywords: ["taco"], images: [IMG("1565299585323-38d6b0865b47"), IMG("1551504734-5ee1c4a1479b")] },
  // Fried chicken
  { keywords: ["fried chicken", "chicken"], images: [IMG("1626645738196-c2a7c87a8f58"), IMG("1562967914-01efa7e87832")] },
  // Rice
  { keywords: ["rice"], images: [IMG("1603133872878-684f208fb84b")] },
  // Noodles
  { keywords: ["noodle"], images: [IMG("1569718212165-3a8922ada9a5"), IMG("1552611052-d24a0d6d32c5")] },
  // Skewers
  { keywords: ["skewer"], images: [IMG("1555939594-58d7cb561ad1")] },
  // Sandwiches
  { keywords: ["sandwich"], images: [IMG("1528735602780-2552fd46c7af"), IMG("1553909489-cd47e0907980")] },
  // Coffee & espresso
  { keywords: ["coffee", "espresso", "latte"], images: [IMG("1509042239860-f550ce710b93"), IMG("1495474472287-4d71bcdd2085"), IMG("1461023058943-07fcbe16d735")] },
  // Toast
  { keywords: ["toast"], images: [IMG("1484723091739-30a097e8f929"), IMG("1525351484163-7529414344d8")] },
  // Croissant
  { keywords: ["croissant"], images: [IMG("1555507036-ab1f4038024a")] },
  // Buns & rolls
  { keywords: ["bun", "roll"], images: [IMG("1509440159596-0249088772ff"), IMG("1558961363-fa8fdf82db35")] },
  // Cupcake
  { keywords: ["cupcake"], images: [IMG("1587668178277-295251f900ce")] },
  // Muffin
  { keywords: ["muffin"], images: [IMG("1558303179-bce4b9a4db43")] },
  // Macaron
  { keywords: ["macaron"], images: [IMG("1569864358642-9d1684040f43")] },
  // Cake
  { keywords: ["cake"], images: [IMG("1578985545062-69928b1d9587")] },
  // Cola & soda
  { keywords: ["coke", "cola", "soda"], images: [IMG("1622483767028-3f66f32aef97")] },
  // Water
  { keywords: ["water"], images: [IMG("1548839140-29a749e1cf4d")] },
  // Energy drink
  { keywords: ["energy", "drink"], images: [IMG("1527960471264-932f39eb5846")] },
  // Chilli / paste / sauce
  { keywords: ["chilli", "paste", "sauce"], images: [IMG("1563379926898-05f4575a45d8")] },
];

// Simple hash to pick a consistent image from an array based on item name
function nameHash(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// Fallback generic food images for items that don't match any keyword
const genericImages = [
  IMG("1504674900247-0877df9cc836"),
  IMG("1476224203421-9ac39bcb3327"),
  IMG("1490645935967-10de6ba17061"),
  IMG("1467003909585-2f8a72700288"),
];

// Cafeteria-specific hero/card images keyed by cafeteria ID
const cafeteriaImages = {
  // The Last Drop — cozy, warm coffee shop atmosphere
  1: IMG("1445116572660-236099ec97a0", 1600, 900),
  // Hex Core Cafe — modern, industrial cafe interior
  2: IMG("1554118811-1e0d58224f24", 1600, 900),
  // Skyline Sips — rooftop terrace with panoramic view
  3: IMG("1517248135467-4c7edcad34c4", 1600, 900),
};

const defaultCafeteriaImage = IMG("1521017432531-fbd92d768814", 1600, 900);

/**
 * Returns a themed image URL for a cafeteria by its ID.
 */
export function getCafeteriaImage(cafeteriaId) {
  return cafeteriaImages[cafeteriaId] || defaultCafeteriaImage;
}

/**
 * Returns a relevant food image URL for a menu item based on its name.
 * If the item already has an imageUrl from the DB, that is returned instead.
 */
export function getFoodImage(itemName, existingUrl) {
  if (existingUrl) return existingUrl;
  if (!itemName) return genericImages[0];

  const lower = itemName.toLowerCase();

  for (const entry of keywordImages) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      const idx = nameHash(itemName) % entry.images.length;
      return entry.images[idx];
    }
  }

  // No keyword matched — use a generic food image
  return genericImages[nameHash(itemName) % genericImages.length];
}
