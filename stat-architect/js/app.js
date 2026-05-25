// ============================================================
// LiF: Arden Character Builder — Application Logic
// ============================================================

// ── State ────────────────────────────────────────────────────
const state = {
  charName: '',
  skillLevels: {},      // skillName → level (0-100), all categories
  combatSpecs: {        // spec 1-5 each hold separate combat skill levels
    1: {}, 2: {}, 3: {}, 4: {}, 5: {}
  },
  activeSpec: 1,
  activeTab: 'crafting', // 'crafting' | 'combat' | 'minor' | 'attributes'
  attributes: { Strength: 10, Agility: 10, Constitution: 10, Intellect: 10, Willpower: 10 },
};

// ── Helpers ───────────────────────────────────────────────────
function getAllSkillsFlat() {
  const flat = {};
  for (const cat of Object.values(SKILL_TREES)) {
    for (const skill of Object.keys(cat)) flat[skill] = true;
  }
  return flat;
}

function getCategory(skillName) {
  for (const [cat, tree] of Object.entries(SKILL_TREES)) {
    if (skillName in tree) return cat;
  }
  return null;
}

function getSkillLevel(skillName) {
  const cat = getCategory(skillName);
  if (cat === 'Combat') {
    return state.combatSpecs[state.activeSpec][skillName] ?? 0;
  }
  return state.skillLevels[skillName] ?? 0;
}

function setSkillLevelRaw(skillName, level) {
  const cat = getCategory(skillName);
  if (cat === 'Combat') {
    state.combatSpecs[state.activeSpec][skillName] = level;
  } else {
    state.skillLevels[skillName] = level;
  }
}

function getLevelClass(level) {
  if (level === 0)   return '';
  if (level < 30)    return 'lvl-low';
  if (level < 60)    return 'lvl-30';
  if (level < 90)    return 'lvl-60';
  if (level < 100)   return 'lvl-90';
  return 'lvl-100';
}

function getRequiredParentLevel(tier) {
  return tier === 2 ? 30 : 60;
}

// XP curve: approximate base XP to reach a given level from 0
function baseXpToLevel(level) {
  if (level <= 0)  return 0;
  if (level <= 30) return level * 3000;
  if (level <= 60) return 90000  + (level - 30) * 6000;
  if (level <= 90) return 270000 + (level - 60) * 12000;
  return 630000 + (level - 90) * 18000; // 810,000 total for 0→100
}

// Estimated hours to level based on game-file ExpToSkillMult values.
// Base rate: ~10,000 XP/hr (calibrated from community data and seasonal design:
//   T1 skill 0→90 ≈ 63h, T4 skill 0→100 ≈ 400h in a 6-month season).
// Actual times vary with: food quality bonus (up to 5.5×), premium XP bank (2×),
//   new-player 75% bonus (first 14 days), and active vs offline play style.
function estimateHours(skillName, fromLevel, toLevel) {
  const mult   = EXP_MULTIPLIERS[skillName] ?? 2;
  const xp     = (baseXpToLevel(toLevel) - baseXpToLevel(fromLevel)) * mult;
  const xphour = 10000; // XP bank drain rate, calibrated from game design
  return xp / xphour;
}

function formatHours(h) {
  if (h < 0.5)  return '<1h';
  if (h < 24)   return h.toFixed(1) + 'h';
  if (h < 168)  return (h / 24).toFixed(1) + 'd';       // < 1 week → days
  if (h < 720)  return (h / 168).toFixed(1) + 'w';      // < ~1 month → weeks
  return (h / 720).toFixed(1) + 'mo';                    // months (720h ≈ 30d)
}

// ── Cascade Logic ─────────────────────────────────────────────
function cascadeLevel(skillName, targetLevel) {
  const cat = getCategory(skillName);
  if (!cat) return;
  const tree = SKILL_TREES[cat];
  const data = tree[skillName];

  targetLevel = Math.max(0, Math.min(100, targetLevel));

  // Cascade UP: auto-level parent to minimum required
  if (targetLevel > 0 && data.parent) {
    const parentName = data.parent;
    const reqLvl = getRequiredParentLevel(data.tier);
    const parentLvl = getSkillLevel(parentName);
    if (parentLvl < reqLvl) {
      cascadeLevel(parentName, reqLvl);
    }
  }

  // Apply the level
  setSkillLevelRaw(skillName, targetLevel);

  // Cascade DOWN: drop children if parent falls below requirement
  for (const [childName, childData] of Object.entries(tree)) {
    if (childData.parent === skillName) {
      const childLvl = getSkillLevel(childName);
      const reqLvl = getRequiredParentLevel(childData.tier);
      if (targetLevel < reqLvl && childLvl > 0) {
        cascadeLevel(childName, 0);
      }
    }
  }
}

