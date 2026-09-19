import type { NavItemConfig } from "./types";

export const primaryNavItems: NavItemConfig[] = [
  {
    id: "women",
    label: "Women",
    viewAllHref: "/women",
    columns: [
      {
        heading: "Discover",
        links: [
          { label: "New Arrivals", href: "/women#shop-category" },
        ],
      },
      {
        heading: "Dresses",
        links: [
          { label: "Formal Dresses", href: "/women#shop-category" },
          { label: "Casual Dresses", href: "/women#shop-category" },
          { label: "Partywear", href: "/women#shop-category" },
        ],
      },
      {
        heading: "Everyday",
        links: [
          { label: "Tops", href: "/women#shop-category" },
          { label: "Pants", href: "/women#shop-category" },
          { label: "Nightwear", href: "/women#shop-category" },
        ],
      },
      {
        heading: "Heritage & more",
        links: [
          { label: "Traditionals", href: "/women#shop-category" },
          { label: "Accessories", href: "/women#shop-category" },
        ],
      },
    ],
    promo: {
      image: "/images/women/mega-menu.webp",
      alt: "Woman in an ink-blue handloom dress selecting cloth in a textile studio",
      caption: "The new women’s edit",
      href: "/women",
    },
  },
  {
    id: "men",
    label: "Men",
    viewAllHref: "/men",
    columns: [
      {
        heading: "Discover",
        links: [
          { label: "New Arrivals", href: "/men#shop-category" },
        ],
      },
      {
        heading: "Clothing",
        links: [
          { label: "Shirts", href: "/men#shop-category" },
          { label: "Pants", href: "/men#shop-category" },
          { label: "T-Shirts", href: "/men#shop-category" },
          { label: "Polo", href: "/men#shop-category" },
        ],
      },
      {
        heading: "Finishing touches",
        links: [
          { label: "Accessories", href: "/men#shop-category" },
        ],
      },
      {
        heading: "Heritage",
        links: [
          { label: "Traditionals", href: "/men#shop-category" },
        ],
      },
    ],
    promo: {
      image: "/images/men/mega-menu.webp",
      alt: "Man in an olive handloom panjabi examining cloth at a textile studio",
      caption: "Cloth with a story",
      href: "/men",
    },
  },
  {
    id: "kids",
    label: "Kids",
    viewAllHref: "/kids",
    columns: [
      {
        heading: "Discover",
        links: [
          { label: "New Arrivals", href: "/kids#shop-category" },
          { label: "Kids Partywear", href: "/kids#shop-category" },
        ],
      },
      {
        heading: "Junior",
        links: [
          { label: "Junior Girls", href: "/kids#shop-category" },
          { label: "Junior Boys", href: "/kids#shop-category" },
        ],
      },
      {
        heading: "Kids",
        links: [
          { label: "Girls", href: "/kids#shop-category" },
          { label: "Boys", href: "/kids#shop-category" },
        ],
      },
      {
        heading: "Play",
        links: [
          { label: "Toys & Books", href: "/kids#shop-category" },
        ],
      },
    ],
    promo: {
      image: "/images/kids/mega-menu.webp",
      alt: "Girl in a block-print dress building a colorful wooden block tower",
      caption: "Made for imagination",
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
