/* =====================================================================
   WHAT TO EDIT
   1. Social links ........... SOCIALS (below)
   2. Projects code + page .. PROJECT_GATE (below). The code and the page
                               it opens are stored ENCRYPTED, so neither
                               appears in the source. To change either:
                               open the site, press F12 > Console, run
                                 makeGate("NEW CODE", "your-page.html")
                               and paste the printed line over PROJECT_GATE.
                               Codes ignore upper/lower case and extra spaces.
   3. Your photo ............. replace assets/photo.jpg
   4. Business card image .... replace assets/card.jpg (if the code sits in a
                               different spot, adjust --code-x / --code-bottom
                               in style.css)
   5. Paragraph text ......... TEXT.en.intro and TEXT.ar.intro (below).
                               The same English text sits in index.html
                               only as a fallback for when JS is off.

   NOTE: this is a soft gate, not real security. The code is checked in the
   browser: it can't be read from the source, but a short, guessable phrase
   can still be brute-forced, and the destination page itself is a normal
   public file that anyone who learns its address can open directly.
   Don't put anything truly private behind it.
   ===================================================================== */

const SOCIALS = {
  email: "mailto:shahenmohdturki@gmail.com",
  linkedin: "https://www.linkedin.com/in/shahen-srour/",
  whatsapp: "https://wa.me/971504512971", // +971 50 451 2971 (digits only, no + or spaces)
};

// Encrypted Projects destination (unlocked by the code on the card).
const PROJECT_GATE = {"salt":"hF1bs1ydWn+hD+Sisd3QMw==","iv":"t0w7hptWqBCRhFKf","data":"Ch/3xiDPKQOb3DPStPdaJTbSvu8oDXWqI2a4Oa+Fq3Mb"};

const TEXT = {
  en: {
    pageTitle: "Shahen Srour",
    name: "Shahen Srour",
    intro: "I’m a Computer Engineering graduate from the American University of Sharjah, based in the UAE. I’m bilingual in Arabic and English, and I like turning technical ideas into things people can actually use and understand. I’m currently studying Huawei HCIA and Cisco CCNA, and building projects on the side. Have a look at what I’ve made, or get in touch.",
    contact: "Contact me",
    projects: "Projects",
    socialsLabel: "Social links",
    email: "Email",
    whatsapp: "WhatsApp",
    back: "Back",
    modalTitle: "Projects",
    codeLabel: "Access code",
    codePlaceholder: "Access code",
    showCode: "Show code",
    hideCode: "Hide code",
    submit: "Unlock",
    error: "That code didn't match. Try again.",
    photoAlt: "Portrait of Shahen Srour",
    cardAlt: "My business card. The access code under my name is blurred.",
    callout: "That blurred line is the access code. You'll find it on my printed card.",
    toggle: "عربي",
    toggleAria: "Switch to Arabic",
  },
  ar: {
    pageTitle: "شاهين سرور",
    name: "شاهين سرور",
    intro: "أنا خريج هندسة الحاسوب من الجامعة الأمريكية في الشارقة، وأقيم في الإمارات. أتحدث العربية والإنجليزية بطلاقة، وأحب تحويل الأفكار التقنية إلى حلول يستطيع الناس استخدامها وفهمها فعلاً. أدرس حالياً لشهادتَي Huawei HCIA وCisco CCNA، وأعمل على مشاريع جانبية. اطّلع على ما أنجزته، أو تواصل معي.",
    contact: "تواصل معي",
    projects: "المشاريع",
    socialsLabel: "روابط التواصل",
    email: "البريد الإلكتروني",
    whatsapp: "واتساب",
    back: "رجوع",
    modalTitle: "المشاريع",
    codeLabel: "رمز الدخول",
    codePlaceholder: "رمز الدخول",
    showCode: "إظهار الرمز",
    hideCode: "إخفاء الرمز",
    submit: "فتح",
    error: "الرمز غير صحيح. حاول مرة أخرى.",
    photoAlt: "صورة شخصية لشاهين سرور",
    cardAlt: "بطاقة عملي. رمز الدخول أسفل اسمي مموّه.",
    callout: "هذا السطر المموّه هو رمز الدخول. ستجده على بطاقتي المطبوعة.",
    toggle: "EN",
    toggleAria: "التبديل إلى الإنجليزية",
  },
};

/* ---------------------------------------------------------------------
   No edits needed below this line.
   --------------------------------------------------------------------- */

const LANG_KEY = "portfolio-lang";

/* ---------- Projects gate crypto ----------
   The entered code is turned into an AES key (PBKDF2-SHA256). If it's the
   right code, the key decrypts PROJECT_GATE into the destination URL;
   any other code fails to decrypt. Needs https or localhost. */
const GATE_ITERATIONS = 250000;
const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const normalizeCode = (s) => s.normalize("NFKC").trim().replace(/\s+/g, " ").toUpperCase();

async function deriveGateKey(code, salt) {
  const base = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(normalizeCode(code)), "PBKDF2", false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: GATE_ITERATIONS, hash: "SHA-256" },
    base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
  );
}

async function unlockGate(code) {
  if (!normalizeCode(code) || !window.crypto?.subtle) return null;
  try {
    const key = await deriveGateKey(code, fromB64(PROJECT_GATE.salt));
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromB64(PROJECT_GATE.iv) }, key, fromB64(PROJECT_GATE.data)
    );
    return new TextDecoder().decode(plain);
  } catch {
    return null; // wrong code
  }
}

