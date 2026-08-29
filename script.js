/* =========================================================
   BIRTHDAY SURPRISE — SCRIPT (LUXE EDITION v2)
   ========================================================= */

const birthdayConfig = {
  name: "توته",
  music: "music.mp3"
};

const MESSAGES = {
  screen2Title: "كل سنة وإنتِ طيبة يا [NAME] ❤️",

  screen2Lines: [
    "يمكن الهدية دي بسيطة،\nبس أنا حبيت أعمل حاجة مختلفة مخصوص ليكي.",
    "مش كل الناس اللي بنقابلهم في حياتنا بيبقوا مجرد صحاب،\nفي ناس وجودهم بيخلّي الأيام أخف،\nوالضحكة أسهل،\nوالذكريات أحلى.",
    "وإنتِ واحدة من الناس دي عندي.",
    "فـ في يومك،\nأتمنى لك سنة جديدة تكون أحلى من كل اللي فات،\nوتحققي فيها حاجات كتير نفسك فيها،\nوتفضلي دايمًا بنفس الروح الحلوة اللي تخلي وجودك مميز.",
    "كل سنة وإنتِ بخير،\nوكل سنة وإنتِ مبسوطة،\nويا رب أفضل أشوفك دايمًا بتضحكي ❤️",
    "Happy Birthday 🎂✨"
  ],

  finalLines: [
    { text: "آخر حاجة بقى...", type: "normal" },
    { text: "مهما كبرت الأيام واتغيرت حاجات كتير،\nأتمنى إن ضحكتك تفضل زي ما هي ❤️", type: "normal" },
    { text: "عيد ميلاد سعيد يا [NAME] 🎂", type: "title" },
    { text: "وخلّي السنة دي أحلى سنة ليكي.", type: "normal" },
    { text: "— من شخص بيتمنى لك كل حاجة حلوة ❤️", type: "signature" }
  ]
};

/* =========================================================
   HELPERS
   ========================================================= */
function applyName(str) {
  return str.replaceAll("[NAME]", birthdayConfig.name);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* =========================================================
   WORD-BY-WORD LINE BUILDER
   wordStepSec controls the pace between each word's reveal —
   raised for a calmer, more deliberate feel.
   ========================================================= */
function buildWordLine(rawLine, extraClass, wordStepSec = 0.08) {
  const lineEl = document.createElement("p");
  lineEl.className = "message-line" + (extraClass ? " " + extraClass : "");

  let wordIndex = 0;
  const parts = rawLine.split("\n");

  parts.forEach((part, partIdx) => {
    const words = part.split(" ").filter((w) => w.length > 0);
    words.forEach((word) => {
      const span = document.createElement("span");
      span.className = "word-reveal";
      span.textContent = word;
      span.style.animationDelay = `${wordIndex * wordStepSec}s`;
      lineEl.appendChild(span);
      lineEl.appendChild(document.createTextNode(" "));
      wordIndex++;
    });
    if (partIdx < parts.length - 1) {
      lineEl.appendChild(document.createElement("br"));
    }
  });

  return { lineEl, wordCount: wordIndex };
}

/* Small ✨ flash placed at the start of a line as it begins revealing */
function addLineSpark(lineEl) {
  const spark = document.createElement("span");
  spark.className = "line-spark";
  spark.textContent = "✨";
  lineEl.insertBefore(spark, lineEl.firstChild);
}

/* =========================================================
   BACKGROUND: ANIMATED STARS (canvas)
   ========================================================= */
const starsCanvas = document.getElementById("stars-canvas");
const starsCtx = starsCanvas.getContext("2d");
let stars = [];

function resizeStarsCanvas() {
  starsCanvas.width = window.innerWidth;
  starsCanvas.height = window.innerHeight;
}

function createStars() {
  const count = Math.floor((window.innerWidth * window.innerHeight) / 6000);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * starsCanvas.width,
    y: Math.random() * starsCanvas.height,
    radius: Math.random() * 1.3 + 0.3,
    baseAlpha: Math.random() * 0.6 + 0.2,
    twinkleSpeed: Math.random() * 0.02 + 0.005,
    phase: Math.random() * Math.PI * 2
  }));
}

function drawStars(time) {
  starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
  for (const star of stars) {
    const alpha = star.baseAlpha + Math.sin(time * star.twinkleSpeed + star.phase) * 0.25;
    starsCtx.beginPath();
    starsCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    starsCtx.fillStyle = `rgba(245, 243, 255, ${Math.max(0, alpha)})`;
    starsCtx.fill();
  }
  requestAnimationFrame(drawStars);
}

resizeStarsCanvas();
createStars();
requestAnimationFrame(drawStars);
window.addEventListener("resize", () => {
  resizeStarsCanvas();
  createStars();
});