// ── DOM Update Helpers ────────────────────────────────────────
function updateNodeDOM(skillName) {
  const node = document.querySelector(`[data-skill="${CSS.escape(skillName)}"]`);
  if (!node) return;
  const level = getSkillLevel(skillName);
  const levelEl = node.querySelector('.node-level');
  if (levelEl) levelEl.textContent = level;

  // Remove all level classes, apply correct one
  node.classList.remove('lvl-low','lvl-30','lvl-60','lvl-90','lvl-100');
  const cls = getLevelClass(level);
  if (cls) node.classList.add(cls);

  // Update any adjacent connector lines
  updateConnectors(skillName);
}

function updateConnectors(skillName) {
  // Connectors are identified by data-child attribute
  document.querySelectorAll(`.chain-connector[data-child="${CSS.escape(skillName)}"]`)
    .forEach(conn => {
      const level = getSkillLevel(skillName);
      if (level > 0) conn.classList.add('active');
      else           conn.classList.remove('active');
    });
}

function updateAllNodes() {
  for (const cat of Object.values(SKILL_TREES)) {
    for (const skillName of Object.keys(cat)) {
      updateNodeDOM(skillName);
    }
  }
}

// ── Tree Rendering ────────────────────────────────────────────
function createSkillNode(skillName) {
  const node = document.createElement('div');
  node.className = 'skill-node';
  node.dataset.skill = skillName;
  node.title = 'Left click +30 | Right click -30 | Scroll ±1';

  const label = document.createElement('div');
  label.className = 'node-label';

  const nameEl = document.createElement('span');
  nameEl.className = 'node-name';
  nameEl.textContent = skillName;

  const levelEl = document.createElement('span');
  levelEl.className = 'node-level';
  levelEl.textContent = '0';

  label.appendChild(nameEl);
  label.appendChild(levelEl);
  node.appendChild(label);

  // Events
  node.addEventListener('click', (e) => {
    e.preventDefault();
    cascadeLevel(skillName, getSkillLevel(skillName) + 30);
    refreshAfterChange(skillName);
  });

  node.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    cascadeLevel(skillName, getSkillLevel(skillName) - 30);
    refreshAfterChange(skillName);
  });

  node.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1 : -1;
    cascadeLevel(skillName, getSkillLevel(skillName) + delta);
    refreshAfterChange(skillName);
  }, { passive: false });

  // Title tooltip handled by HTML title attribute

  return node;
}

function createConnector(childName) {
  const conn = document.createElement('div');
  conn.className = 'chain-connector';
  conn.dataset.child = childName;
  return conn;
}

// ── Preset Build Rendering ────────────────────────────────────
function renderPresetBuilds(category) {
  const panel = document.createElement('div');
  panel.className = 'build-templates-panel';

  const titleEl = document.createElement('div');
  titleEl.className = 'templates-panel-title';
  titleEl.textContent = 'Preset Builds';
  panel.appendChild(titleEl);

  const presets = (typeof PRESET_BUILDS !== 'undefined' && PRESET_BUILDS[category]) || [];
  if (!presets.length) {
    const empty = document.createElement('div');
    empty.style.cssText = 'font-size:11px;color:var(--text-dim);font-style:italic;padding:8px 0';
    empty.textContent = 'No presets for this category.';
    panel.appendChild(empty);
    return panel;
  }

  for (const preset of presets) {
    const card = document.createElement('div');
    card.className = 'preset-card';

    // Header: icon + name
    const header = document.createElement('div');
    header.className = 'preset-card-header';
    header.innerHTML = `<span class="preset-card-icon">${preset.icon}</span><span class="preset-card-name">${escHtml(preset.name)}</span>`;
    card.appendChild(header);

    // Description
    const desc = document.createElement('div');
    desc.className = 'preset-card-desc';
    desc.textContent = preset.desc;
    card.appendChild(desc);

    // Skills list
    const ul = document.createElement('ul');
    ul.className = 'preset-skills-list';
    for (const [skillName, level] of Object.entries(preset.skills)) {
      const li = document.createElement('li');
      li.textContent = `${skillName} — ${level}`;
      ul.appendChild(li);
    }
    card.appendChild(ul);

    // Load button
    const btn = document.createElement('button');
    btn.className = 'preset-load-btn';
    btn.textContent = 'Load Build';
    btn.addEventListener('click', () => loadPreset(preset, category));
    card.appendChild(btn);

    panel.appendChild(card);
  }

  return panel;
}

