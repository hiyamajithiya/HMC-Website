// Calculate years of practice from founding date (25 Jan 2007)
export function getYearsOfPractice(): number {
  const founding = new Date(2007, 0, 25) // Jan 25, 2007
  const now = new Date()
  let years = now.getFullYear() - founding.getFullYear()
  const monthDiff = now.getMonth() - founding.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < founding.getDate())) {
    years--
  }
  return years
}

// Site Information
export const SITE_INFO = {
  name: "Himanshu Majithiya & Co.",
  description: "Chartered Accountants in Ahmedabad providing Income Tax, Company Audit, FFMC Compliance, GST, and AI Automation services since 2007",
  domain: "www.himanshumajithiya.com",
  whatsapp: "+919879503465",

  // Firm Details
  proprietor: "CA Himanshu Majithiya",
  icaiMembership: "126185",
  firmRegistrationNo: "128134W",
  yearEstablished: "2007",
  foundingDate: "2007-01-25",

  // Professional Memberships
  memberships: {
    icai: "126185",
    wirc: "128134W",
    ahca: "Active Member",
  },

  // Contact Information
  phone: {
    primary: "+91 98795 03465",
  },
  email: {
    primary: "info@himanshumajithiya.com",
  },

  // Address
  address: {
    line1: "507-508, Maple Trade Centre",
    line2: "SAL Hospital Road, Near Surdhara Circle",
    city: "Thaltej, Ahmedabad",
    state: "Gujarat",
    pincode: "380059",
    country: "India",
  },

  // Office Hours
  officeHours: "Monday to Friday: 11:00 AM to 6:00 PM",

  // Social Media
  socialMedia: {
    youtube: "https://www.youtube.com/@himanshumajithiya4349",
    linkedin: "https://www.linkedin.com/in/himanshu-majithiya-b86a73381",
    facebook: "https://www.facebook.com/profile.php?id=61580046548872",
  },

  // Team Structure
  team: {
    caInter: 1,
    articledAssistants: 4,
    supportStaff: 4,
  },

  // Grievance Officer (IT Act, 2000)
  grievanceOfficer: {
    name: "CA Himanshu Majithiya",
    email: "info@himanshumajithiya.com",
    phone: "+91 98795 03465",
  },
};

// Services
export const SERVICES = [
  {
    id: "income-tax",
    title: "Income Tax Services",
    slug: "/services/income-tax",
    icon: "FileText",
    description: "Income Tax Return filing, tax planning, assessment representation, and NRI taxation services.",
  },
  {
    id: "company-audit",
    title: "Company Audit",
    slug: "/services/company-audit",
    icon: "ClipboardCheck",
    description: "Statutory audit, internal audit, tax audit, and compliance audit services.",
  },
  {
    id: "ffmc-compliance",
    title: "FFMC Compliance (RBI)",
    slug: "/services/ffmc-compliance",
    icon: "Building2",
    description: "Full Fledged Money Changer compliance, concurrent audit, and RBI regulatory services.",
  },
  {
    id: "ai-automation",
    title: "AI & Workflow Automation",
    slug: "/services/ai-automation",
    icon: "Bot",
    description: "Document automation, data processing, custom Python solutions, and process optimization.",
  },
  {
    id: "gst-services",
    title: "GST Services",
    slug: "/services/gst-services",
    icon: "Receipt",
    description: "GST registration, return filing, reconciliation, audit, and advisory services.",
  },
  {
    id: "other-services",
    title: "Other Services",
    slug: "/services/other-services",
    icon: "Briefcase",
    description: "ROC compliance, LEI registration, MSME registration, and other professional services.",
  },
];

// Navigation Items
export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    submenu: [
      { label: "Income Tax Services", href: "/services/income-tax" },
      { label: "Company Audit", href: "/services/company-audit" },
      { label: "FFMC Compliance", href: "/services/ffmc-compliance" },
      { label: "AI & Automation", href: "/services/ai-automation" },
      { label: "GST Services", href: "/services/gst-services" },
      { label: "Other Services", href: "/services/other-services" },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    submenu: [
      { label: "Blog", href: "/resources/blog" },
      { label: "Tax Calculators", href: "/resources/calculators" },
      { label: "Compliance Calendar", href: "/resources/compliance-calendar" },
      { label: "Useful Links", href: "/resources/useful-links" },
      { label: "Articles", href: "/resources/articles" },
    ],
  },
  { label: "Tools", href: "/tools" },
  { label: "Contact", href: "/contact" },
  { label: "HMC Club", href: "/hmc-club/login" },
];

