/** Contact / Get in touch — Figma frame `53:17` (Moving Logistic). */
export const contactHero = {
  eyebrow: "CONTACT FETE NEXUS",
  title: "Let’s get your next move moving.",
  intro:
    "A question, a quote or a delivery to arrange? Talk to our Bradford team.\nFor urgent jobs and same-day availability, call us now.",
};

export const contactDispatch = {
  heading: "Here when you need us.",
  subheading: "Speak directly with the team coordinating your move or delivery.",
  phoneLabel: "CALL us",
  phoneAvailability: "Available 24 hours, 7 days a week",
  emailLabel: "EMAIL OUR TEAM",
  emailHint: "For quotes and general enquiries",
  hubLabel: "OUR BRADFORD HUB",
  hubLine2: "West Yorkshire, United Kingdom",
  bookingTipTitle: "Have a booking already?",
  bookingTipBody: "Keep your booking reference and collection postcode handy so we can help you faster.",
};

export const contactForm = {
  title: "Tell us how we can help.",
  intro:
    "Share a few details and our team will help plan the next step.\nFields marked * are required.",
  fields: {
    fullName: { label: "Full name *", placeholder: "Your full name" },
    email: { label: "Email address *", placeholder: "you@example.com" },
    phone: { label: "Phone number", placeholder: "Your contact number" },
    service: { label: "Service required *", placeholder: "Which service do you need?" },
    collection: { label: "Collection postcode", placeholder: "e.g. BD1 4PQ" },
    delivery: { label: "Delivery postcode", placeholder: "If applicable" },
    message: {
      label: "Your message *",
      placeholder:
        "Tell us about your move, delivery or property service.\nInclude your preferred date and any access details.",
    },
  },
  privacyNote: "We’ll use these details to respond to your enquiry.",
  privacyLink: "Read our Privacy Policy",
  submit: "Send enquiry",
  success: "Enquiry sent. Our dispatch team will reply using the details you provided.",
};

export const contactCoverage = {
  tag: "MOVE ANYTHING, ANYWHERE, ANYTIME WITH EASE.",
  title: "From West Yorkshire\nto wherever’s next.",
  body: "Our Bradford base connects homes and businesses across the region, with UK-wide removals and commercial deliveries.",
  regions: ["Bradford", "West Yorkshire", "United Kingdom"],
  hint: "Not sure if we cover your route? Include both postcodes in your enquiry.",
};

export const contactFaq = {
  eyebrow: "A FEW USEFUL ANSWERS",
  title: "Before you get in touch.",
  items: [
    {
      question: "Can you help with an urgent job?",
      answer:
        "Call our line line for urgent inquiries and same-day availability. The team will confirm what is possible for your route.",
    },
    {
      question: "What should I include for a quote?",
      answer:
        "Your service, collection and delivery postcodes, preferred date, approximate load and any stairs or access restrictions.",
    },
    {
      question: "Which services can I enquire about?",
      answer:
        "Commercial haulage, home removals, property clearance and end-of-tenancy cleaning. We’ll help match the service to your needs.",
    },
    {
      question: "How do I ask about an existing booking?",
      answer: "Call or email our team with your booking reference and postcode so we can find the right details.",
    },
  ],
};

export const contactBottomCta = {
  title: "Ready to book your next move?",
  body: "Choose your service and get your booking started online.",
  label: "Book Now",
  href: "/book",
};

/** Fallback service options when the catalogue is empty (matches Figma wording). */
export const contactServiceFallback = [
  "House removals",
  "Office relocations",
  "Commercial moves",
  "Property clearance",
  "Business deliveries",
  "Waste removal",
  "Other / not sure",
];