function loadPreset(preset, category) {
  // Reset all skills in this category first
  for (const skillName of Object.keys(SKILL_TREES[category])) {
    setSkillLevelRaw(skillName, 0);
  }
  // Apply each preset skill (cascade handles parent requirements automatically)
  for (const [skillName, level] of Object.entries(preset.skills)) {
    if (SKILL_TREES[category] && skillName in SKILL_TREES[category]) {
      cascadeLevel(skillName, level);
    }
  }
  // Refresh all nodes in this category
  for (const skillName of Object.keys(SKILL_TREES[category])) {
    updateNodeDOM(skillName);
  }
  updateStatusBar();
  if (state.activeTab === 'attributes') updateAttributesBuildPanel();
}

function renderCraftingTree(container) {
  container.innerHTML = '';

  const layout = document.createElement('div');
  layout.className = 'tree-layout';

  // Left: skill tree in medieval frame
  const frame = document.createElement('div');
  frame.className = 'skill-tree-frame';
  for (const chain of CRAFTING_CHAINS) {
    const row = document.createElement('div');
    row.className = 'skill-chain';
    for (let i = 0; i < chain.length; i++) {
      const skillName = chain[i];
      if (i > 0) row.appendChild(createConnector(skillName));
      row.appendChild(createSkillNode(skillName));
    }
    frame.appendChild(row);
  }
  layout.appendChild(frame);

  // Right: preset cards
  layout.appendChild(renderPresetBuilds('Crafting'));

  container.appendChild(layout);
}

function renderCombatTree(container) {
  container.innerHTML = '';

  const layout = document.createElement('div');
  layout.className = 'tree-layout';

  const frame = document.createElement('div');
  frame.className = 'skill-tree-frame';

  // Chain rows
  for (const chain of COMBAT_CHAINS) {
    const row = document.createElement('div');
    row.className = 'skill-chain';
    for (let i = 0; i < chain.length; i++) {
      const skillName = chain[i];
      if (i > 0) row.appendChild(createConnector(skillName));
      row.appendChild(createSkillNode(skillName));
    }
    frame.appendChild(row);
  }

  // Standalone skills
  const standaloneRow = document.createElement('div');
  standaloneRow.className = 'combat-standalones';
  for (const skillName of COMBAT_STANDALONES) {
    const cell = document.createElement('div');
    cell.className = 'standalone-cell';
    cell.appendChild(createSkillNode(skillName));
    const lbl = document.createElement('div');
    lbl.className = 'standalone-label';
    lbl.textContent = skillName;
    cell.appendChild(lbl);
    standaloneRow.appendChild(cell);
  }
  frame.appendChild(standaloneRow);

  layout.appendChild(frame);
  layout.appendChild(renderPresetBuilds('Combat'));

  container.appendChild(layout);
}

function renderMinorTree(container) {
  container.innerHTML = '';

  const layout = document.createElement('div');
  layout.className = 'tree-layout';

  const frame = document.createElement('div');
  frame.className = 'skill-tree-frame';

  const grid = document.createElement('div');
  grid.className = 'minor-grid';
  for (const skillName of Object.keys(SKILL_TREES.Minor)) {
    const cell = document.createElement('div');
    cell.className = 'minor-cell';
    cell.appendChild(createSkillNode(skillName));
    const lbl = document.createElement('div');
    lbl.className = 'skill-label-text';
    lbl.textContent = skillName;
    cell.appendChild(lbl);
    grid.appendChild(cell);
  }
  frame.appendChild(grid);

  layout.appendChild(frame);
  layout.appendChild(renderPresetBuilds('Minor'));

  container.appendChild(layout);
}

