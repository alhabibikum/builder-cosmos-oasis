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
    image: "https://images.unsplash.com/photo-1542000540985-5c8ca4b1c2ad?w=1600&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542000540985-5c8ca4b1c2ad?w=1600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80&auto=format&fit=crop",
    description: "Lightweight crepe with pearl-trim details. Versatile for day to evening.",
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
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1600&q=80&auto=format&fit=crop",
    description: "Airy chiffon kaftan with subtle metallic threadwork inspired by desert dunes.",
    category: "Kaftans",
    tags: ["chiffon", "lightweight"],
  },
  {
    id: "abaya-royal-plum",
    title: "Embroidered Abaya - Royal Plum",
    price: 249,
    image: "https://images.unsplash.com/photo-1544441892-3b2f7d3f5953?w=1600&q=80&auto=format&fit=crop",
    description: "Hand-embroidered detailing with a regal hue. Statement evening piece.",
    category: "Abayas",
    onSale: true,
    tags: ["embroidered", "evening"],
  },
  {
    id: "abaya-pearl",
    title: "Belted Abaya - Pearl",
    price: 219,
    image: "https://images.unsplash.com/photo-1551133988-b9632a4d5801?w=1600&q=80&auto=format&fit=crop",
    description: "Structured crepe abaya with removable belt in soft pearl tone.",
    category: "Abayas",
  },
  {
    id: "kimono-sapphire",
    title: "Kimono Abaya - Sapphire",
    price: 209,
    image: "https://images.unsplash.com/photo-1551717743-49959800b1f3?w=1600&q=80&auto=format&fit=crop",
    description: "Kimono-style abaya with wide sleeves and satin finish in sapphire.",
    category: "Abayas",
  },
  {
    id: "abaya-charcoal",
    title: "Pleated Abaya - Charcoal",
    price: 189,
    image: "https://images.unsplash.com/photo-1520975922401-b09c3163a791?w=1600&q=80&auto=format&fit=crop",
    description: "Fine pleating throughout with a relaxed fit for everyday elegance.",
    category: "Abayas",
  },
  {
    id: "abaya-mocha",
    title: "Luxe Satin Abaya - Mocha",
    price: 229,
    image: "https://images.unsplash.com/photo-1520975654408-0c0df7e594ef?w=1600&q=80&auto=format&fit=crop",
    description: "Silky satin with subtle sheen in rich mocha tone.",
    category: "Abayas",
  },
];
