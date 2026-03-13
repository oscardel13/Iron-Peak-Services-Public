import HandshakeIcon from "@mui/icons-material/Handshake";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import EngineeringIcon from "@mui/icons-material/Engineering";
import BalanceIcon from "@mui/icons-material/Balance";

const METADATA = {
  title: "Iron Peak Services",
  shortTitle: "Iron Peak Services",
  nickname: "Iron Peak Services",
  address: "Commerce City, CO",
  clickableAddress: "https://goo.gl/maps/XYZ123",
  slogan: "Strength You Can Stand On.",

  about:
    "Iron Peak Services is a local, family-run company serving Colorado homeowners, contractors, and small businesses with dumpster rentals, junk removal, and demolition services. We focus on reliable scheduling, straightforward pricing, and friendly service from start to finish. Whether you need a roll-off dumpster for a project, a crew to haul away unwanted items, or help tearing out an old structure, we show up ready to work and treat every job like it matters.",

  about_short:
    "Local, family-run dumpster rental, junk removal, and demolition company focused on reliable service, fair pricing, and clear communication.",

  mission:
    "Our mission is simple: make cleanup and removal easier for the people we serve. We show up when we say we will, communicate clearly, and provide dependable dumpster rental, junk removal, and demolition services without the runaround. From small home cleanouts to larger jobsite needs, we aim to earn trust on every project.",

  mission_short:
    "Make cleanup easy. Show up on time. Do the job right.",

  vision:
    "To be the most trusted local name for dumpster rentals, junk removal, and demolition in our community. We want homeowners, contractors, and businesses to know they can count on us for dependable scheduling, honest pricing, and a smooth experience from the first call to the final pickup.",

  vision_short:
    "Be the most trusted, easy-to-work-with cleanup and removal team in our community.",

  culture:
    "We’re a family business built on respect, hard work, and follow-through. We believe in clear communication, tidy worksites, and treating every customer the way we’d want to be treated. No confusion, no unnecessary upselling, and no excuses—just dependable service from good people who care about doing the job well.",

  culture_short:
    "Friendly, dependable, and hardworking—good people doing honest work.",

  description: [
    "Dumpster rental, junk removal, and demolition done right by a team you can trust.",
    "Serving the Denver metro and Front Range with reliable roll-off dumpsters, junk hauling, and demolition services. Call 720.825.7521 for a friendly, no-pressure quote.",
  ],

  hero: "",
  email: "alej8521@gmail.com",
  clickableEmail: "mailto:alej8521@gmail.com",
  phone: "720.825.7521",
  clickablePhone: "tel:7208257521",

  team: [
    {
      name: "Alejando Herandez",
      title: "President",
      description:
        "Alex leads Iron Peak Services with a simple approach: be fair, be responsive, and deliver dependable service. Focused on building a company customers can trust, he works to make every dumpster rental, junk removal, and demolition project smooth from start to finish.",
      img: "/assets/about/alejandro.jpg",
    },
  ],

  social: [
    {
      name: "facebook",
      url: "https://www.facebook.com/profile.php?id=61587937707507",
    },
  ],

  rentals: [
{
  slug: "17-yard-dumpster",
  title: "17 Yard Dumpster",
  name: "17 Yard Dumpster",
  shortDescription:
    "A versatile size for home cleanouts, remodeling, and medium projects.",
  longDescription:
    "The 17 yard dumpster is a versatile option for home cleanouts, flooring projects, small remodels, and roofing debris. It provides plenty of space for most residential jobs while still fitting comfortably in many driveways.",
  image: "/assets/rentals/17-yard.jpg",
  metaTitle: "17 Yard Dumpster Rental",
  metaDescription:
    "17 yard dumpster rental for home cleanouts, remodeling projects, and construction debris.",
  heroTagline: "A versatile choice for many residential projects.",
  h1: "17 Yard Dumpster Rental",
  dimensions: `14' L x 7' W x 5' H`,
  rentalPeriod: "Up to 7 days",
  includedWeight: "2 tons included",
  extraDayCost: "$25/day",
  extraWeightCost: "$95/ton",
  startingPrice: "Call for pricing",
  goodFor:
    "This dumpster is a great fit for home cleanouts, flooring removal, bathroom or kitchen remodels, deck tear-outs, yard debris, and general residential cleanup.",
  fits: [
    "Small to medium home cleanouts",
    "Bathroom or kitchen remodel debris",
    "Flooring removal (carpet, tile, laminate)",
    "Deck or fence removal",
    "Yard waste and landscaping debris",
    "About 5–7 pickup truck loads of material",
  ],
},
{
  slug: "22-yard-dumpster",
  title: "22 Yard Dumpster",
  name: "22 Yard Dumpster",
  shortDescription:
    "Extra capacity for larger cleanouts, renovations, and construction jobs.",
  longDescription:
    "The 22 yard dumpster offers additional capacity for bigger projects such as major home cleanouts, remodeling work, roofing tear-offs, and construction debris. If you need more space than a standard mid-size dumpster, this option helps handle larger loads efficiently.",
  image: "/assets/rentals/22-yard.jpg",
  metaTitle: "22 Yard Dumpster Rental",
  metaDescription:
    "22 yard dumpster rental for renovations, roofing projects, and larger cleanouts.",
  heroTagline: "More capacity for bigger projects.",
  h1: "22 Yard Dumpster Rental",
  dimensions: `16' L x 7.5' W x 6' H`,
  rentalPeriod: "Up to 7 days",
  includedWeight: "2 tons included",
  extraDayCost: "$25/day",
  extraWeightCost: "$95/ton",
  startingPrice: "Call for pricing",
  goodFor:
    "This dumpster works well for large cleanouts, bigger remodeling jobs, roofing tear-offs, construction debris, shed demolition, and bulkier disposal needs.",
  fits: [
    "Large home cleanouts or estate cleanouts",
    "Major remodeling projects",
    "Roof replacements",
    "Large deck or shed demolition",
    "Construction and renovation debris",
    "About 8–10 pickup truck loads of material",
  ],
},
    // {
    //   slug: "40-yard-dumpster",
    //   title: "40 Yard Dumpster",
    //   name: "40 Yard Dumpster",
    //   shortDescription: "Maximum capacity for commercial and large-scale jobs.",
    //   longDescription:
    //     "Our 40 yard dumpster is the largest standard option—best for commercial cleanouts, large demolition debris, estate cleanouts, and major construction work. If you need maximum volume and fewer hauls, 40 yards is the move.",
    //   image: "/assets/rentals/40-yard.jpg",
    //   metaTitle: "40 Yard Dumpster Rental",
    //   metaDescription:
    //     "40 yard dumpster rental for commercial cleanouts, demolition debris, and large construction projects.",
    //   heroTagline: "Maximum volume for the biggest jobs.",
    //   h1: "40 Yard Dumpster Rental",
    // },
  ],

  services: [
    {
      slug: "junk-removal",
      title: "Junk Removal",
      name: "Junk Removal",
      shortDescription:
        "Professional junk removal services for residential and commercial properties.",
      longDescription:
        "We provide full-service junk removal for homes, businesses, property cleanouts, and job sites. Our team handles lifting, loading, and haul-away so you do not have to deal with the mess yourself.",
      image: "/assets/services/junk-removal.jpg",
      metaTitle: "Junk Removal",
      metaDescription:
        "Fast, professional junk removal for homes and businesses—clean, efficient hauling and responsible disposal.",
      heroTagline:
        "Efficient, reliable junk removal services for homes and businesses.",
      h1: "Junk Removal",
      intro:
        "When clutter, debris, or bulky items start taking up too much space, our junk removal service makes cleanup simple. We handle the heavy lifting and haul-away so you can clear out your home, property, office, or job site without the stress.",
      paragraphs: [
        "We remove furniture, appliances, renovation debris, yard waste, office junk, and general unwanted items from residential and commercial properties. Whether you have a single pickup or a full property cleanout, we show up ready to get it done efficiently.",
        "Our goal is to make the process easy from start to finish. We communicate clearly, work safely, and leave the area cleaner than we found it whenever possible. If you are unsure whether your items are a fit, just reach out and we can walk you through it.",
      ],
      highlights: [
        "Household junk and furniture removal",
        "Garage, estate, and property cleanouts",
        "Office and commercial junk hauling",
        "Renovation debris and yard waste removal",
      ],
    },

    {
      slug: "demolition",
      title: "Demolition",
      name: "Demolition Services",
      shortDescription:
        "Safe and efficient demolition services for residential and commercial properties.",
      longDescription:
        "We provide professional demolition services for homes and businesses. Our team handles tear-outs, removals, cleanup, and haul-away with a focus on safety, efficiency, and keeping the job moving.",
      image: "/assets/services/demolition.jpg",
      metaTitle: "Demolition Services",
      metaDescription:
        "Safe, clean demolition services with efficient haul-away—residential and commercial projects.",
      heroTagline:
        "Professional demolition services that are safe, clean, and efficient.",
      h1: "Demolition Services",
      intro:
        "Whether you need to remove an old shed, tear out a deck, demo an interior space, or clear out a structure before the next phase of work, our demolition services are built to keep the process clean and manageable.",
      paragraphs: [
        "We handle light demolition projects for residential and commercial properties, including sheds, fences, hot tubs, interior tear-outs, decks, and other small structures. We focus on safe removal, organized cleanup, and responsible haul-away.",
        "Every demolition project starts with a clear plan. We look at access, materials, safety concerns, and disposal needs so the work is handled the right way. Our goal is to leave you with a clean slate and no unnecessary headaches.",
        "If your project also needs dumpster rental or junk removal, we can often combine services to make the entire cleanup process easier and more efficient.",
      ],
      highlights: [
        "Shed, fence, and deck demolition",
        "Interior tear-outs and removal work",
        "Hot tub and small structure removal",
        "Cleanup and haul-away after demolition",
      ],
    },
  ],

  values: [
    {
      title: "Integrity",
      description:
        "We do what we say we’ll do—no surprise fees, no vague scheduling, and no runaround. Just honest communication and straightforward service from start to finish.",
      Icon: BalanceIcon,
    },
    {
      title: "Excellence",
      description:
        "We care about the details: prompt delivery, clean haul-away, safe demolition practices, and a smoother experience for every customer we serve.",
      Icon: WorkspacePremiumIcon,
    },
    {
      title: "Reliability",
      description:
        "When you book with us, you should be able to count on us. We show up, communicate clearly, and keep your project moving the way it should.",
      Icon: EngineeringIcon,
    },
    {
      title: "Respect",
      description:
        "We treat your property, your time, and your project with care—friendly service, tidy work, and the kind of follow-through that builds trust.",
      Icon: HandshakeIcon,
    },
  ],

  projects: [
    {
      slug: "firestone-pedriatric-dentistry-and-orthodontics",
      name: "Firestone Pedriatric Dentistry & Orthodontics",
      type: "HEALTH, OFFICE SPACES",
      location: "FIRESTONE , CO",
      area: "3000 SQ FT",
      date: "2024",
      status: "COMPLETED",
      description:
        "This project featured the installation of high-quality acoustical ceiling systems designed to enhance sound control and overall comfort in a modern pediatric dental and orthodontic environment. The space combines functionality with a welcoming atmosphere—bright, open interiors with natural light and warm wood flooring contribute to a calming experience for patients and staff alike.\n\n Our work focused on precise ceiling integration, ensuring clean lines, effective sound absorption, and seamless coordination with lighting, HVAC, and dental equipment systems. The result is a polished, professional, and acoustically balanced clinical space that supports both aesthetic appeal and operational efficiency.",
      heroImage: "/assets/portfolio/FPDAO/img1.JPG",
      gallery: [
        "/assets/portfolio/FPDAO/img1.JPG",
        "/assets/portfolio/FPDAO/img2.JPG",
        "/assets/portfolio/FPDAO/img3.JPG",
      ],
    },
  ],

  featuredProjects: [
    {
      slug: "firestone-pedriatric-dentistry-and-orthodontics",
      name: "Firestone Pedriatric Dentistry & Orthodontics",
      type: "HEALTH, OFFICE SPACES",
      location: "FIRESTONE , CO",
      area: "58880 SQ FT",
      date: "2024",
      status: "COMPLETED",
      heroImage: "/assets/portfolio/FPDAO/img1.JPG",
      gallery: [
        "/assets/portfolio/FPDAO/img1.JPG",
        "/assets/portfolio/FPDAO/img2.JPG",
        "/assets/portfolio/FPDAO/img3.JPG",
      ],
    },
  ],

  testimonials: [
    {
      projectSlug: "302-conifer-apartments",
      name: "Brian Bair",
      title: "Owner",
      quote:
        "Every project comes with its share of challenges, but Dohn's honesty and transparency was very refreshing. Their Team maintained effective communications with our development group and offered creative alternatives to address issues that arose during preconstruction and construction.",
      projectHero: "/assets/landing/hero3.jpg",
    },
  ],

  gallery: [
    "/assets/portfolio/1.jpg",
    "/assets/portfolio/2.jpg",
    "/assets/portfolio/3.jpg",
    "/assets/portfolio/4.jpg",
    "/assets/portfolio/5.jpg",
    "/assets/portfolio/6.jpg",
    "/assets/portfolio/7.jpg",
    "/assets/portfolio/8.jpg",
    "/assets/portfolio/9.jpg",
    "/assets/portfolio/10.jpg",
    "/assets/portfolio/11.jpg",
    "/assets/portfolio/12.jpg",
    "/assets/portfolio/14.jpg",
    "/assets/portfolio/15.jpg",
    "/assets/portfolio/16.jpg",
    "/assets/portfolio/17.jpg",
    "/assets/portfolio/18.jpg",
    "/assets/portfolio/19.jpg",
    "/assets/portfolio/20.jpg",
  ],

  aboutSection: {
    eyebrow: "WHY Iron Peak Services",
    heading: "DOING RIGHT BY OUR NEIGHBORS SINCE 2014",
    subheading:
      "You tell us what you need — we show up, communicate, and get it handled.",
    p1: "We’re a local, family-run team focused on dependable dumpster rentals, efficient junk removal, and safe demolition services. From home cleanouts and remodel debris to tear-outs and jobsite cleanup, we treat every project like it matters.",
    p2: "Friendly service, fair pricing, reliable scheduling, and cleanup you can count on. That’s the Iron Peak Services way.",
    ctaLabel: "ABOUT US",
    ctaHref: "/about",
    image: "/assets/about/about-section-1.jpeg",
    imageAlt: "Iron Peak Services crew at work",
  },
};

export default METADATA;