// Regulatory Links (Permitted by ICAI)
export const REGULATORY_LINKS = [
  { name: "ICAI", url: "https://www.icai.org" },
  { name: "Income Tax Department", url: "https://www.incometax.gov.in" },
  { name: "GST Portal", url: "https://www.gst.gov.in" },
  { name: "RBI", url: "https://www.rbi.org.in" },
  { name: "MCA", url: "https://www.mca.gov.in" },
];

// Useful Government Portals and Links
export const USEFUL_LINKS = [
  {
    category: "Income Tax",
    links: [
      { name: "Income Tax E-Filing Portal", url: "https://www.incometax.gov.in/iec/fologin" },
      { name: "e-Pay Tax", url: "https://onlineservices.tin.egov-nsdl.com/etaxnew/tdsnontds.jsp" },
      { name: "TRACES (TDS)", url: "https://www.tdscpc.gov.in/" },
      { name: "Form 26AS / AIS", url: "https://www.incometax.gov.in/iec/fologin" },
      { name: "PAN Services", url: "https://www.pan.utiitsl.com/" },
    ],
  },
  {
    category: "GST",
    links: [
      { name: "GST Portal", url: "https://www.gst.gov.in/" },
      { name: "GST Registration", url: "https://reg.gst.gov.in/registration/" },
      { name: "GST Return Filing", url: "https://return.gst.gov.in/" },
      { name: "GST Payment", url: "https://payment.gst.gov.in/" },
      { name: "E-Invoice System", url: "https://einvoice1.gst.gov.in/" },
    ],
  },
  {
    category: "MCA & ROC",
    links: [
      { name: "MCA Portal", url: "https://www.mca.gov.in/" },
      { name: "MCA Services (V3)", url: "https://www.mca.gov.in/content/mca/global/en/mca/master-data/MDS.html" },
      { name: "Director KYC (DIR-3 KYC)", url: "https://www.mca.gov.in/content/mca/global/en/home.html" },
      { name: "LEI Registration (CCIL)", url: "https://www.ccilindia-lei.co.in/" },
    ],
  },
  {
    category: "EPFO & ESI",
    links: [
      { name: "EPFO Portal", url: "https://www.epfindia.gov.in/" },
      { name: "Unified Portal (EPF)", url: "https://unifiedportal-mem.epfindia.gov.in/memberinterface/" },
      { name: "ESIC Portal", url: "https://www.esic.in/" },
    ],
  },
  {
    category: "RBI & Banking",
    links: [
      { name: "RBI Official Website", url: "https://www.rbi.org.in/" },
      { name: "FEMA Regulations", url: "https://www.rbi.org.in/Scripts/Fema.aspx" },
      { name: "FFMC Master Directions", url: "https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx" },
    ],
  },
  {
    category: "Other Important Portals",
    links: [
      { name: "MSME / Udyam Registration", url: "https://udyamregistration.gov.in/" },
      { name: "Professional Tax (Gujarat)", url: "https://ptax.guj.nic.in/" },
      { name: "NSDL - TIN Services", url: "https://www.tin-nsdl.com/" },
      { name: "Protean (formerly NSDL e-Gov)", url: "https://www.protean-tinpan.com/" },
    ],
  },
];

// Blog Categories
export const BLOG_CATEGORIES = [
  { label: "Tax Updates", value: "TAX_UPDATES" },
  { label: "GST Updates", value: "GST_UPDATES" },
  { label: "Automation Tips", value: "AUTOMATION_TIPS" },
  { label: "Compliance", value: "COMPLIANCE" },
  { label: "FFMC/RBI", value: "FFMC_RBI" },
  { label: "General", value: "GENERAL" },
];

// Appointment Time Slots
export const TIME_SLOTS = [
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
];

// Service Categories for Contact/Appointment Forms
export const SERVICE_CATEGORIES = [
  "Income Tax Consultation",
  "Company Audit",
  "FFMC/RBI Compliance",
  "GST Services",
  "Automation Solutions",
  "Other",
];

// Compliance Categories
export const COMPLIANCE_CATEGORIES = [
  { label: "Income Tax", value: "INCOME_TAX", color: "#1a365d" },
  { label: "GST", value: "GST", color: "#d69e2e" },
  { label: "ROC", value: "ROC", color: "#38a169" },
  { label: "RBI/FFMC", value: "RBI_FFMC", color: "#3182ce" },
  { label: "TDS", value: "TDS", color: "#805ad5" },
  { label: "Advance Tax", value: "ADVANCE_TAX", color: "#dd6b20" },
  { label: "Other", value: "OTHER", color: "#718096" },
];

