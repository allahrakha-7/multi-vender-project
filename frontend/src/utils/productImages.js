import laptapsImg from "../images/laptaps.png";
import cosmeticsImg from "../images/cosmetics.png";
import headandshouldersImg from "../images/headandshoulders.png";
import cleanerImg from "../images/cleaner.png";
import detergentImg from "../images/detergent.png";
import headphonesImg from "../images/headphones.png";
import playconsoleImg from "../images/playconsole.png";
import spanchImg from "../images/spanch.png";
import thermameterImg from "../images/thermameter.png";
import toothandbrushImg from "../images/toothandbrush.png";
import vitaminCImg from "../images/vitaminC.png";
import bandachesImg from "../images/bandaches.png";

export const getProductImage = (product) => {
  if (!product) return "/placeholder.jpg";
  const nameLower = (product.name || "").toLowerCase();
  const catLower = (product.category || "").toLowerCase();

  if (nameLower.includes("laptop") || catLower.includes("laptop") || nameLower.includes("laptap") || catLower.includes("laptap")) {
    return laptapsImg;
  }
  if (nameLower.includes("cosmetic") || catLower.includes("cosmetic") || nameLower.includes("lipstick") || nameLower.includes("palette") || nameLower.includes("foundation") || nameLower.includes("cream")) {
    return cosmeticsImg;
  }
  if (nameLower.includes("shampoo") || nameLower.includes("headandshoulders") || nameLower.includes("head & shoulders") || nameLower.includes("head and shoulders")) {
    return headandshouldersImg;
  }
  if (nameLower.includes("cleaner") || nameLower.includes("clean")) {
    return cleanerImg;
  }
  if (nameLower.includes("detergent") || nameLower.includes("wash") || nameLower.includes("surf")) {
    return detergentImg;
  }
  if (nameLower.includes("headphone") || nameLower.includes("headphones") || nameLower.includes("earbud") || nameLower.includes("airpod")) {
    return headphonesImg;
  }
  if (nameLower.includes("playconsole") || nameLower.includes("console") || nameLower.includes("playstation") || nameLower.includes("xbox") || nameLower.includes("game console")) {
    return playconsoleImg;
  }
  if (nameLower.includes("sponge") || nameLower.includes("spanch")) {
    return spanchImg;
  }
  if (nameLower.includes("thermometer") || nameLower.includes("thermameter")) {
    return thermameterImg;
  }
  if (nameLower.includes("toothbrush") || nameLower.includes("toothpaste") || nameLower.includes("toothandbrush") || nameLower.includes("colgate") || nameLower.includes("brush")) {
    return toothandbrushImg;
  }
  if (nameLower.includes("vitamin c") || nameLower.includes("vitaminc") || nameLower.includes("vitamin") || nameLower.includes("supplement")) {
    return vitaminCImg;
  }
  if (nameLower.includes("bandage") || nameLower.includes("bandache") || nameLower.includes("band-aid") || nameLower.includes("bandaid") || nameLower.includes("aid")) {
    return bandachesImg;
  }

  return (product.images && product.images[0]) || "/placeholder.jpg";
};