/* =========================================================
   BACKGROUND: FLOATING PARTICLES
   ========================================================= */
const particlesContainer = document.getElementById("particles-container");

function spawnParticle() {
  const particle = document.createElement("div");
  const isGold = Math.random() < 0.35;
  particle.className = "particle" + (isGold ? " gold" : "");
  const size = Math.random() * 4 + 2;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.bottom = `-10px`;
  particle.style.setProperty("--drift", `${(Math.random() - 0.5) * 80}px`);
  particle.style.animationDuration = `${Math.random() * 8 + 10}s`;
  particlesContainer.appendChild(particle);
  setTimeout(() => particle.remove(), 19000);
}

setInterval(spawnParticle, 550);
for (let i = 0; i < 16; i++) {
  setTimeout(spawnParticle, i * 250);
}

/* =========================================================
   CONFETTI — now mixes rectangles and circles for a
   classier, less "office party" look.
   ========================================================= */
const confettiCanvas = document.getElementById("confetti-canvas");
const confettiCtx = confettiCanvas.getContext("2d");
let confettiPieces = [];
let confettiAnimating = false;

function resizeConfettiCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeConfettiCanvas();
window.addEventListener("resize", resizeConfettiCanvas);

const confettiColors = ["#9b6bff", "#ff7ac6", "#ffd88a", "#f5f3ff", "#ff9fd6", "#fff2cf"];

function launchConfetti() {
  confettiPieces = Array.from({ length: 120 }, () => ({
    x: confettiCanvas.width / 2 + (Math.random() - 0.5) * 60,
    y: confettiCanvas.height * 0.45,
    vx: (Math.random() - 0.5) * 9,
    vy: Math.random() * -10 - 3,
    size: Math.random() * 6 + 4,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    shape: Math.random() < 0.5 ? "rect" : "circle",
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 12,
    gravity: 0.22,
    life: 0,
    maxLife: 140 + Math.random() * 40
  }));

  if (!confettiAnimating) {
    confettiAnimating = true;
    requestAnimationFrame(animateConfetti);
  }
}

function animateConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  let stillAlive = false;
  for (const piece of confettiPieces) {
    piece.life++;
    if (piece.life > piece.maxLife) continue;
    stillAlive = true;

    piece.vy += piece.gravity * 0.05;
    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.rotation += piece.rotationSpeed;

    const fade = 1 - piece.life / piece.maxLife;

    confettiCtx.save();
    confettiCtx.translate(piece.x, piece.y);
    confettiCtx.rotate((piece.rotation * Math.PI) / 180);
    confettiCtx.globalAlpha = Math.max(0, fade);
    confettiCtx.fillStyle = piece.color;

    if (piece.shape === "circle") {
      confettiCtx.beginPath();
      confettiCtx.arc(0, 0, piece.size / 2.4, 0, Math.PI * 2);
      confettiCtx.fill();
    } else {
      confettiCtx.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
    }

    confettiCtx.restore();
  }

  if (stillAlive) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiAnimating = false;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

/* =========================================================
   FLOATING HEARTS (screen 3 accent)
   ========================================================= */
let heartsInterval = null;

function startFloatingHearts() {
  const screen3 = document.getElementById("screen-3");
  heartsInterval = setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.textContent = ["💖", "✨", "💫", "🩷", "⭐"][Math.floor(Math.random() * 5)];
    heart.style.left = `${Math.random() * 90 + 5}%`;
    heart.style.setProperty("--drift", `${(Math.random() - 0.5) * 60}px`);
    heart.style.animationDuration = `${Math.random() * 4 + 6}s`;
    screen3.appendChild(heart);
    setTimeout(() => heart.remove(), 10500);
  }, 500);
}

function stopFloatingHearts() {
  if (heartsInterval) {
    clearInterval(heartsInterval);
    heartsInterval = null;
  }
  document.querySelectorAll(".floating-heart").forEach((el) => el.remove());
}

/* =========================================================
   MUSIC
   ========================================================= */
const bgMusic = document.getElementById("bg-music");
const musicToggleBtn = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");
let musicStarted = false;

bgMusic.src = birthdayConfig.music;

bgMusic.addEventListener("error", () => {
  musicToggleBtn.classList.add("hidden");
}, { once: false });

function tryStartMusic() {
  if (musicStarted) return;
  musicStarted = true;

  const playPromise = bgMusic.play();
  if (playPromise && typeof playPromise.then === "function") {
    playPromise
      .then(() => {
        musicToggleBtn.classList.remove("hidden");
      })
      .catch(() => {
        musicToggleBtn.classList.add("hidden");
      });
  }
}

musicToggleBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
    musicIcon.textContent = "🔊";
  } else {
    bgMusic.pause();
    musicIcon.textContent = "🔇";
  }
});

/* =========================================================
   SCREEN NAVIGATION
   ========================================================= */
function goToScreen(fromId, toId) {
  const fromEl = document.getElementById(fromId);
  const toEl = document.getElementById(toId);

  fromEl.classList.add("leaving");

  setTimeout(() => {
    fromEl.classList.remove("active", "leaving");
    toEl.classList.add("active", "entering");
    setTimeout(() => toEl.classList.remove("entering"), 800);
  }, 480);
}

/* =========================================================
   SCREEN 1 → SCREEN 2: OPEN THE GIFT
   ========================================================= */
const giftBox = document.getElementById("gift-box");
const openGiftBtn = document.getElementById("open-gift-btn");
let giftOpened = false;

openGiftBtn.addEventListener("click", () => {
  if (giftOpened) return;
  giftOpened = true;

  giftBox.classList.add("opening");
  launchConfetti();
  tryStartMusic();
  openGiftBtn.style.pointerEvents = "none";
  openGiftBtn.style.opacity = "0.6";

  setTimeout(() => {
    goToScreen("screen-1", "screen-2");
    playScreen2();
  }, 900);
});

/* =========================================================
   SCREEN 2: TITLE + WORD-BY-WORD MESSAGE REVEAL (slower pace)
   ========================================================= */
const mainTitleEl = document.getElementById("main-title");
const messageLinesEl = document.getElementById("message-lines");
const finalBtn = document.getElementById("final-btn");
let screen2Played = false;

async function playScreen2() {
  if (screen2Played) return;
  screen2Played = true;

  mainTitleEl.textContent = applyName(MESSAGES.screen2Title);

  await wait(900);

  for (const rawLine of MESSAGES.screen2Lines) {
    const isEmphasis = rawLine.includes("Happy Birthday");
    const { lineEl, wordCount } = buildWordLine(applyName(rawLine), isEmphasis ? "emphasis" : "");
    if (!isEmphasis) addLineSpark(lineEl);
    messageLinesEl.appendChild(lineEl);

    // Wait for the last word to finish revealing, plus a calm pause
    const revealTime = wordCount * 80 + 700;
    await wait(revealTime + 450);
  }

  await wait(500);
  finalBtn.classList.remove("hidden");
  finalBtn.classList.add("fade-target");
}

/* =========================================================
   SCREEN 2 → SCREEN 3: FINAL SURPRISE
   ========================================================= */
const finalLinesEl = document.getElementById("final-lines");
const replayBtn = document.getElementById("replay-btn");
let screen3Played = false;

finalBtn.addEventListener("click", () => {
  finalBtn.style.pointerEvents = "none";
  goToScreen("screen-2", "screen-3");
  playScreen3();
});

async function playScreen3() {
  if (screen3Played) return;
  screen3Played = true;

  startFloatingHearts();
  await wait(800);

  for (const item of MESSAGES.finalLines) {
    const extraClass = item.type === "title" ? "title-line" : item.type === "signature" ? "signature" : "";
    const { lineEl, wordCount } = buildWordLine(applyName(item.text), extraClass);
    lineEl.className = lineEl.className.replace("message-line", "final-line");
    if (item.type === "normal") addLineSpark(lineEl);
    finalLinesEl.appendChild(lineEl);

    const revealTime = wordCount * 80 + 700;
    await wait(revealTime + 550);
  }

  await wait(600);
  replayBtn.classList.remove("hidden");
  replayBtn.classList.add("fade-target");
}

/* =========================================================
   REPLAY: RESET EVERYTHING BACK TO SCREEN 1
   ========================================================= */
replayBtn.addEventListener("click", () => {
  const screen3 = document.getElementById("screen-3");
  screen3.classList.add("leaving");

  setTimeout(() => {
    screen3.classList.remove("active", "leaving");
    stopFloatingHearts();
    finalLinesEl.innerHTML = "";
    replayBtn.classList.add("hidden");
    replayBtn.classList.remove("fade-target");
    screen3Played = false;

    messageLinesEl.innerHTML = "";
    mainTitleEl.textContent = "";
    finalBtn.classList.add("hidden");
    finalBtn.classList.remove("fade-target");
    finalBtn.style.pointerEvents = "auto";
    screen2Played = false;

    giftBox.classList.remove("opening");
    giftOpened = false;
    openGiftBtn.style.pointerEvents = "auto";
    openGiftBtn.style.opacity = "1";

    document.getElementById("screen-1").classList.add("active", "entering");
    setTimeout(() => document.getElementById("screen-1").classList.remove("entering"), 800);
  }, 480);
});