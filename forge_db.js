// Ancestral Forge (Forja Ancestral) - Data Definitions
// 8 modules: Sintese, Alquimia, Criacao, Lapidacao, Gravacao, Inscricao, Extracao, Oferenda

// ─── Materials ──────────────────────────────────────────────────────
// Tiered essence-like currency used by Alquimia/Criacao/Oferenda, separate from Essence (Forge tier-up) and Shards.
const FORGE_MATERIAL_TIERS = ['common', 'rare', 'epic']; // Essencia Comum -> Rara -> Epica
const FORGE_MATERIAL_NAMES = {
  common: 'Essência Comum',
  rare: 'Essência Rara',
  epic: 'Essência Épica'
};

// Alchemy conversion ratio degrades with repeated use (diminishing returns), resets on Prestige.
const ALCHEMY_CONVERSION_STEPS = [
  { uses: 10, ratio: 5 },
  { uses: 20, ratio: 6 },
  { uses: Infinity, ratio: 8 }
];

function getAlchemyRatio(usesSoFar) {
  let cumulative = 0;
  for (const step of ALCHEMY_CONVERSION_STEPS) {
    cumulative += step.uses;
    if (usesSoFar < cumulative) return step.ratio;
  }
  return ALCHEMY_CONVERSION_STEPS[ALCHEMY_CONVERSION_STEPS.length - 1].ratio;
}

// ─── Affinities (Alquimia) ──────────────────────────────────────────
const AFFINITIES = {
  fire:    { name: 'Fogo',    icon: '🔥', color: '#ff5e3a', effect: { spellDmgPct: 0.05 } },
  ice:     { name: 'Gelo',    icon: '❄️', color: '#5ed6ff', effect: { slowOnHitChance: 0.10 } },
  nature:  { name: 'Natureza',icon: '🌿', color: '#2ecc71', effect: { hpRegenPct: 0.10 } },
  arcane:  { name: 'Arcano',  icon: '🔮', color: '#9b59b6', effect: { manaRegenPct: 0.15 } },
  shadow:  { name: 'Trevas',  icon: '🌑', color: '#5c5c7a', effect: { lifestealPct: 0.03 } },
  physical:{ name: 'Físico',  icon: '⚔️', color: '#e5c158', effect: { critChancePct: 0.02 } }
};

// ─── Gems (Lapidação) ───────────────────────────────────────────────
const GEM_TYPES = {
  ruby:    { name: 'Rubi',     icon: '❤️', stats: ['damage', 'critMultPct', 'lifestealPct'] },
  sapphire:{ name: 'Safira',   icon: '💙', stats: ['mana', 'spellDmgPct', 'manaRegenPct'] },
  emerald: { name: 'Esmeralda',icon: '💚', stats: ['attackSpeedPct', 'evasionPct', 'critChancePct'] },
  topaz:   { name: 'Topázio',  icon: '💛', stats: ['goldPct', 'dropChancePct', 'xpPct'] },
  onyx:    { name: 'Ônix',     icon: '🖤', stats: ['armor', 'magicResPct', 'bossDmgPct'] }
};

const GEM_LEVELS = 5; // Gema I..V
const GEM_COMBINE_COUNT = 3; // 3 of level N -> 1 of level N+1
const GEM_LEVEL_POWER = [0.6, 1.0, 1.6, 2.4, 3.4]; // multiplier applied to a base stat roll per gem level (index = level-1)

// Max gem slots per rarity tier (matches item rarity index in RARITIES)
const GEM_SLOTS_BY_RARITY = { common: 0, uncommon: 1, rare: 1, epic: 2, legendary: 3, mythic: 3, immortal: 3 };

function getGemSlotOpenCost(currentSlotCount) {
  // currentSlotCount = slots already opened (0, 1, 2)
  if (currentSlotCount === 0) return { gold: 8000, materials: { rare: 5 } };
  if (currentSlotCount === 1) return { gold: 30000, materials: { epic: 5 } };
  return { gold: 90000, materials: { epic: 15 } }; // 3rd slot, legendary/mythic only enforced by caller
}

// ─── Criação (crafting recipes) ─────────────────────────────────────
// Base rarity roll table for a standard recipe (before catalyst bonus)
const CRAFT_RARITY_TABLE = [
  { rarity: 'uncommon',  chance: 0.55 },
  { rarity: 'rare',      chance: 0.32 },
  { rarity: 'epic',      chance: 0.11 },
  { rarity: 'legendary', chance: 0.019 },
  { rarity: 'mythic',    chance: 0.001 }
];

