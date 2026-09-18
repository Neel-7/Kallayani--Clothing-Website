import type { Collection, EditorialFeature, HeroSlide, Product } from "@/types/catalog";

const media = {
  womenBanner: {
    src: "/images/women-campaign-v2.webp",
    alt: "Two women in red Jamdani and ivory striped sarees in a sunlit Bengali courtyard",
    position: "50% 38%",
  },
  bengaliGirls: {
    src: "images/three_girl_traditional.png",
    alt: "Three girls wearing traditional Bengali attire in a sunlit courtyard",
    position: "50% 38%",
  },
  heritageTravel: {
    src: "images/heritage_travels_beauty.png",
    alt: "A Bengali couple in elegant traditional dress share a warm moment in the American countryside.",
    position: "50% 20%",
  },
  menBanner: {
    src: "/images/men/collection-hero.webp",
    alt: "Two men of different ages in indigo and ivory handwoven panjabis at a textile atelier",
    position: "50% 42%",
  },
  menHomeCampaign: {
    src: "/images/men/home-campaign.webp",
    alt: "Man in an ivory panjabi and indigo waistcoat walking through a sunlit colonnade",
    position: "50% 38%",
  },
  menCategory: {
    src: "/images/men/home-category.webp",
    alt: "Man wearing a rust handwoven panjabi beside an indigo doorway",
    position: "50% 32%",
  },
  menTraditionals: {
    src: "/images/men/subcategory-traditionals.webp",
    alt: "Man wearing an indigo handwoven traditional panjabi in a courtyard",
    position: "50% 25%",
  },
  menShirts: {
    src: "/images/men/subcategory-shirts.webp",
    alt: "Man wearing a striped handloom cotton shirt beside a shuttered window",
    position: "50% 30%",
  },
  menPants: {
    src: "/images/men/subcategory-pants.webp",
    alt: "Man wearing tailored olive cotton pants on a sunlit terrace",
    position: "50% 50%",
  },
  menTShirts: {
    src: "/images/men/subcategory-t-shirts.webp",
    alt: "Man wearing a brick-red cotton T-shirt against a blue wall",
    position: "50% 30%",
  },
  menPolo: {
    src: "/images/men/subcategory-polo.webp",
    alt: "Man wearing a forest-green textured polo shirt on a veranda",
    position: "50% 28%",
  },
  menAccessories: {
    src: "/images/men/subcategory-accessories.webp",
    alt: "Leather satchel, indigo scarf, belt and watch on a stone table",
    position: "50% 50%",
  },
  menNewArrivals: {
    src: "/images/men/subcategory-new-arrivals.webp",
    alt: "Man walking in a mineral-teal panjabi on a stone veranda",
    position: "50% 28%",
  },
  menKaash: {
    src: "/images/men/product-kaash.webp",
    alt: "Man wearing a pale stone handloom kurta and charcoal trousers",
    position: "50% 50%",
  },
  menLongline: {
    src: "/images/men/product-longline.webp",
    alt: "Man wearing a midnight indigo longline panjabi and ivory trousers",
    position: "50% 50%",
  },
  menMati: {
    src: "/images/men/product-mati.webp",
    alt: "Man wearing a terracotta handwoven panjabi and ivory trousers",
    position: "50% 50%",
  },
  menMegh: {
    src: "/images/men/product-megh.webp",
    alt: "Man wearing a sage-green cotton kurta and cream trousers",
    position: "50% 50%",
  },
  kidsBanner: {
    src: "/images/kids-campaign-v2.webp",
    alt: "Two smiling children in coral and turquoise cotton clothing playing with a paper kite",
    position: "50% 35%",
  },
  homeBanner: {
    src: "/images/home-indigo-campaign.webp",
    alt: "Indigo block-printed kantha quilt in a sunlit heritage bedroom",
    position: "50% 40%",
  },
  jewelleryBanner: {
    src: "/images/jewellery-campaign-v3.webp",
    alt: "Woman wearing an antique gold and garnet necklace in a sunlit colonnade",
    position: "50% 15%",
  },
  jewelleryPortrait: {
    src: "/images/jewellery-campaign-v2.webp",
    alt: "Woman wearing a garnet necklace and wine silk saree in a stone colonnade",
    position: "50% 15%",
  },
  wineSaree: {
    src: "/images/saree-wine-editorial.webp",
    alt: "Woman wearing a wine silk saree with antique gold zari border",
    position: "50% 25%",
  },
  winePanjabi: {
    src: "/images/men/product-rong.webp",
    alt: "Man wearing a wine handloom panjabi and cream trousers in a studio",
    position: "50% 50%",
  },
  kidsDress: {
    src: "/images/kids-teal-dress.webp",
    alt: "Girl wearing a teal and cream embroidered cotton dress",
    position: "50% 20%",
  },
  kidsPanjabi: {
    src: "/images/kids-ochre-panjabi.webp",
    alt: "Boy wearing an ochre cotton panjabi with indigo trousers",
    position: "50% 18%",
  },
  cushions: {
    src: "/images/home-cushions.webp",
    alt: "Indigo, rust, and ivory hand-block printed cushions on a teak bench",
    position: "50% 45%",
  },
  tablecloth: {
    src: "/images/home-tablecloth.webp",
    alt: "Vermilion block-printed tablecloth on a teak dining table",
    position: "50% 45%",
  },
  earrings: {
    src: "/images/jewellery-earrings.webp",
    alt: "Antique gold and garnet drop earrings on pale stone",
    position: "50% 42%",
  },
  ring: {
    src: "/images/jewellery-ring.webp",
    alt: "Antique gold filigree ring with an oval garnet stone",
    position: "50% 45%",
  },
  women: {
    src: "/images/bengal-edit.webp",
    alt: "Woman wearing an ivory and vermilion handwoven saree",
    position: "50% 24%",
  },
  south: {
    src: "/images/south-edit.webp",
    alt: "Woman wearing an ink-black silk saree with antique gold border",
    position: "50% 20%",
  },
  womenCampaign: {
    src: "/images/kallayani-hero.webp",
    alt: "Two women in handwoven red and black sarees in a bright colonnade",
    position: "center top",
  },
  indigo: {
    src: "/images/men/product-kallayani-indigo.webp",
    alt: "Man wearing a deep indigo handloom panjabi",
    position: "50% 18%",
  },
  ivory: {
    src: "/images/men/product-sada.webp",
    alt: "Man wearing an ivory handloom kurta with indigo motifs",
    position: "50% 18%",
  },
  kids: {
    src: "/images/kids-edit.webp",
    alt: "Two children in vermilion and ivory festive clothing",
    position: "50% 25%",
  },
  home: {
    src: "/images/home-edit.webp",
    alt: "White bedroom layered with vermilion and ink hand-blocked textiles",
    position: "50% 60%",
  },
  jewellery: {
    src: "/images/jewellery-edit.webp",
    alt: "Handcrafted gold and garnet jewellery arranged on black silk",
    position: "center",
  },
} as const;

