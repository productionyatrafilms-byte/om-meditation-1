const btnEn = document.querySelector(".english");
const btnHi = document.querySelector(".hindi");
const btnGu = document.querySelector(".gujrati");

const DEFAULT_LANG = "English";
const STORAGE_KEY = "selectedLanguage";

let translations = {};

// ================= LANGUAGE AUDIO =================

const englishAudio = new Audio("./assets/audio/Eng.mpeg");
const hindiAudio = new Audio("./assets/audio/Hin.mpeg");
const gujaratiAudio = new Audio("./assets/audio/Guj.mpeg");

let currentAudio = null;

function playLanguageAudio(audio) {
  // Stop previous language audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = audio;
  currentAudio.currentTime = 0;

  currentAudio.play().catch((err) => {
    console.error("Audio play error:", err);
  });
}

// ================= LANDSCAPE ALERT =================

let landscapeAlertShown = false;

function checkScreenSize() {
  const isMobile =
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  if (isMobile && window.innerWidth < 768) {
    if (!landscapeAlertShown) {
      landscapeAlertShown = true;
      alert("Please use Landscape!");
    }
  } else {
    landscapeAlertShown = false;
  }
}

window.addEventListener("load", checkScreenSize);
window.addEventListener("resize", checkScreenSize);

// ================= ACTIVE BUTTON =================

function setActiveButton(activeBtn) {
  [btnEn, btnHi, btnGu].forEach((btn) => {
    if (btn) {
      btn.classList.remove("active");
    }
  });

  if (activeBtn) {
    activeBtn.classList.add("active");
  }
}

// ================= APPLY LANGUAGE =================

function applyLanguage(lang) {
  const langData = translations[lang];

  if (!langData) return;

  document.documentElement.lang = lang;

  if (lang === "English") {
    document.body.setAttribute("data-lang", "en");
    setActiveButton(btnEn);
  } else if (lang === "Hindi") {
    document.body.setAttribute("data-lang", "hi");
    setActiveButton(btnHi);
  } else if (lang === "Gujarati") {
    document.body.setAttribute("data-lang", "gu");
    setActiveButton(btnGu);
  }

  document.querySelectorAll("[data-lang-key]").forEach((el) => {
    const key = el.getAttribute("data-lang-key");

    if (langData[key] !== undefined) {
      el.innerHTML = String(langData[key]).replace(/\n/g, "<br>");
    }
  });

  localStorage.setItem(STORAGE_KEY, lang);
}

// ================= DETECT REFRESH =================

function isPageRefresh() {
  const navEntries = performance.getEntriesByType("navigation");

  if (navEntries.length > 0) {
    return navEntries[0].type === "reload";
  }

  return performance.navigation.type === 1;
}

// ================= LOAD LANGUAGE =================

window.addEventListener("DOMContentLoaded", () => {
  fetch("./assets/json/data.json")
    .then((res) => res.json())
    .then((data) => {
      translations = data;

      let langToApply = DEFAULT_LANG;
      const savedLang = localStorage.getItem(STORAGE_KEY);

      if (isPageRefresh()) {
        // On refresh always reset to English
        langToApply = DEFAULT_LANG;
        localStorage.setItem(STORAGE_KEY, DEFAULT_LANG);
      } else {
        // On normal page load / navigation keep selected language
        langToApply = savedLang || DEFAULT_LANG;
      }

      applyLanguage(langToApply);
    })
    .catch((err) => {
      console.error("Error loading translations:", err);
    });
});

// ================= LANGUAGE BUTTON CLICKS =================

// English button
if (btnEn) {
  btnEn.addEventListener("click", () => {
    applyLanguage("English");
    playLanguageAudio(englishAudio);
  });
}

// Hindi button
if (btnHi) {
  btnHi.addEventListener("click", () => {
    applyLanguage("Hindi");
    playLanguageAudio(hindiAudio);
  });
}

// Gujarati button
if (btnGu) {
  btnGu.addEventListener("click", () => {
    applyLanguage("Gujarati");
    playLanguageAudio(gujaratiAudio);
  });
}