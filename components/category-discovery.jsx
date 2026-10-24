"use client";
import {useState,} from "react";
import Image from "next/image";

const categoryGroups = [
  {
    id: "furniture",
    items: [
      { name: "Sofas", image: "/images/category-sofas-cutout.webp", width: 900, height: 387, alt: "Illustrative cutout of a contemporary sage sofa" },
      { name: "Beds", image: "/images/category-beds-cutout.webp", width: 900, height: 515, alt: "Illustrative cutout of a modern double bed" },
      { name: "Wardrobes", image: "/images/category-wardrobes-cutout.webp", width: 522, height: 700, alt: "Illustrative cutout of a freestanding oak wardrobe" },
      { name: "Dining Tables", image: "/images/category-dining-tables-cutout.webp", width: 900, height: 518, alt: "Illustrative cutout of a dining table with four chairs" },
      { name: "Study Tables", image: "/images/category-study-tables-cutout.webp", width: 900, height: 544, alt: "Illustrative cutout of a study desk with chair" },
    ],
  },
  {
    id: "appliances",
    items: [
      { name: "Refrigerators", image: "/images/category-refrigerators-cutout.webp", width: 330, height: 700, alt: "Illustrative cutout of an upright refrigerator" },
      { name: "Washing Machines", image: "/images/category-washing-machines-cutout.webp", width: 602, height: 700, alt: "Illustrative cutout of a front-loading washing machine" },
      { name: "Televisions", image: "/images/category-televisions-cutout.webp", width: 900, height: 669, alt: "Illustrative cutout of a modern flat-screen television" },
      { name: "Air Conditioners", image: "/images/category-air-conditioners-cutout.webp", width: 900, height: 250, alt: "Illustrative cutout of a wall-mounted split air conditioner" },
      { name: "Microwaves", image: "/images/category-microwaves-cutout.webp", width: 900, height: 523, alt: "Illustrative cutout of a countertop microwave oven" },
    ],
  },
];

function CategoryRow({ group }) {
  return (
    <div className="category-cutout-grid" id={group.id}>
      {group.items.map((item) => (
        <a className="category-cutout" href="#rentals" key={item.name} aria-label={`Explore ${item.name} rental and purchase information`} id={`cat-${item.name.toLowerCase().replaceAll(" ", "-")}`}>
          <span className="category-cutout__image">
            <Image src={item.image} alt={item.alt} width={item.width} height={item.height} sizes="(max-width: 640px) 42vw, (max-width: 1000px) 28vw, 18vw" />
          </span>
          <span className="category-cutout__name">{item.name}</span>
        </a>
      ))}
    </div>
  );
}

export function CategoryDiscovery() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Categories" },
    { id: "furniture", label: "Furniture" },
    { id: "appliances", label: "Home Appliances" },
  ];

  const visibleGroups = activeFilter === "all" ? categoryGroups : categoryGroups.filter((group) => group.id === activeFilter);

  return (
    <section
      id="categories"
      className="category-section page-container"
      aria-labelledby="category-heading"
    >
      <div className="category-section__toolbar">
        <h2 id="category-heading">Shop by Category</h2>

        <div
          className="category-section__filters"
          aria-label="Filter categories"
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id;

            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFilter(filter.id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36] ${
                  isActive
                    ? "border-[#124734] bg-[#124734] text-white"
                    : "border-[#124734]/25 bg-transparent text-[#124734] hover:border-[#017F36] hover:text-[#017F36]"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="category-cutout-rows">
        {visibleGroups.map((group) => (
          <CategoryRow group={group} key={group.id} />
        ))}
      </div>

      

      <p className="sr-only">
        All category product images are illustrative concepts, not product
        listings or availability information.
      </p>
    </section>
  );
}