// Catalysts shift relative chance toward higher rarities (multiplicative on rarity index weight)
const CRAFT_CATALYSTS = {
  none:   { name: 'Nenhum', mult: 1.0, cost: { common: 0 } },
  minor:  { name: 'Catalisador Menor', mult: 1.3, cost: { common: 8 } },
  major:  { name: 'Catalisador Maior', mult: 1.8, cost: { rare: 4 } },
  grand:  { name: 'Catalisador Grandioso', mult: 2.6, cost: { epic: 2 } }
};

function rollCraftRarity(catalystKey = 'none') {
  const catalyst = CRAFT_CATALYSTS[catalystKey] || CRAFT_CATALYSTS.none;
  // Weight each rarity band by index^mult to skew upward without touching 'common' (crafting never yields common)
  const weights = CRAFT_RARITY_TABLE.map((row, idx) => row.chance * Math.pow(catalyst.mult, idx));
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < CRAFT_RARITY_TABLE.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return CRAFT_RARITY_TABLE[i].rarity;
  }
  return CRAFT_RARITY_TABLE[0].rarity;
}

const CRAFT_BASE_COST = { gold: 2000, materials: { common: 10 } };

// ─── Gravação (reforge secondary stats) ─────────────────────────────
const REFORGE_STAT_POOL_OFFENSIVE = ['critChance', 'critMult', 'attackSpeed', 'bossDmgPct', 'damage'];
const REFORGE_STAT_POOL_DEFENSIVE = ['armor', 'magicResPct', 'hpRegen', 'block', 'evasion'];
const REFORGE_BASE_COST = 1200;
const REFORGE_COST_MULT = 1.8;

function getReforgeCost(timesReforged) {
  return Math.round(REFORGE_BASE_COST * Math.pow(REFORGE_COST_MULT, timesReforged));
}

// ─── Inscrição (runewords / special effects) ────────────────────────
const INSCRIPTION_FAMILIES = ['offensive', 'defensive', 'elemental', 'support', 'fortune', 'boss', 'automation'];

const INSCRIPTIONS = {
  storm: {
    id: 'storm', name: 'Inscrição da Tempestade', family: 'offensive', icon: '⚡', compatible: ['weapon', 'artifact'],
    desc: 'Ataques possuem 8% de chance de lançar um raio em outro inimigo.',
    effect: { chainLightningChance: 0.08 }
  },
  winter: {
    id: 'winter', name: 'Inscrição do Inverno', family: 'elemental', icon: '❄️', compatible: ['weapon', 'artifact'],
    desc: 'Ataques contra inimigos congelados causam +15% de dano.',
    effect: { frozenDmgPct: 0.15 }
  },
  executioner_ins: {
    id: 'executioner_ins', name: 'Inscrição do Carrasco', family: 'offensive', icon: '☠️', compatible: ['weapon', 'artifact'],
    desc: 'Inimigos abaixo de 20% de vida recebem +10% de dano deste herói.',
    effect: { lowHpDmgPct: 0.10 }
  },
  echo: {
    id: 'echo', name: 'Inscrição do Eco', family: 'support', icon: '🔁', compatible: ['weapon', 'armor', 'artifact'],
    desc: 'A primeira habilidade utilizada na batalha possui 15% de chance de ser repetida.',
    effect: { firstSkillEchoChance: 0.15 }
  },
  guardian: {
    id: 'guardian', name: 'Inscrição do Guardião', family: 'defensive', icon: '🛡️', compatible: ['armor', 'artifact'],
    desc: 'Ao perder 30% da vida, recebe um escudo de 8% da vida máxima.',
    effect: { shieldOnHpLossPct: 0.08 }
  },
  fortune_ins: {
    id: 'fortune_ins', name: 'Inscrição da Fortuna', family: 'fortune', icon: '🍀', compatible: ['accessory', 'artifact'],
    desc: '+12% de ouro recebido em combate.',
    effect: { goldPct: 0.12 }
  },
  automaton: {
    id: 'automaton', name: 'Inscrição do Autômato', family: 'automation', icon: '⚙️', compatible: ['accessory', 'artifact'],
    desc: '+10% de chance relativa de item ao derrotar chefes.',
    effect: { bossDropChancePct: 0.10 }
  }
};

const INSCRIPTION_COST = { gold: 15000, materials: { epic: 3 } };
const MINOR_INSCRIPTION_MIN_RARITY = 'mythic'; // only Mythic+ items may carry a minor inscription