function renderAttributesTab(container) {
  container.innerHTML = '';

  // ── Section 1: Attribute Inputs + Derived Stats ──────────
  const layout = document.createElement('div');
  layout.className = 'attributes-layout';

  // Left card: attribute inputs
  const attrCard = document.createElement('div');
  attrCard.className = 'attr-card';
  attrCard.innerHTML = `<div class="card-title">Character Attributes</div>`;

  for (const [attr, val] of Object.entries(state.attributes)) {
    const row = document.createElement('div');
    row.className = 'attr-row';

    const nameEl = document.createElement('span');
    nameEl.className = 'attr-name';
    nameEl.textContent = attr;

    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'attr-input';
    input.min = 10; input.max = 110; input.step = 1;
    input.value = val;
    input.dataset.attr = attr;
    input.addEventListener('input', () => {
      let v = parseInt(input.value) || 10;
      v = Math.max(10, Math.min(110, v));
      state.attributes[attr] = v;
      updateDerivedStats();
    });

    row.appendChild(nameEl);
    row.appendChild(input);
    attrCard.appendChild(row);
  }

  // Total bar
  const totalBar = document.createElement('div');
  totalBar.className = 'attr-total-bar';
  totalBar.innerHTML = `
    <div class="attr-total-row">
      <span class="attr-total-label">Stat Cap Total</span>
      <span class="attr-total-value" id="attr-total-val">50 / 150</span>
    </div>
    <div class="progress-bar-bg">
      <div class="progress-bar-fill" id="attr-progress-fill" style="width:0%"></div>
    </div>`;
  attrCard.appendChild(totalBar);
  layout.appendChild(attrCard);

  // Right card: derived stats
  const statsCard = document.createElement('div');
  statsCard.className = 'stats-card';
  statsCard.innerHTML = `<div class="card-title">Derived Stats</div>`;
  const statsToShow = [
    ['Soft HP',           'derived-soft-hp',   'CON ×1'],
    ['Hard HP',           'derived-hard-hp',   'CON ×1'],
    ['Soft Stamina',      'derived-soft-stam', 'WIL ×1'],
    ['Hard Stamina',      'derived-hard-stam', 'WIL ×1'],
    ['Carry Capacity',    'derived-carry',     'WIL ×2 +100'],
    ['Equip Tolerance',   'derived-equip',     'STR ×5'],
    ['Skill Cap Bonus',   'derived-cap-bonus', 'INT ×2'],
  ];
  for (const [label, id, formula] of statsToShow) {
    const row = document.createElement('div');
    row.className = 'stat-row';
    row.innerHTML = `<span class="stat-name">${label}<span style="font-size:9px;color:var(--text-dim);margin-left:6px">${formula}</span></span><span class="stat-value" id="${id}">—</span>`;
    statsCard.appendChild(row);
  }
  layout.appendChild(statsCard);
  container.appendChild(layout);

  updateDerivedStats();

  // ── Section 2: Build Overview (cap bars + grind time) ────
  const overviewWrap = document.createElement('div');
  overviewWrap.id = 'attr-build-overview';
  container.appendChild(overviewWrap);

  // ── Section 3: Skill Unlocks Accordion ───────────────────
  const unlocksWrap = document.createElement('div');
  unlocksWrap.id = 'attr-unlocks';
  container.appendChild(unlocksWrap);

  // Fill both sections
  updateAttributesBuildPanel();
}

// Refresh only the overview + unlocks sections (preserves attribute inputs)
function updateAttributesBuildPanel() {
  const overviewEl = document.getElementById('attr-build-overview');
  const unlocksEl  = document.getElementById('attr-unlocks');
  if (overviewEl) { overviewEl.innerHTML = ''; overviewEl.appendChild(buildOverviewSection()); }
  if (unlocksEl)  { unlocksEl.innerHTML  = ''; unlocksEl.appendChild(buildUnlocksAccordion()); }
}

// Build Overview: cap bars + grind time table
function buildOverviewSection() {
  const section = document.createElement('div');
  section.className = 'build-section';
  section.innerHTML = `<div class="build-section-title">Build Overview</div>`;

  const invested = getInvestedSkills();
  if (invested.length === 0) {
    section.innerHTML += `<div style="font-size:12px;color:var(--text-dim);padding:8px 0;font-style:italic">No skills invested — level skills in the Crafting, Combat, or Minor tabs.</div>`;
    return section;
  }

  // Cap usage bars
  const caps = calculateCaps();
  const capsDiv = document.createElement('div');
  capsDiv.style.marginBottom = '16px';
  capsDiv.innerHTML =
    renderCapBar('Crafting', caps.crafting, SKILL_CAPS.crafting) +
    renderCapBar(`Combat (Spec ${state.activeSpec})`, caps.combat, SKILL_CAPS.combat) +
    renderCapBar('Minor', caps.minor, SKILL_CAPS.minor);
  section.appendChild(capsDiv);

  // Grind time table
  let totalHours = 0;
  const groups = { Crafting: [], Combat: [], Minor: [] };
  for (const { name, level } of invested) {
    const cat = getCategory(name);
    if (cat) groups[cat].push({ name, level });
    totalHours += estimateHours(name, 0, level);
  }

  const table = document.createElement('div');
  table.className = 'grind-table';
  for (const [cat, skills] of Object.entries(groups)) {
    if (!skills.length) continue;
    table.innerHTML += `<div class="grind-cat-header">${cat}</div>`;
    for (const { name, level } of skills) {
      const h = estimateHours(name, 0, level);
      table.innerHTML += `<div class="grind-row">
        <span class="grind-name">${escHtml(name)}</span>
        <span class="grind-level">${level}</span>
        <span class="grind-time">~${formatHours(h)}</span>
      </div>`;
    }
  }
  table.innerHTML += `<div class="grind-total-row">
    <span>Est. Total Grind</span>
    <span>~${formatHours(totalHours)}</span>
  </div>`;
  section.appendChild(table);

  const note = document.createElement('div');
  note.className = 'grind-note';
  note.textContent = '⚠ Multipliers confirmed from skill_types.xml. Base rate calibrated for a 6-month season (~10k XP/hr baseline). Actual times vary with food quality bonus (up to 5.5×), premium bank, and the 75% new-player boost for the first 14 days.';
  section.appendChild(note);

  return section;
}

