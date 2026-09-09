(() => {
  "use strict";

  const STORAGE_KEY = "pokedex-tracker-caught-v1";
  const SPRITE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

  const state = {
    caught: loadCaught(),
    search: "",
    gen: "all",
    type: "all",
    status: "all",
    form: "all",
  };

  const CATEGORY_LABEL = { mega: "MEGA", gmax: "GMAX" };

  const els = {
    grid: document.getElementById("dex-grid"),
    empty: document.getElementById("empty-state"),
    search: document.getElementById("search-input"),
    genFilter: document.getElementById("gen-filter"),
    typeFilter: document.getElementById("type-filter"),
    statusFilter: document.getElementById("status-filter"),
    formFilter: document.getElementById("form-filter"),
    progressFill: document.getElementById("progress-fill"),
    progressCount: document.getElementById("progress-count"),
    navbarProgress: document.getElementById("navbar-progress"),
    markVisible: document.getElementById("mark-all-visible"),
    clearAll: document.getElementById("clear-all"),
  };

  function loadCaught() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  }

  function saveCaught() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.caught]));
    } catch {
      /* storage unavailable (private mode, quota) — caught state just won't persist */
    }
  }

  function padId(id) {
    return "#" + String(id).padStart(4, "0");
  }

  function displayNum(p) {
    return padId(p.baseId);
  }

  function spriteUrl(id) {
    return `${SPRITE_BASE}${id}.png`;
  }

  function buildTypeFilterChips() {
    const types = [...new Set(POKEDEX.flatMap((p) => p.types))].sort();
    for (const t of types) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.dataset.type = t;
      btn.textContent = t;
      els.typeFilter.appendChild(btn);
    }
  }

  function matchesFilters(p) {
    if (state.gen !== "all" && String(p.gen) !== state.gen) return false;
    if (state.type !== "all" && !p.types.includes(state.type)) return false;
    if (state.form !== "all" && p.category !== state.form) return false;
    const isCaught = state.caught.has(p.id);
    if (state.status === "caught" && !isCaught) return false;
    if (state.status === "missing" && isCaught) return false;
    if (state.search) {
      const q = state.search.trim().toLowerCase();
      const num = q.replace(/^#/, "");
      const matchesNum = num === String(p.baseId);
      const matchesName = p.name.toLowerCase().includes(q);
      if (!matchesNum && !matchesName) return false;
    }
    return true;
  }

  function typeBadge(t) {
    const span = document.createElement("span");
    span.className = `type-badge type-${t}`;
    span.textContent = t;
    return span;
  }

  function renderGrid() {
    const visible = POKEDEX.filter(matchesFilters);
    els.grid.innerHTML = "";
    els.empty.hidden = visible.length !== 0;

    const frag = document.createDocumentFragment();
    for (const p of visible) {
      const isCaught = state.caught.has(p.id);
      const card = document.createElement("div");
      card.className = "dex-card" + (isCaught ? " caught" : "");
      card.dataset.id = String(p.id);
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute(
        "aria-pressed",
        isCaught ? "true" : "false"
      );
      card.setAttribute(
        "aria-label",
        `${p.name}, ${displayNum(p)}, ${isCaught ? "caught" : "not caught"}`
      );

      const check = document.createElement("div");
      check.className = "dex-card-check";
      check.textContent = "✓";
      card.appendChild(check);

      const num = document.createElement("div");
      num.className = "dex-card-num";
      num.textContent = displayNum(p);
      if (CATEGORY_LABEL[p.category]) {
        const tag = document.createElement("span");
        tag.className = `dex-card-tag dex-card-tag-${p.category}`;
        tag.textContent = CATEGORY_LABEL[p.category];
        num.appendChild(tag);
      }
      card.appendChild(num);

      const spriteWrap = document.createElement("div");
      spriteWrap.className = "dex-sprite-wrap";
      const img = document.createElement("img");
      img.loading = "lazy";
      img.alt = "";
      img.src = spriteUrl(p.id);
      img.onerror = () => {
        img.style.visibility = "hidden";
      };
      spriteWrap.appendChild(img);
      card.appendChild(spriteWrap);

      const name = document.createElement("div");
      name.className = "dex-name";
      name.textContent = p.name;
      card.appendChild(name);

      const types = document.createElement("div");
      types.className = "dex-types";
      for (const t of p.types) types.appendChild(typeBadge(t));
      card.appendChild(types);

      card.addEventListener("click", () => toggleCaught(p.id));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleCaught(p.id);
        }
      });

      frag.appendChild(card);
    }
    els.grid.appendChild(frag);
  }

  function toggleCaught(id) {
    if (state.caught.has(id)) {
      state.caught.delete(id);
    } else {
      state.caught.add(id);
    }
    saveCaught();
    updateCardEl(id);
    updateProgress();
  }

  function updateCardEl(id) {
    const card = els.grid.querySelector(`.dex-card[data-id="${id}"]`);
    if (!card) return;
    const isCaught = state.caught.has(id);
    card.classList.toggle("caught", isCaught);
    card.setAttribute("aria-pressed", isCaught ? "true" : "false");
    if (state.status !== "all") {
      renderGrid();
    }
  }

  function updateProgress() {
    const total = POKEDEX.length;
    const caught = state.caught.size;
    const pct = total ? Math.round((caught / total) * 100) : 0;
    els.progressFill.style.width = pct + "%";
    els.progressCount.textContent = `${caught} / ${total} (${pct}%)`;
    els.navbarProgress.textContent = `${caught} / ${total}`;
  }

  function setupChipGroup(container, stateKey, datasetKey) {
    container.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      container
        .querySelectorAll(".chip")
        .forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      state[stateKey] = btn.dataset[datasetKey];
      renderGrid();
    });
  }

  function init() {
    buildTypeFilterChips();
    setupChipGroup(els.genFilter, "gen", "gen");
    setupChipGroup(els.typeFilter, "type", "type");
    setupChipGroup(els.statusFilter, "status", "status");
    setupChipGroup(els.formFilter, "form", "form");

    els.search.addEventListener("input", (e) => {
      state.search = e.target.value;
      renderGrid();
    });

    els.markVisible.addEventListener("click", () => {
      const visible = POKEDEX.filter(matchesFilters);
      for (const p of visible) state.caught.add(p.id);
      saveCaught();
      renderGrid();
      updateProgress();
    });

    els.clearAll.addEventListener("click", () => {
      if (state.caught.size === 0) return;
      if (!confirm("Clear your entire caught list? This can't be undone.")) return;
      state.caught.clear();
      saveCaught();
      renderGrid();
      updateProgress();
    });

    renderGrid();
    updateProgress();
  }

  init();
})();