// ─── Extração (component recovery) ──────────────────────────────────
const EXTRACTION_RECOVERY_RATES = {
  gem:         { common: 0.90, uncommon: 0.85, rare: 0.75, epic: 0.60, legendary: 0.45, mythic: 0.30, immortal: 0.20 },
  inscription: { common: 0.90, uncommon: 0.80, rare: 0.65, epic: 0.50, legendary: 0.30, mythic: 0.15, immortal: 0.10 }
};
const EXTRACTION_SAFE_COST_MULT = 3.0; // "safe" extraction guarantees recovery at higher cost
const EXTRACTION_BASE_COST = 4000;

// ─── Oferenda (altar / sacrifice) ────────────────────────────────────
function getOfferingValue(inst, itemLevel) {
  const rarityIdx = RARITIES.indexOf(inst.rarity || 'common');
  const rarityMult = [1, 2, 4, 8, 20, 45, 90][rarityIdx] || 1;
  const qualityMult = 1 + ((inst.tier || 0) * 0.15);
  const attrMult = 1 + ((inst.modifiers ? inst.modifiers.length : 0) * 0.15);
  const inscriptionMult = inst.inscription ? 1.5 : 1.0;
  return Math.round(rarityMult * Math.max(1, itemLevel || 1) * qualityMult * attrMult * inscriptionMult);
}

const ALTAR_FAVOR_THRESHOLD = 10000;
const GRAND_RITUAL_THRESHOLD = 50000; // fed only by Legendary+ offerings

const ALTAR_BLESSINGS = [
  { id: 'gold', name: '+15% de Ouro', icon: '🪙', durationSec: 4 * 3600, effect: { goldPct: 0.15 } },
  { id: 'xp', name: '+10% de Experiência', icon: '⭐', durationSec: 4 * 3600, effect: { xpPct: 0.10 } },
  { id: 'drop', name: '+10% de Chance de Equipamento', icon: '🎁', durationSec: 4 * 3600, effect: { dropChanceRelPct: 0.10 } },
  { id: 'materials', name: '+15% de Materiais', icon: '🧪', durationSec: 4 * 3600, effect: { materialsPct: 0.15 } },
  { id: 'bossdmg', name: '+10% de Dano contra Chefes', icon: '⚔️', durationSec: 4 * 3600, effect: { bossDmgPct: 0.10 } }
];

// ─── Forge level progression ──────────────────────────────────────────
const FORGE_LEVEL_UNLOCKS = {
  1: 'synthesis',
  2: 'creation',
  3: 'alchemy',
  5: 'lapidary',
  7: 'reforge',
  10: 'inscription',
  12: 'extraction',
  15: 'offering_advanced'
};

const FORGE_MODULE_NAMES = {
  synthesis: 'Síntese',
  alchemy: 'Alquimia',
  creation: 'Criação',
  lapidary: 'Lapidação',
  reforge: 'Gravação',
  inscription: 'Inscrição',
  extraction: 'Extração',
  offering: 'Oferenda'
};

// XP required for the Forge to reach a given level (simple geometric ramp)
function getForgeLevelXpReq(level) {
  return Math.round(500 * Math.pow(1.35, level - 1));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FORGE_MATERIAL_TIERS, FORGE_MATERIAL_NAMES, getAlchemyRatio,
    AFFINITIES, GEM_TYPES, GEM_LEVELS, GEM_COMBINE_COUNT, GEM_LEVEL_POWER, GEM_SLOTS_BY_RARITY, getGemSlotOpenCost,
    CRAFT_RARITY_TABLE, CRAFT_CATALYSTS, rollCraftRarity, CRAFT_BASE_COST,
    REFORGE_STAT_POOL_OFFENSIVE, REFORGE_STAT_POOL_DEFENSIVE, getReforgeCost,
    INSCRIPTION_FAMILIES, INSCRIPTIONS, INSCRIPTION_COST, MINOR_INSCRIPTION_MIN_RARITY,
    EXTRACTION_RECOVERY_RATES, EXTRACTION_SAFE_COST_MULT, EXTRACTION_BASE_COST,
    getOfferingValue, ALTAR_FAVOR_THRESHOLD, GRAND_RITUAL_THRESHOLD, ALTAR_BLESSINGS,
    FORGE_LEVEL_UNLOCKS, FORGE_MODULE_NAMES, getForgeLevelXpReq
  };
}