// Console helper for changing the code or the destination page (see top of file).
window.makeGate = async function makeGate(code, url) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveGateKey(code, salt);
  const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(url));
  const line = `const PROJECT_GATE = ${JSON.stringify({ salt: toB64(salt), iv: toB64(iv), data: toB64(data) })};`;
  console.log(line);
  return line;
};

function readSavedLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === "ar" || saved === "en" ? saved : "en";
  } catch {
    return "en";
  }
}

let currentLang = readSavedLang();

// Set language + direction right away (this file loads in <head>) so the
// layout doesn't flip after first paint.
document.documentElement.lang = currentLang;
document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const main = $("#main");
  const langToggle = $("#lang-toggle");
  const panels = $("#panels");
  const introPanel = $("#panel-intro");
  const socialsPanel = $("#panel-socials");
  const contactBtn = $("#contact-btn");
  const projectsBtn = $("#projects-btn");
  const socialsBack = $("#socials-back");
  const modal = $("#projects-modal");
  const dialog = modal.querySelector('[role="dialog"]');
  const modalBack = $("#modal-back");
  const form = $("#unlock-form");
  const input = $("#code");
  const codeField = $("#code-field");
  const eyeToggle = $("#eye-toggle");
  const error = $("#code-error");

  /* ---------- Show / hide the typed code ---------- */
  function setCodeVisible(visible) {
    input.type = visible ? "text" : "password";
    eyeToggle.setAttribute("aria-pressed", String(visible));
    eyeToggle.setAttribute("aria-label", TEXT[currentLang][visible ? "hideCode" : "showCode"]);
  }

  eyeToggle.addEventListener("click", () => {
    setCodeVisible(input.type === "password");
    input.focus({ preventScroll: true });
  });

  /* ---------- Language ---------- */
  function applyLang(lang) {
    const t = TEXT[lang];
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = t.pageTitle;

    $$("[data-i18n]").forEach((el) => {
      const value = t[el.dataset.i18n];
      if (value !== undefined) el.textContent = value;
    });

    $$("[data-i18n-attr]").forEach((el) => {
      el.dataset.i18nAttr.split(";").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        if (t[key] !== undefined) el.setAttribute(attr, t[key]);
      });
    });

    // The toggle's label is written in the *other* language.
    langToggle.lang = lang === "ar" ? "en" : "ar";

    if (error.textContent) error.textContent = t.error;
    setCodeVisible(input.type === "text");
  }

  langToggle.addEventListener("click", () => {
    const next = currentLang === "ar" ? "en" : "ar";
    applyLang(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      /* storage unavailable: the choice just won't persist */
    }
  });

  applyLang(currentLang);

  /* ---------- Social links ---------- */
  $$("[data-social]").forEach((link) => {
    const href = SOCIALS[link.dataset.social];
    if (href) link.href = href;
  });

  /* ---------- Contact <-> socials panel ---------- */
  function showSocials(show) {
    const incoming = show ? socialsPanel : introPanel;
    const outgoing = show ? introPanel : socialsPanel;

    incoming.inert = false;
    panels.classList.toggle("show-socials", show);
    (show ? socialsPanel.querySelector("a") : contactBtn).focus({ preventScroll: true });
    outgoing.inert = true;
  }

  contactBtn.addEventListener("click", () => showSocials(true));
  socialsBack.addEventListener("click", () => showSocials(false));

  /* ---------- Projects modal ---------- */
  const isOpen = () => modal.classList.contains("is-open");

  function resetForm() {
    form.reset();
    error.textContent = "";
    input.removeAttribute("aria-invalid");
    codeField.classList.remove("is-shaking");
    setCodeVisible(false);
  }

  function openModal() {
    modal.inert = false;
    main.inert = true;
    langToggle.inert = true;
    modal.classList.add("is-open");
    input.focus({ preventScroll: true });
  }

  function closeModal() {
    if (!isOpen()) return;
    modal.classList.remove("is-open");
    main.inert = false;
    langToggle.inert = false;
    projectsBtn.focus({ preventScroll: true });
    modal.inert = true;
    resetForm();
  }

  projectsBtn.addEventListener("click", openModal);
  modalBack.addEventListener("click", closeModal);

  // Close on backdrop click, but only if the press also started on the
  // backdrop (so dragging a text selection out of the input doesn't close it).
  let pressStartedOnBackdrop = false;
  modal.addEventListener("pointerdown", (e) => {
    pressStartedOnBackdrop = e.target === modal;
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal && pressStartedOnBackdrop) closeModal();
    pressStartedOnBackdrop = false;
  });

  function trapFocus(e) {
    const focusables = Array.from(
      dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => !el.disabled && el.getClientRects().length > 0);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (!dialog.contains(active)) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  document.addEventListener("keydown", (e) => {
    if (!isOpen()) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
    } else if (e.key === "Tab") {
      trapFocus(e);
    }
  });

  /* ---------- Password ---------- */
  function showError() {
    error.textContent = TEXT[currentLang].error;
    input.setAttribute("aria-invalid", "true");
    // restart the shake animation (the eye button shakes along with the input)
    codeField.classList.remove("is-shaking");
    void codeField.offsetWidth;
    codeField.classList.add("is-shaking");
    input.select();
  }

  let checking = false;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (checking) return;
    checking = true;
    form.setAttribute("aria-busy", "true");
    const destination = await unlockGate(input.value);
    form.removeAttribute("aria-busy");
    checking = false;

    if (destination) {
      window.location.href = destination;
    } else {
      showError();
    }
  });

  input.addEventListener("input", () => {
    input.removeAttribute("aria-invalid");
  });

  codeField.addEventListener("animationend", () => codeField.classList.remove("is-shaking"));
});
