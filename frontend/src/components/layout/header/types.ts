export type MegaMenuLink = {
  label: string;
  href: string;
};

export type MegaMenuColumn = {
  heading: string;
  links: MegaMenuLink[];
};

export type MegaMenuPromo = {
  image: string;
  alt: string;
  caption: string;
  href: string;
};

export type NavItemConfig = {
  id: string;
  label: string;
  viewAllHref: string;
  columns: MegaMenuColumn[];
  promo: MegaMenuPromo;
};
