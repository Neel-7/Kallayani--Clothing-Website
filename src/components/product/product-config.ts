export const productCopy: Record<string, string> = {
  women:
    "A considered drape with an easy, fluid hand. Woven for celebration, then refined for quieter rituals.",
  men: "A relaxed silhouette in breathable cloth, finished with enough structure to move easily from day to evening.",
  kids: "Soft against the skin and generous through the body, made to follow every small adventure.",
  home: "A quietly expressive textile that brings handwork, depth, and lived-in pattern to the rooms you return to.",
  jewellery:
    "A sculptural everyday piece, finished by hand so subtle variations become part of its character.",
};

export const sizesByCollection: Record<string, string[]> = {
  women: ["XS", "S", "M", "L", "XL"],
  men: ["S", "M", "L", "XL", "XXL"],
  kids: ["2–3Y", "4–5Y", "6–7Y", "8–9Y"],
  home: ["Standard", "Large"],
  jewellery: ["One size"],
};

export const dollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
