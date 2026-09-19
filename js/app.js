/* ==========================================================================
   LEGALBRIDGE — app.js
   Vanilla JS. All data below is fictional demo data for a frontend prototype.
   No real AI, backend, database, or helpline integration exists here.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     1. MOCK DATA
     ------------------------------------------------------------------ */
  const LB_CASES = [
    { caseId: "LB-2026-00124", name: "Moyuri", location: "Kalai, Joypurhat", district: "Joypurhat", risk: "High", vulnerability: "High", urgency: "High", status: "Safety hold", verification: "Pending", type: "Domestic violence", priority: "Urgent", source: "Third-party — Ripon (brother)", days: 0 },
    { caseId: "LB-2026-00119", name: "Rehana Begum", location: "Kalai, Joypurhat", district: "Joypurhat", risk: "High", vulnerability: "Medium", urgency: "High", status: "Lawyer assigned", verification: "Verified", type: "Maintenance claim", priority: "Urgent", source: "Direct — applicant", days: 2 },
    { caseId: "LB-2026-00131", name: "Abdul Karim", location: "Rangpur Sadar, Rangpur", district: "Rangpur", risk: "Low", vulnerability: "Low", urgency: "Medium", status: "Mediation booked", verification: "Verified", type: "House-rent dispute", priority: "Standard", source: "Direct — applicant", days: 4 },
    { caseId: "LB-2026-00108", name: "Shahnaz Parvin", location: "Dinajpur Sadar, Dinajpur", district: "Dinajpur", risk: "Medium", vulnerability: "High", urgency: "High", status: "Awaiting callback", verification: "Pending", type: "Dowry-related threat", priority: "High", source: "Third-party — neighbour", days: 9 },
    { caseId: "LB-2026-00142", name: "Md. Yunus", location: "Kushtia Sadar, Kushtia", district: "Kushtia", risk: "Low", vulnerability: "Medium", urgency: "Low", status: "Advice given", verification: "Verified", type: "Consumer complaint", priority: "Standard", source: "Direct — applicant", days: 1 },
    { caseId: "LB-2026-00097", name: "Nazma Khatun", location: "Satkhira Sadar, Satkhira", district: "Satkhira", risk: "High", vulnerability: "High", urgency: "Medium", status: "Under review", verification: "Verified", type: "Domestic violence", priority: "Urgent", source: "Direct — applicant", days: 3 },
    { caseId: "LB-2026-00155", name: "Rafiqul Islam", location: "Mymensingh Sadar, Mymensingh", district: "Mymensingh", risk: "Low", vulnerability: "Low", urgency: "High", status: "Limitation alert", verification: "Verified", type: "Land dispute", priority: "High", source: "Direct — applicant", days: 0 },
    { caseId: "LB-2026-00088", name: "Farida Yasmin", location: "Kalai, Joypurhat", district: "Joypurhat", risk: "Medium", vulnerability: "High", urgency: "Medium", status: "Info gap queue", verification: "Pending", type: "Maintenance claim", priority: "High", source: "Third-party — sister", days: 11 },
    { caseId: "LB-2026-00161", name: "Selina Akter", location: "Noakhali Sadar, Noakhali", district: "Noakhali", risk: "Medium", vulnerability: "Medium", urgency: "Medium", status: "Mediation ongoing", verification: "Verified", type: "Wage non-payment", priority: "Standard", source: "Direct — applicant", days: 5 },
    { caseId: "LB-2026-00073", name: "Jasim Uddin", location: "Debidwar, Cumilla", district: "Cumilla", risk: "Low", vulnerability: "Medium", urgency: "Low", status: "Closed — settled", verification: "Verified", type: "Consumer complaint", priority: "Standard", source: "Direct — applicant", days: 14 }
  ];

  /* Case-level detail used by risk-flag popovers and district/legal features */
  const LB_CASE_FLAGS = {
    "LB-2026-00124": [
      { flag: "Ongoing violence", quote: "\"My sister's husband beats her.\"", source: "Ripon (brother) · unverified" },
      { flag: "Financial deprivation", quote: "\"He hasn't paid for household expenses in five months.\"", source: "Ripon (brother) · unverified" },
      { flag: "Communication barrier", quote: "\"My sister doesn't have access to a phone.\"", source: "Ripon (brother) · unverified" },
      { flag: "Disability", quote: "\"I am blind.\"", source: "Ripon (brother), about himself · unverified" }
    ]
  };

  /* Section 21Kha district rollout status (P1.2) — illustrative, matches phased gazette notification */
  const LB_S21KHA_DISTRICTS = {
    "Sylhet": true, "Moulvibazar": true, "Sunamganj": true, "Faridpur": true,
    "Mymensingh": true, "Rangpur": true, "Dinajpur": true, "Satkhira": true,
    "Kushtia": true, "Cumilla": true, "Noakhali": true, "Rangamati": true,
    "Thakurgaon": true, "Tangail": true,
    "Joypurhat": false
  };
  window.LB_S21KHA_DISTRICTS = LB_S21KHA_DISTRICTS;

  window.LB_CASES = LB_CASES;

  /* ------------------------------------------------------------------
     2. NAVBAR ACTIVE STATE
     ------------------------------------------------------------------ */
  function setActiveNav() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".lb-nav .nav-link[data-page]").forEach((link) => {
      if (link.dataset.page === path) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ------------------------------------------------------------------
     3. TOASTS
     ------------------------------------------------------------------ */
  function lbToast(message, variant) {
    variant = variant || "success";
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container position-fixed bottom-0 end-0 p-3";
      document.body.appendChild(container);
    }
    const icon = variant === "danger" ? "bi-exclamation-triangle-fill" :
                 variant === "warning" ? "bi-shield-exclamation" : "bi-check-circle-fill";
    const el = document.createElement("div");
    el.className = "toast align-items-center border-0 shadow";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.innerHTML =
      '<div class="d-flex">' +
        '<div class="toast-body d-flex align-items-center gap-2"><i class="bi ' + icon + '"></i>' + message + '</div>' +
        '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>' +
      '</div>';
    el.style.background = variant === "danger" ? "var(--lb-terracotta-700)" :
                           variant === "warning" ? "var(--lb-gold-600)" : "var(--lb-emerald-700)";
    el.style.color = "#fff";
    container.appendChild(el);
    const toast = new bootstrap.Toast(el, { delay: 3800 });
    toast.show();
    el.addEventListener("hidden.bs.toast", () => el.remove());
  }
  window.lbToast = lbToast;

  /* ------------------------------------------------------------------
     4. ACCESSIBILITY PANEL (font size, contrast, motion, language)
     ------------------------------------------------------------------ */
  function initAccessibilityPanel() {
    const root = document.body;
    const state = JSON.parse(localStorage.getItem("lb_a11y") || "{}");

    function apply() {
      root.classList.toggle("lb-large-text", state.textSize === "large");
      root.classList.toggle("lb-larger-text", state.textSize === "larger");
      root.classList.toggle("lb-high-contrast", !!state.contrast);
      root.classList.toggle("lb-reduced-motion", !!state.reducedMotion);
    }
    apply();

    const incBtn = document.getElementById("a11yFontInc");
    const decBtn = document.getElementById("a11yFontDec");
    const contrastToggle = document.getElementById("a11yContrast");
    const motionToggle = document.getElementById("a11yMotion");

    const sizes = ["normal", "large", "larger"];
    function save() { localStorage.setItem("lb_a11y", JSON.stringify(state)); apply(); }

    if (incBtn) incBtn.addEventListener("click", () => {
      const i = sizes.indexOf(state.textSize || "normal");
      state.textSize = sizes[Math.min(i + 1, sizes.length - 1)];
      save();
    });
    if (decBtn) decBtn.addEventListener("click", () => {
      const i = sizes.indexOf(state.textSize || "normal");
      state.textSize = sizes[Math.max(i - 1, 0)];
      save();
    });
    if (contrastToggle) {
      contrastToggle.checked = !!state.contrast;
      contrastToggle.addEventListener("change", (e) => { state.contrast = e.target.checked; save(); });
    }
    if (motionToggle) {
      motionToggle.checked = !!state.reducedMotion;
      motionToggle.addEventListener("change", (e) => { state.reducedMotion = e.target.checked; save(); });
    }
  }

  /* ------------------------------------------------------------------
     5. LANGUAGE TOGGLE (বাংলা / English)
        Translates every element carrying a data-i18n="key" attribute
        (looked up in LB_I18N below) and also still supports the
        older inline data-en / data-bn attribute pairs.
     ------------------------------------------------------------------ */
  const LB_I18N = {
    skip_link: { en: "Skip to main content", bn: "মূল কনটেন্টে যান" },
    brand_tag: { en: "Bridging Citizens to Justice.", bn: "নাগরিকদের ন্যায়বিচারের সাথে সংযুক্ত করা।" },
    nav_home: { en: "Home", bn: "হোম" },
    nav_citizen_access: { en: "Citizen Access", bn: "নাগরিক প্রবেশাধিকার" },
    nav_ai_intake: { en: "AI Intake", bn: "এআই ইনটেক" },
    nav_safety: { en: "Safety", bn: "নিরাপত্তা" },
    nav_dashboard: { en: "DLAO Dashboard", bn: "ডিএলএও ড্যাশবোর্ড" },
    nav_mediation: { en: "Mediation", bn: "মধ্যস্থতা" },
    nav_case: { en: "Case Record", bn: "মামলার রেকর্ড" },
    emergency_help: { en: "Emergency Help", bn: "জরুরি সহায়তা" },
    hero_badge: { en: "Digital Legal Aid • Bangladesh", bn: "ডিজিটাল আইনি সহায়তা • বাংলাদেশ" },
    hero_h1: { en: "Legal help should be within everyone's reach.", bn: "আইনি সহায়তা সবার নাগালের মধ্যে থাকা উচিত।" },
    hero_lead: { en: "LegalBridge connects citizens to safe, accessible and human-centred legal assistance — even when technology, mobility or accessibility becomes a barrier.", bn: "লিগ্যালব্রিজ নাগরিকদের নিরাপদ, সহজলভ্য এবং মানবিক আইনি সহায়তার সাথে সংযুক্ত করে — এমনকি যখন প্রযুক্তি, চলাফেরা বা প্রবেশাধিকার একটি বাধা হয়ে দাঁড়ায়।" },
    btn_get_support: { en: "Get Legal Support", bn: "আইনি সহায়তা নিন" },
    btn_call: { en: "Call 16699", bn: "১৬৬৯৯ নম্বরে কল করুন" },
    trust_line: { en: "AI assists. Human officers decide.", bn: "এআই সহায়তা করে। মানব কর্মকর্তারা সিদ্ধান্ত নেন।" },
    pathway_kicker: { en: "A citizen's path through LegalBridge", bn: "লিগ্যালব্রিজের মাধ্যমে একজন নাগরিকের পথ" },
    node1_title: { en: "Citizen", bn: "নাগরিক" },
    node1_desc: { en: "Reaches out directly, or through a trusted proxy", bn: "সরাসরি বা বিশ্বস্ত কারো মাধ্যমে যোগাযোগ করেন" },
    node2_title: { en: "Voice Intake", bn: "ভয়েস ইনটেক" },
    node2_desc: { en: "Speaks freely; no forms or typing required", bn: "স্বাধীনভাবে কথা বলেন; কোনো ফর্ম বা টাইপ করার প্রয়োজন নেই" },
    node3_title: { en: "Safety Screening", bn: "নিরাপত্তা যাচাই" },
    node3_desc: { en: "Risk and communication safety assessed first", bn: "প্রথমে ঝুঁকি ও যোগাযোগের নিরাপত্তা মূল্যায়ন করা হয়" },
    node4_title: { en: "Human Officer", bn: "মানব কর্মকর্তা" },
    node4_desc: { en: "Reviews, verifies, and decides — not the AI", bn: "পর্যালোচনা, যাচাই ও সিদ্ধান্ত নেন — এআই নয়" },
    node5_title: { en: "Justice", bn: "ন্যায়বিচার" },
    node5_desc: { en: "Legal aid, mediation, or ODR toward an outcome", bn: "একটি ফলাফলের দিকে আইনি সহায়তা, মধ্যস্থতা, বা অনলাইন বিরোধ নিষ্পত্তি" },
    problem_kicker: { en: "The problem", bn: "সমস্যা" },
    problem_h2: { en: "Real barriers stand between citizens and legal protection.", bn: "নাগরিক ও আইনি সুরক্ষার মধ্যে প্রকৃত বাধা রয়েছে।" },
    problem1_title: { en: "Distance", bn: "দূরত্ব" },
    problem1_desc: { en: "Legal Aid Offices may be difficult to reach.", bn: "আইনি সহায়তা অফিসে পৌঁছানো কঠিন হতে পারে।" },
    problem2_title: { en: "Digital Barriers", bn: "ডিজিটাল বাধা" },
    problem2_desc: { en: "Forms, CAPTCHA, OTP and documents can exclude people.", bn: "ফর্ম, ক্যাপচা, ওটিপি এবং কাগজপত্র মানুষকে বাদ দিতে পারে।" },
    problem3_title: { en: "Safety", bn: "নিরাপত্তা" },
    problem3_desc: { en: "Unsafe communication can put vulnerable applicants at risk.", bn: "অনিরাপদ যোগাযোগ ঝুঁকিপূর্ণ আবেদনকারীদের বিপদে ফেলতে পারে।" },
    problem4_title: { en: "Accessibility", bn: "প্রবেশাধিকার" },
    problem4_desc: { en: "Digital access must work for people with disabilities.", bn: "প্রতিবন্ধী ব্যক্তিদের জন্যও ডিজিটাল প্রবেশাধিকার কার্যকর হতে হবে।" },
    hiw_kicker: { en: "How LegalBridge works", bn: "লিগ্যালব্রিজ যেভাবে কাজ করে" },
    hiw_h2: { en: "Five steps, from first contact to resolution.", bn: "প্রথম যোগাযোগ থেকে সমাধান পর্যন্ত পাঁচটি ধাপ।" },
    step1_title: { en: "Citizen / Proxy", bn: "নাগরিক / প্রতিনিধি" },
    step1_desc: { en: "Reaches out directly or through someone they trust.", bn: "সরাসরি অথবা বিশ্বস্ত কারো মাধ্যমে যোগাযোগ করেন।" },
    step2_title: { en: "Voice Intake", bn: "ভয়েস ইনটেক" },
    step2_desc: { en: "Describes the situation by speaking, not typing.", bn: "টাইপ না করে কথা বলে পরিস্থিতি বর্ণনা করেন।" },
    step3_title: { en: "Safety Screening", bn: "নিরাপত্তা যাচাই" },
    step3_desc: { en: "Risk and safe-contact windows are established.", bn: "ঝুঁকি ও নিরাপদ যোগাযোগের সময় নির্ধারণ করা হয়।" },
    step4_title: { en: "Human Review", bn: "মানব পর্যালোচনা" },
    step4_desc: { en: "A legal aid officer verifies and takes the decision.", bn: "একজন আইনি সহায়তা কর্মকর্তা যাচাই করে সিদ্ধান্ত নেন।" },
    step5_title: { en: "Legal Support / Mediation", bn: "আইনি সহায়তা / মধ্যস্থতা" },
    step5_desc: { en: "The citizen is guided toward aid, mediation, or ODR.", bn: "নাগরিককে সহায়তা, মধ্যস্থতা বা অনলাইন বিরোধ নিষ্পত্তির দিকে পরিচালিত করা হয়।" },
    principles_kicker: { en: "Key principles", bn: "মূল নীতিমালা" },
    principles_h2: { en: "The rules the product is built around.", bn: "যে নিয়মের ভিত্তিতে এই পণ্যটি তৈরি।" },
    p1_title: { en: "AI assists, humans decide", bn: "এআই সহায়তা করে, মানুষ সিদ্ধান্ত নেয়" },
    p1_desc: { en: "Every consequential decision is made by a person, not a model.", bn: "প্রতিটি গুরুত্বপূর্ণ সিদ্ধান্ত একজন মানুষ নেয়, কোনো মডেল নয়।" },
    p2_title: { en: "Safety before convenience", bn: "সুবিধার আগে নিরাপত্তা" },
    p2_desc: { en: "No contact happens unless it's confirmed safe first.", bn: "নিরাপদ নিশ্চিত না হওয়া পর্যন্ত কোনো যোগাযোগ হয় না।" },
    p3_title: { en: "Accessibility for everyone", bn: "সবার জন্য প্রবেশাধিকার" },
    p3_desc: { en: "Voice, phone, and human pathways exist alongside digital ones.", bn: "ডিজিটালের পাশাপাশি ভয়েস, ফোন এবং মানবিক মাধ্যমও বিদ্যমান।" },
    p4_title: { en: "Incomplete information ≠ low priority", bn: "অসম্পূর্ণ তথ্য মানেই কম অগ্রাধিকার নয়" },
    p4_desc: { en: "Missing details never automatically reduce a case's urgency.", bn: "তথ্যের অভাব কখনও স্বয়ংক্রিয়ভাবে একটি মামলার জরুরিতা কমায় না।" },
    p5_title: { en: "Privacy by design", bn: "পরিকল্পনায় গোপনীয়তা" },
    p5_desc: { en: "Sensitive details are visible only to the roles that need them.", bn: "স্পর্শকাতর তথ্য শুধুমাত্র প্রয়োজনীয় ভূমিকার কাছেই দৃশ্যমান।" },
    case_kicker: { en: "Featured case · Fictional demo data", bn: "বৈশিষ্ট্যযুক্ত মামলা · কাল্পনিক ডেমো তথ্য" },
    case_h2: { en: "Moyuri's journey through LegalBridge.", bn: "লিগ্যালব্রিজে ময়ূরীর যাত্রা।" },
    case_name: { en: "Moyuri, 24", bn: "ময়ূরী, ২৪" },
    case_location: { en: "Kalai, Joypurhat", bn: "কালাই, জয়পুরহাট" },
    case_status: { en: "Human verification pending", bn: "মানব যাচাই বাকি" },
    case_risk_label: { en: "Risk level", bn: "ঝুঁকির মাত্রা" },
    case_risk_value: { en: "High", bn: "উচ্চ" },
    case_source_label: { en: "Information source", bn: "তথ্যের উৎস" },
    case_source_value: { en: "Third-party — Ripon", bn: "তৃতীয় পক্ষ — রিপন" },
    case_window_label: { en: "Safe contact window", bn: "নিরাপদ যোগাযোগের সময়" },
    case_window_value: { en: "Friday • approximately 20 minutes", bn: "শুক্রবার • আনুমানিক ২০ মিনিট" },
    case_btn: { en: "View Case Journey", bn: "মামলার যাত্রা দেখুন" },
    a11y_kicker: { en: "Accessibility", bn: "প্রবেশাধিকার" },
    a11y_h2: { en: "Legal access should not depend on eyesight, internet or digital literacy.", bn: "আইনি সহায়তা দৃষ্টিশক্তি, ইন্টারনেট বা ডিজিটাল সাক্ষরতার উপর নির্ভর করা উচিত নয়।" },
    a11y_p: { en: "LegalBridge is built voice-first, so that someone like Ripon — who cannot read a form, a CAPTCHA, or an OTP screen — can still report on behalf of someone he cares about.", bn: "লিগ্যালব্রিজ ভয়েস-ফার্স্ট হিসেবে তৈরি, যাতে রিপনের মতো কেউ — যিনি ফর্ম, ক্যাপচা বা ওটিপি স্ক্রিন পড়তে পারেন না — তিনিও তার প্রিয়জনের পক্ষে অভিযোগ জানাতে পারেন।" },
    a11y_row1_title: { en: "Voice-first interaction", bn: "ভয়েস-ফার্স্ট ইন্টারঅ্যাকশন" },
    a11y_row1_desc: { en: "Speak instead of typing or filling forms.", bn: "টাইপ বা ফর্ম পূরণের পরিবর্তে কথা বলুন।" },
    a11y_row2_title: { en: "Bangla audio guidance", bn: "বাংলা অডিও নির্দেশনা" },
    a11y_row2_desc: { en: "Spoken prompts and confirmations in Bangla.", bn: "বাংলায় মৌখিক নির্দেশনা ও নিশ্চিতকরণ।" },
    a11y_row3_title: { en: "Accessible navigation", bn: "সহজ প্রবেশযোগ্য নেভিগেশন" },
    a11y_row3_desc: { en: "Keyboard, screen-reader and large-control support.", bn: "কীবোর্ড, স্ক্রিন-রিডার এবং বড় নিয়ন্ত্রণ সমর্থন।" },
    a11y_row4_title: { en: "Phone-first access", bn: "ফোন-ফার্স্ট প্রবেশাধিকার" },
    a11y_row4_desc: { en: "Reachable through a helpline, not only an app.", bn: "শুধু অ্যাপ নয়, হেল্পলাইনের মাধ্যমেও যোগাযোগযোগ্য।" },
    a11y_row5_title: { en: "Human assistance", bn: "মানবিক সহায়তা" },
    a11y_row5_desc: { en: "A person is always reachable behind the interface.", bn: "ইন্টারফেসের পেছনে সবসময় একজন মানুষ থাকেন।" },
    footer_product: { en: "Product", bn: "প্রোডাক্ট" },
    footer_about: { en: "About", bn: "সম্পর্কে" },
    footer_how: { en: "How It Works", bn: "যেভাবে কাজ করে" },
    footer_trust: { en: "Trust", bn: "বিশ্বাস" },
    footer_privacy: { en: "Privacy", bn: "গোপনীয়তা" },
    footer_legal_aid: { en: "Legal Aid", bn: "আইনি সহায়তা" },
    footer_contact: { en: "Contact (16699)", bn: "যোগাযোগ (১৬৬৯৯)" },
    footer_scope_title: { en: "Prototype scope", bn: "প্রোটোটাইপের পরিধি" },
    footer_scope_p: { en: "Built for the Legal Tech Hackathon 2026 · Accelerating Digital Legal Aid Services in Bangladesh (ADLASB) · UNDP Bangladesh · Directorate of Bangladesh Legal Aid (DBLA). Prototype only — not a live government service.", bn: "লিগ্যাল টেক হ্যাকাথন ২০২৬-এর জন্য তৈরি · অ্যাক্সিলারেটিং ডিজিটাল লিগ্যাল এইড সার্ভিসেস ইন বাংলাদেশ (ADLASB) · ইউএনডিপি বাংলাদেশ · বাংলাদেশ লিগ্যাল এইড অধিদপ্তর (DBLA)। শুধুমাত্র প্রোটোটাইপ — কোনো সরাসরি সরকারি সেবা নয়।" },
    footer_disclaimer: { en: "LegalBridge is a prototype concept for a digital legal-aid service. AI-generated information is not a substitute for official legal advice or human legal judgment.", bn: "লিগ্যালব্রিজ একটি ডিজিটাল আইনি সহায়তা সেবার প্রোটোটাইপ ধারণা। এআই-উৎপন্ন তথ্য কখনও দাপ্তরিক আইনি পরামর্শ বা মানুষের আইনি বিচার-বুদ্ধির বিকল্প নয়।" },
    modal_title: { en: "Need immediate help?", bn: "তাৎক্ষণিক সহায়তা প্রয়োজন?" },
    modal_call: { en: "Call Legal Aid Helpline", bn: "আইনি সহায়তা হেল্পলাইনে কল করুন" },
    modal_officer: { en: "Speak to Human Officer", bn: "মানব কর্মকর্তার সাথে কথা বলুন" },
    modal_guidance: { en: "Safety Guidance", bn: "নিরাপত্তা নির্দেশনা" },
    modal_109: { en: "Women & child abuse", bn: "নারী ও শিশু নির্যাতন" },
    modal_999: { en: "National emergency", bn: "জাতীয় জরুরি সেবা" },
    modal_occ: { en: "Nearest district hospital", bn: "নিকটতম জেলা হাসপাতাল" },
    modal_disclaimer: { en: "Prototype interaction — not a live helpline connection.", bn: "প্রোটোটাইপ ইন্টারঅ্যাকশন — এটি সরাসরি হেল্পলাইন সংযোগ নয়।" },
    oc_text_size: { en: "Text size", bn: "লেখার আকার" },
    oc_adjust: { en: "Adjust", bn: "সমন্বয় করুন" },
    oc_contrast: { en: "High contrast", bn: "উচ্চ কনট্রাস্ট" },
    oc_motion: { en: "Reduced motion", bn: "কমানো মোশন" },
    oc_talkback: { en: "The Bangla interface on the intake flow has been tested with TalkBack (Android).", bn: "ইনটেক প্রবাহের বাংলা ইন্টারফেস TalkBack (অ্যান্ড্রয়েড) দিয়ে পরীক্ষা করা হয়েছে।" },
    oc_voice_mode: { en: "Voice mode", bn: "ভয়েস মোড" },
    oc_voice_mode_desc: { en: "Available on the Case Record page for voice-first access.", bn: "ভয়েস-ফার্স্ট প্রবেশাধিকারের জন্য কেস রেকর্ড পাতায় উপলব্ধ।" },
    oc_open_voice: { en: "Open voice mode", bn: "ভয়েস মোড খুলুন" },
    oc_language: { en: "Language", bn: "ভাষা" },
    oc_language_desc: { en: "Use the বাংলা / English toggle in the top navigation.", bn: "উপরের নেভিগেশনে বাংলা / English টগল ব্যবহার করুন।" },
    oc_voice_mode_desc_intake: { en: "This intake page is voice-first: use the microphone, the \"read my application back\" button, and phone-call verification below without needing to read the screen.", bn: "এই ইনটেক পাতাটি ভয়েস-ফার্স্ট: স্ক্রিন না পড়েই মাইক্রোফোন, \"আমার আবেদন পড়ে শোনান\" বাটন এবং নিচের ফোন-কল যাচাইকরণ ব্যবহার করুন।" },
    intake_step: { en: "Step 2 of 5 · Voice intake", bn: "৫টির মধ্যে ধাপ ২ · ভয়েস ইনটেক" },
    intake_h1: { en: "AI-Assisted Voice Intake", bn: "এআই-সহায়তায় ভয়েস ইনটেক" },
    intake_lead: { en: "Tell us what happened. LegalBridge will organize the information for a human officer.", bn: "আমাদের বলুন কী ঘটেছে। লিগ্যালব্রিজ একজন মানব কর্মকর্তার জন্য তথ্য গুছিয়ে দেবে।" },
    intake_legal_basis_label: { en: "Legal basis:", bn: "আইনি ভিত্তি:" },
    intake_legal_basis_text: { en: "Maintenance and dowry-related claims fall under Schedule items 1 & 8 of the Legal Aid Services Act, 2000, to be read with Section 21Kha.", bn: "ভরণপোষণ ও যৌতুক-সম্পর্কিত দাবি লিগ্যাল এইড সার্ভিসেস অ্যাক্ট, ২০০০-এর তফসিল ১ ও ৮ ধারার অন্তর্ভুক্ত, যা ধারা ২১(ক)-এর সাথে পড়তে হবে।" },
    intake_district_label: { en: "Applicant's district", bn: "আবেদনকারীর জেলা" },
    intake_offline_label: { en: "Offline / UDC mode", bn: "অফলাইন / ইউডিসি মোড" },
    intake_offline_active: { en: "Offline mode active.", bn: "অফলাইন মোড সক্রিয়।" },
    intake_offline_desc: { en: "The application is being taken without an internet connection and stored on this device.", bn: "ইন্টারনেট সংযোগ ছাড়াই আবেদনটি নেওয়া হচ্ছে এবং এই ডিভাইসে সংরক্ষিত হচ্ছে।" },
    intake_offline_pending: { en: "3 applications pending — will sync automatically once a network is available.", bn: "৩টি আবেদন অপেক্ষমাণ — নেটওয়ার্ক পাওয়া গেলেই স্বয়ংক্রিয়ভাবে সিঙ্ক হবে।" },
    intake_offline_sync: { en: "Last sync: yesterday, 18:42", bn: "সর্বশেষ সিঙ্ক: গতকাল, ১৮:৪২" },
    intake_mic_ready: { en: "Ready", bn: "প্রস্তুত" },
    intake_mic_hint: { en: "Tap the microphone to begin, or use the fallback text option below.", bn: "শুরু করতে মাইক্রোফোনে চাপ দিন, অথবা নিচের টেক্সট অপশন ব্যবহার করুন।" },
    intake_fallback_summary: { en: "Prefer to type instead? Use the text fallback", bn: "টাইপ করতে চান? টেক্সট অপশন ব্যবহার করুন" },
    intake_fallback_label: { en: "Describe what happened", bn: "কী ঘটেছে তা বর্ণনা করুন" },
    intake_fallback_note: { en: "Speech recognition in this prototype is simulated. In a live product, an on-device or server option would be offered with this text fallback always available.", bn: "এই প্রোটোটাইপে স্পিচ রিকগনিশন সিমুলেটেড। একটি লাইভ পণ্যে অন-ডিভাইস বা সার্ভার অপশন থাকবে, এবং এই টেক্সট বিকল্পটিও সবসময় উপলব্ধ থাকবে।" },
    intake_safety_notice_title: { en: "AI safety notice", bn: "এআই নিরাপত্তা নোটিশ" },
    intake_safety_notice_text: { en: "AI does not determine eligibility, verify allegations, provide final legal advice, or decide case priority.", bn: "এআই যোগ্যতা নির্ধারণ, অভিযোগ যাচাই, চূড়ান্ত আইনি পরামর্শ প্রদান, বা মামলার অগ্রাধিকার নির্ধারণ করে না।" },
    intake_extract_heading: { en: "Information organized so far", bn: "এ পর্যন্ত সংগৃহীত তথ্য" },
    intake_extract_applicant: { en: "Applicant", bn: "আবেদনকারী" },
    intake_extract_source: { en: "Information source", bn: "তথ্যের উৎস" },
    intake_extract_source_value: { en: "Ripon — Brother", bn: "রিপন — ভাই" },
    intake_extract_verification: { en: "Verification", bn: "যাচাইকরণ" },
    intake_extract_pending: { en: "Pending", bn: "বাকি" },
    intake_extract_location: { en: "Location", bn: "অবস্থান" },
    intake_extract_indicators: { en: "Issue indicators", bn: "সমস্যার নির্দেশক" },
    intake_indicator_dv: { en: "Domestic violence", bn: "পারিবারিক সহিংসতা" },
    intake_indicator_financial: { en: "Financial support", bn: "আর্থিক সহায়তা" },
    intake_indicator_threat: { en: "Threat / coercion", bn: "হুমকি / জবরদস্তি" },
    intake_extract_na: { en: "Not available", bn: "উপলব্ধ নয়" },
    intake_extract_safe_comm: { en: "Safe communication", bn: "নিরাপদ যোগাযোগ" },
    intake_extract_safe_comm_value: { en: "Friday — ~20 minutes", bn: "শুক্রবার — আনুমানিক ২০ মিনিট" },
    intake_readaloud_title: { en: "Hear it back before you submit", bn: "জমা দেওয়ার আগে শুনে নিন" },
    intake_readaloud_desc: { en: "This reads the whole application aloud — useful for anyone who can't read the screen, like Ripon.", bn: "এটি পুরো আবেদনটি জোরে পড়ে শোনায় — যারা স্ক্রিন পড়তে পারেন না, যেমন রিপন, তাদের জন্য উপযোগী।" },
    intake_readaloud_btn: { en: "Read my full application aloud", bn: "আমার পুরো আবেদন পড়ে শোনান" },
    intake_readaloud_stop: { en: "Stop", bn: "থামুন" },
    intake_readaloud_yes: { en: "✅ Yes, that's correct", bn: "✅ হ্যাঁ, এটি সঠিক" },
    intake_readaloud_no: { en: "✏️ No, I need to fix something", bn: "✏️ না, কিছু ঠিক করা দরকার" },
    intake_vc_title: { en: "Phone-call verification", bn: "ফোন-কল যাচাইকরণ" },
    intake_vc_desc: { en: "No CAPTCHA, no SMS code to read — the code is spoken to you over a phone call to your registered safe number, and you confirm it on the keypad.", bn: "কোনো ক্যাপচা নেই, পড়ার জন্য কোনো এসএমএস কোড নেই — কোডটি আপনার নিবন্ধিত নিরাপদ নম্বরে ফোন কলে বলা হবে, এবং আপনি কিপ্যাডে তা নিশ্চিত করবেন।" },
    intake_vc_number_label: { en: "Number:", bn: "নম্বর:" },
    intake_vc_number_value: { en: "017XX-XXXXXX (registered safe number)", bn: "017XX-XXXXXX (নিবন্ধিত নিরাপদ নম্বর)" },
    intake_vc_callme: { en: "Call me", bn: "আমাকে কল করুন" },
    intake_vc_ringing: { en: "Calling…", bn: "কল করা হচ্ছে…" },
    intake_vc_speaking: { en: "Speaking the code…", bn: "কোড বলা হচ্ছে…" },
    intake_vc_enter_code: { en: "Enter the 4-digit code you heard. Time remaining:", bn: "আপনি যে ৪-সংখ্যার কোড শুনেছেন তা লিখুন। বাকি সময়:" },
    intake_vc_repeat: { en: "Hear the code again", bn: "আবার কোড শুনুন" },
    intake_vc_moretime: { en: "Give me more time", bn: "আরও সময় দিন" },
    intake_vc_callagain: { en: "Call again", bn: "আবার কল করুন" },
    intake_vc_verified: { en: "Verified. Thank you.", bn: "যাচাই সম্পন্ন। ধন্যবাদ।" },
    intake_vc_failed: { en: "We couldn't verify this automatically.", bn: "আমরা এটি স্বয়ংক্রিয়ভাবে যাচাই করতে পারিনি।" },
    intake_vc_speak_officer: { en: "👤 Speak to an officer instead", bn: "👤 পরিবর্তে একজন কর্মকর্তার সাথে কথা বলুন" },
    intake_vc_channel_demo: { en: "Channel-lock demo", bn: "চ্যানেল-লক ডেমো" },
    intake_vc_channel_desc: { en: "Verification calls only ever go to the registered safe number — never a number typed in on the spot. Try it with a blocked number:", bn: "যাচাইকরণ কল শুধুমাত্র নিবন্ধিত নিরাপদ নম্বরেই যায় — তাৎক্ষণিকভাবে টাইপ করা কোনো নম্বরে নয়। একটি ব্লক করা নম্বর দিয়ে চেষ্টা করুন:" },
    intake_vc_blocked_btn: { en: "Try calling the flagged handset instead", bn: "পরিবর্তে ফ্ল্যাগ করা হ্যান্ডসেটে কল করার চেষ্টা করুন" },
    intake_vc_note: { en: "Prototype note: the call is simulated in this browser demo. In production this is placed through the 16699 call-centre telephony (IVR/DTMF), so it works over any phone line — no internet or screen required.", bn: "প্রোটোটাইপ নোট: এই ব্রাউজার ডেমোতে কলটি সিমুলেটেড। প্রোডাকশনে এটি ১৬৬৯৯ কল-সেন্টার টেলিফোনির (IVR/DTMF) মাধ্যমে করা হয়, তাই এটি ইন্টারনেট বা স্ক্রিন ছাড়াই যেকোনো ফোন লাইনে কাজ করে।" },
    intake_continue_btn: { en: "Continue to Safety Screening", bn: "নিরাপত্তা যাচাইয়ে এগিয়ে যান" },
    intake_extract_empty: { en: "Extracted information will appear here once intake begins.", bn: "ইনটেক শুরু হলে সংগৃহীত তথ্য এখানে দেখা যাবে।" }
  };


  /* Fallback translation layer for the older pages whose HTML does not yet
     have data-i18n attributes. It translates visible static text nodes and
     lets the same বাংলা/English button control every page. */
  const LB_TEXT_BN = {
    "Skip to main content":"মূল কনটেন্টে যান",
    "Bridging Citizens to Justice.":"নাগরিকদের ন্যায়বিচারের সাথে সংযুক্ত করা।",
    "Home":"হোম", "Citizen Access":"নাগরিক প্রবেশাধিকার", "AI Intake":"এআই ইনটেক",
    "Safety":"নিরাপত্তা", "DLAO Dashboard":"ডিএলএও ড্যাশবোর্ড", "Mediation":"মধ্যস্থতা", "Case Record":"কেস রেকর্ড",
    "Emergency Help":"জরুরি সহায়তা", "Product":"প্রোডাক্ট", "About":"সম্পর্কে", "How It Works":"যেভাবে কাজ করে",
    "Trust":"বিশ্বাস", "Privacy":"গোপনীয়তা", "Legal Aid":"আইনি সহায়তা", "Contact (16699)":"যোগাযোগ (১৬৬৯৯)",
    "Prototype scope":"প্রোটোটাইপের পরিধি",
    "Step 3 of 5 · Safety screening":"৫টির মধ্যে ধাপ ৩ · নিরাপত্তা যাচাই",
    "Safety & Human Verification":"নিরাপত্তা ও মানব যাচাই",
    "Communication safety is a case requirement — nothing proceeds until it's confirmed.":"যোগাযোগের নিরাপত্তা কেসের একটি আবশ্যিক শর্ত — এটি নিশ্চিত না হওয়া পর্যন্ত কোনো কার্যক্রম এগোবে না।",
    "Legal basis:":"আইনি ভিত্তি:",
    "Verification of third-party information and emergency-support decisions — Section 8 (Emergency Legal Support) of the Legal Aid Services Act, 2000.":"তৃতীয় পক্ষের তথ্য যাচাই এবং জরুরি সহায়তা সংক্রান্ত সিদ্ধান্ত — Legal Aid Services Act, 2000-এর ধারা ৮ (জরুরি আইনি সহায়তা)।",
    "Communication safety is a case requirement.":"যোগাযোগের নিরাপত্তা কেসের একটি আবশ্যিক শর্ত।",
    "This case cannot proceed to direct contact until safety and verification steps are completed by a human officer.":"একজন মানব কর্মকর্তা নিরাপত্তা ও যাচাইয়ের ধাপগুলো সম্পন্ন না করা পর্যন্ত এই কেসে সরাসরি যোগাযোগ করা যাবে না।",
    "Information source":"তথ্যের উৎস", "Ripon — Third-party":"রিপন — তৃতীয় পক্ষ",
    "Verification":"যাচাই", "Not yet verified":"এখনও যাচাই করা হয়নি",
    "Safe contact window":"নিরাপদ যোগাযোগের সময়", "Friday • approximately 20 minutes":"শুক্রবার • প্রায় ২০ মিনিট",
    "Contact risk":"যোগাযোগের ঝুঁকি", "High":"উচ্চ", "Applicant's phone":"আবেদনকারীর ফোন",
    "Not safe for unscheduled contact":"পূর্বনির্ধারিত সময় ছাড়া যোগাযোগের জন্য নিরাপদ নয়",
    "NID":"এনআইডি", "Not currently accessible":"বর্তমানে পাওয়া যাচ্ছে না",
    "Schedule Safe Human Contact":"নিরাপদ মানব যোগাযোগের সময় নির্ধারণ করুন",
    "Escalate to Officer":"কর্মকর্তার কাছে এসকেলেট করুন", "Verification checklist":"যাচাইয়ের চেকলিস্ট",
    "Third-party information clearly identified":"তৃতীয় পক্ষের তথ্য স্পষ্টভাবে চিহ্নিত করা হয়েছে",
    "Safe communication window recorded":"নিরাপদ যোগাযোগের সময় রেকর্ড করা হয়েছে",
    "Unsafe handset communication blocked":"অনিরাপদ হ্যান্ডসেটে যোগাযোগ বন্ধ করা হয়েছে",
    "Human officer review required":"মানব কর্মকর্তার পর্যালোচনা প্রয়োজন",
    "Applicant safely verified":"আবেদনকারীকে নিরাপদভাবে যাচাই করা হয়েছে", "Consent confirmed":"সম্মতি নিশ্চিত করা হয়েছে",
    "Ripon's information is shown as unverified throughout the system until a human officer completes safe verification with Moyuri directly.":"একজন মানব কর্মকর্তা সরাসরি ময়ূরীর সাথে নিরাপদ যাচাই সম্পন্ন না করা পর্যন্ত পুরো সিস্টেমে রিপনের তথ্য যাচাই না-করা হিসেবে দেখানো হবে।",
    "Need immediate help?":"তাৎক্ষণিক সহায়তা প্রয়োজন?", "Call Legal Aid Helpline":"আইনি সহায়তা হেল্পলাইনে কল করুন",
    "Speak to Human Officer":"মানব কর্মকর্তার সাথে কথা বলুন", "Safety Guidance":"নিরাপত্তা নির্দেশনা",
    "Women & child abuse":"নারী ও শিশু নির্যাতন", "National emergency":"জাতীয় জরুরি সেবা",
    "Nearest district hospital":"নিকটস্থ জেলা হাসপাতাল", "Prototype interaction — not a live helpline connection.":"প্রোটোটাইপ ইন্টারঅ্যাকশন — এটি কোনো লাইভ হেল্পলাইন সংযোগ নয়।",
    "Accessibility":"অ্যাক্সেসিবিলিটি", "Text size":"লেখার আকার", "Adjust":"সমন্বয় করুন",
    "High contrast":"উচ্চ কনট্রাস্ট", "Reduced motion":"কম অ্যানিমেশন",
    "The Bangla interface on the intake flow has been tested with TalkBack (Android).":"ইনটেক প্রবাহের বাংলা ইন্টারফেস TalkBack (অ্যান্ড্রয়েড) দিয়ে পরীক্ষা করা হয়েছে।",

    "Step 4 of 5 · Human review":"৫টির মধ্যে ধাপ ৪ · মানব পর্যালোচনা",
    "Legal Aid Officer Dashboard":"আইনি সহায়তা কর্মকর্তা ড্যাশবোর্ড",
    "A working view for officers reviewing, verifying, and prioritizing cases across districts.":"বিভিন্ন জেলার কেস পর্যালোচনা, যাচাই ও অগ্রাধিকার নির্ধারণের জন্য কর্মকর্তাদের কার্যকরী ভিউ।",
    "Final prioritization and assistance decisions rest with the Legal Aid Officer — Section 21Ka(2) of the Legal Aid Services Act, 2000.":"চূড়ান্ত অগ্রাধিকার ও সহায়তার সিদ্ধান্ত আইনি সহায়তা কর্মকর্তার ওপর ন্যস্ত — Legal Aid Services Act, 2000-এর ধারা ২১ক(২)।",
    "STATS":"পরিসংখ্যান", "Urgent Cases":"জরুরি কেস", "High Priority":"উচ্চ অগ্রাধিকার",
    "Pending Verification":"যাচাই অপেক্ষমাণ", "Mediation":"মধ্যস্থতা", "PRIORITY PANEL":"অগ্রাধিকার প্যানেল",
    "Priority recommendation is decision-support only. Final prioritization remains with the Legal Aid Officer.":"অগ্রাধিকার সুপারিশ শুধুমাত্র সিদ্ধান্তে সহায়তার জন্য। চূড়ান্ত অগ্রাধিকার নির্ধারণ করবেন আইনি সহায়তা কর্মকর্তা।",
    "Immediate Risk":"তাৎক্ষণিক ঝুঁকি", "Vulnerability":"ঝুঁকিপ্রবণতা", "Time Sensitivity":"সময়ের সংবেদনশীলতা",
    "Missing information must not automatically reduce priority. Recommended priority for Moyuri's case:":"তথ্য অসম্পূর্ণ থাকলেই অগ্রাধিকার স্বয়ংক্রিয়ভাবে কমানো যাবে না। ময়ূরীর কেসের জন্য প্রস্তাবিত অগ্রাধিকার:",
    "Urgent Review":"জরুরি পর্যালোচনা", "Review Case":"কেস পর্যালোচনা করুন", "CASE TABLE":"কেস টেবিল",
    "Case queue":"কেসের সারি", "Filter by district":"জেলা অনুযায়ী ফিল্টার", "All districts":"সব জেলা",
    "Search cases":"কেস খুঁজুন", "Click a risk, vulnerability, or urgency flag to see the statement it was drawn from.":"ঝুঁকি, ঝুঁকিপ্রবণতা বা জরুরি চিহ্নে ক্লিক করে এর ভিত্তির তথ্য দেখুন।",
    "🔴 Escalate":"🔴 এসকেলেট করুন", "marks files untouched for 7+ days.":"৭ দিন বা তার বেশি সময় কোনো কাজ না হওয়া ফাইল চিহ্নিত করে।",
    "Case queue for legal aid officers":"আইনি সহায়তা কর্মকর্তাদের কেসের সারি", "Case":"কেস", "Location":"অবস্থান",
    "Risk":"ঝুঁকি", "Urgency":"জরুরিতা", "Recommended Priority":"প্রস্তাবিত অগ্রাধিকার", "Status":"অবস্থা", "Days":"দিন", "Action":"কাজ",
    "Rendered by js/app.js from mock data":"mock data থেকে js/app.js দ্বারা দেখানো হয়েছে", "Change priority":"অগ্রাধিকার পরিবর্তন",
    "New priority":"নতুন অগ্রাধিকার", "Urgent":"জরুরি", "Standard":"সাধারণ", "Reason (required)":"কারণ (আবশ্যক)",
    "Cancel":"বাতিল", "Save & log":"সংরক্ষণ ও লগ করুন", "RISK FLAG DETAIL MODAL (P1.3)":"ঝুঁকি চিহ্নের বিস্তারিত (P1.3)", "Why is this flagged?":"এটি কেন চিহ্নিত করা হয়েছে?",

    "Step 5 of 5 · Resolution":"৫টির মধ্যে ধাপ ৫ · সমাধান",
    "Digital Mediation & ODR":"ডিজিটাল মধ্যস্থতা ও ODR",
    "A structured path from intake to a certified, recorded agreement — with a human-controlled stop at every stage.":"ইনটেক থেকে প্রত্যয়িত ও রেকর্ডকৃত চুক্তি পর্যন্ত একটি কাঠামোবদ্ধ পথ — প্রতিটি ধাপে মানব কর্মকর্তার নিয়ন্ত্রণে থামার সুযোগ রয়েছে।",
    "Mandatory pre-litigation mediation — Section 21Kha. Provisions governing the mediation agreement — Section 21Ga, Legal Aid Services Act, 2000.":"মামলা করার আগে বাধ্যতামূলক মধ্যস্থতা — ধারা ২১খ। মধ্যস্থতা চুক্তির বিধান — ধারা ২১গ, Legal Aid Services Act, 2000।",
    "Mediation process":"মধ্যস্থতার প্রক্রিয়া", "Citizen Entry":"নাগরিক প্রবেশ", "Eligibility / Intake":"যোগ্যতা / ইনটেক",
    "Safety Screening":"নিরাপত্তা যাচাই", "Suitable for Mediation?":"মধ্যস্থতার জন্য উপযুক্ত?", "Mediator":"মধ্যস্থতাকারী",
    "Agreement":"চুক্তি", "Certification":"সনদায়ন", "Secure Record":"নিরাপদ রেকর্ড", "Follow-up":"ফলো-আপ",
    "Every mediation-eligible matter is screened individually. These two cases show why the outcome differs — the system's judgment, not a script.":"মধ্যস্থতার যোগ্য প্রতিটি বিষয় আলাদাভাবে যাচাই করা হয়। এই দুটি কেস দেখায় কেন ফলাফল ভিন্ন — এটি সিস্টেমের সিদ্ধান্ত, কোনো পূর্বনির্ধারিত স্ক্রিপ্ট নয়।",
    "Track A — Moyuri's case (stops)":"ট্র্যাক A — ময়ূরীর কেস (থামে)", "Track B — Abdul Karim's case (proceeds)":"ট্র্যাক B — আবদুল করিমের কেস (এগোয়)",
    "TRACK A — STOPS":"ট্র্যাক A — থামে", "Case LB-2026-00124 · Moyuri":"কেস LB-2026-00124 · ময়ূরী",
    "Legal position":"আইনি অবস্থান", "Pre-litigation mediation mandatory (Schedule items 1 & 8, Section 21Kha)":"মামলার আগে মধ্যস্থতা বাধ্যতামূলক (তফসিলের ১ ও ৮ নম্বর বিষয়, ধারা ২১খ)",
    "Safety screening":"নিরাপত্তা যাচাই", "Independent, confidential participation could not be confirmed":"স্বাধীন ও গোপনীয় অংশগ্রহণ নিশ্চিত করা যায়নি",
    "System decision: joint online mediation is blocked.":"সিস্টেমের সিদ্ধান্ত: যৌথ অনলাইন মধ্যস্থতা বন্ধ করা হয়েছে।",
    "Referred to the DLAO as emergency legal support under Section 8. The next decision belongs to the Legal Aid Officer — not the system. Alternatives: separate / shuttle mediation, or a non-settlement certificate.":"ধারা ৮ অনুযায়ী জরুরি আইনি সহায়তার জন্য DLAO-এর কাছে পাঠানো হয়েছে। পরবর্তী সিদ্ধান্ত আইনি সহায়তা কর্মকর্তার — সিস্টেমের নয়। বিকল্প: পৃথক/শাটল মধ্যস্থতা অথবা অমীমাংসিত সনদ।",
    "Escalate to Human Legal Assistance":"মানব আইনি সহায়তার কাছে এসকেলেট করুন", "Generate Non-Settlement Certificate":"অমীমাংসিত সনদ তৈরি করুন",
    "TRACK B — PROCEEDS":"ট্র্যাক B — এগোয়", "Case LB-2026-00131 · Abdul Karim":"কেস LB-2026-00131 · আবদুল করিম",
    "House-rent dispute (Schedule item 2, House Rent Control Act, 1991).":"বাড়িভাড়া বিরোধ (তফসিলের ২ নম্বর বিষয়, House Rent Control Act, 1991)।",
    "Passed":"পাস হয়েছে", "Free participation":"স্বাধীন অংশগ্রহণ", "Required":"প্রয়োজনীয়", "Coercion detected":"জবরদস্তি শনাক্ত", "No":"না",
    "Suitable for mediation":"মধ্যস্থতার জন্য উপযুক্ত", "Yes":"হ্যাঁ", "Safety and voluntariness confirmed. Mediation proceeds.":"নিরাপত্তা ও স্বেচ্ছাসম্মতি নিশ্চিত হয়েছে। মধ্যস্থতা এগিয়ে যাবে।",
    "Start Mediation":"মধ্যস্থতা শুরু করুন", "Stop condition":"থামার শর্ত",
    "Online mediation must stop when safe and voluntary participation cannot be ensured.":"নিরাপদ ও স্বেচ্ছামূলক অংশগ্রহণ নিশ্চিত করা না গেলে অনলাইন মধ্যস্থতা বন্ধ করতে হবে।",
    "This applies when there is:":"এটি প্রযোজ্য যখন রয়েছে:", "An immediate safety threat":"তাৎক্ষণিক নিরাপত্তা হুমকি", "Intimidation or coercion":"ভয় দেখানো বা জবরদস্তি",
    "A participant who cannot participate freely":"স্বাধীনভাবে অংশ নিতে না-পারা অংশগ্রহণকারী", "A matter unsuitable for online mediation":"অনলাইন মধ্যস্থতার জন্য অনুপযুক্ত বিষয়",
    "NON-SETTLEMENT CERTIFICATE (P1.7)":"অমীমাংসিত সনদ (P1.7)", "Non-Settlement Certificate":"অমীমাংসিত সনদ",
    "Certificate of Non-Settlement":"অমীমাংসিত থাকার সনদ", "Issued under the Legal Aid Services Act, 2000":"Legal Aid Services Act, 2000 অনুযায়ী জারি করা হয়েছে",
    "Case No.:":"কেস নম্বর:", "Date:":"তারিখ:", "Parties:":"পক্ষসমূহ:",
    "Moyuri (Applicant) and respondent named in case file":"ময়ূরী (আবেদনকারী) এবং কেস ফাইলে উল্লেখিত প্রতিপক্ষ",
    "Subject of dispute / Schedule item:":"বিরোধের বিষয় / তফসিলের বিষয়:", "Maintenance and dowry-related claim — Schedule items 1 & 8":"ভরণপোষণ ও যৌতুক-সংক্রান্ত দাবি — তফসিলের ১ ও ৮ নম্বর বিষয়",
    "Outcome:":"ফলাফল:", "Not resolved through mediation — joint online mediation halted on safety grounds under Section 8.":"মধ্যস্থতার মাধ্যমে সমাধান হয়নি — ধারা ৮ অনুযায়ী নিরাপত্তাজনিত কারণে যৌথ অনলাইন মধ্যস্থতা বন্ধ করা হয়েছে।",
    "Legal Aid Officer signature & seal:":"আইনি সহায়তা কর্মকর্তার স্বাক্ষর ও সিল:", "Verification code:":"যাচাই কোড:",
    "This lets the applicant proceed to court without being sent back and forth between office and courthouse.":"এর ফলে আবেদনকারীকে অফিস ও আদালতের মধ্যে বারবার যাতায়াত না করিয়ে আদালতে যাওয়ার সুযোগ দেওয়া হয়।",
    "Close":"বন্ধ করুন", "Download":"ডাউনলোড",

    "CASE RECORD":"কেস রেকর্ড", "Case Record":"কেস রেকর্ড", "Case timeline":"কেসের সময়রেখা",
    "Overview":"সারসংক্ষেপ", "Evidence":"প্রমাণ", "Communications":"যোগাযোগ", "Audit log":"অডিট লগ",
    "Case overview":"কেসের সারসংক্ষেপ", "Applicant":"আবেদনকারী", "Respondent":"প্রতিপক্ষ", "Issue":"বিষয়",
    "Case status":"কেসের অবস্থা", "Human verification pending":"মানব যাচাই অপেক্ষমাণ", "Third-party — Ripon":"তৃতীয় পক্ষ — রিপন",
    "Domestic violence":"পারিবারিক সহিংসতা", "Financial deprivation":"আর্থিক বঞ্চনা", "Threat / coercion":"হুমকি / জবরদস্তি",
    "Pending":"অপেক্ষমাণ", "Verified":"যাচাইকৃত", "Unverified":"যাচাই করা হয়নি",
    "Viewed safe window":"নিরাপদ যোগাযোগের সময় দেখা হয়েছে", "Break-glass: urgent verification":"জরুরি যাচাই: বিশেষ অনুমতিতে প্রবেশ",
    "Recorded":"রেকর্ড করা হয়েছে", "Officer review":"কর্মকর্তার পর্যালোচনা", "Third-party information":"তৃতীয় পক্ষের তথ্য",
    "Consent":"সম্মতি", "Safe contact":"নিরাপদ যোগাযোগ", "Priority":"অগ্রাধিকার", "Urgent Review":"জরুরি পর্যালোচনা",
    "Review":"পর্যালোচনা", "Review case":"কেস পর্যালোচনা করুন",
    "Mediation session step advanced.":"মধ্যস্থতার ধাপ এগিয়ে নেওয়া হয়েছে।",
    "Mediation paused. Case escalated to human legal assistance.":"মধ্যস্থতা স্থগিত করা হয়েছে। কেসটি মানব আইনি সহায়তার কাছে পাঠানো হয়েছে।",
    "Certificate downloaded.":"সনদ ডাউনলোড হয়েছে।",
    "Cannot send.":"পাঠানো সম্ভব নয়।",
    "Change priority":"অগ্রাধিকার পরিবর্তন", "Escalate":"এসকেলেট করুন"
  };

  function lbTranslateUnmarked(lang) {
    const root = document.body;
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT","STYLE","TEXTAREA"].includes(parent.tagName)) return;
      const raw = node.nodeValue;
      const key = raw.trim();
      if (!key) return;
      const translated = lang === "bn" ? LB_TEXT_BN[key] : null;
      if (translated) node.nodeValue = raw.replace(key, translated);
      else if (lang === "en") {
        const entry = Object.entries(LB_TEXT_BN).find(([,bn]) => bn === key);
        if (entry) node.nodeValue = raw.replace(key, entry[0]);
      }
    });
    document.documentElement.lang = lang === "bn" ? "bn" : "en";
  }

  function initLanguageToggle() {
    const toggle = document.getElementById("langToggle");
    if (!toggle) return;
    let lang = localStorage.getItem("lb_lang") || "en";

    function apply() {
      document.body.classList.toggle("bn-active", lang === "bn");

      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const entry = LB_I18N[el.dataset.i18n];
        if (entry) el.textContent = lang === "bn" ? entry.bn : entry.en;
      });
      // Backward-compatible support for elements using data-en / data-bn pairs.
      document.querySelectorAll("[data-en][data-bn]").forEach((el) => {
        el.textContent = lang === "bn" ? el.dataset.bn : el.dataset.en;
      });
      lbTranslateUnmarked(lang);
      if (typeof renderCaseTable === "function" && typeof LB_CASES !== "undefined") renderCaseTable(LB_CASES);

      toggle.textContent = lang === "bn" ? "English" : "বাংলা";
      toggle.setAttribute("lang", lang === "bn" ? "en" : "bn");
      toggle.setAttribute("aria-label", "Switch language, current language " + (lang === "bn" ? "Bangla" : "English"));
      document.documentElement.setAttribute("lang", lang === "bn" ? "bn" : "en");
    }
    apply();
    toggle.addEventListener("click", () => {
      lang = lang === "bn" ? "en" : "bn";
      localStorage.setItem("lb_lang", lang);
      apply();
      lbToast(lang === "bn" ? "ভাষা বাংলায় পরিবর্তন করা হয়েছে" : "Language switched to English", "success");
    });
  }

  /* ------------------------------------------------------------------
     6. EMERGENCY MODAL — prototype only, clearly labelled
     ------------------------------------------------------------------ */
  function initEmergencyModal() {
    document.querySelectorAll("[data-lb-emergency-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.lbEmergencyAction;
        if (action === "call") {
          lbToast("Prototype interaction — this would dial the 16699 legal aid helpline. Not a live connection.", "warning");
        } else if (action === "officer") {
          lbToast("Prototype interaction — a request to speak with a human officer has been simulated.", "success");
        } else if (action === "guidance") {
          lbToast("Prototype interaction — safety guidance would open here.", "success");
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     7. MOBILE-FRIENDLY CASE CARDS (used on dashboard for small screens)
     ------------------------------------------------------------------ */
  function riskPillClass(level) {
    if (level === "High") return "lb-pill-risk-high";
    if (level === "Medium") return "lb-pill-risk-med";
    return "lb-pill-risk-low";
  }

  const LB_OVERRIDES = {}; // caseId -> { priority, reason, by, date }

  function flagButton(caseId, kind, level) {
    const hasDetail = LB_CASE_FLAGS[caseId] && LB_CASE_FLAGS[caseId].length;
    if (!hasDetail) return `<span class="lb-pill ${riskPillClass(level)}">${level}</span>`;
    return `<button type="button" class="lb-flag-btn" data-flag-case="${caseId}" data-flag-kind="${kind}" style="width:auto;">
      <span class="lb-pill ${riskPillClass(level)}" style="cursor:pointer;">${level} <i class="bi bi-info-circle ms-1"></i></span>
    </button>`;
  }

  function renderCaseTable(cases) {
    const tbody = document.getElementById("caseTableBody");
    const mobileWrap = document.getElementById("caseMobileList");
    if (!tbody && !mobileWrap) return;

    if (tbody) {
      tbody.innerHTML = cases.map((c) => {
        const ov = LB_OVERRIDES[c.caseId];
        const priorityDisplay = ov ? ov.priority : c.priority;
        const escalate = c.days >= 7 ? '<span class="lb-pill" style="background:var(--lb-terracotta-100); color:var(--lb-terracotta-700); border-color:transparent;">🔴 Escalate</span>' : c.days + 'd';
        return `
        <tr>
          <td>
            <div class="fw-semibold">${c.name}</div>
            <div class="text-body-secondary small">${c.caseId}</div>
          </td>
          <td>${c.location}</td>
          <td>${flagButton(c.caseId, 'risk', c.risk)}</td>
          <td>${flagButton(c.caseId, 'vulnerability', c.vulnerability)}</td>
          <td>${flagButton(c.caseId, 'urgency', c.urgency)}</td>
          <td>
            <span class="lb-status-badge ${c.verification === 'Verified' ? 'lb-status-verified' : 'lb-status-unverified'}">
              <i class="bi ${c.verification === 'Verified' ? 'bi-patch-check-fill' : 'bi-hourglass-split'}"></i>${c.verification}
            </span>
          </td>
          <td class="fw-semibold small">
            ${priorityDisplay}
            <button type="button" class="btn btn-sm btn-lb-outline mt-1 d-block" data-override-case="${c.caseId}" data-override-name="${c.name}">Change priority</button>
            ${ov ? `<div class="lb-override-log">Priority changed — Legal Aid Officer · ${ov.date}<br>Reason: "${ov.reason}"</div>` : ""}
          </td>
          <td><span class="lb-pill">${c.status}</span></td>
          <td class="small">${escalate}</td>
          <td class="text-end">
            <a href="case.html" class="btn btn-sm btn-lb-outline">Review</a>
          </td>
        </tr>
      `; }).join("");
    }

    if (mobileWrap) {
      mobileWrap.innerHTML = cases.map((c) => {
        const ov = LB_OVERRIDES[c.caseId];
        const priorityDisplay = ov ? ov.priority : c.priority;
        return `
        <div class="lb-card p-3 mb-3">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <div class="fw-semibold">${c.name}</div>
              <div class="text-body-secondary small">${c.caseId} · ${c.location}</div>
            </div>
            <span class="lb-status-badge ${c.verification === 'Verified' ? 'lb-status-verified' : 'lb-status-unverified'}">
              <i class="bi ${c.verification === 'Verified' ? 'bi-patch-check-fill' : 'bi-hourglass-split'}"></i>${c.verification}
            </span>
          </div>
          <div class="d-flex flex-wrap gap-2 mb-2">
            ${flagButton(c.caseId, 'risk', c.risk)}
            ${flagButton(c.caseId, 'vulnerability', c.vulnerability)}
            ${flagButton(c.caseId, 'urgency', c.urgency)}
          </div>
          <div class="small text-body-secondary mb-2">${priorityDisplay} · ${c.status} ${c.days >= 7 ? "· 🔴 Escalate" : ""}</div>
          <button type="button" class="btn btn-sm btn-lb-outline w-100 mb-2" data-override-case="${c.caseId}" data-override-name="${c.name}">Change priority</button>
          <a href="case.html" class="btn btn-sm btn-lb-outline w-100">Review case</a>
        </div>
      `; }).join("");
    }

    // Wire flag buttons
    document.querySelectorAll("[data-flag-case]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const caseId = btn.dataset.flagCase;
        const details = LB_CASE_FLAGS[caseId] || [];
        const body = document.getElementById("flagModalBody");
        if (!body) return;
        body.innerHTML = details.map((d) => `
          <div class="lb-flag-source mb-2">
            <div class="fw-semibold small mb-1">${d.flag}</div>
            <div class="lb-flag-quote">${d.quote}</div>
            <div class="lb-flag-meta small">Source: ${d.source}</div>
          </div>
        `).join("") + '<p class="small text-body-secondary mb-0"><i class="bi bi-exclamation-circle me-1"></i>Shown to support officer judgment — this is not a verified fact.</p>';
        const modalEl = document.getElementById("flagModal");
        if (modalEl && window.bootstrap) new bootstrap.Modal(modalEl).show();
      });
    });

    // Wire override buttons
    document.querySelectorAll("[data-override-case]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const caseId = btn.dataset.overrideCase;
        const label = document.getElementById("overrideCaseLabel");
        if (label) label.textContent = "Case " + caseId + " — " + btn.dataset.overrideName;
        const saveBtn = document.getElementById("overrideSaveBtn");
        if (saveBtn) saveBtn.dataset.activeCase = caseId;
        const modalEl = document.getElementById("overrideModal");
        if (modalEl && window.bootstrap) new bootstrap.Modal(modalEl).show();
      });
    });
  }

  function initOverrideModal() {
    const saveBtn = document.getElementById("overrideSaveBtn");
    if (!saveBtn) return;
    saveBtn.addEventListener("click", () => {
      const caseId = saveBtn.dataset.activeCase;
      const priority = document.getElementById("overridePriority").value;
      const reason = document.getElementById("overrideReason").value.trim();
      if (!reason) { lbToast("A reason is required to change priority.", "warning"); return; }
      const today = new Date();
      LB_OVERRIDES[caseId] = { priority, reason, date: today.toLocaleDateString() };
      const modalEl = document.getElementById("overrideModal");
      if (modalEl && window.bootstrap) bootstrap.Modal.getOrCreateInstance(modalEl).hide();
      document.getElementById("overrideReason").value = "";
      applyDashboardFilters();
      lbToast("Priority changed and logged.", "success");
    });
  }

  function applyDashboardFilters() {
    const searchInput = document.getElementById("caseSearch");
    const districtSelect = document.getElementById("districtFilter");
    const q = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const district = districtSelect ? districtSelect.value : "";
    const filtered = LB_CASES.filter((c) =>
      (!district || c.district === district) &&
      (c.name.toLowerCase().includes(q) ||
       c.location.toLowerCase().includes(q) ||
       c.type.toLowerCase().includes(q) ||
       c.caseId.toLowerCase().includes(q))
    );
    renderCaseTable(filtered);
  }

  function initDashboardFilter() {
    const searchInput = document.getElementById("caseSearch");
    if (!searchInput) return;
    const districtSelect = document.getElementById("districtFilter");
    if (districtSelect) {
      const districts = Array.from(new Set(LB_CASES.map((c) => c.district))).sort();
      districtSelect.innerHTML = '<option value="">All districts</option>' +
        districts.map((d) => `<option value="${d}">${d}</option>`).join("");
      districtSelect.addEventListener("change", applyDashboardFilters);
    }
    renderCaseTable(LB_CASES);
    searchInput.addEventListener("input", applyDashboardFilters);
    initOverrideModal();
  }

  /* ------------------------------------------------------------------
     7b. DISTRICT ROLLOUT STATUS — Section 21Kha (intake.html, P1.2)
     ------------------------------------------------------------------ */
  function initDistrictStatus() {
    const select = document.getElementById("districtSelect");
    const badge = document.getElementById("districtStatusBadge");
    if (!select || !badge) return;
    const districts = Object.keys(LB_S21KHA_DISTRICTS).sort();
    select.innerHTML = districts.map((d) => `<option value="${d}">${d}</option>`).join("");
    select.value = "Joypurhat"; // matches Moyuri's case for the demo

    function update() {
      const d = select.value;
      const active = LB_S21KHA_DISTRICTS[d];
      if (active) {
        badge.innerHTML = `<i class="bi bi-patch-check-fill" style="color:var(--lb-risk-low);"></i>
          <span><strong>${d}</strong> — Section 21Kha in force. <span class="text-body-secondary">Routing: direct legal aid or mediation, applicant's choice.</span></span>`;
      } else {
        badge.innerHTML = `<i class="bi bi-hourglass-split" style="color:var(--lb-gold-600);"></i>
          <span><strong>${d}</strong> — Section 21Kha in force: verification needed. <span class="text-body-secondary">Routing: mediation-first / direct legal aid.</span></span>`;
      }
    }
    update();
    select.addEventListener("change", update);
  }

  /* ------------------------------------------------------------------
     7c. OFFLINE / UDC MODE (intake.html, P1.8)
     ------------------------------------------------------------------ */
  function initOfflineMode() {
    const toggle = document.getElementById("offlineModeToggle");
    const banner = document.getElementById("offlineModeBanner");
    if (!toggle || !banner) return;
    toggle.addEventListener("change", () => {
      banner.hidden = !toggle.checked;
      if (toggle.checked) {
        banner.classList.add("lb-reveal");
        lbToast("Offline mode on — this application will be stored on the device and synced later.", "warning");
      }
    });
  }

  /* ------------------------------------------------------------------
     7d. READ MY APPLICATION ALOUD (intake.html, P1.11)
     ------------------------------------------------------------------ */
  function initReadAloud() {
    const btn = document.getElementById("readAloudBtn");
    if (!btn) return;
    const stopBtn = document.getElementById("readAloudStopBtn");
    const log = document.getElementById("readAloudLog");
    const confirmBox = document.getElementById("readAloudConfirm");

    const summaryLines = [
      "Reading your application back to you.",
      "Submitted by: Ripon, relationship: brother.",
      "On behalf of: Moyuri, age 27.",
      "Address: Kalai, Joypurhat.",
      "Issue: ongoing domestic violence and financial deprivation.",
      "Safe contact: Friday, approximately 20 minutes.",
      "National ID: not yet provided, to be verified later.",
      "Is all of this correct?"
    ];

    function speak(lines) {
      log.innerHTML = "";
      stopBtn.hidden = false;
      confirmBox.hidden = true;
      let i = 0;
      function next() {
        if (i >= lines.length) {
          stopBtn.hidden = true;
          confirmBox.hidden = false;
          document.getElementById("readAloudYes").focus();
          return;
        }
        const line = document.createElement("div");
        line.textContent = lines[i];
        log.appendChild(line);
        i++;
        if (window.speechSynthesis) {
          const utter = new SpeechSynthesisUtterance(lines[i - 1]);
          utter.rate = 0.95;
          utter.onend = () => setTimeout(next, 250);
          window.speechSynthesis.speak(utter);
        } else {
          setTimeout(next, 1200);
        }
      }
      next();
    }

    btn.addEventListener("click", () => speak(summaryLines));
    stopBtn.addEventListener("click", () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      stopBtn.hidden = true;
    });
    const yesBtn = document.getElementById("readAloudYes");
    const noBtn = document.getElementById("readAloudNo");
    if (yesBtn) yesBtn.addEventListener("click", () => lbToast("Confirmed. Thank you.", "success"));
    if (noBtn) noBtn.addEventListener("click", () => lbToast("No problem — use the text fallback above to make changes.", "warning"));
  }

  /* ------------------------------------------------------------------
     7e. VOICE CALLBACK VERIFICATION (intake.html, P1.12)
     ------------------------------------------------------------------ */
  function initVoiceCallback() {
    const callBtn = document.getElementById("vcCallBtn");
    if (!callBtn) return;
    const live = document.getElementById("vcLiveRegion");
    const idle = document.getElementById("vcIdle");
    const ringing = document.getElementById("vcRinging");
    const speaking = document.getElementById("vcSpeaking");
    const awaiting = document.getElementById("vcAwaiting");
    const verified = document.getElementById("vcVerified");
    const failed = document.getElementById("vcFailed");
    const dots = document.querySelectorAll("#vcDots span");
    const timerEl = document.getElementById("vcTimer");

    const DIGITS = "23456789"; // never 0 or 1 — spoken digits can be confused on a phone line
    let code = "";
    let entered = "";
    let attempts = 0;
    let seconds = 300;
    let timerId = null;

    function announce(msg) { if (live) live.textContent = msg; }
    function show(el) { [idle, ringing, speaking, awaiting, verified, failed].forEach((e) => { if (e) e.hidden = true; }); if (el) el.hidden = false; }

    function speakCode() {
      if (!window.speechSynthesis) return;
      const spoken = code.split("").join(", ");
      const utter = new SpeechSynthesisUtterance(
        "This is Legal Aid. Your verification code is " + spoken + ". Repeating. " + spoken + "."
      );
      utter.rate = 0.85;
      window.speechSynthesis.speak(utter);
    }

    function formatTimer() {
      const m = Math.floor(seconds / 60);
      const s = String(seconds % 60).padStart(2, "0");
      if (timerEl) timerEl.textContent = m + ":" + s;
    }

    function startCall() {
      code = Array.from({ length: 4 }, () => DIGITS[Math.floor(Math.random() * DIGITS.length)]).join("");
      entered = "";
      attempts = 0;
      seconds = 300;
      formatTimer();
      dots.forEach((d) => d.classList.remove("is-filled"));
      show(ringing);
      announce("Calling your registered number now.");
      setTimeout(() => {
        show(speaking);
        announce("Call connected. Speaking the code now.");
        speakCode();
        setTimeout(() => {
          show(awaiting);
          announce("Enter the code you heard on the keypad.");
          if (timerId) clearInterval(timerId);
          timerId = setInterval(() => {
            seconds = Math.max(0, seconds - 1);
            formatTimer();
          }, 1000);
        }, 2200);
      }, 1500);
    }

    function pressDigit(d) {
      if (entered.length >= 4) return;
      entered += d;
      dots[entered.length - 1].classList.add("is-filled");
      if (entered.length === 4) {
        if (entered === code) {
          if (timerId) clearInterval(timerId);
          show(verified);
          announce("Verified. Thank you.");
        } else {
          attempts++;
          entered = "";
          dots.forEach((d2) => d2.classList.remove("is-filled"));
          if (attempts >= 3) {
            if (timerId) clearInterval(timerId);
            show(failed);
            announce("We could not verify this automatically. Please speak to an officer.");
          } else {
            lbToast("That code didn't match — try again.", "warning");
          }
        }
      }
    }

    callBtn.addEventListener("click", startCall);
    document.querySelectorAll("#vcAwaiting [data-digit]").forEach((btn) => {
      btn.addEventListener("click", () => pressDigit(btn.dataset.digit));
    });
    const repeatBtn = document.getElementById("vcRepeatBtn");
    if (repeatBtn) repeatBtn.addEventListener("click", speakCode);
    const moreTimeBtn = document.getElementById("vcMoreTimeBtn");
    if (moreTimeBtn) moreTimeBtn.addEventListener("click", () => { seconds += 300; formatTimer(); lbToast("Added 5 more minutes.", "success"); });
    const recallBtn = document.getElementById("vcRecallBtn");
    if (recallBtn) recallBtn.addEventListener("click", startCall);

    const blockedBtn = document.getElementById("vcBlockedDemoBtn");
    const blockedResult = document.getElementById("vcBlockedResult");
    if (blockedBtn && blockedResult) {
      blockedBtn.addEventListener("click", () => {
        blockedResult.hidden = false;
        blockedResult.innerHTML = `<div class="lb-channel-block"><strong><i class="bi bi-x-octagon-fill me-1"></i>Call blocked.</strong> This number is flagged as an unsafe channel and is not the registered safe number. Verification calls can only go to the number on file.</div>`;
      });
    }
  }

  /* ------------------------------------------------------------------
     8. VOICE INTAKE SIMULATION (intake.html)
     ------------------------------------------------------------------ */
  function initVoiceIntake() {
    const micBtn = document.getElementById("micBtn");
    if (!micBtn) return;
    const stateLabel = document.getElementById("micStateLabel");
    const hint = document.getElementById("micHint");
    const wave = document.getElementById("micWave");
    const chat = document.getElementById("intakeChat");
    const extraction = document.getElementById("extractionResults");
    const continueBtn = document.getElementById("continueToSafety");

    let stage = "ready"; // ready -> listening -> processing -> completed

    function setStage(next) {
      stage = next;
      micBtn.classList.remove("is-listening", "is-processing");
      wave.classList.remove("is-active");

      if (stage === "ready") {
        stateLabel.textContent = "Ready";
        hint.textContent = "Tap the microphone to begin, or use the fallback text option below.";
        micBtn.setAttribute("aria-label", "Start voice intake");
      } else if (stage === "listening") {
        micBtn.classList.add("is-listening");
        wave.classList.add("is-active");
        stateLabel.textContent = "Listening…";
        hint.textContent = "Speak now. LegalBridge is capturing what you say.";
        micBtn.setAttribute("aria-label", "Stop listening");
      } else if (stage === "processing") {
        micBtn.classList.add("is-processing");
        stateLabel.textContent = "Processing…";
        hint.textContent = "AI is organizing this information for a human officer to review.";
      } else if (stage === "completed") {
        stateLabel.textContent = "Completed";
        hint.textContent = "Information captured. A human officer will review this intake.";
        micBtn.setAttribute("aria-label", "Restart voice intake");
      }
    }

    function appendChat(tag, text, from) {
      const msg = document.createElement("div");
      msg.className = "lb-chat-msg from-" + from;
      msg.innerHTML = '<span class="lb-chat-tag">' + tag + '</span>' + text;
      chat.appendChild(msg);
      chat.scrollTop = chat.scrollHeight;
    }

    function runExtraction() {
      extraction.hidden = false;
      extraction.classList.add("lb-reveal");
      if (continueBtn) continueBtn.disabled = false;
      lbToast("Information organized for human officer review.", "success");
    }

    micBtn.addEventListener("click", () => {
      if (stage === "ready") {
        setStage("listening");
        appendChat("Ripon — Third-party (unverified)",
          "My sister Moyuri is being beaten by her husband. He does not give her proper support and is threatening another marriage unless she gets him a motorcycle.",
          "user");
        setTimeout(() => {
          setStage("processing");
        }, 2200);
        setTimeout(() => {
          appendChat("LegalBridge AI",
            "I understand. I will record this as information provided by a third party. I cannot verify these facts or make a legal decision. A human legal aid officer will review this.",
            "ai");
          setStage("completed");
          runExtraction();
        }, 4200);
      } else {
        setStage("ready");
        chat.innerHTML = "";
        extraction.hidden = true;
        if (continueBtn) continueBtn.disabled = true;
      }
    });

    setStage("ready");
  }

  /* ------------------------------------------------------------------
     9. SAFETY CHECKLIST (safety.html)
     ------------------------------------------------------------------ */
  function initSafetyChecklist() {
    const scheduleBtn = document.getElementById("scheduleContactBtn");
    if (!scheduleBtn) return;
    const escalateBtn = document.getElementById("escalateOfficerBtn");
    const verifiedItem = document.getElementById("checklistVerified");
    const consentItem = document.getElementById("checklistConsent");

    function markDone(item) {
      if (!item || item.classList.contains("is-done")) return;
      item.classList.remove("is-open");
      item.classList.add("is-done");
      item.querySelector(".lb-check-icon").innerHTML = '<i class="bi bi-check-lg"></i>';
    }

    scheduleBtn.addEventListener("click", () => {
      markDone(verifiedItem);
      lbToast("Safe human contact scheduled for Friday's contact window. Applicant's phone will not be contacted directly.", "success");
    });
    escalateBtn.addEventListener("click", () => {
      markDone(consentItem);
      lbToast("Case escalated to a Legal Aid Officer for direct review.", "warning");
    });
  }

  /* ------------------------------------------------------------------
     10. PRIORITY FACTOR PANEL (dashboard.html)
     ------------------------------------------------------------------ */
  function initPriorityPanel() {
    const reviewBtns = document.querySelectorAll("[data-priority-review]");
    reviewBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        lbToast("Opening case for officer review. Priority shown is decision-support only.", "success");
      });
    });
  }

  /* ------------------------------------------------------------------
     11. MEDIATION STEP PROGRESSION (mediation.html)
     ------------------------------------------------------------------ */
  function initMediationStepper() {
    const startBtn = document.getElementById("startMediationBtn");
    if (!startBtn) return;
    const items = document.querySelectorAll(".lb-stepper-item");
    startBtn.addEventListener("click", () => {
      let currentIdx = -1;
      items.forEach((item, i) => { if (item.classList.contains("is-current")) currentIdx = i; });
      if (currentIdx > -1 && currentIdx < items.length - 1) {
        items[currentIdx].classList.remove("is-current");
        items[currentIdx].classList.add("is-done");
        items[currentIdx].querySelector(".lb-stepper-dot").innerHTML = '<i class="bi bi-check-lg"></i>';
        items[currentIdx + 1].classList.add("is-current");
      }
      lbToast("Mediation session step advanced.", "success");
    });

    const escalateBtn = document.getElementById("mediationEscalateBtn");
    if (escalateBtn) {
      escalateBtn.addEventListener("click", () => {
        lbToast("Mediation paused. Case escalated to human legal assistance.", "danger");
      });
    }
  }

  /* ------------------------------------------------------------------
     11b. MEDIATION TWO-TRACK SWITCHER (mediation.html, P1.1 / P0.5)
     ------------------------------------------------------------------ */
  function initMediationTracks() {
    const tabs = document.querySelectorAll("[data-track-tab]");
    if (!tabs.length) return;
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => { t.classList.remove("is-active"); t.setAttribute("aria-selected", "false"); });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");
        document.querySelectorAll(".lb-track-panel").forEach((p) => p.classList.remove("is-active"));
        const panel = document.getElementById("track-" + tab.dataset.trackTab);
        if (panel) panel.classList.add("is-active");
      });
    });
  }

  /* ------------------------------------------------------------------
     11c. NON-SETTLEMENT CERTIFICATE (mediation.html, P1.7)
     ------------------------------------------------------------------ */
  function initCertificate() {
    const openBtn = document.getElementById("certOpenBtn");
    if (!openBtn) return;
    const dateEl = document.getElementById("certDate");
    openBtn.addEventListener("click", () => {
      if (dateEl) dateEl.textContent = new Date().toLocaleDateString();
      const modalEl = document.getElementById("certModal");
      if (modalEl && window.bootstrap) new bootstrap.Modal(modalEl).show();
    });
    const downloadBtn = document.getElementById("certDownloadBtn");
    if (downloadBtn) downloadBtn.addEventListener("click", () => {
      const area = document.getElementById("certPrintArea");
      const html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Non-Settlement Certificate — LB-2026-00124</title></head><body>" + area.innerHTML + "</body></html>";
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "non-settlement-certificate-LB-2026-00124.html";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      lbToast("Certificate downloaded.", "success");
    });
  }

  /* ------------------------------------------------------------------
     12. RIPON ACCESSIBILITY / VOICE MODE (case.html or standalone)
     ------------------------------------------------------------------ */
  function initVoiceAccessMode() {
    const toggle = document.getElementById("voiceModeToggle");
    const panel = document.getElementById("voiceModePanel");
    if (!toggle || !panel) return;

    toggle.addEventListener("change", () => {
      panel.hidden = !toggle.checked;
      if (toggle.checked) {
        panel.classList.add("lb-reveal");
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    const statusText = "Your sister's case is currently waiting for safe human verification.";
    const repeatBtn = document.getElementById("voiceRepeatBtn");
    const statusBtn = document.getElementById("voiceStatusBtn");
    const speakLog = document.getElementById("voiceSpeakLog");

    function speak(tag, text) {
      const line = document.createElement("div");
      line.className = "small mb-2";
      line.innerHTML = '<strong>' + tag + ':</strong> ' + text;
      speakLog.appendChild(line);
      speakLog.scrollTop = speakLog.scrollHeight;
    }

    if (statusBtn) statusBtn.addEventListener("click", () => {
      speak("System", statusText);
    });
    if (repeatBtn) repeatBtn.addEventListener("click", () => {
      speak("User", "Repeat");
      speak("System", statusText);
    });

    const confirmBtn = document.getElementById("voiceConfirmBtn");
    if (confirmBtn) confirmBtn.addEventListener("click", () => {
      speak("System", "Your confirmation has been recorded and sent to the legal aid officer.");
    });

    const officerBtn = document.getElementById("voiceOfficerBtn");
    if (officerBtn) officerBtn.addEventListener("click", () => {
      speak("System", "Connecting your request to a human officer. Someone will follow up on the recorded safe contact schedule.");
    });

    const reportBtn = document.getElementById("voiceReportBtn");
    if (reportBtn) reportBtn.addEventListener("click", () => {
      speak("System", "Please describe what happened after the tone. This will be marked as third-party, unverified information.");
    });
  }

  /* ------------------------------------------------------------------
     13. UNSAFE CHANNEL SMS BLOCK DEMO (case.html, P1.5)
     ------------------------------------------------------------------ */
  function initSmsBlockDemo() {
    const btn = document.getElementById("sendSmsBtn");
    const result = document.getElementById("smsBlockResult");
    if (!btn || !result) return;
    btn.addEventListener("click", () => {
      result.hidden = false;
      result.innerHTML = `
        <div class="lb-channel-block">
          <p class="mb-1"><strong><i class="bi bi-x-octagon-fill me-1"></i>Cannot send.</strong> Moyuri's handset (017XX-XXXXXX) is flagged as an unsafe channel. Reason: this handset is controlled by another member of the household.</p>
          <p class="mb-2 small">Alternative: send to Ripon's number instead? (Friday 13:00–13:30)</p>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-lb-primary" id="smsSendRiponBtn" type="button">Yes, send to Ripon's number</button>
            <button class="btn btn-sm btn-lb-outline" type="button" id="smsCancelBtn">Cancel</button>
          </div>
        </div>`;
      const sendRipon = document.getElementById("smsSendRiponBtn");
      const cancel = document.getElementById("smsCancelBtn");
      if (sendRipon) sendRipon.addEventListener("click", () => {
        lbToast("Update scheduled to send to Ripon's number during the safe window.", "success");
        result.hidden = true;
      });
      if (cancel) cancel.addEventListener("click", () => { result.hidden = true; });
    });
  }

  /* ------------------------------------------------------------------
     INIT
     ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    setActiveNav();
    initAccessibilityPanel();
    initLanguageToggle();
    initEmergencyModal();
    initDashboardFilter();
    initDistrictStatus();
    initOfflineMode();
    initReadAloud();
    initVoiceCallback();
    initVoiceIntake();
    initSafetyChecklist();
    initPriorityPanel();
    initMediationStepper();
    initVoiceAccessMode();
    initSmsBlockDemo();
    initMediationTracks();
    initCertificate();

    // Enable Bootstrap tooltips if any are present
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
      new bootstrap.Tooltip(el);
    });
  });
})();
