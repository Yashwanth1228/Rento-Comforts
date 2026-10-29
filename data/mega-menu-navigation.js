function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const groupImages = {
  beds: "/images/category-beds-cutout.webp",
  mattresses: "/images/category-beds-cutout.webp",
  "sofas-recliners": "/images/category-sofas-cutout.webp",
  dining: "/images/category-dining-tables-cutout.webp",
  tables: "/images/category-study-tables-cutout.webp",
  wardrobes: "/images/category-wardrobes-cutout.webp",
  "storage-organizers": "/images/category-wardrobes-cutout.webp",
  "office-study": "/images/category-study-tables-cutout.webp",
  refrigerators: "/images/category-refrigerators-cutout.webp",
  "washing-machines": "/images/category-washing-machines-cutout.webp",
  televisions: "/images/category-televisions-cutout.webp",
  "air-conditioners": "/images/category-air-conditioners-cutout.webp",
  microwaves: "/images/category-microwaves-cutout.webp",
  "kitchen-appliances": "/images/hero-appliances-cutout.webp",
  "cooling-air-care": "/images/category-air-conditioners-cutout.webp",
  "home-utilities": "/images/hero-appliances-cutout.webp",
  "bedroom-combos": "/images/category-beds-cutout.webp",
  "living-room-combos": "/images/category-sofas-cutout.webp",
  "dining-combos": "/images/category-dining-tables-cutout.webp",
  "work-study-combos": "/images/category-study-tables-cutout.webp",
  "appliance-combos": "/images/hero-appliances-cutout.webp",
  "complete-home-combos": "/images/hero-living-room-cutout.webp",
  "home-shifting": "/images/category-movers-truck.webp",
  "office-shifting": "/images/category-movers-truck.webp",
  "packing-services": "/images/category-wardrobes-cutout.webp",
  "unpacking-setup": "/images/category-sofas-cutout.webp",
  "furniture-appliance-moving": "/images/category-movers-truck.webp",
  "loading-unloading": "/images/category-movers-truck.webp",
};

function group(id, heading, icon, labels) {
  return {
    id,
    heading,
    icon,
    image: groupImages[id],
    imageClassName: ["refrigerators", "washing-machines"].includes(id)
      ? "mega-menu__group-image mega-menu__group-image--compact"
      : "mega-menu__group-image",
    status: "planned",
    items: labels.map((label) => ({
      id: `${id}-${slugify(label)}`,
      label,
      status: "planned",
      href: null,
    })),
  };
}

