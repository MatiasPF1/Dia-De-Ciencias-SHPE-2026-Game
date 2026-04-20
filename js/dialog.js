import { state } from "./state.js";
import { NPCS } from "./npcs.js";
import { BOWSER_EVENT, spawnBowser } from "./bowser.js";

const dlgRoot = () => document.getElementById("npc-dialog");
const el = (id) => document.getElementById(id);

// ── Internal state ────────────────────────────────────────────────────────
let _phase = 1;
let _typingDone = false;
let _typingTimer = null;
let _revealTimer = null;
let _npcIndex = null;
let _bowserMode = false;
let _bowserChallenge = 0; // 0 or 1

// ── Normalise answer for loose comparison ─────────────────────────────────
function normalise(str) {
  return str
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => l.length > 0)
    .map((l) => {
      // Preserve leading indentation, normalize spaces around = assignment
      const indent = l.match(/^(\s*)/)[1];
      const code = l.slice(indent.length)
        .replace(/(?<![=!<>])\s*=\s*(?![=])/g, "=");
      return indent + code;
    })
    .join("\n");
}

// ── Typewriter ────────────────────────────────────────────────────────────
function typeText(elem, text, msPerChar, onDone) {
  clearTimeout(_typingTimer);
  _typingDone = false;
  elem.textContent = "";
  elem.classList.add("typing");
  let i = 0;
  function step() {
    i++;
    elem.textContent = text.slice(0, i);
    if (i < text.length) {
      _typingTimer = setTimeout(step, msPerChar);
    } else {
      _typingDone = true;
      elem.classList.remove("typing");
      if (onDone) onDone();
    }
  }
  _typingTimer = setTimeout(step, msPerChar);
}

function skipTyping(elem, text) {
  clearTimeout(_typingTimer);
  clearTimeout(_revealTimer);
  _typingDone = true;
  elem.classList.remove("typing");
  elem.textContent = text;
}

// ── Open dialog ───────────────────────────────────────────────────────────
export function openDialog(npcIndex) {
  const npc = NPCS[npcIndex];
  if (!npc) return;
  _npcIndex = npcIndex;

  document.querySelector(".npc-dialog__panel").style.setProperty("--npc-color", npc.color);

  el("dlg-npcname").textContent = npc.name;
  el("dlg-topic").textContent = `— ${npc.topic}`;
  el("dlg-input").value = "";
  el("dlg-feedback").textContent = "";
  el("dlg-feedback").className = "npc-dialog__feedback";
  el("dlg-hint").hidden = true;
  el("dlg-hint").textContent = npc.hint;
  el("dlg-question").textContent = npc.question;
  const indentEl = el("dlg-indent-note");
  if (npc.indentNote) {
    indentEl.textContent = npc.indentNote;
    indentEl.hidden = false;
  } else {
    indentEl.hidden = true;
  }
  el("dlg-submit-btn").disabled = false;
  el("dlg-input").disabled = false;
  const counter = el("dlg-challenge-counter");
  if (counter) counter.hidden = true; // only shown for Bowser

  dlgRoot().hidden = false;
  goPhase(1);
}

// ── Phase management ──────────────────────────────────────────────────────
function goPhase(n) {
  _phase = n;
  el("dlg-phase-1").hidden = n !== 1;
  el("dlg-phase-2").hidden = n !== 2;
  el("dlg-phase-3").hidden = n !== 3;

  const npc = _bowserMode ? null : NPCS[_npcIndex];

  // ── Phase 1: Character intro ──────────────────────────────────────────
  if (n === 1) {
    const btn = el("dlg-next-1");
    btn.textContent = "Continue →";
    btn.disabled = true;

    const introText = _bowserMode ? BOWSER_EVENT.intro : npc.intro;
    typeText(el("dlg-intro-text"), introText, 30, () => {
      btn.disabled = false;
    });

    btn.onclick = () => {
      if (!_typingDone) return;
      if (_bowserMode) goPhase(3); // skip lesson, go straight to challenge
      else goPhase(2);
    };
  }

  // ── Phase 2: Lesson + example + output ───────────────────────────────
  if (n === 2) {
    const btn = el("dlg-next-2");
    btn.textContent = "Got it! Try it →";
    btn.disabled = true;
    el("dlg-code-block").hidden = true;
    el("dlg-output-block").hidden = true;
    el("dlg-code-block").classList.remove("dlg-reveal");
    el("dlg-output-block").classList.remove("dlg-reveal");
    el("dlg-code").textContent = npc.example;
    el("dlg-output").textContent = npc.output;

    typeText(el("dlg-teach-text"), npc.teach, 26, () => {
      _revealTimer = setTimeout(() => {
        el("dlg-code-block").hidden = false;
        el("dlg-code-block").classList.add("dlg-reveal");
        _revealTimer = setTimeout(() => {
          el("dlg-output-block").hidden = false;
          el("dlg-output-block").classList.add("dlg-reveal");
          _revealTimer = setTimeout(() => {
            btn.disabled = false;
          }, 300);
        }, 550);
      }, 400);
    });

    btn.onclick = () => {
      if (_typingDone) goPhase(3);
    };
  }

  // ── Phase 3: Challenge ────────────────────────────────────────────────
  if (n === 3) {
    el("dlg-input").focus();
    el("dlg-input").onkeydown = (e) => {
      if (e.key === "Enter" && e.ctrlKey) { e.preventDefault(); submitAnswer(); }
    };
    el("dlg-submit-btn").onclick = submitAnswer;
    el("dlg-hint-btn").onclick = toggleHint;
  }
}

