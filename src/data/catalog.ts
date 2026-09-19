import type { Collection, EditorialFeature, HeroSlide, Product } from "@/types/catalog";

const media = {
  womenBanner: {
    src: "/images/women/collection-hero.webp",
    alt: "Two women in ivory Jamdani and indigo handloom dress at a textile atelier",
    position: "50% 38%",
  },
  womenHomeCampaign: {
    src: "/images/women/home-campaign.webp",
    alt: "Woman in an oxblood and ivory handwoven dress walking through a colonnade",
    position: "50% 44%",
  },
  womenCategory: {
    src: "/images/women/home-category.webp",
    alt: "Two women in contemporary and traditional handwoven clothing by a teal doorway",
    position: "50% 36%",
  },
  womenNewArrivals: {
    src: "/images/women/subcategory-new-arrivals.webp",
    alt: "Woman wearing a mineral-teal embroidered handwoven dress on a veranda",
    position: "50% 34%",
  },
  womenFormalDresses: {
    src: "/images/women/subcategory-formal-dresses.webp",
    alt: "Woman wearing an ink-black formal dress in a modern gallery",
    position: "50% 35%",
  },
  womenCasualDresses: {
    src: "/images/women/subcategory-casual-dresses.webp",
    alt: "Woman wearing a terracotta block-print casual dress in a garden courtyard",
    position: "50% 34%",
  },
  womenPartywear: {
    src: "/images/women/subcategory-partywear.webp",
    alt: "Woman wearing an oxblood silk party dress beside a heritage staircase",
    position: "50% 32%",
  },
  womenTops: {
    src: "/images/women/subcategory-tops.webp",
    alt: "Woman wearing an ivory and indigo handloom top in a textile studio",
    position: "50% 28%",
  },
  womenPants: {
    src: "/images/women/subcategory-pants.webp",
    alt: "Woman wearing rust wide-leg handloom pants in a colonnade",
    position: "50% 50%",
  },
  womenNightwear: {
    src: "/images/women/subcategory-nightwear.webp",
    alt: "Woman wearing indigo block-print cotton nightwear in a bright bedroom",
    position: "50% 36%",
  },
  womenTraditionals: {
    src: "/images/women/subcategory-traditionals.webp",
    alt: "Woman wearing an ivory and vermilion Jamdani saree in a heritage courtyard",
    position: "50% 34%",
  },
  womenAccessories: {
    src: "/images/women/subcategory-accessories.webp",
    alt: "Oxblood handbag, indigo scarf, jewellery, belt and hair pin arranged on stone",
    position: "50% 50%",
  },
  womenRakta: {
    src: "/images/women/product-rakta.webp",
    alt: "Woman wearing an ivory Jamdani saree with vermilion floral motifs",
    position: "50% 50%",
  },
  womenNila: {
    src: "/images/women/product-nila.webp",
    alt: "Woman wearing an indigo Kanjeevaram saree with antique-gold border",
    position: "50% 50%",
  },
  womenSindoor: {
    src: "/images/women/product-sindoor.webp",
    alt: "Woman wearing a deep red tonal silk saree",
    position: "50% 50%",
  },
  womenRani: {
    src: "/images/women/product-rani.webp",
    alt: "Woman wearing a rani-pink silk saree with muted-gold zari border",
    position: "50% 50%",
  },
  womenShada: {
    src: "/images/women/product-shada.webp",
    alt: "Woman wearing a white Tant cotton saree with fine black and rust stripes",
    position: "50% 50%",
  },
  womenNeelDress: {
    src: "/images/women/product-neel-dress.webp",
    alt: "Woman wearing an ink-blue formal handloom dress",
    position: "50% 50%",
  },
  womenMatiPants: {
    src: "/images/women/product-mati-pants.webp",
    alt: "Woman wearing rust wide-leg handloom pants and an ivory top",
    position: "50% 50%",
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
    src: "/images/kids/collection-hero.webp",
    alt: "Four children carrying a handmade fabric fish through an outdoor art festival",
    position: "50% 42%",
  },
  kidsHomeCampaign: {
    src: "/images/kids/home-campaign.webp",
    alt: "Two children running through a field with a patchwork kite at sunset",
    position: "50% 45%",
  },
  kidsCategory: {
    src: "/images/kids/home-category.webp",
    alt: "Three children laughing through a blue and yellow cardboard playhouse",
    position: "50% 42%",
  },
  kidsNewArrivals: {
    src: "/images/kids/subcategory-new-arrivals.webp",
    alt: "Two children making colorful paper birds and a kite in an art studio",
    position: "50% 34%",
  },
  kidsPartywear: {
    src: "/images/kids/subcategory-partywear.webp",
    alt: "Three children in festive clothing celebrating at a garden birthday table",
    position: "50% 38%",
  },
  kidsJuniorGirls: {
    src: "/images/kids/subcategory-junior-girls.webp",
    alt: "Junior girl in an indigo jumpsuit painting a colorful kite on a rooftop",
    position: "50% 36%",
  },
  kidsJuniorBoys: {
    src: "/images/kids/subcategory-junior-boys.webp",
    alt: "Junior boy in a green handloom overshirt repairing a bicycle",
    position: "50% 40%",
  },
  kidsGirls: {
    src: "/images/kids/subcategory-girls.webp",
    alt: "Two girls in cotton dresses playing hopscotch in a garden courtyard",
    position: "50% 36%",
  },
  kidsBoys: {
    src: "/images/kids/subcategory-boys.webp",
    alt: "Two boys in handloom clothing floating paper boats after rain",
    position: "50% 32%",
  },
  kidsToysBooks: {
    src: "/images/kids/subcategory-toys-books.webp",
    alt: "Illustrated books, wooden toys and a cloth elephant in a sunny reading nook",
    position: "50% 50%",
  },
  kidsRanga: {
    src: "/images/kids/product-ranga.webp",
    alt: "Girl wearing a coral block-print cotton dress",
    position: "50% 50%",
  },
  kidsShada: {
    src: "/images/kids/product-shada.webp",
    alt: "Boy wearing an ivory embroidered festive kurta set",
    position: "50% 50%",
  },
  kidsAalor: {
    src: "/images/kids/product-aalor.webp",
    alt: "Boy wearing a mustard striped handloom kurta and cream trousers",
    position: "50% 50%",
  },
  kidsKhela: {
    src: "/images/kids/product-khela.webp",
    alt: "Girl wearing a turquoise cotton dress with coral embroidery",
    position: "50% 50%",
  },
  kidsChhoto: {
    src: "/images/kids/product-chhoto.webp",
    alt: "Boy wearing a rust handloom panjabi and ivory trousers",
    position: "50% 50%",
  },
  kidsTara: {
    src: "/images/kids/product-tara.webp",
    alt: "Junior girl wearing an indigo handloom jumpsuit",
    position: "50% 50%",
  },
  kidsMegh: {
    src: "/images/kids/product-megh.webp",
    alt: "Junior boy wearing a green handloom overshirt and navy trousers",
    position: "50% 50%",
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
    src: "/images/women/editorial-wine-saree.webp",
    alt: "Woman wearing a wine silk saree with antique gold zari border",
    position: "50% 25%",
  },
  winePanjabi: {
    src: "/images/men/product-rong.webp",
    alt: "Man wearing a wine handloom panjabi and cream trousers in a studio",
    position: "50% 50%",
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
    src: "/images/women/editorial-bengal.webp",
    alt: "Woman wearing an ivory and vermilion handwoven saree",
    position: "50% 24%",
  },
  south: {
    src: "/images/women/editorial-south.webp",
    alt: "Woman wearing an ink-black silk saree with antique gold border",
    position: "50% 20%",
  },
  womenCampaign: {
    src: "/images/women/editorial-hero.webp",
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
  product("rakta-jamdani", "Rakta Jamdani saree", "Jamdani", "Bengal", 248, media.womenRakta),
  product(
    "nila-kanjeevaram",
    "Nila Kanjeevaram saree",
    "Pure silk · Korvai border",
    "Kanchipuram",
    320,
    media.womenNila,
  ),
  product(
    "sindoor-silk",
    "Sindoor silk saree",
    "Supplementary-weft silk",
    "Bengal",
    286,
    media.womenSindoor,
  ),
  product("rani-zari", "Rani zari saree", "Kanjeevaram silk", "Tamil Nadu", 348, media.womenRani),
  product("shada-tant", "Shada Tant saree", "Handloom cotton", "Phulia", 168, media.womenShada),
  product("neel-formal", "Neel formal dress", "Handloom cotton", "Dhaka", 188, media.womenNeelDress),
  product("mati-trousers", "Mati wide-leg pants", "Textured handloom", "Bengal", 154, media.womenMatiPants),
];

const kidsProducts = [
  product("ranga-cotton", "Ranga cotton dress", "Block-print cotton", "Bengal", 96, media.kidsRanga),
  product("shada-festive", "Shada festive set", "Embroidered cotton", "Bengal", 114, media.kidsShada),
  product("aalor-kurta", "Aalor cotton kurta", "Handloom cotton", "Bengal", 132, media.kidsAalor),
  product(
    "khela-dress",
    "Khela cotton dress",
    "Embroidered cotton",
    "Bengal",
    150,
    media.kidsKhela,
  ),
  product("chhoto-panjabi", "Chhoto panjabi", "Soft handloom cotton", "Bengal", 128, media.kidsChhoto),
  product("tara-jumpsuit", "Tara junior jumpsuit", "Handloom cotton", "Dhaka", 148, media.kidsTara),
  product("megh-overshirt", "Megh junior overshirt", "Textured cotton", "Bengal", 136, media.kidsMegh),
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
    image: media.womenHomeCampaign,
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
    image: media.kidsHomeCampaign,
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
    categoryImage: media.womenCategory,
    subcategories: [
      { name: "New Arrivals", image: media.womenNewArrivals },
      { name: "Formal Dresses", image: media.womenFormalDresses },
      { name: "Casual Dresses", image: media.womenCasualDresses },
      { name: "Partywear", image: media.womenPartywear },
      { name: "Tops", image: media.womenTops },
      { name: "Pants", image: media.womenPants },
      { name: "Nightwear", image: media.womenNightwear },
      { name: "Traditionals", image: media.womenTraditionals },
      { name: "Accessories", image: media.womenAccessories },
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
    categoryImage: media.kidsCategory,
    subcategories: [
      { name: "New Arrivals", image: media.kidsNewArrivals },
      { name: "Kids Partywear", image: media.kidsPartywear },
      { name: "Junior Girls", image: media.kidsJuniorGirls },
      { name: "Junior Boys", image: media.kidsJuniorBoys },
      { name: "Girls", image: media.kidsGirls },
      { name: "Boys", image: media.kidsBoys },
      { name: "Toys & Books", image: media.kidsToysBooks },
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
