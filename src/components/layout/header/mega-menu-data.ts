import type { NavItemConfig } from "./types";

export const primaryNavItems: NavItemConfig[] = [
  {
    id: "women",
    label: "Women",
    viewAllHref: "/women",
    columns: [
      {
        heading: "Sarees",
        links: [
          { label: "Jamdani", href: "/women#shop-category" },
          { label: "Kanjeevaram", href: "/women#shop-category" },
          { label: "Tant", href: "/women#shop-category" },
          { label: "Silk", href: "/women#products" },
          { label: "Cotton", href: "/women#products" },
        ],
      },
      {
        heading: "Clothing",
        links: [
          { label: "Kurta sets", href: "/women#shop-category" },
          { label: "Dresses", href: "/women#products" },
          { label: "Blouses", href: "/women#products" },
          { label: "Jackets", href: "/women#shop-category" },
        ],
      },
      {
        heading: "Occasion",
        links: [
          { label: "Wedding guest", href: "/women#products" },
          { label: "Festive", href: "/women#products" },
          { label: "Work", href: "/women#products" },
          { label: "Everyday", href: "/women#products" },
        ],
      },
      {
        heading: "Edits",
        links: [
          { label: "Bengal", href: "/women" },
          { label: "South India", href: "/women" },
          { label: "Ivory", href: "/women#products" },
          { label: "Evening", href: "/women#products" },
        ],
      },
    ],
    promo: {
      image: "/images/saree-wine-editorial.webp",
      alt: "Woman wearing a wine silk saree with gold border",
      caption: "The silk edit",
      href: "/women",
    },
  },
  {
    id: "men",
    label: "Men",
    viewAllHref: "/men",
    columns: [
      {
        heading: "Indian wear",
        links: [
          { label: "Panjabis", href: "/men#shop-category" },
          { label: "Kurtas", href: "/men#shop-category" },
          { label: "Jackets", href: "/men#shop-category" },
          { label: "Festive sets", href: "/men#products" },
        ],
      },
      {
        heading: "Everyday",
        links: [
          { label: "Shirts", href: "/men#shop-category" },
          { label: "Trousers", href: "/men#shop-category" },
          { label: "Layering", href: "/men#products" },
        ],
      },
      {
        heading: "By cloth",
        links: [
          { label: "Handloom cotton", href: "/men#products" },
          { label: "Silk blends", href: "/men#products" },
          { label: "Indigo", href: "/men#products" },
          { label: "Textured white", href: "/men#products" },
        ],
      },
      {
        heading: "Occasion",
        links: [
          { label: "Wedding", href: "/men#products" },
          { label: "Celebration", href: "/men#products" },
          { label: "Weekend", href: "/men#products" },
        ],
      },
    ],
    promo: {
      image: "/images/panjabi-wine-editorial.webp",
      alt: "Man wearing a wine handloom panjabi",
      caption: "New forms for him",
      href: "/men",
    },
  },
  {
    id: "kids",
    label: "Kids",
    viewAllHref: "/kids",
    columns: [
      {
        heading: "Girls",
        links: [
          { label: "Dresses", href: "/kids#shop-category" },
          { label: "Skirt sets", href: "/kids#products" },
          { label: "Festive", href: "/kids#shop-category" },
        ],
      },
      {
        heading: "Boys",
        links: [
          { label: "Panjabis", href: "/kids#products" },
          { label: "Kurta sets", href: "/kids#products" },
          { label: "Everyday", href: "/kids#shop-category" },
        ],
      },
      {
        heading: "By age",
        links: [
          { label: "2–5 years", href: "/kids#products" },
          { label: "6–9 years", href: "/kids#products" },
          { label: "10–14 years", href: "/kids#products" },
        ],
      },
      {
        heading: "Gifts",
        links: [
          { label: "New baby", href: "/kids#shop-category" },
          { label: "Celebration", href: "/kids#products" },
          { label: "Gift cards", href: "/kids" },
        ],
      },
    ],
    promo: {
      image: "/images/kids-teal-dress.webp",
      alt: "Girl wearing a teal and cream cotton dress",
      caption: "Made for movement",
      href: "/kids",
    },
  },
  {
    id: "home",
    label: "Home Decor",
    viewAllHref: "/home",
    columns: [
      {
        heading: "Living",
        links: [
          { label: "Cushions", href: "/home#shop-category" },
          { label: "Throws", href: "/home#shop-category" },
          { label: "Floor textiles", href: "/home#products" },
        ],
      },
      {
        heading: "Dining",
        links: [
          { label: "Table linen", href: "/home#shop-category" },
          { label: "Serveware", href: "/home#products" },
          { label: "Glassware", href: "/home#products" },
        ],
      },
      {
        heading: "Bed",
        links: [
          { label: "Bedding", href: "/home#shop-category" },
          { label: "Coverlets", href: "/home#products" },
          { label: "Pillow covers", href: "/home#products" },
        ],
      },
      {
        heading: "Décor",
        links: [
          { label: "Objects", href: "/home#shop-category" },
          { label: "Lighting", href: "/home#products" },
          { label: "Baskets", href: "/home#products" },
          { label: "Wall pieces", href: "/home#products" },
        ],
      },
      {
        heading: "Kids home",
        links: [
          { label: "Bedding", href: "/home#products" },
          { label: "Soft furnishings", href: "/home#products" },
          { label: "Gifts", href: "/home" },
        ],
      },
    ],
    promo: {
      image: "/images/home-cushions.webp",
      alt: "Block-printed cushions in rust and indigo",
      caption: "A quieter room",
      href: "/home",
    },
  },
  {
    id: "traditional",
    label: "Traditional",
    viewAllHref: "/women",
    columns: [
      {
        heading: "Sarees",
        links: [
          { label: "Jamdani", href: "/women#shop-category" },
          { label: "Kanjeevaram", href: "/women#shop-category" },
          { label: "Tant", href: "/women#shop-category" },
        ],
      },
      {
        heading: "Panjabis",
        links: [
          { label: "Handloom cotton", href: "/men#products" },
          { label: "Festive wear", href: "/men#shop-category" },
          { label: "Kurtas", href: "/men#shop-category" },
        ],
      },
      {
        heading: "For children",
        links: [
          { label: "Girls' festive wear", href: "/kids#shop-category" },
          { label: "Boys' panjabis", href: "/kids#products" },
        ],
      },
      {
        heading: "Handcrafted",
        links: [
          { label: "Bengal edit", href: "/women" },
          { label: "Temple jewellery", href: "/jewellery" },
        ],
      },
    ],
    promo: {
      image: "/images/three_girl_traditional.png",
      alt: "Three women wearing traditional sarees",
      caption: "Traditional forms",
      href: "/women",
    },
  },
  {
    id: "gifts",
    label: "Gifts & Crafts",
    viewAllHref: "/home",
    columns: [
      {
        heading: "For her",
        links: [
          { label: "Jewellery", href: "/jewellery" },
          { label: "Silk scarves", href: "/women#products" },
          { label: "Sarees", href: "/women" },
        ],
      },
      {
        heading: "For him",
        links: [
          { label: "Panjabis", href: "/men" },
          { label: "Shirts", href: "/men#shop-category" },
          { label: "Accessories", href: "/men#products" },
        ],
      },
      {
        heading: "For home",
        links: [
          { label: "Table", href: "/home#shop-category" },
          { label: "Cushions", href: "/home#shop-category" },
          { label: "Objects", href: "/home" },
        ],
      },
      {
        heading: "Services",
        links: [
          { label: "Gift cards", href: "/home" },
          { label: "Gift notes", href: "/home" },
          { label: "Private appointments", href: "/#newsletter" },
        ],
      },
    ],
    promo: {
      image: "/images/jewellery-ring.webp",
      alt: "Gold filigree ring with an oval garnet",
      caption: "Gifts with a story",
      href: "/jewellery",
    },
  },
  {
    id: "jewellery",
    label: "Jewellery",
    viewAllHref: "/jewellery",
    columns: [
      {
        heading: "Shop by type",
        links: [
          { label: "Necklaces", href: "/jewellery#shop-category" },
          { label: "Earrings", href: "/jewellery#shop-category" },
          { label: "Bangles", href: "/jewellery#shop-category" },
          { label: "Rings", href: "/jewellery#shop-category" },
        ],
      },
      {
        heading: "Materials",
        links: [
          { label: "Antique gold", href: "/jewellery#products" },
          { label: "Silver", href: "/jewellery#shop-category" },
          { label: "Garnet", href: "/jewellery#products" },
          { label: "Pearl", href: "/jewellery#products" },
        ],
      },
      {
        heading: "Stories",
        links: [
          { label: "Temple forms", href: "/jewellery" },
          { label: "Modern heirlooms", href: "/jewellery" },
          { label: "Everyday pieces", href: "/jewellery#products" },
        ],
      },
      {
        heading: "Gifting",
        links: [
          { label: "Under $150", href: "/jewellery#products" },
          { label: "Wedding gifts", href: "/jewellery#products" },
          { label: "Gift cards", href: "/jewellery" },
        ],
      },
    ],
    promo: {
      image: "/images/jewellery-earrings.webp",
      alt: "Gold and garnet drop earrings on pale stone",
      caption: "Adornment, considered",
      href: "/jewellery",
    },
  },
  {
    id: "wedding",
    label: "Wedding",
    viewAllHref: "/women",
    columns: [
      {
        heading: "For her",
        links: [
          { label: "Silk sarees", href: "/women#shop-category" },
          { label: "Jamdani", href: "/women#shop-category" },
          { label: "Wedding guest", href: "/women#products" },
        ],
      },
      {
        heading: "For him",
        links: [
          { label: "Panjabis", href: "/men#shop-category" },
          { label: "Festive sets", href: "/men#products" },
        ],
      },
      {
        heading: "Jewellery",
        links: [
          { label: "Necklaces", href: "/jewellery#shop-category" },
          { label: "Earrings", href: "/jewellery#shop-category" },
          { label: "Heirloom pieces", href: "/jewellery#products" },
        ],
      },
      {
        heading: "Gifts",
        links: [
          { label: "For the couple", href: "/home#products" },
          { label: "For the home", href: "/home#shop-category" },
        ],
      },
    ],
    promo: {
      image: "/images/heritage_travels_beauty.png",
      alt: "Couple wearing traditional dress outdoors",
      caption: "For the celebration",
      href: "/women",
    },
  },
];
