const services = Object.freeze({
  web: {
    title: "Web Development",
    kicker: "01 / WEB",
    copy: "Fast, secure and scalable websites and web applications tailored to business needs, with the interface treated as part of the product rather than an afterthought.",
    points: [
      "Responsive layouts across mobile, tablet and desktop.",
      "Performance-aware front-end architecture.",
      "Accessible interaction and semantic structure.",
      "Backend-ready data boundary without UI coupling.",
    ],
  },
  graphics: {
    title: "Graphics Design",
    kicker: "02 / VISUAL",
    copy: "Visual identity, campaign materials and digital graphics that turn a technical idea into something people can recognize, understand and remember.",
    points: [
      "Brand identity and logo systems.",
      "Social and marketing artwork.",
      "Digital-first composition and hierarchy.",
      "Consistent visual language across product surfaces.",
    ],
  },
  marketing: {
    title: "Digital Marketing",
    kicker: "03 / GROWTH",
    copy: "Data-informed visibility work across search, social media, content and campaign systems, with clear calls to action and measurable user journeys.",
    points: [
      "SEO-friendly information architecture.",
      "Campaign landing pages and conversion paths.",
      "Content and social visual systems.",
      "Analytics-ready interaction patterns.",
    ],
  },
  cloud: {
    title: "Cloud Solutions",
    kicker: "04 / CLOUD",
    copy: "Cloud-oriented product interfaces for storing, managing and accessing information securely and reliably across devices.",
    points: [
      "File and storage experiences.",
      "Migration and management interfaces.",
      "Permission-aware interaction states.",
      "Progressive loading for mobile networks.",
    ],
  },
  security: {
    title: "Cybersecurity",
    kicker: "05 / SECURITY",
    copy: "Security-conscious interface design and defensive thinking that make risks, warnings and sensitive actions easier to understand.",
    points: [
      "Vulnerability-aware product UX.",
      "Clear warning and error states.",
      "Safer forms and input handling.",
      "Security concepts presented without unnecessary fear or noise.",
    ],
  },
  networking: {
    title: "Networking",
    kicker: "06 / SYSTEMS",
    copy: "Networking concepts expressed as dependable user-facing systems: connectivity, infrastructure, device access and collaboration.",
    points: [
      "LAN/WAN and wireless concepts.",
      "Infrastructure status interfaces.",
      "Device and connectivity feedback.",
      "Scalable information architecture for operational tools.",
    ],
  },
});
const projects = Object.freeze({
  "web-design": {
    title: "Web Design",
    kicker: "01 / WEB",
    copy: "Modern UI/UX, responsive structure, performance and security-minded implementation.",
    list: [
      "Modern UI/UX",
      "Responsive Design",
      "Performance Focused",
      "Secure & Reliable",
      "Custom Solutions",
    ],
  },
  networking: {
    title: "Networking",
    kicker: "02 / SYSTEMS",
    copy: "Reliable connectivity, secure infrastructure and scalable network design.",
    list: [
      "Reliable Connectivity",
      "Secure Infrastructure",
      "Collaboration Ready",
      "Scalable Networks",
    ],
  },
  cloud: {
    title: "Cloud Storage",
    kicker: "03 / CLOUD",
    copy: "Secure storage, uploads, sharing and device-independent access.",
    list: [
      "Secure Storage",
      "Easy Uploads",
      "Seamless Sharing",
      "Access Anywhere",
    ],
  },
  programming: {
    title: "Programming",
    kicker: "04 / CODE",
    copy: "Custom software solutions, modern technology, collaboration and quality.",
    list: [
      "Custom Solutions",
      "Modern Technologies",
      "Collaboration",
      "Quality & Security",
    ],
  },
  software: {
    title: "Software Design",
    kicker: "05 / SOFTWARE",
    copy: "Efficient, future-ready and secure software thinking for real-world problems.",
    list: [
      "Efficient Solutions",
      "Innovation Driven",
      "Quality & Security",
      "Team Collaboration",
    ],
  },
  graphics: {
    title: "Graphics Design",
    kicker: "06 / VISUAL",
    copy: "Creative branding, visual storytelling, professional artwork and innovative concepts.",
    list: [
      "Creative Branding",
      "Visual Storytelling",
      "Professional Quality",
      "Innovative Ideas",
    ],
  },
});
export const portfolioData = Object.freeze({ services, projects });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export async function submitContact(payload, onProgress = () => {}) {
  const steps = [12, 35, 64, 82, 100];
  for (const p of steps) {
    await sleep(p === 100 ? 180 : 140);
    onProgress(p);
  }
  if (
    String(payload.subject || "")
      .toUpperCase()
      .includes("FAIL-MOCK")
  )
    throw new Error(
      "Mock delivery failed. Retry without losing the form data.",
    );
  return { ok: true, reference: `KT-${Date.now().toString(36).toUpperCase()}` };
}