// Build Unlocks Accordion: one <details> per leveled skill
function buildUnlocksAccordion() {
  const section = document.createElement('div');
  section.className = 'build-section';
  section.innerHTML = `<div class="build-section-title">Skill Unlocks</div>`;

  const invested = getInvestedSkills();
  if (invested.length === 0) {
    section.innerHTML += `<div style="font-size:12px;color:var(--text-dim);padding:8px 0;font-style:italic">Level skills to see your unlocked actions, items, and recipes here.</div>`;
    return section;
  }

  for (const { name, level } of invested) {
    const details = SKILL_DETAILS[name];
    if (!details) continue;

    const thresholds = [0, 30, 60, 90, 100];

    // Build per-tier content (only tiers the player has reached)
    let tierHtml = '';
    for (const t of thresholds) {
      if (t > level) continue;
      const data = details[t] || { actions: [], items: [], recipes: [] };
      const hasContent = data.actions.length || data.items.length || data.recipes.length;
      if (!hasContent && t > 0) continue;

      tierHtml += `<div class="unlock-tier active" style="margin-bottom:10px">
        <div class="tier-header">Level ${t}</div>`;
      if (data.actions.length)  tierHtml += renderUnlockSection('Actions',  'actions',  data.actions);
      if (data.items.length)    tierHtml += renderUnlockSection('Items',    'items',    data.items);
      if (data.recipes.length)  tierHtml += renderUnlockSection('Recipes',  'recipes',  data.recipes);
      if (!data.actions.length && !data.items.length && !data.recipes.length) {
        tierHtml += `<div style="font-size:10px;color:var(--text-dim)">No additional unlocks</div>`;
      }
      tierHtml += `</div>`;
    }

    if (!tierHtml) continue;

    const timeEst = estimateHours(name, 0, level);
    const accEl = document.createElement('details');
    accEl.className = 'unlock-accordion';
    accEl.innerHTML = `
      <summary>
        <span class="unlock-acc-icon">▶</span>
        <span class="unlock-acc-name">${escHtml(name)}</span>
        <span class="unlock-acc-level">Lv ${level}</span>
        <span class="unlock-acc-time">~${formatHours(timeEst)}</span>
      </summary>
      <div class="unlock-acc-body">${tierHtml}</div>`;
    section.appendChild(accEl);
  }

  return section;
}

function updateDerivedStats() {
  const { Strength: str, Agility: agi, Constitution: con, Intellect: int_, Willpower: wil } = state.attributes;

  const total = str + agi + con + int_ + wil;
  const totalEl = document.getElementById('attr-total-val');
  const fillEl  = document.getElementById('attr-progress-fill');
  if (totalEl) {
    totalEl.textContent = `${total} / 150`;
    totalEl.className = 'attr-total-value' + (total > 150 ? ' over' : '');
  }
  if (fillEl) {
    const pct = Math.min((total / 150) * 100, 100);
    fillEl.style.width = pct + '%';
    fillEl.className = 'progress-bar-fill' + (total > 150 ? ' over' : '');
  }

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  // Formulas sourced from Official LiF Wiki (community-verified per-point increments)
  // CON: +1 Soft HP, +1 Hard HP per point
  // WIL: +1 Soft Stam, +1 Hard Stam per point; Carry = 100 + WIL×2 stones (confirmed: 110 WIL → 320)
  // STR: Equip tolerance = STR×5 per point
  // INT: Skill cap bonus = INT×2 per point (applies to both combat and craft caps)
  set('derived-soft-hp',    `${con}`);
  set('derived-hard-hp',    `${con}`);
  set('derived-soft-stam',  `${wil}`);
  set('derived-hard-stam',  `${wil}`);
  set('derived-carry',      `${100 + wil * 2} stones`);
  set('derived-equip',      `${str * 5} pts`);
  set('derived-cap-bonus',  `+${int_ * 2}`);
}

