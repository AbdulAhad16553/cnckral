export interface RouterFittingFaq {
  question: string;
  answer: string;
}

export const ROUTER_FITTING_TITLE =
  "CNC Router Spindle — Fitting aur Setup Ka Tareeqa";

export const ROUTER_FITTING_INTRO =
  "Yeh guide aapko batati hai ke CNC router spindle ko Z-axis par kaise mount karna hai, collet aur router bit kaise lagana hai, wiring aur water cooling check karna, aur pehli test run kaise leni hai.";

export const ROUTER_FITTING_STEPS = [
  {
    step: 1,
    title: "Spindle ko Z-axis par mount karen",
    detail:
      "Spindle ko Z-axis mounting plate par rakhen. Mounting holes align karen aur M6/M8 bolts evenly tight karen — ek taraf zyada tight na karen taake spindle tilt na ho.",
  },
  {
    step: 2,
    title: "Collet assembly lagayen",
    detail:
      "Sahi size ka collet choose karen (ER11 ya ER20 — bit shank ke mutabiq). Collet ko spindle mein dalen, collet nut hand-tight karen, phir collet wrench se firm karen — over-tight na karen.",
  },
  {
    step: 3,
    title: "Router bit insert karen",
    detail:
      "Router bit ka shank collet mein kam az kam 15–20 mm gehrai tak dalen. Collet nut ko torque ke mutabiq tight karen. Bit loose na ho aur collet mein seedha baithi ho.",
  },
  {
    step: 4,
    title: "Wiring aur cooling check karen",
    detail:
      "VFD/inverter cables, ground wire, aur spindle power connection sahi lagayen. Water-cooled spindle ho to pump, hoses aur flow pehle check karen — pani ke baghair spindle start na karen.",
  },
  {
    step: 5,
    title: "Low RPM test run",
    detail:
      "Pehli dafa 6000–8000 RPM par 1–2 minute chalayein. Vibration, awaz aur heat check karen. Sab theek ho to normal cutting RPM par kaam shuru karen.",
  },
  {
    step: 6,
    title: "Z-axis zero set karen",
    detail:
      "Tool length probe ya manual method se workpiece surface par Z-zero set karen. Har naya bit lagane ke baad tool length dubara check karen.",
  },
] as const;

export const ROUTER_FITTING_FAQS: RouterFittingFaq[] = [
  {
    question: "Router bit collet mein kitni gehrai tak lagana chahiye?",
    answer:
      "Shank ko collet mein kam az kam 15–20 mm gehrai tak dalen. Kam gehrai par bit slip ho sakti hai aur collet damage ho sakta hai. Bit poori tarah collet grip area mein honi chahiye.",
  },
  {
    question: "ER11 aur ER20 collet mein kya farq hai?",
    answer:
      "ER11 chhote shank bits ke liye hota hai (3.175 mm / 1/8 inch tak common). ER20 bade shank bits ke liye (6 mm, 8 mm, 12 mm). Apni spindle specification aur bit shank size ke mutabiq sahi collet choose karen.",
  },
  {
    question: "Spindle vibration kyun hoti hai?",
    answer:
      "Common wajahain: loose collet nut, galat collet size, bit seedhi nahi lagi, spindle bolts loose, ya Z-axis rails dirty. Pehle collet aur bit check karen, phir mounting bolts aur rail cleaning.",
  },
  {
    question: "Water-cooled spindle mein pani kaise check karen?",
    answer:
      "Pump on karen aur flow dekhen — inlet aur outlet dono se pani aa raha ho. Leaks check karen. Distilled water + coolant mix use karen. Spindle start karne se pehle water flow confirm karen.",
  },
  {
    question: "Collet nut kitna tight karna chahiye?",
    answer:
      "Pehle hand-tight karen, phir collet wrench se firm karen — zyada force na lagayen. Over-tight karne se collet crack ho sakta hai. Bit nikalne ke liye wrench se ulta ghumayen.",
  },
  {
    question: "Air-cooled aur water-cooled spindle mein kya farq hai?",
    answer:
      "Air-cooled spindle fan se thandi hoti hai — setup simple hai, chhote jobs ke liye theek. Water-cooled zyada powerful aur lambi duty ke liye behtar hai lekin pump, tank aur hoses zaroori hain.",
  },
];

export function buildRouterFittingFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ROUTER_FITTING_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
