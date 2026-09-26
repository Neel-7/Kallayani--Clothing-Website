import type { NavItemConfig } from "./types";

export const primaryNavItems: NavItemConfig[] = [
  {
    id: "women",
    label: "Women",
    viewAllHref: "/women",
    columns: [
      {
        heading: "Discover",
        links: [{ label: "New Arrivals", href: "/women#shop-category" }],
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
        links: [{ label: "New Arrivals", href: "/men#shop-category" }],
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
        links: [{ label: "Accessories", href: "/men#shop-category" }],
      },
      {
        heading: "Heritage",
        links: [{ label: "Traditionals", href: "/men#shop-category" }],
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
        links: [{ label: "Toys & Books", href: "/kids#shop-category" }],
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
        heading: "Shop by category",
        links: [
          { label: "Beddings", href: "/home#shop-category" },
          { label: "Nakshi Kantha", href: "/home#shop-category" },
        ],
      },
      {
        heading: "Bedding edits",
        links: [
          { label: "Mineral blues", href: "/home#products" },
          { label: "Botanical print", href: "/home#products" },
          { label: "Modern stripe", href: "/home#products" },
        ],
      },
      {
        heading: "Nakshi Kantha",
        links: [
          { label: "River stitch", href: "/home#products" },
          { label: "Sun stitch", href: "/home#products" },
          { label: "Meet the makers", href: "/home" },
        ],
      },
      {
        heading: "Discover",
        links: [
          { label: "New arrivals", href: "/home#products" },
          { label: "The bedroom edit", href: "/home" },
          { label: "Gifts for home", href: "/home#products" },
        ],
      },
    ],
    promo: {
      image: "/images/home-decor/mega-menu.webp",
      alt: "Mineral blue bedding with a folded hand-stitched kantha",
      caption: "Rest, shaped by hand",
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
        heading: "Ears & neck",
        links: [
          { label: "Earrings", href: "/jewellery#shop-category" },
          { label: "Necklaces", href: "/jewellery#shop-category" },
        ],
      },
      {
        heading: "Wrist & ankle",
        links: [
          { label: "Bracelets & Bangles", href: "/jewellery#shop-category" },
          { label: "Anklets", href: "/jewellery#shop-category" },
        ],
      },
      {
        heading: "Details",
        links: [
          { label: "Rings", href: "/jewellery#shop-category" },
          { label: "Lockets", href: "/jewellery#shop-category" },
        ],
      },
      {
        heading: "Discover",
        links: [
          { label: "New arrivals", href: "/jewellery#products" },
          { label: "Modern heirlooms", href: "/jewellery#products" },
          { label: "Under $150", href: "/jewellery#products" },
        ],
      },
    ],
    promo: {
      image: "/images/jewellery/mega-menu.webp",
      alt: "Woman wearing modern geometric gold and garnet earrings",
      caption: "The modern jewellery edit",
      href: "/jewellery",
    },
  },
  {
    id: "wedding",
    label: "Wedding",
    viewAllHref: "/wedding",
    columns: [
      {
        heading: "Women",
        links: [
          { label: "Bengali brides", href: "/wedding#shop-category" },
          { label: "South Indian silks", href: "/wedding#products" },
          { label: "Reception sarees", href: "/wedding#products" },
        ],
      },
      {
        heading: "Men",
        links: [
          { label: "Wedding panjabis", href: "/wedding#shop-category" },
          { label: "Sherwanis", href: "/wedding#products" },
          { label: "Veshti sets", href: "/wedding#products" },
        ],
      },
      {
        heading: "Occasion",
        links: [
          { label: "Ceremony", href: "/wedding#products" },
          { label: "Reception", href: "/wedding#products" },
          { label: "Wedding guests", href: "/wedding#products" },
        ],
      },
      {
        heading: "Discover",
        links: [
          { label: "New arrivals", href: "/wedding#products" },
          { label: "The couple edit", href: "/wedding" },
          { label: "Wedding gifts", href: "/home#products" },
        ],
      },
    ],
    promo: {
      image: "/images/wedding/mega-menu.webp",
      alt: "Bengali wedding couple in red Benarasi and ivory sherwani",
      caption: "Tradition, composed for now",
      href: "/wedding",
    },
  },
];
