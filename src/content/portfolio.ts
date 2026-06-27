import type { PortfolioContent } from "./types";

const EMAIL = "drewstake3@gmail.com";
const GITHUB = "https://github.com/drewstake";
const LINKEDIN = "https://www.linkedin.com/in/drewstake/";
const LEETCODE = "https://leetcode.com/u/drewstake/";
const RESUME_PATH = "/Andrew_Nguyen_Resume.pdf";

export const portfolioContent = {
  profile: {
    name: "Andrew Nguyen",
    eyebrow: "Full-stack software engineer",
    credential: "B.S. Computer Science, Penn State University",
    headline: "Andrew Nguyen",
    summary:
      "Software engineer building production web and mobile applications for healthcare workflows, internal operations, and customer-facing products. Experienced across React, Python, Django, Flutter, Firebase, APIs, and databases.",
    location: "United States",
    availability: "Open to full-stack software engineering roles",
    headshot: {
      src: "/professional_headshot.jpg",
      alt: "Andrew Nguyen headshot",
    },
  },
  nav: [
    { href: "#projects", label: "Projects" },
    { href: "#experience", label: "Experience" },
    { href: "#skills", label: "Skills" },
    { href: "#resume", label: "Resume" },
    { href: "#contact", label: "Contact" },
  ],
  links: [
    { label: "Email", href: `mailto:${EMAIL}`, kind: "email" },
    { label: "GitHub", href: GITHUB, kind: "github" },
    { label: "LinkedIn", href: LINKEDIN, kind: "linkedin" },
    { label: "LeetCode", href: LEETCODE, kind: "leetcode" },
    { label: "Resume", href: RESUME_PATH, kind: "resume" },
  ],
  heroMetrics: [
    { label: "Current role", value: "Software Developer" },
    { label: "Client work", value: "HR Healthcare, Carter Lumber" },
    { label: "Core stack", value: "React, Python, Django" },
    { label: "Mobile stack", value: "Flutter, Firebase, Firestore" },
  ],
  projects: [
    {
      slug: "hr-healthcare-order-platform",
      name: "HR Healthcare Order Platform",
      tagline: "Healthcare order workflow fixes across Intake, Patient Services, and clinic portals",
      status: "live",
      role: "Full-stack developer",
      timeframe: "2026",
      summary:
        "Production work on a healthcare order platform, focused on change requests, document workflows, permissions, queue routing, notifications, and regression coverage.",
      problem:
        "Healthcare order workflows span clinics, intake teams, patient services, documents, signatures, approvals, and versioned change requests. Small state bugs can send work to the wrong queue or expose incorrect actions.",
      solution:
        "Shipped backend and frontend fixes for order/change-request routing, clinic notifications, approval guards, document request handling, PDF/addendum rendering, and permission gates.",
      impact: [
        "Fixed returned documentation and change-request flows so work moves to the right review queue.",
        "Added safeguards around unsigned or terminal change requests to prevent incorrect approval actions.",
        "Backed fixes with focused Django and frontend regression tests tied to production-reported cases.",
      ],
      metrics: [
        { label: "Client", value: "HR Healthcare" },
        { label: "Scope", value: "Orders, docs, queues" },
        { label: "Verification", value: "Regression tests" },
      ],
      tech: ["Python", "Django", "JavaScript", "React", "SQL", "API permissions", "Regression tests"],
      links: [],
    },
    {
      slug: "carter-lumber-mobile",
      name: "Carter Lumber Internal App",
      tagline: "Flutter app features for internal store, newsfeed, and release workflows",
      status: "live",
      role: "Mobile developer",
      timeframe: "2026",
      summary:
        "Contributed to an internal Flutter app for Carter Lumber, including branded entry flows, Firestore-backed content, store discovery, and Firebase distribution setup.",
      problem:
        "Internal users needed quick access to company updates and store information from a mobile app with branded flows and reliable release distribution.",
      solution:
        "Built a branded login experience, connected newsfeed content to Firestore, added a Google Maps store screen with address search and contact actions, and configured Firebase App Distribution.",
      impact: [
        "Added an interactive store map with custom pins, search, popups, directions, call, and email actions.",
        "Connected Newsfeed to Firestore posts and added a full post detail view with images and HTML content.",
        "Improved release workflow by configuring Android Firebase App Distribution.",
      ],
      metrics: [
        { label: "Platform", value: "Flutter mobile" },
        { label: "Data", value: "Firestore" },
        { label: "Maps", value: "Google Maps" },
      ],
      tech: ["Flutter", "Dart", "Firebase", "Firestore", "Google Maps", "Android", "iOS"],
      links: [],
    },
    {
      slug: "carter-lumber-vehicles",
      name: "Carter Lumber Vehicle Documents App",
      tagline: "Flutter app for vehicle document access, scanning, PDFs, and field workflows",
      status: "live",
      role: "Mobile developer",
      timeframe: "2026",
      summary:
        "Worked on a Carter Lumber vehicle documents Flutter app with cached document access, Firebase/Firestore integration, PDF viewing and signing, QR scanning, document scanning, and external workflow links.",
      problem:
        "Vehicle-related documents and field workflows need to be accessible from mobile devices, including offline-friendly document lookup, scanning, signatures, and links into external processes.",
      solution:
        "Built app flows and services around authenticated sessions, Firestore-backed vehicle documents, local document caching, PDF viewing, signature capture, QR search, document scanning, email/share actions, and web-based workflow screens.",
      impact: [
        "Implemented mobile access patterns for vehicle documents and synced cached files.",
        "Added document-centric workflows for PDF viewing, signature capture, QR scanning, and scan upload paths.",
        "Integrated supporting services for downloads, external workflows, email/share actions, and Firebase bootstrap.",
      ],
      metrics: [
        { label: "Platform", value: "Flutter mobile" },
        { label: "Documents", value: "PDFs, scans, signatures" },
        { label: "Backend", value: "Firebase + Firestore" },
      ],
      tech: ["Flutter", "Dart", "Firebase", "Firestore", "PDF viewer", "Document scanning", "QR scanning"],
      links: [],
    },
  ],
  experience: [
    {
      role: "Software Developer",
      organization: "Innovative Owl Technology",
      timeframe: "2026 - Present",
      summary: "Client-facing software development across production web and mobile applications.",
      bullets: [
        "Ship scoped features and production fixes across client codebases.",
        "Work through pull requests with root-cause notes, testing steps, and regression coverage.",
        "Contribute across web, mobile, backend, API, and release workflows depending on client needs.",
      ],
    },
    {
      role: "Full-stack Developer",
      organization: "HR Healthcare Order Platform",
      timeframe: "2026",
      summary:
        "Production healthcare workflow work through Innovative Owl Technology, focused on order state, document routing, change requests, notifications, and permissions.",
      bullets: [
        "Fixed Intake, Patient Services, and clinic change-request routing so orders move to the correct work queues.",
        "Improved document request and returned-document flows across clinic and Patient Services review paths.",
        "Added focused Django and frontend regression tests for production-reported workflow bugs.",
      ],
    },
    {
      role: "Mobile Developer",
      organization: "Carter Lumber Internal App",
      timeframe: "2026",
      summary:
        "Internal mobile app work through Innovative Owl Technology, focused on branded app flows, Firestore-backed content, store discovery, and release distribution.",
      bullets: [
        "Built Carter Lumber branded login and app navigation flows in Flutter.",
        "Connected the Newsfeed to Firestore and added full post views with images and rich content.",
        "Added a Google Maps store screen with search, custom pins, popups, directions, call, and email actions.",
        "Configured Android Firebase App Distribution for internal release delivery.",
      ],
    },
    {
      role: "Mobile Developer",
      organization: "Carter Lumber Vehicle Documents App",
      timeframe: "2026",
      summary:
        "Vehicle document mobile app work through Innovative Owl Technology, focused on document access, scanning, signatures, and Firebase-backed data flows.",
      bullets: [
        "Worked with Flutter app modules for login, home, search, PDF viewing, QR scanning, accident workflows, signatures, and Smartsheet/web workflow screens.",
        "Integrated Firebase/Firestore-backed vehicle document data with local caching and sync behavior.",
        "Supported document workflows with file downloads, PDF viewing/signing, document scanning, email, sharing, and URL-launch actions.",
      ],
    },
  ],
  skills: [
    {
      label: "Core",
      items: ["Python", "TypeScript", "JavaScript", "SQL", "React", "Django", "REST APIs"],
    },
    {
      label: "Mobile + data",
      items: ["Flutter", "Dart", "Firebase", "Firestore", "PostgreSQL", "MySQL", "Redis"],
    },
    {
      label: "Delivery",
      items: ["Git", "GitHub", "Docker", "Postman", "Regression tests", "Code review", "CI/CD"],
    },
  ],
  resume: {
    path: RESUME_PATH,
    updated: "June 26, 2026",
    highlights: [
      "Software Developer at Innovative Owl Technology.",
      "Shipped production fixes for HR Healthcare order workflows, change requests, document routing, permissions, and notifications.",
      "Built Carter Lumber mobile app features across internal communications, store discovery, vehicle documents, scanning, PDFs, signatures, Firebase, and Firestore.",
      "Practical experience with full-stack debugging, regression tests, documentation, and code review.",
    ],
  },
  contact: {
    headline: "Have a role or project where this fits?",
    summary:
      "Email is the fastest way to reach me. I am also active on LinkedIn and GitHub if you want to review work first.",
  },
} satisfies PortfolioContent;