// renderUnlockSection is still used by buildUnlocksAccordion

function renderUnlockSection(label, typeClass, items) {
  const listItems = items.map(i => `<li>${escHtml(i)}</li>`).join('');
  return `<div class="unlock-section">
    <div class="unlock-type ${typeClass}">${label}</div>
    <ul class="unlock-list ${typeClass}">${listItems}</ul>
  </div>`;
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}


function renderCapBar(label, current, max) {
  const pct = Math.min((current / max) * 100, 100);
  const over = current > max;
  return `<div class="cap-bar-group">
    <div class="cap-bar-label">
      <span class="cap-bar-name">${label}</span>
      <span class="cap-bar-val ${over ? 'over' : ''}">${current} / ${max}</span>
    </div>
    <div class="progress-bar-bg">
      <div class="progress-bar-fill ${over ? 'over' : ''}" style="width:${pct}%"></div>
    </div>
  </div>`;
}

function getInvestedSkills() {
  const result = [];
  for (const [cat, tree] of Object.entries(SKILL_TREES)) {
    for (const skillName of Object.keys(tree)) {
      const level = (cat === 'Combat')
        ? (state.combatSpecs[state.activeSpec][skillName] ?? 0)
        : (state.skillLevels[skillName] ?? 0);
      if (level > 0) result.push({ name: skillName, level });
    }
  }
  return result;
}

function calculateCaps() {
  let crafting = 0, combat = 0, minor = 0;
  for (const [skillName] of Object.entries(SKILL_TREES.Crafting)) {
    crafting += state.skillLevels[skillName] ?? 0;
  }
  for (const [skillName] of Object.entries(SKILL_TREES.Combat)) {
    combat += state.combatSpecs[state.activeSpec][skillName] ?? 0;
  }
  for (const [skillName] of Object.entries(SKILL_TREES.Minor)) {
    minor += state.skillLevels[skillName] ?? 0;
  }
  return { crafting, combat, minor };
}

// ── Status Bar ────────────────────────────────────────────────
function updateStatusBar() {
  const caps = calculateCaps();

  const setVal = (id, val, max, isHeader) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = `${val} / ${max}`;
    if (isHeader) {
      el.className = 'cap-value' + (val > max ? ' over' : '');
    } else {
      el.className = 'status-value' + (val > max ? ' over' : val === max ? ' full' : '');
    }
  };

  // Bottom status bar
  setVal('stat-crafting', caps.crafting, SKILL_CAPS.crafting, false);
  setVal('stat-combat',   caps.combat,   SKILL_CAPS.combat,   false);
  setVal('stat-minor',    caps.minor,    SKILL_CAPS.minor,    false);

  // Header caps
  setVal('header-crafting', caps.crafting, SKILL_CAPS.crafting, true);
  setVal('header-combat',   caps.combat,   SKILL_CAPS.combat,   true);
  setVal('header-minor',    caps.minor,    SKILL_CAPS.minor,    true);

  const specEl = document.getElementById('stat-spec-label');
  if (specEl) specEl.textContent = `Combat (Spec ${state.activeSpec})`;
}

// ── Full Refresh After Skill Change ──────────────────────────
function refreshAfterChange(changedSkillName) {
  // Update all nodes in the same category (cascade may have touched many)
  const cat = getCategory(changedSkillName);
  if (!cat) return;
  for (const skillName of Object.keys(SKILL_TREES[cat])) {
    updateNodeDOM(skillName);
  }
  updateStatusBar();
  // Live-update the Build Overview section if Attributes tab is visible
  if (state.activeTab === 'attributes') {
    const overviewEl = document.getElementById('attr-build-overview');
    if (overviewEl) { overviewEl.innerHTML = ''; overviewEl.appendChild(buildOverviewSection()); }
  }
  queueAutoSave();
}

// ── Tab Navigation ────────────────────────────────────────────
function switchTab(tabName) {
  state.activeTab = tabName;

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.toggle('hidden', pane.dataset.pane !== tabName);
  });

  if (tabName === 'attributes') renderAttributesTab(document.getElementById('pane-attributes'));
}

// ── Combat Spec Switching ─────────────────────────────────────
function switchSpec(specIndex) {
  state.activeSpec = specIndex;
  document.querySelectorAll('.spec-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.spec) === specIndex);
  });
  // Re-render all combat nodes with new spec's data
  for (const skillName of Object.keys(SKILL_TREES.Combat)) {
    updateNodeDOM(skillName);
  }
  updateStatusBar();
  // Refresh attributes tab build panel if active
  if (state.activeTab === 'attributes') updateAttributesBuildPanel();
}

