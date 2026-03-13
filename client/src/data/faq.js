// data/faqs.js

export const FAQ_ITEMS = [
  {
    q: "What services do you offer?",
    a: "We offer roll-off dumpster rentals, junk removal, and light demolition services for residential, commercial, and construction projects.",
  },
  {
    q: "What dumpster sizes do you offer?",
    a: "We offer multiple dumpster sizes to fit different projects, from small home cleanouts to larger renovation and construction jobs. If you are not sure which size is right, we can help recommend the best option.",
  },
  {
    q: "How do I book a dumpster?",
    a: "Booking is simple. You can request a quote or book online by choosing your dumpster size, delivery address, rental period, and any add-ons or special instructions.",
  },
  {
    q: "How long can I keep the dumpster?",
    a: "Our standard rental periods can vary by project, but we offer flexible scheduling. If you need extra time, just let us know and we can discuss an extension.",
  },
  {
    q: "Do you offer same-day or next-day delivery?",
    a: "Yes, depending on availability, project location, and our current schedule, we may be able to offer same-day or next-day delivery.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve the Denver metro area and nearby communities. Our standard service area covers locations within a 25-mile radius of our base. If your project is outside that range, we may still be able to help—an additional travel fee of $5 per mile will be added for locations beyond the 25-mile radius. Feel free to contact us and we’ll confirm availability and pricing for your address.",
  },
  {
    q: "How should I prepare for dumpster delivery?",
    a: "Make sure the drop-off area is clear and accessible, with enough room for the truck and dumpster. If possible, move vehicles, equipment, or other obstacles before delivery.",
  },
  {
    q: "What happens if I fill the dumpster above the top?",
    a: "For safety reasons, debris should never be loaded above the fill line. Overfilled dumpsters may require material to be removed before pickup, and additional charges may apply.",
  },
  {
    q: "Are there weight limits?",
    a: "Yes. Every dumpster has a weight limit based on size and material type. Heavy materials like concrete, dirt, brick, asphalt, roofing shingles, or masonry can reach weight limits quickly, so it is important to choose the right dumpster.",
  },
  {
    q: "Can I put concrete, dirt, brick, or asphalt in any dumpster?",
    a: "Heavy materials usually require a smaller dumpster size to stay within safe hauling limits. Contact us before loading concrete, dirt, brick, rock, asphalt, or similar materials so we can recommend the right option.",
  },
  {
    q: "Do you offer junk removal too?",
    a: "Yes. If you do not want to load a dumpster yourself, we also offer junk removal services where our team can do the lifting, loading, and haul-away for you.",
  },
  {
    q: "What kind of demolition do you do?",
    a: "We offer light demolition services for projects like sheds, decks, fences, interior tear-outs, hot tubs, small structures, and similar removal work. Reach out with your project details and we will let you know if it is a fit.",
  },
  {
    q: "Do you offer recurring service for businesses or contractors?",
    a: "Yes. We can provide recurring dumpster service for contractors, property managers, businesses, and ongoing job sites that need regular waste removal.",
  },
  {
    q: "What items are not allowed in the dumpster?",
    a: "Hazardous materials, liquids, batteries, tires, electronics, asbestos, and other restricted items are not allowed. We recommend checking our allowed and prohibited materials list before loading.",
  },
];

export const ALLOWED_ITEMS = [
  {
    title: "General Household Items",
    description:
      "Furniture, clothing, toys, boxes, general home junk, and most non-hazardous household waste.",
  },
  {
    title: "Renovation Debris",
    description:
      "Drywall, wood, flooring, cabinets, non-hazardous remodeling debris, and tear-out materials.",
  },
  {
    title: "Construction Materials",
    description:
      "Construction and demolition debris is generally allowed. Heavy materials may require a specific dumpster size.",
  },
  {
    title: "Yard Waste",
    description:
      "Branches, brush, leaves, landscaping debris, and similar green waste, when approved.",
  },
  {
    title: "Cardboard, Paper, and Plastic",
    description:
      "Clean, non-hazardous recyclable materials are generally accepted.",
  },
  {
    title: "Furniture and Bulky Items",
    description:
      "Couches, chairs, mattresses, tables, and other large non-hazardous items are typically allowed.",
  },
];

export const NOT_ALLOWED_ITEMS = [
  {
    title: "Liquids and Saturated Materials",
    description:
      "No liquids, partially filled containers, paint in liquid form, oils, or materials saturated with liquids.",
  },
  {
    title: "Hazardous Materials",
    description:
      "No chemicals, solvents, asbestos, lead-based materials, fuels, pesticides, or anything regulated as hazardous waste.",
  },
  {
    title: "Batteries",
    description:
      "Car batteries, lithium batteries, and other restricted battery types are not allowed.",
  },
  {
    title: "Tires",
    description:
      "Tires are typically prohibited and require special disposal.",
  },
  {
    title: "Electronics",
    description:
      "TVs, monitors, computers, printers, and other e-waste may not be accepted in standard dumpster loads.",
  },
  {
    title: "Biohazards or Medical Waste",
    description:
      "No needles, medical waste, biomedical materials, or other biohazardous items.",
  },
  {
    title: "Gas-Filled or Pressurized Containers",
    description:
      "Propane tanks, fuel cylinders, and other pressurized containers are not allowed.",
  },
  {
    title: "Large Amounts of Food Waste",
    description:
      "Food waste and perishables are typically not allowed because they can create odor, pest, and disposal issues.",
  },
];

export const MATERIALS_DETAILS = {
  acceptable: [
    "Household junk",
    "Commercial waste",
    "Construction debris",
    "Renovation debris",
    "Landscape waste",
    "Furniture",
    "Cardboard and paper",
    "Plastic",
    "Drywall",
    "Scrap metal",
    "Mattresses",
  ],
  restricted: [
    "Concrete, dirt, brick, rock, masonry, or asphalt may require a smaller dumpster",
    "Roofing shingles may require a specific dumpster size based on weight",
  ],
  prohibited: [
    "Liquids or saturated materials",
    "Gas-filled containers",
    "Hazardous waste",
    "Biomedical waste",
    "Asbestos",
    "Lead paint",
    "Fluorescent bulbs",
    "Batteries",
    "Tires",
    "Electronics",
  ],
};

export default FAQ_ITEMS;