/** Landing page copy and service cards from Figma (Moving Logistic / Home page). */
export const homeHero = {
  badge: "WEST YORKSHIRE PREMIER HAULAGE & REMOVAL NETWORK",
  headline: ["Your Logistics and", "Removals Partner"],
  body:
    "House removals, office relocations, commercial moves, business deliveries, clearance and waste removal—all handled with reliability and care.",
  callLabel: "Call  07920 507601",
  callHref: "tel:07920507601",
};

export const homeTrustStats = [
  { value: "£50k", label: "GOODS IN TRANSIT" },
  { value: "4.9 / 5", label: "VERIFIED REVIEWS" },
  { value: "98.4%", label: "ZERO LANDFILL RATIO" },
] as const;

export const homeRouteOverlay = {
  title: "UNIT #BD-04 LIVE ROUTE",
  route: "Leeds Ring Rd -> M62",
  consignment: "Consignment: FN-8829-YRK",
  eta: "ETA: 18 mins",
};

export const homeRapidBooking = {
  tag: "RAPID BOOKING ENGINE",
  title: "Calculate Van & Haulage Estimate",
  subtitle: "Direct pricing based on West Yorkshire depot dispatch, payload volume, and distance.",
  pickupDefault: "BD1 4PQ",
  deliveryDefault: "LS1 2HL",
  operationDefault: "Residential / House Removal",
  cta: "View Instant Rate",
  routeLine: "M62 / Direct Route: 11.4 Miles",
  includes: "Includes 2-Man DBS Team + £50k In-Transit Cover",
  guaranteed: "GUARANTEED RATE FROM:",
  rate: "£85.00",
  vat: "+VAT",
  lock: "Lock Price",
};

export const homeTopServices = {
  eyebrow: "Our Services",
  title: "Top Services",
  cards: [
    {
      title: "House & Office Removals",
      summary:
        "Moving home or workspace? We help transport furniture, belongings, office equipment and other items to your new destination.",
    },
    {
      title: "Office Relocations",
      summary:
        "We support office moves and workspace relocations, helping businesses transport furniture, equipment and essentials.",
    },
    {
      title: "Commercial Moves",
      summary: "Practical moving support for commercial spaces, business premises and larger relocation needs.",
    },
    {
      title: "Business Deliveries",
      summary: "Transportation and delivery services for business items, goods, stock and other requirements.",
    },
    {
      title: "Clearance & Waste Removals",
      summary: "Removal of unwanted items and waste from residential and commercial properties.",
    },
    {
      title: "House, Garage, Office & Commercial Clearance",
      summary: "Clearance support for houses, garages, offices, storage areas and commercial spaces.",
    },
    {
      title: "House & Business Waste",
      summary: "Waste removal services for household and business needs, subject to job assessment.",
    },
    {
      title: "Rubbish & Unwanted Items",
      summary: "Help removing rubbish, unwanted furniture and other items.",
    },
  ],
} as const;

export const homeMidCta = {
  title: "Ready to Move or Need a Collection?",
  body: "Contact our Bradford team today for a removal, delivery or clearance quote. Same-day bookings available, subject to availability.",
  phone: "07920 507601",
  phoneHref: "tel:07920507601",
  book: "Book Online in 3 Minutes",
};

export const homeWhoWeAre = {
  eyebrow: "WHO WE ARE",
  title: "Your logistics and Removal partner in Bradford and across England",
  body: `Fete Nexus Logistics & Removals provides removal, delivery, collection, relocation, clearance and waste removal services. We aim to make moving, transporting items and clearing spaces easier by offering practical solutions and dependable customer service.

Founded by Lucky Osaigbovo, Fete Nexus is committed to serving customers across Bradford, Leeds and West Yorkshire with professionalism, care and clear communication.`,
  values: [
    {
      title: "£50,000 Transit Cover",
      text: "Every single payload is fully underwritten by specialist Lloyd’s accredited transport insurance.",
    },
    {
      title: "Bradford Green Fleet",
      text: "Transitioning our urban carrier routes to 100% zero-tailpipe electric powertrains by 2026.",
    },
    {
      title: "Fixed Price Transparency",
      text: "No congestion surcharges, fuel surcharges, or stair flight penalty surprises on moving day.",
    },
    {
      title: "4.9/5 TrustScore",
      text: "Over 1,200 successful residential and commercial deliveries executed across Yorkshire.",
    },
  ],
  fleetTitle: "Our Fleet Standards & Operators",
  carbonBadge: { percent: "100%", label: "YORKSHIRE WOODLAND CARBON OFFSET" },
  vettedTitle: "ENHANCED VETTED",
  vettedText: "Every driver and technician undergoes rigorous background and DBS vetting.",
};

export const homeImages = {
  hero: "/figma/home/hero.png",
  collageMain: "/figma/home/collage-main.png",
  collageFleet: "/figma/home/collage-fleet.png",
};