const product = (
  id: string,
  name: string,
  craft: string,
  region: string,
  price: number,
  image: Product["image"],
): Product => ({ id, name, craft, region, price, image });

const menProducts = [
  product(
    "kallayani-indigo",
    "Kallayani cotton panjabi",
    "Handloom cotton",
    "Bengal",
    148,
    media.indigo,
  ),
  product("sada-kurta", "Sada motif kurta", "Supplementary-weft cotton", "Nadia", 136, media.ivory),
  product(
    "rong-evening",
    "Rong evening panjabi",
    "Tonal hand embroidery",
    "Kolkata",
    172,
    media.winePanjabi,
  ),
  product("kaash-kurta", "Kaash relaxed kurta", "Textured handloom", "Shantipur", 154, media.menKaash),
  product(
    "indigo-longline",
    "Indigo longline panjabi",
    "Low-impact dye",
    "Bengal",
    188,
    media.menLongline,
  ),
  product("mati-panjabi", "Mati woven panjabi", "Handloom cotton", "Bengal", 162, media.menMati),
  product("megh-kurta", "Megh cotton kurta", "Woven stripe cotton", "Bengal", 142, media.menMegh),
];

const womenProducts = [
  product("rakta-jamdani", "Rakta Jamdani saree", "Jamdani", "Bengal", 248, media.women),
  product(
    "nila-kanjeevaram",
    "Nila Kanjeevaram saree",
    "Pure silk · Korvai border",
    "Kanchipuram",
    320,
    media.south,
  ),
  product(
    "sindoor-silk",
    "Sindoor silk saree",
    "Supplementary-weft silk",
    "Bengal",
    286,
    media.womenCampaign,
  ),
  product("rani-zari", "Rani zari saree", "Kanjeevaram silk", "Tamil Nadu", 348, media.wineSaree),
  product("shada-tant", "Shada Tant saree", "Handloom cotton", "Phulia", 168, {
    ...media.womenBanner,
    position: "69% 35%",
  }),
];