// ── Startup Screen ────────────────────────────────────────────
function handleStart() {
  const nameInput = document.getElementById('char-name-input');
  state.charName = nameInput.value.trim() || 'Unknown Peasant';
  enterMainScreen();
}

// ── Save / Load ──────────────────────────────────────────────
const SAVE_KEY     = 'statArchitect_saves';
const AUTOSAVE_KEY = 'statArchitect_autosave';

function getSaves() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY) || '[]'); } catch { return []; }
}
function setSaves(arr) { localStorage.setItem(SAVE_KEY, JSON.stringify(arr)); }

function buildStateSnapshot(name) {
  return {
    id: Date.now().toString(),
    name: name || state.charName || 'Build',
    charName: state.charName,
    savedAt: new Date().toISOString(),
    skillLevels: JSON.parse(JSON.stringify(state.skillLevels)),
    combatSpecs:  JSON.parse(JSON.stringify(state.combatSpecs)),
    attributes:   JSON.parse(JSON.stringify(state.attributes)),
    activeSpec:   state.activeSpec,
    activeTab:    state.activeTab,
  };
}

let _autoSaveTimer = null;
function queueAutoSave() {
  clearTimeout(_autoSaveTimer);
  _autoSaveTimer = setTimeout(() => {
    try { localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(buildStateSnapshot('_autosave'))); } catch {}
    renderSaveBar();
  }, 1500);
}

function getAutoSave() {
  try { return JSON.parse(localStorage.getItem(AUTOSAVE_KEY)); } catch { return null; }
}

function saveCurrentBuild() {
  const nameInput = document.getElementById('save-name-input');
  const name = (nameInput ? nameInput.value.trim() : '') || state.charName || 'Build';
  const saves = getSaves();
  saves.unshift(buildStateSnapshot(name));
  if (saves.length > 20) saves.length = 20;   // cap at 20 named saves
  setSaves(saves);
  if (nameInput) nameInput.value = '';
  renderSaveBar();
}

function deleteSaveById(id) {
  setSaves(getSaves().filter(s => s.id !== id));
  renderSaveBar();
}

function applySnapshot(save) {
  state.charName    = save.charName || 'Unknown Peasant';
  state.skillLevels = JSON.parse(JSON.stringify(save.skillLevels || {}));
  state.combatSpecs = JSON.parse(JSON.stringify(save.combatSpecs || {1:{},2:{},3:{},4:{},5:{}}));
  state.attributes  = JSON.parse(JSON.stringify(save.attributes  || {Strength:10,Agility:10,Constitution:10,Intellect:10,Willpower:10}));
  state.activeSpec  = save.activeSpec || 1;
  state.activeTab   = save.activeTab  || 'crafting';
}

function fmtSaveDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch { return ''; }
}

function makeSaveChip(name, date, onLoad, onDelete) {
  const chip = document.createElement('div');
  chip.className = 'save-chip';

  const info = document.createElement('div');
  info.className = 'save-chip-info';
  info.innerHTML =
    `<span class="save-chip-name">${escHtml(name)}</span>` +
    `<span class="save-chip-date">${escHtml(date)}</span>`;
  info.addEventListener('click', onLoad);
  chip.appendChild(info);

  if (onDelete) {
    const del = document.createElement('button');
    del.className = 'save-chip-del';
    del.textContent = '×';
    del.title = 'Delete';
    del.addEventListener('click', e => { e.stopPropagation(); onDelete(); });
    chip.appendChild(del);
  }
  return chip;
}

function renderSaveBar() {
  const slotsEl = document.getElementById('save-slots');
  if (!slotsEl) return;
  slotsEl.innerHTML = '';

  const autosave = getAutoSave();
  const saves    = getSaves();

  if (!autosave && !saves.length) {
    const empty = document.createElement('span');
    empty.className = 'save-slots-empty';
    empty.textContent = 'No saved builds yet — name one above and hit SAVE';
    slotsEl.appendChild(empty);
    return;
  }

  function loadAndRefresh(save) {
    applySnapshot(save);
    updateAllNodes();
    updateStatusBar();
    document.getElementById('char-name-display').textContent = `⚔  ${state.charName}`;
    document.querySelectorAll('.spec-btn').forEach(b => {
      b.classList.toggle('active', +b.dataset.spec === state.activeSpec);
    });
    switchTab(state.activeTab || 'crafting');
    renderSaveBar();
  }

  // Auto-save chip (no delete)
  if (autosave) {
    const chip = makeSaveChip('↩ Continue', fmtSaveDate(autosave.savedAt), () => loadAndRefresh(autosave), null);
    chip.classList.add('autosave-chip');
    slotsEl.appendChild(chip);
  }

  // Named save chips
  for (const save of saves.slice(0, 8)) {
    const chip = makeSaveChip(save.name, fmtSaveDate(save.savedAt),
      () => loadAndRefresh(save),
      () => deleteSaveById(save.id));
    slotsEl.appendChild(chip);
  }
}