export const megaMenuNavigation = {
  furniture: {
    label: "Furniture",
    statusNote: "Planned category structure · product listings and availability are not connected.",
    columns: [
      [
        group("beds", "Beds", "home", ["Single Beds", "Double Beds", "Queen Size Beds", "King Size Beds", "Storage Beds"]),
        group("mattresses", "Mattresses", "layers", ["Single Mattresses", "Double Mattresses", "Queen Mattresses", "King Mattresses"]),
      ],
      [
        group("sofas-recliners", "Sofas & Recliners", "home", ["1-Seater Sofas", "2-Seater Sofas", "3-Seater Sofas", "L-Shape Sofas", "Recliners", "Sofa Cum Beds"]),
        group("dining", "Dining", "grid", ["2-Seater Dining Sets", "4-Seater Dining Sets", "6-Seater Dining Sets", "Dining Chairs"]),
      ],
      [
        group("tables", "Tables", "grid", ["Study Tables", "Coffee / Center Tables", "Side Tables", "Bedside Tables"]),
        group("wardrobes", "Wardrobes", "box", ["Single Door Wardrobes", "Double Door Wardrobes", "Multi-Door Wardrobes"]),
      ],
      [
        group("storage-organizers", "Storage & Organizers", "box", ["Storage Cabinets", "Bookshelves", "Shoe Racks", "TV Units"]),
        group("office-study", "Office & Study", "briefcase", ["Office Chairs", "Office Tables", "Computer Desks", "Study Chairs"]),
      ],
    ],
    promo: {
      image: "/images/rento-living-room.webp",
      imageAlt: "Illustrative warm living room with a sofa and coffee table",
      eyebrow: "PREMIUM LIVING",
      heading: "Furniture for Every Chapter of Life",
      description: "Explore furniture for rent or purchase.",
      cta: "Explore Furniture",
      href: "#categories",
    },
  },
  appliances: {
    label: "Appliances",
    statusNote: "Planned category structure · product listings and availability are not connected.",
    columns: [
      [
        group("refrigerators", "Refrigerators", "box", ["Single Door", "Double Door", "Side-by-Side", "Mini Refrigerators", "Convertible Refrigerators"]),
        group("washing-machines", "Washing Machines", "droplet", ["Top Load", "Front Load", "Semi-Automatic", "Fully Automatic"]),
      ],
      [
        group("televisions", "Televisions", "tv", ["Smart TVs", "LED TVs", "Android / Google TVs", "4K TVs"]),
        group("air-conditioners", "Air Conditioners", "wind", ["Split AC", "Window AC", "Inverter AC", "Portable AC"]),
      ],
      [
        group("microwaves", "Microwaves", "grid", ["Solo Microwave", "Grill Microwave", "Convection Microwave"]),
        group("kitchen-appliances", "Kitchen Appliances", "home", ["Mixer Grinders", "Induction Cooktops", "Electric Kettles", "OTG Ovens"]),
      ],
      [
        group("cooling-air-care", "Cooling & Air Care", "wind", ["Air Coolers", "Fans", "Air Purifiers"]),
        group("home-utilities", "Home Utilities", "droplet", ["Water Purifiers", "Geysers", "Vacuum Cleaners"]),
      ],
    ],
    promo: {
      image: "/images/buy-banner-appliances.png",
      imageAlt: "Illustrative home appliances for a household",
      eyebrow: "EVERYDAY COMFORT",
      heading: "Everyday Comfort for Your Home",
      description: "Explore home appliances for rental or purchase.",
      cta: "Explore Appliances",
      href: "#categories",
    },
  },
  combos: {
    label: "Combos",
    statusNote: "Planned bundle taxonomy · package contents, availability and pricing are not configured.",
    columns: [
      [
        group("bedroom-combos", "Bedroom Combos", "layers", ["Bed & Mattress Combo", "Bed & Wardrobe Combo", "Complete Bedroom Set", "Bedroom Storage Combo"]),
        group("living-room-combos", "Living Room Combos", "home", ["Sofa & Coffee Table", "Sofa & TV Unit", "Living Room Furniture Set", "Sofa & Recliner Combo"]),
      ],
      [
        group("dining-combos", "Dining Combos", "grid", ["2-Seater Dining Set", "4-Seater Dining Set", "6-Seater Dining Set", "Dining & Storage Set"]),
        group("work-study-combos", "Work & Study Combos", "briefcase", ["Study Table & Chair", "Work From Home Setup", "Office Desk & Chair", "Study & Storage Combo"]),
      ],
      [
        group("appliance-combos", "Appliance Combos", "box", ["Refrigerator & Washing Machine", "TV & Refrigerator", "Kitchen Appliance Combo", "Essential Appliances Package"]),
        group("complete-home-combos", "Complete Home Combos", "home", ["1 BHK Furniture Package", "2 BHK Furniture Package", "3 BHK Furniture Package", "Furniture & Appliances Package"]),
      ],
    ],
    promo: {
      image: "/images/rento-living-room.webp",
      imageAlt: "Illustrative living room arrangement",
      eyebrow: "PLANNED BUNDLES",
      heading: "Complete Your Home",
      description: "Explore planned furniture and appliance combinations.",
      cta: null,
      href: null,
    },
  },
  packers: {
    label: "Packers & Movers",
    statusNote: "Planned service taxonomy · service availability and booking are not configured.",
    columns: [
      [
        group("home-shifting", "Home Shifting", "home", ["Local Home Shifting", "1 BHK Shifting", "2 BHK Shifting", "3 BHK Shifting", "Apartment Relocation"]),
        group("office-shifting", "Office Shifting", "briefcase", ["Small Office Relocation", "Office Furniture Moving", "Office Equipment Moving", "Commercial Relocation"]),
      ],
      [
        group("packing-services", "Packing Services", "box", ["Full Household Packing", "Fragile Item Packing", "Furniture Packing", "Appliance Packing"]),
        group("unpacking-setup", "Unpacking & Setup", "layers", ["Unpacking Assistance", "Furniture Placement", "Basic Home Setup"]),
      ],
      [
        group("furniture-appliance-moving", "Furniture & Appliance Moving", "truck", ["Sofa & Bed Moving", "Wardrobe Moving", "Refrigerator Moving", "Washing Machine Moving", "Single-Item Transportation"]),
        group("loading-unloading", "Loading & Unloading", "truck", ["Loading Assistance", "Unloading Assistance", "Moving Labour Assistance"]),
      ],
    ],
    promo: {
      image: "/images/rento-living-room.webp",
      imageAlt: "Illustrative home interior",
      eyebrow: "PLANNED SERVICE",
      heading: "Moving Made Easier",
      description: "Moving service information will be shared when the offering is configured.",
      cta: null,
      href: null,
    },
  },
};