const kidsProducts = [
  product("ranga-cotton", "Ranga cotton set", "Handloom cotton", "Bengal", 96, media.kidsBanner),
  product("shada-festive", "Shada festive set", "Festive cotton", "Bengal", 114, media.kids),
  product("aalor-kurta", "Aalor cotton kurta", "Handloom cotton", "Bengal", 132, media.kidsPanjabi),
  product(
    "khela-dress",
    "Khela cotton dress",
    "Embroidered cotton",
    "Bengal",
    150,
    media.kidsDress,
  ),
  product("chhoto-panjabi", "Chhoto panjabi", "Soft cotton", "Bengal", 168, {
    ...media.kidsBanner,
    position: "68% 30%",
  }),
];

const homeProducts = [
  product(
    "kantha-coverlet",
    "Indigo Kantha coverlet",
    "Hand quilting",
    "Bengal",
    168,
    media.homeBanner,
  ),
  product(
    "botanical-cushion",
    "Botanical cushion set",
    "Hand block print",
    "Bengal",
    114,
    media.cushions,
  ),
  product(
    "batik-tablecloth",
    "Block-print tablecloth",
    "Hand block print",
    "Bengal",
    132,
    media.tablecloth,
  ),
  product("block-print-throw", "Block-print throw", "Hand block print", "Bengal", 150, media.home),
  product(
    "indigo-cushion",
    "Indigo cushion cover",
    "Hand block print",
    "Bengal",
    96,
    media.cushions,
  ),
];

const jewelleryProducts = [
  product(
    "rakta-collar",
    "Rakta garnet collar",
    "Hand-finished metal",
    "Kolkata",
    248,
    media.jewelleryPortrait,
  ),
  product(
    "golap-drops",
    "Golap garnet drops",
    "Hand-finished metal",
    "Kolkata",
    132,
    media.earrings,
  ),
  product("temple-bangle", "Temple bangle", "Hand-finished metal", "Kolkata", 186, media.jewellery),
  product("kajal-ring", "Kajal garnet ring", "Hand-finished metal", "Kolkata", 154, media.ring),
  product("moti-pendant", "Moti pendant", "Hand-finished metal", "Kolkata", 168, media.jewellery),
];

export const heroSlides: HeroSlide[] = [
  {
    id: "bengal",
    title: "A season in colour",
    description: "Handwoven sarees. Made for the moments that stay.",
    href: "/women",
    cta: "Discover women",
    image: media.womenBanner,
  },
  {
    id: "men",
    title: "The everyday, reimagined",
    description: "Light cotton. Rich indigo. A little more ease.",
    href: "/men",
    cta: "Discover men",
    image: media.menHomeCampaign,
  },
  {
    id: "kids",
    title: "Little moments, big joy",
    description: "Soft cotton and colours made for play.",
    href: "/kids",
    cta: "Discover kids",
    image: media.kidsBanner,
  },
  {
    id: "heritage-travel",
    title: "Heritage travels beautifully",
    description: "Rooted in Bengal, at home anywhere",
    href: "/kids",
    cta: "Discover new arrivals",
    image: media.heritageTravel,
  },
];