function renderStartupSaves() {
  const autosave = getAutoSave();
  const saves    = getSaves();
  if (!autosave && !saves.length) return;

  const container = document.getElementById('startup-saves');
  const listEl    = document.getElementById('startup-saves-list');
  if (!container || !listEl) return;

  container.style.display = '';
  listEl.innerHTML = '';

  const slots = [];
  if (autosave) slots.push({ ...autosave, _isAuto: true });
  saves.slice(0, 3).forEach(s => slots.push(s));

  for (const save of slots.slice(0, 4)) {
    const card = document.createElement('div');
    card.className = 'startup-save-card';
    const invested =
      Object.values(save.skillLevels || {}).filter(v => v > 0).length +
      Object.values(save.combatSpecs || {}).reduce((a, sp) => a + Object.values(sp).filter(v => v > 0).length, 0);

    card.innerHTML =
      `<div class="startup-save-info">` +
        `<div class="startup-save-name">${save._isAuto ? '↩ Continue Last Session' : escHtml(save.name)}</div>` +
        `<div class="startup-save-meta">${escHtml(save.charName || '')}${invested ? ' · ' + invested + ' skills' : ''} · ${fmtSaveDate(save.savedAt)}</div>` +
      `</div>` +
      `<span class="startup-save-arrow">→</span>`;

    card.addEventListener('click', () => {
      applySnapshot(save);
      enterMainScreen();
    });
    listEl.appendChild(card);
  }
}

// ── Enter Main Screen (shared by fresh start + load) ─────────
function enterMainScreen() {
  document.getElementById('startup-screen').style.display = 'none';
  const mainScreen = document.getElementById('main-screen');
  mainScreen.classList.add('visible', 'fade-in');

  document.getElementById('char-name-display').textContent = `⚔  ${state.charName}`;

  // Render trees on first entry only
  const craftingPane = document.getElementById('pane-crafting');
  const combatPane   = document.getElementById('pane-combat');
  const minorPane    = document.getElementById('pane-minor');
  if (!craftingPane.children.length) renderCraftingTree(craftingPane);
  if (!combatPane.children.length)   renderCombatTree(combatPane);
  if (!minorPane.children.length)    renderMinorTree(minorPane);

  updateAllNodes();
  updateStatusBar();

  // Sync spec buttons to loaded spec
  document.querySelectorAll('.spec-btn').forEach(b => {
    b.classList.toggle('active', +b.dataset.spec === state.activeSpec);
  });

  renderSaveBar();
  switchTab(state.activeTab || 'crafting');
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Startup screen
  const startBtn = document.getElementById('start-btn');
  startBtn.addEventListener('click', handleStart);
  document.getElementById('char-name-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleStart();
  });

  // Save bar button
  document.getElementById('save-now-btn').addEventListener('click', saveCurrentBuild);
  document.getElementById('save-name-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') saveCurrentBuild();
  });

  // Show existing saves on startup screen
  renderStartupSaves();

  // Build spec buttons
  const specRow = document.getElementById('spec-btn-row');
  for (let i = 1; i <= 5; i++) {
    const btn = document.createElement('button');
    btn.className = 'spec-btn' + (i === 1 ? ' active' : '');
    btn.dataset.spec = i;
    btn.textContent = i;
    btn.addEventListener('click', () => switchSpec(i));
    specRow.appendChild(btn);
  }

  // Build tab buttons
  const tabDefs = [
    { id: 'crafting', label: 'Crafting' },
    { id: 'combat',   label: 'Combat' },
    { id: 'minor',    label: 'Minor' },
    { id: 'attributes', label: 'Attributes' },
  ];

  const tabBar = document.getElementById('skill-tab-bar');
  tabDefs.forEach(({ id, label }) => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (id === 'crafting' ? ' active' : '');
    btn.dataset.tab = id;
    btn.textContent = label;
    btn.addEventListener('click', () => switchTab(id));
    tabBar.appendChild(btn);
  });

});
