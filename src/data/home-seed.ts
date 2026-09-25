import type { HomeCategory, StorefrontInfo } from "@/types/catalog";

export const homeCategorySeed: HomeCategory[] = [
  {
    id: "category_women",
    slug: "women",
    label: "Women",
    href: "/women",
    image: {
      src: "/images/women/home-category.webp",
      alt: "Two women wearing a rust handwoven dress and an ivory Jamdani saree",
      position: "50% 36%",
    },
    position: 1,
  },
  {
    id: "category_men",
    slug: "men",
    label: "Men",
    href: "/men",
    image: {
      src: "/images/men/home-category.webp",
      alt: "Man wearing a rust handwoven panjabi beside an indigo doorway",
      position: "50% 32%",
    },
    position: 2,
  },
  {
    id: "category_kids",
    slug: "kids",
    label: "Kids",
    href: "/kids",
    image: {
      src: "/images/kids/home-category.webp",
      alt: "Three children laughing through the windows of a colorful cardboard playhouse",
      position: "50% 42%",
    },
    position: 3,
  },
  {
    id: "category_home",
    slug: "home",
    label: "Home Decor",
    href: "/home",
    image: {
      src: "/images/home-decor/mega-menu.webp",
      alt: "Modern mineral blue bedding with a folded hand-stitched kantha",
      position: "50% 50%",
    },
    position: 4,
  },
  {
    id: "category_traditional",
    slug: "traditional",
    label: "Traditional",
    href: "/women",
    image: {
      src: "/images/three_girl_traditional.png",
      alt: "Three women wearing traditional sarees",
      position: "50% 45%",
    },
    position: 5,
  },
  {
    id: "category_gifts",
    slug: "gifts",
    label: "Gifts & Crafts",
    href: "/home",
    image: {
      src: "/images/home-tablecloth.webp",
      alt: "Hand-block printed tablecloth on a set dining table",
      position: "50% 46%",
    },
    position: 6,
  },
  {
    id: "category_jewellery",
    slug: "jewellery",
    label: "Jewellery",
    href: "/jewellery",
    image: {
      src: "/images/jewellery-campaign-v3.webp",
      alt: "Woman wearing handcrafted gold and garnet jewellery",
      position: "50% 34%",
    },
    position: 7,
  },
  {
    id: "category_wedding",
    slug: "wedding",
    label: "Wedding",
    href: "/wedding",
    image: {
      src: "/images/wedding/home-category.webp",
      alt: "South Indian wedding couple in maroon silk and ivory traditional dress",
      position: "50% 44%",
    },
    position: 8,
  },
];

export const storefrontInfoSeed: StorefrontInfo = {
  name: "Kallayani",
  contactEmail: "care@kallayani.com",
  contactPhone: null,
  supportHours: null,
  addressLine: "New York · Kolkata · Chennai",
  instagramUrl: null,
  facebookUrl: null,
  announcementBarText: "Complimentary US shipping over $150",
  secondaryAnnouncementText: "New York appointments now open",
  freeShippingThreshold: 150,
};