// ── Open Bowser dialog ───────────────────────────────────────────────────
export function openBowserDialog() {
  _bowserMode = true;
  _bowserChallenge = 0;

  document.querySelector(".npc-dialog__panel").style.setProperty("--npc-color", BOWSER_EVENT.color);
  el("dlg-npcname").textContent = BOWSER_EVENT.name;
  el("dlg-topic").textContent = `— ${BOWSER_EVENT.topic}`;

  _loadBowserChallenge(0);

  dlgRoot().hidden = false;
  goPhase(1);
}

function _loadBowserChallenge(idx) {
  const ch = BOWSER_EVENT.challenges[idx];
  el("dlg-input").value = "";
  el("dlg-feedback").textContent = "";
  el("dlg-feedback").className = "npc-dialog__feedback";
  el("dlg-hint").hidden = true;
  el("dlg-hint").textContent = ch.hint;
  el("dlg-question").textContent = ch.question;
  el("dlg-submit-btn").disabled = false;
  el("dlg-input").disabled = false;
  const indentEl = el("dlg-indent-note");
  if (ch.indentNote) {
    indentEl.textContent = ch.indentNote;
    indentEl.hidden = false;
  } else {
    indentEl.hidden = true;
  }
  const counter = el("dlg-challenge-counter");
  if (counter) {
    counter.textContent = `Challenge ${idx + 1} / 2`;
    counter.hidden = false;
  }
}

// ── Close dialog ──────────────────────────────────────────────────────────
export function closeDialog() {
  clearTimeout(_typingTimer);
  clearTimeout(_revealTimer);
  dlgRoot().hidden = true;
  if (_bowserMode && !state.bowserDialogDone) {
    state.activeBowser = false;
  }
  _bowserMode = false;
  state.activeNpc = null;
  const canvas = document.querySelector("canvas");
  if (canvas) canvas.focus();
}

// ── Toggle hint ───────────────────────────────────────────────────────────
export function toggleHint() {
  const hint = el("dlg-hint");
  hint.hidden = !hint.hidden;
}

// ── Submit answer ─────────────────────────────────────────────────────────
export function submitAnswer() {
  const fb = el("dlg-feedback");

  // ── Bowser challenge path ─────────────────────────────────────────────
  if (_bowserMode) {
    const ch = BOWSER_EVENT.challenges[_bowserChallenge];
    const userAnswer = normalise(el("dlg-input").value);
    const correctAnswer = normalise(ch.answer);

    if (userAnswer === correctAnswer) {
      fb.className = "npc-dialog__feedback npc-dialog__feedback--correct";
      fb.textContent = `✅ ${ch.successMsg}`;
      el("dlg-submit-btn").disabled = true;
      el("dlg-input").disabled = true;

      if (_bowserChallenge === 0) {
        // Load challenge 2 after a short pause
        setTimeout(() => {
          _bowserChallenge = 1;
          _loadBowserChallenge(1);
          el("dlg-input").focus();
        }, 1400);
      } else {
        // Both challenges done — spawn Bowser and close
        setTimeout(() => {
          state.bowserDialogDone = true;
          state.activeBowser = false;
          closeDialog();
          spawnBowser();
        }, 1600);
      }
    } else {
      fb.className = "npc-dialog__feedback npc-dialog__feedback--wrong";
      fb.textContent = "❌ Not quite. Check indentation and quotes. Try again!";
      el("dlg-input").select();
    }
    return;
  }

  // ── Normal NPC path ───────────────────────────────────────────────────
  const npcIndex = state.activeNpc;
  if (npcIndex === null) return;
  const npc = NPCS[npcIndex];

  const userAnswer = normalise(el("dlg-input").value);
  const correctAnswer = normalise(npc.answer);

  if (userAnswer === correctAnswer) {
    fb.className = "npc-dialog__feedback npc-dialog__feedback--correct";
    fb.textContent = `✅ ${npc.successMsg}`;
    state.npcsCompleted[npcIndex] = true;
    state.gems += 1;
    el("dlg-submit-btn").disabled = true;
    el("dlg-input").disabled = true;
    setTimeout(closeDialog, 2200);
  } else {
    fb.className = "npc-dialog__feedback npc-dialog__feedback--wrong";
    fb.textContent = "❌ Not quite. Check indentation and quotes. Try again!";
    el("dlg-input").select();
  }
}
