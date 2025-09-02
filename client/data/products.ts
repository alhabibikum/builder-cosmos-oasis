export type Size = "XS" | "S" | "M" | "L" | "XL";

export interface CatalogProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  category: "Abayas" | "Kaftans" | "Modest Dresses" | "Prayer Sets";
  isNew?: boolean;
  isBestSeller?: boolean;
  onSale?: boolean;
  badge?: string;
  colors?: string[]; // hex
  sizes?: Size[];
  tags?: string[];
}

export const products: CatalogProduct[] = [
  {
    id: "abaya-royal-obsidian",
    title: "Royal Satin Abaya - Obsidian",
    price: 259,
    image:
      "https://images.pexels.com/photos/7816726/pexels-photo-7816726.jpeg",
    images: [
      "https://images.pexels.com/photos/7816726/pexels-photo-7816726.jpeg",
      "https://images.pexels.com/photos/7805045/pexels-photo-7805045.jpeg",
    ],
    description:
      "An exquisite satin abaya finished with pearl piping and a fluid drape. Tailored for an elegant silhouette.",
    category: "Abayas",
    isBestSeller: true,
    badge: "Bestseller",
    colors: ["#0f0b1e", "#e9e2d0"],
    sizes: ["XS", "S", "M", "L", "XL"],
    tags: ["satin", "pearl", "open-abaya"],
  },
  {
    id: "abaya-pearl-trim",
    title: "Pearl Trim Open Abaya",
    price: 219,
    image:
      "https://images.pexels.com/photos/7805045/pexels-photo-7805045.jpeg",
    description:
      "Lightweight crepe with pearl-trim details. Versatile for day to evening.",
    category: "Abayas",
    isNew: true,
    badge: "New",
    colors: ["#1b1735", "#ffffff"],
    sizes: ["XS", "S", "M", "L", "XL"],
    tags: ["open", "pearl", "crepe"],
  },
  {
    id: "kaftan-sand-dune",
    title: "Chiffon Kaftan - Sand Dune",
    price: 179,
    image:
      "https://images.pexels.com/photos/18958578/pexels-photo-18958578.jpeg",
    description:
      "Airy chiffon kaftan with subtle metallic threadwork inspired by desert dunes.",
    category: "Kaftans",
    tags: ["chiffon", "lightweight"],
  },
  {
    id: "abaya-royal-plum",
    title: "Embroidered Abaya - Royal Plum",
    price: 249,
    image:
      "https://images.pexels.com/photos/32208654/pexels-photo-32208654.jpeg",
    description:
      "Hand-embroidered detailing with a regal hue. Statement evening piece.",
    category: "Abayas",
    onSale: true,
    tags: ["embroidered", "evening"],
  },
  {
    id: "abaya-pearl",
    title: "Belted Abaya - Pearl",
    price: 219,
    image:
      "https://images.pexels.com/photos/32388357/pexels-photo-32388357.jpeg",
    description:
      "Structured crepe abaya with removable belt in soft pearl tone.",
    category: "Abayas",
  },
  {
    id: "kimono-sapphire",
    title: "Kimono Abaya - Sapphire",
    price: 209,
    image:
      "https://images.pexels.com/photos/30435953/pexels-photo-30435953.jpeg",
    description:
      "Kimono-style abaya with wide sleeves and satin finish in sapphire.",
    category: "Abayas",
  },
  {
    id: "abaya-charcoal",
    title: "Pleated Abaya - Charcoal",
    price: 189,
    image:
      "https://images.pexels.com/photos/9218391/pexels-photo-9218391.jpeg",
    description:
      "Fine pleating throughout with a relaxed fit for everyday elegance.",
    category: "Abayas",
  },
  {
    id: "abaya-mocha",
    title: "Luxe Satin Abaya - Mocha",
    price: 229,
    image:
      "https://images.pexels.com/photos/9880839/pexels-photo-9880839.jpeg",
    description: "Silky satin with subtle sheen in rich mocha tone.",
    category: "Abayas",
  },
];