export const editorialFeatures: EditorialFeature[] = [
  {
    title: "Summer statement",
    description: "Sarees shaped by colour and light.",
    href: "/women",
    image: media.south,
  },
  {
    title: "Shimmering echoes",
    description: "Jewellery finished slowly, by hand.",
    href: "/jewellery",
    image: media.jewelleryBanner,
  },
  {
    title: "A quieter room",
    description: "Pattern that settles into daily life.",
    href: "/home",
    image: media.homeBanner,
  },
];

export const collections: Collection[] = [
  {
    slug: "women",
    name: "Women",
    headline: "Woven to move with you.",
    description: "Sarees and separates chosen for their clarity of craft and ease of wear.",
    hero: media.womenBanner,
    categoryImage: media.women,
    subcategories: [
      { name: "Jamdani", image: media.women },
      { name: "Kanjeevaram", image: media.wineSaree },
      {
        name: "New arrivals",
        image: { ...media.womenBanner, position: "36% 30%" },
      },
      { name: "Silk sarees", image: media.womenCampaign },
    ],
    products: womenProducts,
  },
  {
    slug: "men",
    name: "Men",
    headline: "Cut for the present.",
    description: "Handwoven cloth, easy proportions, and considered detail.",
    hero: media.menBanner,
    categoryImage: media.menCategory,
    subcategories: [
      { name: "New Arrivals", image: media.menNewArrivals },
      { name: "Shirts", image: media.menShirts },
      { name: "Pants", image: media.menPants },
      { name: "T-Shirts", image: media.menTShirts },
      { name: "Polo", image: media.menPolo },
      { name: "Accessories", image: media.menAccessories },
      { name: "Traditionals", image: media.menTraditionals },
    ],
    products: menProducts,
  },
  {
    slug: "kids",
    name: "Kids",
    headline: "Made for movement.",
    description: "Soft handloom cotton and celebration clothes that still feel like play.",
    hero: media.kidsBanner,
    categoryImage: media.kids,
    subcategories: [
      { name: "Girls", image: media.kidsDress },
      { name: "Boys", image: media.kidsPanjabi },
      { name: "Festive", image: media.kids },
      { name: "Everyday", image: media.kidsBanner },
    ],
    products: kidsProducts,
  },
  {
    slug: "home",
    name: "Home",
    headline: "Pattern, held quietly.",
    description: "Table, bed, and living textiles made to settle into a room rather than stage it.",
    hero: media.homeBanner,
    categoryImage: media.home,
    subcategories: [
      { name: "Bedding", image: media.homeBanner },
      { name: "Cushions", image: media.cushions },
      { name: "Throws", image: media.home },
      { name: "Table linen", image: media.tablecloth },
    ],
    products: homeProducts,
  },
  {
    slug: "jewellery",
    name: "Jewellery",
    headline: "Adornment with a point of view.",
    description: "Sculptural pieces shaped by regional motifs and finished by hand.",
    hero: media.jewelleryBanner,
    categoryImage: media.jewellery,
    subcategories: [
      { name: "Necklaces", image: media.jewelleryPortrait },
      { name: "Earrings", image: media.earrings },
      { name: "Bangles", image: media.jewellery },
      { name: "Rings", image: media.ring },
    ],
    products: jewelleryProducts,
  },
];

export const collectionBySlug = Object.fromEntries(collections.map((entry) => [entry.slug, entry]));
export const featuredProducts = [
  womenProducts[0],
  menProducts[0],
  womenProducts[1],
  menProducts[1],
  womenProducts[2],
  menProducts[2],
];
