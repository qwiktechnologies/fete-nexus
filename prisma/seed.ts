import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

function loadEnv() {
  try {
    const text = readFileSync(resolve(process.cwd(), ".env"), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      let value = trimmed.slice(index + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // prisma db seed loads the environment itself
  }
}

loadEnv();
const prisma = new PrismaClient();

const services = [
  {
    title: "Property clearance and waste removal",
    slug: "property-clearance-and-waste-removal",
    category: "Clearance",
    icon: "clearance",
    featured: true,
    sortOrder: 1,
    summary: "Clear a house, garage, office or yard, then take the waste away under our licence.",
    description:
      "A clearance is rarely just a few bags by the door. We load what you are finished with, keep what you still want moved, and leave the space ready for the next tenant, buyer or working week.\n\nTell us the access, the floors and what is actually in the room. Photographs help us send a fair quote instead of a guess.",
    includes: "Loading and removal\nLicensed waste carriage\nSpace left broom-clean on request\nQuote from your photographs",
  },
  {
    title: "End of tenancy cleaning",
    slug: "end-of-tenancy-cleaning",
    category: "Cleaning",
    icon: "home",
    featured: true,
    sortOrder: 2,
    isPurchasable: true,
    pricePence: 14900,
    summary: "A listed clean for the end of a tenancy, once the rooms are empty enough to work in.",
    description:
      "This is the clean after the furniture has gone: kitchen, bathroom, floors and the marks a move leaves behind. It is priced as a standard property. If the place needs a clearance first, book that as well and we will sequence the two.\n\nThe listed price is the starting invoice. If the property is larger than a typical flat or house, we will send an updated invoice before you pay.",
    includes: "Kitchen and bathroom\nFloors and skirtings\nInside empty cupboards\nHandover-ready finish",
  },
  {
    title: "Shipping and logistics",
    slug: "shipping-and-logistics",
    category: "Logistics",
    icon: "truck",
    featured: true,
    sortOrder: 3,
    summary: "Planned moves for stock, equipment and anything that needs a proper run, not a favour.",
    description:
      "Shops, trades and offices use us when a load has to leave one site and arrive at another without a chain of phone calls. We agree the window, the vehicle and the price in your account.\n\nRegular runs can be added as their own listed service once the route is settled.",
    includes: "Booked collection window\nBradford, Leeds and West Yorkshire\nDelivery to a named address\nUpdates in your account",
  },
  {
    title: "Collections and delivery",
    slug: "collections-and-delivery",
    category: "Delivery",
    icon: "package",
    featured: true,
    sortOrder: 4,
    isPurchasable: true,
    pricePence: 6500,
    summary: "A local collection and drop for parcels, furniture and shop stock.",
    description:
      "Use this when you already know the two addresses and the load will fit a van. The listed price covers a straightforward local job. Longer runs and awkward items are quoted before you pay the deposit.",
    includes: "Collection from one address\nDelivery to one address\nLocal West Yorkshire runs\nDeposit confirms the slot",
  },
  {
    title: "House and office removals",
    slug: "house-and-office-removals",
    category: "Removals",
    icon: "truck",
    sortOrder: 5,
    summary: "Full house moves and office moves, quoted from the inventory and the two addresses.",
    description:
      "A home move and an office move fail for the same reasons: no parking, a third floor, and a van that was never big enough. Send photographs of the rooms and tell us about stairs, lifts and permits.\n\nWe quote in the app. The deposit on the invoice holds the crew for that date.",
    includes: "Home and office moves\nLoading and unloading\nQuoted from photographs\nInsured crew",
  },
  {
    title: "Office relocations",
    slug: "office-relocations",
    category: "Removals",
    icon: "office",
    sortOrder: 6,
    summary: "Desks, files and equipment moved so the office can open again at the new address.",
    description:
      "We plan office moves around the working day you give us. Label what must stay together, and tell us what cannot go on the van until the new site is ready.\n\nThe quote covers the crew and the vehicle. Extra packing can be added on the invoice.",
    includes: "Desks, files and equipment\nTimed around your working day\nNew site and old site\nQuote before the deposit",
  },
  {
    title: "Commercial moves",
    slug: "commercial-moves",
    category: "Removals",
    icon: "layers",
    sortOrder: 7,
    summary: "Shops, warehouses and fit-outs that need more than a domestic van.",
    description:
      "Commercial jobs are quoted. Tell us the access for a larger vehicle, whether there is a goods lift, and what has to be moved in which order.\n\nWe work across Bradford, Leeds and the rest of West Yorkshire.",
    includes: "Shops and warehouses\nFit-out moves\nVehicle matched to the load\nWritten quote in your account",
  },
  {
    title: "Business deliveries",
    slug: "business-deliveries",
    category: "Delivery",
    icon: "package",
    sortOrder: 8,
    isPurchasable: true,
    pricePence: 5500,
    summary: "A listed local delivery for stock, samples and customer orders.",
    description:
      "For a single local drop that fits the van, the listed price is the invoice. If you have a round of several stops, message us and we will price the round as one job.",
    includes: "One collection\nOne business drop\nLocal pricing\nBooking reference on the invoice",
  },
  {
    title: "Clearance and waste removals",
    slug: "clearance-and-waste-removals",
    category: "Clearance",
    icon: "clearance",
    sortOrder: 9,
    summary: "Mixed waste taken from homes and businesses and carried under licence CBDU663154.",
    description:
      "This is the waste side of a clearance: bagged rubbish, broken furniture, shop waste and the pile that has been in the yard too long. We do not leave it for someone else to discover.\n\nIf you are not sure whether an item can be taken, photograph it and ask in the booking thread.",
    includes: "Household and business waste\nLicensed carriage\nQuote from photographs\nSite left tidy",
  },
  {
    title: "House, garage, office and commercial clearance",
    slug: "house-garage-office-commercial-clearance",
    category: "Clearance",
    icon: "home",
    sortOrder: 10,
    summary: "One crew for the house, the garage, the office or the whole commercial unit.",
    description:
      "Garages and stock rooms are where quotes go wrong. Photograph the full space, not just the doorway, and say whether we can park at the building.\n\nWe quote the job as we see it, then the deposit confirms the day.",
    includes: "Houses and garages\nOffices and commercial units\nFull or part clearance\nWaste handled with the clearance",
  },
  {
    title: "House and business waste",
    slug: "house-and-business-waste",
    category: "Clearance",
    icon: "clearance",
    sortOrder: 11,
    summary: "Regular or one-off waste collections for a home or a business.",
    description:
      "Use this when the job is waste, not a full property clear. A one-off collection is quoted or booked from the photographs. If you need a repeating collection, say so in the instructions and we will set it up as its own service.",
    includes: "One-off collections\nHome or business\nLicensed carrier\nRepeat work on request",
  },
  {
    title: "Rubbish and unwanted items",
    slug: "rubbish-and-unwanted-items",
    category: "Clearance",
    icon: "clearance",
    sortOrder: 12,
    isPurchasable: true,
    pricePence: 7900,
    summary: "A listed collection for a small load of rubbish or items you no longer want.",
    description:
      "Sofas, mattresses, bagged rubbish and the spare room you have been meaning to deal with. The listed price suits a small van load. If the photographs show more than that, we will replace the invoice before you pay.",
    includes: "Small van load\nHousehold items\nCollection from the property\nLicensed disposal route",
  },
  {
    title: "Same-day delivery and collection",
    slug: "same-day-delivery-and-collection",
    category: "Delivery",
    icon: "clock",
    sortOrder: 13,
    isPurchasable: true,
    pricePence: 9500,
    summary: "A same-day van when the job cannot wait until tomorrow.",
    description:
      "Same-day depends on the diary. Book it with today's date and we will accept it in the app if a crew is free. The listed price is for a local same-day collection and delivery. Paying the deposit is what holds the slot.",
    includes: "Same-day when the diary allows\nCollection and delivery\nLocal West Yorkshire\nConfirmed once the deposit is paid",
  },
];

const posts = [
  {
    title: "Fete Nexus is helping clean Bradford this winter",
    slug: "helping-clean-bradford-this-winter",
    excerpt: "Mattresses, bagged rubbish and garages that have been shut since summer. This is the work we are booking across Bradford.",
    content: `Winter brings a familiar problem to Bradford streets, yards and shared alleys: mattresses left after a move, bagged rubbish from a clear-out, and garages that have been shut since summer. Fete Nexus is spending this season on the jobs that make a street feel looked after again.

Our crews are booking house, garage and business clearances across Bradford, Leeds and the rest of West Yorkshire. If a tenancy is ending, a shop is refitting, or a family is finally tackling the spare room, we collect the waste, move what is worth keeping, and leave the space ready for what comes next.

We hold waste carrier licence CBDU663154, and we are fully insured. That matters when a job looks simple from the pavement and turns out to be a full van. Items go to the right route for reuse, recycling or licensed disposal.

If you are clearing a property this winter, book the job in your account, add photographs, and tell us the access. We reply with a quote in the app, and a deposit confirms the date.`,
  },
  {
    title: "Fete Nexus believes in sustaining our environment",
    slug: "sustaining-our-environment",
    excerpt: "A clearance should not mean a shortcut. We would rather sort a load properly than leave a customer with someone else's problem.",
    content: `A removals company can look green on a van and still tip a mixed load in the wrong place. We are not interested in that version of the job. Fete Nexus is a licensed waste carrier, and the licence number is on the site because customers should be able to check it.

Sustaining the place we work in is mostly unglamorous. It is separating what can be reused from what has to be disposed of. It is refusing a price that only works if the waste disappears. It is telling a customer when a job is bigger than the photograph suggested, before the deposit is paid.

Bradford and Leeds do not need another pile at the end of a terrace. They need the van to turn up, the crew to be insured, and the waste to leave with a paperwork trail. That is the standard we book work against.

If you are choosing a company for a clearance, ask who carries the waste and where it goes. We will answer in your account, on the booking, where the quote already sits.`,
  },
  {
    title: "A look at the future of logistics in England",
    slug: "future-of-logistics-in-england",
    excerpt: "The interesting change is not a new kind of van. It is customers expecting a price, a date and a message thread before the crew leaves the yard.",
    content: `Logistics in England is being pulled in two directions. Big networks want everything in a hub. Local customers still need a person who can get a sofa down a staircase in Leeds on a Thursday.

The useful change is not a slogan about the future. It is that people now expect the same clarity from a removals firm that they expect from anyone else they pay: what it costs, when it happens, and a record of what was agreed. A quote that lives in a text thread is not a record. An invoice with a deposit is.

We built the booking side of Fete Nexus around that. You send the date, the two addresses and the photographs. We reply in the same account. The deposit on the invoice is what turns a conversation into a confirmed job.

The companies that last in this trade will be the ones who can still do the physical work, and who can also say, in writing, what the customer is paying for. That is the part of the future we are already using.`,
  },
  {
    title: "Why most logistics companies are going for green energy",
    slug: "why-logistics-companies-are-going-for-green-energy",
    excerpt: "Fuel is the obvious reason. The quieter reason is that customers have started asking what happens to the load after it leaves their drive.",
    content: `Ask a room of operators why they are looking at cleaner fuel and you will hear about diesel prices first. That is real. A van that spends the day between Bradford and Leeds feels every spike.

The second reason is newer, and it comes from the customer. People booking a house move or a shop clearance now ask two questions they did not always ask: are you insured, and where does the waste go? Green energy is the fuel version of that same question. They want the journey, not just the slogan, to stand up.

We are a small licensed carrier, not a national fleet with a press release. What we can do now is refuse the cheap version of a clearance, carry waste under licence CBDU663154, and keep the job in writing. Cleaner vehicles are a decision we will make as the diary and the miles justify them, and we will say so here when we do.

Until then, the honest position is this: most of the trade is moving this way because customers can see the difference, and because the old way of hiding the miles and the waste is a poor way to keep a business.`,
  },
];

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@fetenexus.co.uk").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "FeteNexus!Admin2026";
  const name = process.env.SEED_ADMIN_NAME ?? "Lucky Osaigbovo";

  const existingAdmin = await prisma.user.findUnique({ where: { email } });
  const admin =
    existingAdmin ??
    (await prisma.user.create({
      data: {
        name,
        email,
        phone: "07920 507601",
        passwordHash: await bcrypt.hash(password, 10),
        role: "SUPER_ADMIN",
      },
    }));

  const paymentConfig = await prisma.paymentConfig.findUnique({ where: { id: "default" } });
  if (!paymentConfig) await prisma.paymentConfig.create({ data: { id: "default" } });

  const settings = await prisma.siteSetting.findUnique({ where: { id: "default" } });
  if (!settings) {
    await prisma.siteSetting.create({
      data: {
        id: "default",
        companyName: "Fete Nexus",
        heroLine: "Logistics & Removals",
        tagline: "Your Logistics Partner",
        email: "contact@fetenexus.co.uk",
        phone: "07920 507601",
        address: "Bradford, Leeds and West Yorkshire",
        areas: "Bradford | Leeds | West Yorkshire",
        directorName: "Lucky Osaigbovo",
        licenceNumber: "CBDU663154",
        insuredNote: "Fully insured",
        hours: "Available 7 days. Book online or call.",
        depositPercent: 30,
        about:
          "Fete Nexus Logistics & Removals is a West Yorkshire company for people who need something moved, delivered or cleared without chasing a driver. We work across Bradford, Leeds and the surrounding towns.\n\nLucky Osaigbovo started the company to be the crew he wanted to hire: insured, licensed to carry waste, and clear about the price before the van is booked. House moves, office relocations, end-of-tenancy cleaning, shop deliveries and full property clearances sit in one place.\n\nYou book on the site, we reply in your account, and the date is held once the deposit on your invoice is paid.",
      },
    });
  }

  for (const service of services) {
    const found = await prisma.service.findUnique({ where: { slug: service.slug } });
    if (!found) await prisma.service.create({ data: service });
  }

  for (const post of posts) {
    const found = await prisma.post.findUnique({ where: { slug: post.slug } });
    if (!found) {
      await prisma.post.create({
        data: { ...post, published: true, publishedAt: new Date(), authorId: admin.id },
      });
    }
  }

  console.log(`Seeded super admin ${email}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
