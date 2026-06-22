/* ============================================================
   FLOSSWORK™ — MASTER CONFIG FILE
   ============================================================
   EDIT THIS FILE to update clinic data across ALL pages.

   RULES:
   ✓  Only change values BETWEEN the quotes " "
   ✓  Don't delete commas, colons, or brackets
   ✓  Images are organised per page: images/home/, images/about/,
      images/aligners/, images/services/, images/contact/ (shared
      assets like the logo live in images/shared/). Drop the file
      in the matching folder, e.g. "images/about/dr-priyesh.jpg"
   ✓  To hide a doctor: set active: false
   ✓  Prices, phone, hours, NAP — all live here
   ============================================================ */

const FW = {

  /* ── CLINIC IDENTITY ─────────────────────────────────────── */
  clinic: {
    name:       "Flosswork Dental Clinic",
    tagline:    "Aligners & Implants Experience Centre",
    established: "2023",
    phone1:     "+91 83540 88822",       // Primary — used in all CTAs
    phone1raw:  "+918354088822",          // For tel: and wa.me links (no spaces)
    phone2:     "+91 77135 93252",        // Secondary — footer only
    phone2raw:  "+917713593252",
    email:      "helloflosswork@gmail.com",
    whatsapp:   "918354088822",           // wa.me number — no + sign
  },

  /* ── ADDRESS / NAP ───────────────────────────────────────── */
  /* Keep this EXACTLY matching Google My Business listing     */
  address: {
    line1:    "6, South Avenue",
    line2:    "Opp. Dr. Bhagwat Hospital",
    area:     "Choubey Colony",
    city:     "Raipur",
    state:    "Chhattisgarh",
    pin:      "492001",
    country:  "India",
    landmark: "Opposite Dr. Bhagwat Hospital",
    parking:  "Parking for 8 cars · 5-min walk from nearest auto stand",
    /* Full single-line string for schema/footer — must match GBP exactly */
    full:     "6, South Avenue, Choubey Colony, Raipur, Chhattisgarh 492001",
    /* Google Maps embed URL — replace with real embed src from GBP */
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.123456789!2d81.6296!3d21.2514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zFlosswork+Dental+Clinic!5e0!3m2!1sen!2sin!4v1234567890",
    /* Google Maps directions URL */
    mapsUrl:  "https://maps.google.com/?q=Flosswork+Dental+Clinic+Choubey+Colony+Raipur",
    /* Geo coordinates for schema */
    lat:      "21.2514",
    lng:      "81.6296",
  },

  /* ── HOURS ───────────────────────────────────────────────── */
  hours: {
    display:  "Mon – Sun · 10:00 AM – 8:00 PM",
    short:    "10am – 8pm",
    open:     "10:00",
    close:    "20:00",
    lunch:    "2:00 PM – 4:00 PM",
    note:     "Open all 7 days - Sundays till noon",
    emergency: "Call anytime for dental emergencies",
  },

  /* ── SOCIAL & REVIEW LINKS ───────────────────────────────── */
  social: {
    google:    "https://share.google/SbuT7Ec2s7Q5kgoFc",
    instagram: "https://www.instagram.com/helloflosswork?igsh=MTNnbWM2NXNobTA4dw%3D%3D&utm_source=qr",   // <!-- UPDATE: add real handle -->
    facebook:  "https://www.facebook.com/share/1aPEa3Czvx/?mibextid=wwXIfr",    // <!-- UPDATE: add real URL -->
    youtube:   "https://youtube.com/@flossworkdental",    // <!-- UPDATE: add real URL -->
  },

  /* ── STATS (update quarterly) ────────────────────────────── */
  stats: {
    patients:   "5,000+",
    rating:     "4.9",
    reviews:    "83",          // <!-- UPDATE: check Google reviews count -->
    avgPlan:    "14 months",
    specialists: "8",
    years:      "3+",
  },

  /* ── PRICING ─────────────────────────────────────────────── */
  /* Rendered by JS in pricing section — edit here, updates everywhere */
  pricing: [
    {
      name:     "Essentials",
      tagline:  "Mild corrections",
      price:    "₹50,000",
      emi:      "₹2,778/mo",       // price ÷ 18 months, 0% EMI
      emiNote:  "18 months · 0% interest",
      featured: false,
      features: [
        "3D digital scan",
        "Custom aligner sets",
        "Specialist monitoring",
        "1 set of refiners",
        "Retainers included",
      ],
    },
    {
      name:     "Advanced",
      tagline:  "Moderate corrections",
      price:    "₹75,000",
      emi:      "₹4,167/mo",
      emiNote:  "18 months · 0% interest",
      featured: true,
      features: [
        "Everything in Essentials",
        "Comprehensive plan",
        "3 sets of refiners",
        "Priority appointments",
        "Mid-treatment progress scan",
      ],
    },
    {
      name:     "Premium",
      tagline:  "Full transformation",
      price:    "₹90,000",
      emi:      "₹5,000/mo",
      emiNote:  "18 months · 0% interest",
      featured: false,
      features: [
        "Everything in Advanced",
        "Unlimited refiners",
        "Invisalign / SureSmile system",
        "Direct WhatsApp specialist access",
        "Lifetime retainer guarantee",
      ],
    },
  ],

  /* ── DOCTORS ─────────────────────────────────────────────── */
  doctors: [
    {
      active:   true,
      name:     "Dr. Priyesh Gupta",
      role:     "Lead Prosthodontist & Implantologist",
      qual:     "MDS Prosthodontics · 10+ years",
      img:      "images/about/dr-priyesh.jpg",   // <!-- REPLACE with real photo -->
      imgAlt:   "Dr. Priyesh Gupta, Lead Prosthodontist & Implantologist at Flosswork Dental Clinic Raipur",
      badges:   ["MDS Certified"],
      tags:     ["Implants", "Veneers", "Smile Design"],
      waMsg:    "Hi, I'd like to book a consultation with Dr. Priyesh Gupta at Flosswork.",
    },
    {
      active:   true,
      name:     "Dr. Nehal Gupta",
      role:     "Lead Orthodontist",
      qual:     "MDS Orthodontics · 10+ years",
      img:      "images/about/dr-nehal.jpg",     // <!-- REPLACE with real photo -->
      imgAlt:   "Dr. Nehal Gupta, Lead Orthodontist at Flosswork Dental Clinic Raipur",
      badges:   ["MDS Certified", "Invisalign Certified"],
      tags:     ["Clear Aligners", "Invisalign", "Smile Design"],
      waMsg:    "Hi, I'd like to book a consultation with Dr. Nehal Gupta at Flosswork.",
    },
    /* Add more doctors below. Set active: false to hide without deleting.
    {
      active:   false,
      name:     "Dr. Example Name",
      role:     "Specialty",
      qual:     "Qualification · X years",
      img:      "images/about/dr-example.jpg",
      imgAlt:   "Alt text",
      badges:   ["MDS Certified"],
      tags:     ["Specialty 1"],
      waMsg:    "Hi, I'd like to book with Dr. Example at Flosswork.",
    },
    */
  ],

  /* ── SERVICES (homepage list + services page) ────────────── */
  services: [
    { id: "aligners",   name: "Clear Aligners",      desc: "Nearly invisible, removable trays planned to sub-millimetre precision.",   href: "aligners.html",          img: "images/services/aligners.jpg"  },
    { id: "implants",   name: "Dental Implants",      desc: "Long-lasting tooth replacements placed with surgical precision.",         href: "services.html#implants",  img: "images/services/implants.jpg"  },
    { id: "smiledesign",name: "Smile Design",         desc: "Digitally planned smile makeovers — veneers, bonding, transformations.",  href: "services.html#smiledesign",img: "images/services/smiledesign.jpg"},
    { id: "whitening",  name: "Teeth Whitening",      desc: "Professional whitening for a noticeably brighter smile in one session.", href: "services.html#whitening", img: "images/services/whitening.jpg" },
    { id: "rootcanal",  name: "Root Canal",           desc: "Pain-free treatment using rotary endodontic technology.",                href: "services.html#rootcanal", img: "images/services/rootcanal.jpg" },
    { id: "braces",     name: "Crowns & Bridges",     desc: "Durable, natural-looking restorations for damaged or missing teeth.",     href: "services.html#braces",    img: "images/services/braces.jpg"    },
    { id: "cleaning",   name: "Scaling & Cleaning",   desc: "Professional cleaning to remove tartar and protect gum health.",        href: "services.html#cleaning",  img: "images/services/cleaning.jpg"  },
    { id: "extraction", name: "Gum Disease Treatment",desc: "Treat bleeding gums, bad breath and gum infections.",                    href: "services.html#extraction", img: "images/services/extraction.jpg"},
    { id: "pediatric",  name: "Dentures",             desc: "Comfortable, natural-looking dentures designed for everyday confidence.", href: "services.html#pediatric", img: "images/services/pediatric.jpg" },
  ],

  /* ── ANALYTICS ───────────────────────────────────────────── */
  /* Replace placeholders after setting up GA4 + GTM           */
  analytics: {
    ga4Id:  "G-XXXXXXXXXX",    // <!-- REPLACE: GA4 Measurement ID from analytics.google.com -->
    gtmId:  "GTM-XXXXXXX",     // <!-- REPLACE: GTM Container ID from tagmanager.google.com -->
  },

  /* ── WHATSAPP MESSAGES ───────────────────────────────────── */
  /* Pre-filled messages for each CTA context                   */
  waMessages: {
    default:     "Hi, I'd like to book a consultation at Flosswork Dental Clinic.",
    fab:         "Hi! I'd like to know more about treatments at Flosswork Dental Clinic.",
    aligners:    "Hi, I'd like to know more about clear aligners at Flosswork.",
    booking:     "Hi, I'd like to book a 3D scan consultation at Flosswork.",
    emergency:   "Hi, I have a dental emergency and need urgent help.",
    callback:    "Hi, I requested a callback from Flosswork. My name is {name} and my number is {phone}.",
    pricing:     "Hi, I'd like to know more about aligner pricing and EMI options at Flosswork.",
    implants:    "Hi, I'd like to book a consultation for dental implants at Flosswork.",
    smiledesign: "Hi, I'm interested in smile design / veneers at Flosswork.",
  },

};

/* Make available globally */
window.FW = FW;
