/* Flosswork: single source of truth for data used across all pages.
   Edit here; pages read it. price: number (rupees) or null (shows "Get a quote"). */
window.FW = {
  clinic: {
    name: "Flosswork Dental Clinic",
    tagline: "Clearly better.",
    phone: "+91 83540 88822",
    phoneRaw: "+918354088822",
    phone2: "+91 77135 93252",
    phone2Raw: "+917713593252",
    whatsapp: "918354088822",
    email: "helloflosswork@gmail.com",
    hoursLong: "Mon–Sat 10am–8pm · Sun 10am–2pm",
    googleReviews: "https://share.google/SbuT7Ec2s7Q5kgoFc",
    instagram: "https://www.instagram.com/helloflosswork",
    facebook: "https://www.facebook.com/share/1aPEa3Czvx/",
    maps: "https://maps.google.com/?q=Flosswork+Dental+Clinic+Choubey+Colony+Raipur",
    rating: "4.9",
    reviewCount: "122"
  },

  /* Trust strip shown on the home and About pages. Edit once, then run `node tools/build-site.js`.
     { rating: true } shows clinic.rating and clinic.reviewCount; others use value + label. */
  trust: [
    { rating: true },
    { value: "5,000+",   label: "Patients treated" },
    { value: "200+",     label: "Aligner cases" },
    { value: "MDS",      label: "Experts" },
    { value: "Advanced", label: "3D scanning" },
    { value: "Premium",  label: "Comfortable care" }
  ],

  /* Paste your Google Apps Script web-app URL here (set up at the end).
     While empty, leads go to WhatsApp only. */
  leadEndpoint: "",

  /* Analytics. Prefer gtmId (configure the GA4 tag inside Tag Manager). ga4Id loads gtag.js directly
     and is used only when gtmId is empty. Leave both empty to load nothing. */
  analytics: { gtmId: "", ga4Id: "" },

  /* Options in "Plan your visit" and the booking form.
     key: stable id; label: dropdown text; pill: short label;
     price: number|null; mode: "emergency" switches to the call-now panel. */
  needs: [
    { key: "aligners",  label: "Clear aligners",         pill: "Aligners",   price: 50000 },
    { key: "cleaning",  label: "Teeth cleaning",         pill: "Cleaning",                  price: null },
    { key: "implants",  label: "Dental implants",        pill: "Implants", price: null },
    { key: "whitening", label: "Teeth whitening",        pill: "Whitening",                  price: null },
    { key: "snoring",   label: "Anti-snoring device",    pill: "Snoring",                  price: null },
    { key: "pain",      label: "Tooth pain / emergency", pill: "Pain",                  price: null, mode: "emergency" },
    { key: "other",     label: "Check-up / other",       pill: "Other",                  price: null }
  ],
  when: ["Today", "Tomorrow", "This week"],

  /* Four treatment tiles on the homepage (aligners have their own feature band). */
  tiles: [
    { key: "cleaning",  icon: "✧", name: "Teeth cleaning",       blurb: "Scaling and polishing by your doctor, with a check-up.", href: "cleaning.html" },
    { key: "implants",  icon: "◇", name: "Dental implants",      blurb: "Natural-looking, long-lasting replacement for missing teeth.", href: "services.html#implants" },
    { key: "whitening", icon: "✦", name: "Teeth whitening",      blurb: "Professional whitening in clinic.", href: "services.html#whitening" },
    { key: "snoring",   icon: "☾", name: "Anti-snoring devices", blurb: "Diagnosed, scanned, delivered and followed up by your doctor.", href: "services.html#snoring" }
  ],

  /* Doctors: active:false hides a card. Add a new object and a card appears everywhere.
     photo: path to portrait (e.g. "images/dr-priyesh.jpg"); empty shows initials. */
  doctors: [
    { active: true, name: "Dr. Priyesh Gupta", short: "Dr. Priyesh", initials: "PG", role: "Owner · Prosthodontist & Implant Surgeon", qual: "BDS, MDS", tags: ["Implants", "Prosthodontics"], photo: "" },
    { active: true, name: "Dr. Nehal Saraf",   short: "Dr. Nehal",   initials: "NS", role: "Co-owner · Orthodontist & Aligner Specialist", qual: "BDS, MDS", tags: ["Clear aligners", "Orthodontics"], photo: "" }
  ],

  /* Aligner before/after cases. Leave before/after empty until you have photos. */
  cases: [
    { title: "Crowding correction", months: 14, before: "images/case-1-before.jpg", after: "images/case-1-after.jpg" },
    { title: "Spacing & alignment", months: 10, before: "", after: "" },
    { title: "Overbite correction", months: 18, before: "", after: "" },
    { title: "Smile design",        months: 12, before: "", after: "" }
  ],


  /* Services page: groups of cards, then a chip list. img: file in images/ ("" shows an icon tile). */
  services: [
    { id: "love", title: "Love your smile", lead: "Straighten, reshape and brighten.", items: [
      { id: "aligners", name: "Clear aligners", desc: "Nearly invisible, removable trays planned to sub-millimetre precision.", img: "svc-aligners.jpg", href: "aligners.html" },
      { id: "braces", name: "Braces", desc: "Metal and ceramic braces to straighten teeth and correct bite problems, planned by your doctor.", img: "svc-braces.jpg" },
      { id: "smiledesign", name: "Smile design", desc: "Enhance the shape, proportion and appearance of your smile with a personalised plan.", img: "svc-smile-design.jpg" },
      { id: "whitening", name: "Teeth whitening", desc: "Remove stains and brighten your smile safely with professional-grade whitening.", img: "svc-whitening.jpg" }
    ]},
    { id: "restore", title: "Restore your teeth", lead: "Eat, speak and smile with confidence again.", items: [
      { id: "implants", name: "Dental implants", desc: "Replace missing teeth with implants that look, feel and function like natural teeth.", img: "svc-implants.jpg" },
      { id: "fillings", name: "Dental fillings", desc: "Repair cavities and chipped teeth with tooth-coloured fillings that blend in.", img: "svc-fillings.jpg" },
      { id: "rootcanal", name: "Root canal treatment", desc: "Save infected or damaged teeth with careful root canal treatment.", img: "svc-root-canal.jpg" },
      { id: "crowns", name: "Crowns & bridges", desc: "Restore damaged or missing teeth with durable, natural-looking restorations.", img: "svc-crowns.jpg" }
    ]},
    { id: "protect", title: "Protect your oral health", lead: "Prevention today, fewer problems tomorrow.", items: [
      { id: "cleaning", name: "Teeth cleaning", desc: "Remove plaque and tartar to keep teeth and gums healthy.", img: "svc-cleaning.jpg", href: "cleaning.html" },
      { id: "gums", name: "Gum disease treatment", desc: "Treat bleeding gums, bad breath and gum infections before they cause permanent damage.", img: "svc-gums.jpg" },
      { id: "badbreath", name: "Bad breath treatment", desc: "Find and treat the cause of persistent bad breath, from gum problems to plaque and decay.", img: "svc-bad-breath.jpg" },
      { id: "dentures", name: "Dentures", desc: "Replace multiple missing teeth with comfortable, natural-looking dentures.", img: "svc-dentures.jpg" }
    ]},
    { id: "sleep", title: "Sleep & comfort", lead: "Treatment for snoring and jaw problems.", items: [
      { id: "snoring", name: "Anti-snoring devices", desc: "Your doctor diagnoses, scans, makes and fits the device, then follows up with you.", img: "svc-snoring.jpg" },
      { id: "nightguard", name: "Night guard", desc: "A custom-fitted guard that protects your teeth from grinding and clenching while you sleep.", img: "svc-night-guard.jpg" }
    ]}
  ],
  moreTreatments: ["Wisdom tooth extraction", "Dental veneers", "Night guards", "TMJ treatment", "Fluoride treatment", "Oral cancer screening", "Sports mouthguards", "Sensitive teeth treatment", "Full mouth rehabilitation", "Kids dentistry", "Tooth diamond", "Others"],

  equipment: ["3D intraoral scanner", "Digital X-ray", "Professional whitening unit", "Smile design software", "Autoclave sterilisation"]
};
