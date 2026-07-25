// Dota 2 Idle Arena - Core Game Code

// --- AUDIO SYNTH ENGINE ---
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = true;
    this.volume = 0.3;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playHit() {
    if (this.muted || !this.ctx) return;
    this.init();
    let osc = this.ctx.createOscillator();
    let gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  }

  playCoin() {
    if (this.muted || !this.ctx) return;
    this.init();
    let osc = this.ctx.createOscillator();
    let gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, this.ctx.currentTime);
    osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(this.volume * 0.8, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.26);
  }

  playSpell() {
    if (this.muted || !this.ctx) return;
    this.init();
    let osc = this.ctx.createOscillator();
    let gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(this.volume * 0.6, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.36);
  }

  playLevelUp() {
    if (this.muted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      let osc = this.ctx.createOscillator();
      let gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(this.volume * 0.7, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.22);
    });
  }

  playDefeat() {
    if (this.muted || !this.ctx) return;
    this.init();
    let osc = this.ctx.createOscillator();
    let gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.65);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.66);
  }

  playRareDrop() {
    if (this.muted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;
    const notes = [587.33, 698.46, 880.00, 1046.50, 1396.91]; // D5, F5, A5, C6, F6
    notes.forEach((freq, idx) => {
      let osc = this.ctx.createOscillator();
      let gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(this.volume * 0.8, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.32);
    });
  }
}

const sfx = new SoundEngine();

// --- HERO PORTRAIT/EMOJI DIRECTORY ---
let HERO_TEMPLATES = {
  sven: { id: 'sven', name: 'Sven', type: 'strength', emoji: '⚔️', baseDamage: 38, baseHp: 620, baseMana: 200, baseStr: 22, baseAgi: 16, baseInt: 16, strGrowth: 3.2, agiGrowth: 2.0, intGrowth: 1.3, role: 'Tank / Cleave physical dealer', skills: [
    { name: 'Storm Hammer', desc: 'Stuns the enemy, dealing 80 + 40/Lvl magic damage.', cost: 80, cd: 8, level: 0 },
    { name: 'Great Cleave', desc: 'Passively increases normal attack damage by 15% per Lvl.', cost: 0, cd: 0, level: 0 },
    { name: "God's Strength", desc: 'Active ultimate: boosts physical damage by 100% for 12s.', cost: 125, cd: 25, level: 0 }
  ]},
  crystal_maiden: { id: 'crystal_maiden', name: 'Crystal Maiden', type: 'intelligence', emoji: '❄️', baseDamage: 28, baseHp: 500, baseMana: 260, baseStr: 17, baseAgi: 14, baseInt: 20, strGrowth: 2.0, agiGrowth: 1.6, intGrowth: 3.3, role: 'Support / Mana regen aura / Spellcaster', skills: [
    { name: 'Crystal Nova', desc: 'Deals 60 + 35/Lvl magic damage and slows enemy attack rate.', cost: 95, cd: 7, level: 0 },
    { name: 'Arcane Aura', desc: 'Passively adds +0.5 mana regen/s globally per Lvl.', cost: 0, cd: 0, level: 0 },
    { name: 'Freezing Field', desc: 'Channeling ultimate: Deals 200 + 100/Lvl damage over 6s.', cost: 180, cd: 24, level: 0 }
  ]},
  drow_ranger: { id: 'drow_ranger', name: 'Drow Ranger', type: 'agility', emoji: '🏹', baseDamage: 34, baseHp: 520, baseMana: 180, baseStr: 18, baseAgi: 20, baseInt: 15, strGrowth: 1.9, agiGrowth: 3.4, intGrowth: 1.4, role: 'Fast single-target physical DPS', skills: [
    { name: 'Frost Arrows', desc: 'Infuses arrows, adding +15 + 10/Lvl physical attack damage.', cost: 12, cd: 0, level: 0 },
    { name: 'Precision Aura', desc: 'Passively boosts Drow attack speed by 8% per Lvl.', cost: 0, cd: 0, level: 0 },
    { name: 'Marksmanship', desc: 'Active ultimate: deals 200% damage with 25% + 5%/Lvl proc chance.', cost: 60, cd: 15, level: 0 }
  ]},
  juggernaut: { id: 'juggernaut', name: 'Juggernaut', type: 'agility', emoji: '🛡️', baseDamage: 30, baseHp: 540, baseMana: 200, baseStr: 20, baseAgi: 22, baseInt: 14, strGrowth: 2.2, agiGrowth: 2.8, intGrowth: 1.4, role: 'Melee agility / Spell immunity / Crit strike', recruitCost: 50, skills: [
    { name: 'Blade Fury', desc: 'Deals 80 + 40/Lvl magic damage/s and grants immunity for 5s.', cost: 110, cd: 12, level: 0 },
    { name: 'Blade Dance', desc: 'Passively gives 20% + 5%/Lvl chance for 1.8x crit strike.', cost: 0, cd: 0, level: 0 },
    { name: 'Omnislash', desc: 'Slashes rapidly, dealing 300 + 150/Lvl physical burst.', cost: 200, cd: 26, level: 0 }
  ]},
  lina: { id: 'lina', name: 'Lina', type: 'intelligence', emoji: '🔥', baseDamage: 27, baseHp: 510, baseMana: 280, baseStr: 19, baseAgi: 16, baseInt: 24, strGrowth: 2.0, agiGrowth: 1.5, intGrowth: 3.8, role: 'Bursty spellcaster / Attack speed scaling', recruitCost: 150, skills: [
    { name: 'Dragon Slave', desc: 'Deals 90 + 45/Lvl magic wave damage.', cost: 100, cd: 6, level: 0 },
    { name: 'Fiery Soul', desc: 'Passive: Spells cast boost self attack speed by 15% + 10%/Lvl.', cost: 0, cd: 0, level: 0 },
    { name: 'Laguna Blade', desc: 'Deals 450 + 250/Lvl single-target lightning damage.', cost: 250, cd: 28, level: 0 }
  ]},
  axe: { id: 'axe', name: 'Axe', type: 'strength', emoji: '🪓', baseDamage: 26, baseHp: 680, baseMana: 180, baseStr: 25, baseAgi: 15, baseInt: 16, strGrowth: 3.6, agiGrowth: 1.7, intGrowth: 1.6, role: 'Taunting tank / Helix counter procs', recruitCost: 200, skills: [
    { name: "Berserker's Call", desc: 'Taunts enemy and adds +30 armor for 4 seconds.', cost: 80, cd: 10, level: 0 },
    { name: 'Counter Helix', desc: 'Passive: 18% + 2%/Lvl chance to spin dealing 60 + 30/Lvl physical damage when attacked.', cost: 0, cd: 0, level: 0 },
    { name: 'Culling Blade', desc: 'Executes enemy instantly if below 250 + 150/Lvl HP, else deals basic damage.', cost: 100, cd: 20, level: 0 }
  ]},
  invoker: { id: 'invoker', name: 'Invoker', type: 'intelligence', emoji: '🔮', baseDamage: 30, baseHp: 540, baseMana: 300, baseStr: 19, baseAgi: 14, baseInt: 22, strGrowth: 2.4, agiGrowth: 1.9, intGrowth: 4.0, role: 'Multi-element Spellcaster / High spell bursts', recruitCost: 0, dotaCoinCost: 6000, skills: [
    { name: 'Cold Snap', desc: 'Stuns enemy periodically, dealing 30 + 15/Lvl per proc.', cost: 100, cd: 9, level: 0 },
    { name: 'Alacrity', desc: 'Boosts attack speed by 30% + 15%/Lvl for 9 seconds.', cost: 80, cd: 12, level: 0 },
    { name: 'Sun Strike', desc: 'Deals 250 + 120/Lvl pure damage globally.', cost: 175, cd: 22, level: 0 }
  ]},
  // ─── Premium heroes: Dota Coins + active Dota Plus required (see PREMIUM_HERO_IDS) ──
  sniper: { id: 'sniper', name: 'Sniper', type: 'agility', emoji: '🏹', image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/sniper.png', baseDamage: 32, baseHp: 520, baseMana: 180, baseStr: 18, baseAgi: 24, baseInt: 15, strGrowth: 2.0, agiGrowth: 3.2, intGrowth: 1.4, role: 'Long-range Carry / Nuker', recruitCost: 0, dotaCoinCost: 4000, skills: [
    { name: 'Shrapnel', desc: 'Launches a shrapnel shell that showers the target area in explosive pellets, dealing 20 + 8/Lvl damage per second and slowing enemies.', cost: 80, cd: 8, level: 0 },
    { name: 'Headshot', desc: 'Passive: chance to deal 20 + 10/Lvl bonus damage and knock back the target on attack.', cost: 0, cd: 0, level: 0 },
    { name: 'Assassinate', desc: 'Fires a devastating long-range shot dealing 300 + 140/Lvl damage to a single target.', cost: 175, cd: 24, level: 0 }
  ]},
  phantom_assassin: { id: 'phantom_assassin', name: 'Phantom Assassin', type: 'agility', emoji: '🏹', image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/phantom_assassin.png', baseDamage: 36, baseHp: 570, baseMana: 180, baseStr: 18, baseAgi: 24, baseInt: 15, strGrowth: 2.0, agiGrowth: 3.2, intGrowth: 1.4, role: 'Critical-strike Carry / Escape', recruitCost: 0, dotaCoinCost: 4000, skills: [
    { name: 'Stifling Dagger', desc: 'Throws a dagger that slows the target and deals 65 + 30% of attack damage.', cost: 80, cd: 8, level: 0 },
    { name: 'Phantom Strike', desc: 'Blinks to a target unit, granting bonus attack speed if it is an enemy.', cost: 95, cd: 10, level: 0 },
    { name: 'Coup de Grace', desc: 'Passive: attacks have a 15% + 5%/Lvl chance to deal a massive critical strike (450% damage).', cost: 0, cd: 0, level: 0 }
  ]},
  outworld_devourer: { id: 'outworld_devourer', name: 'Outworld Devourer', type: 'intelligence', emoji: '❄️', image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/obsidian_destroyer.png', baseDamage: 28, baseHp: 500, baseMana: 260, baseStr: 17, baseAgi: 16, baseInt: 25, strGrowth: 1.9, agiGrowth: 1.6, intGrowth: 3.4, role: 'Mana-scaling Carry / Nuker / Disabler', recruitCost: 0, dotaCoinCost: 4000, skills: [
    { name: 'Arcane Orb', desc: 'Adds extra pure damage to attacks based on remaining mana pool.', cost: 80, cd: 8, level: 0 },
    { name: 'Astral Imprisonment', desc: 'Steals a percentage of the target\'s max mana and banishes them briefly.', cost: 95, cd: 10, level: 0 },
    { name: 'Sanity\'s Eclipse', desc: 'Deals pure damage based on the target\'s missing mana within an area.', cost: 175, cd: 24, level: 0 }
  ]},
  oracle: { id: 'oracle', name: 'Oracle', type: 'intelligence', emoji: '❄️', image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/oracle.png', baseDamage: 28, baseHp: 500, baseMana: 260, baseStr: 17, baseAgi: 16, baseInt: 25, strGrowth: 1.9, agiGrowth: 1.6, intGrowth: 3.4, role: 'Support / Nuker / Disabler / Escape', recruitCost: 0, dotaCoinCost: 4000, skills: [
    { name: "Fortune's End", desc: 'Channeled bolt that damages and roots the target, dealing 100 + 50/Lvl damage.', cost: 80, cd: 8, level: 0 },
    { name: "Fate's Edict", desc: 'Disarms a target while granting 100% magic resistance for its duration.', cost: 95, cd: 10, level: 0 },
    { name: 'Purifying Flames', desc: 'Burns the target for 100 + 60/Lvl magic damage, or heals an ally for the same amount.', cost: 150, cd: 24, level: 0 }
  ]},
  techies: { id: 'techies', name: 'Techies', type: 'universal', emoji: '🌀', image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/techies.png', baseDamage: 31, baseHp: 550, baseMana: 200, baseStr: 20, baseAgi: 20, baseInt: 20, strGrowth: 2.4, agiGrowth: 2.4, intGrowth: 2.4, role: 'Nuker / Disabler / Area denial', recruitCost: 0, dotaCoinCost: 4000, skills: [
    { name: 'Sticky Bomb', desc: 'Lobs a bomb that sticks to the first enemy hero it touches, detonating for 90 + 40/Lvl damage.', cost: 80, cd: 8, level: 0 },
    { name: 'Reactive Tazer', desc: 'Triggers an electric charge, slowing an enemy or hasting an ally briefly.', cost: 95, cd: 10, level: 0 },
    { name: 'Blast Off!', desc: 'Hurtles into the enemy midst, detonating charges for 260 + 130/Lvl damage in an area.', cost: 150, cd: 24, level: 0 }
  ]}
};

// Heroes exclusive to Dota Plus subscribers, purchasable only with Dota Coins (not Shards)
const PREMIUM_HERO_IDS = ['invoker', 'sniper', 'phantom_assassin', 'outworld_devourer', 'oracle', 'techies'];
function getPremiumHeroCoinCost(heroId) {
  return HERO_TEMPLATES[heroId] && HERO_TEMPLATES[heroId].dotaCoinCost ? HERO_TEMPLATES[heroId].dotaCoinCost : 4000;
}

// ═══════════════════ HERO TALENT TREE (per-hero passive talents) ═══════════════════
// Generic passive talent catalog. statKey maps to a bonus accumulator inside getHeroStats().
// Percent-based stats (evasion/crit/spellAmp/lifesteal) are stored as fractions (perRank already /100).
const TALENT_DEFS = {
  hp_flat:      { name: 'Vitalidade',        icon: '❤️', statKey: 'bonusHp',            perRank: 40,    maxRank: 4 },
  hp_regen:     { name: 'Regeneração',       icon: '💗', statKey: 'bonusHpRegen',       perRank: 0.8,   maxRank: 4 },
  armor:        { name: 'Pele de Ferro',     icon: '🛡️', statKey: 'bonusArmor',         perRank: 1.2,   maxRank: 4 },
  block:        { name: 'Deflexão',          icon: '🔰', statKey: 'bonusBlock',         perRank: 3,     maxRank: 4 },
  damage_flat:  { name: 'Força Bruta',       icon: '💥', statKey: 'bonusDmg',           perRank: 4,     maxRank: 4 },
  atk_speed:    { name: 'Ímpeto',            icon: '⚡', statKey: 'bonusASFlat',        perRank: 4,     maxRank: 4 },
  evasion:      { name: 'Agilidade',         icon: '🍃', statKey: 'bonusEvasionPct',    perRank: 0.015, maxRank: 4 },
  crit_chance:  { name: 'Precisão',          icon: '🎯', statKey: 'bonusCritChance',    perRank: 0.015, maxRank: 4 },
  mana_flat:    { name: 'Reserva Arcana',    icon: '🔵', statKey: 'bonusMana',          perRank: 15,    maxRank: 4 },
  spell_amp:    { name: 'Foco Arcano',       icon: '✨', statKey: 'bonusSpellAmpPct',    perRank: 0.012, maxRank: 4 },
  lifesteal:    { name: 'Vampirismo',        icon: '🩸', statKey: 'bonusLifestealPct',  perRank: 0.01,  maxRank: 4 }
};

// Fixed tier templates per hero attribute type. 10 tiers, unlocking every 10 hero levels.
// Content is generic/shared (not per-hero authored) — every hero of a given type sees the same tree.
const TALENT_TIER_LEVELS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
const HERO_TALENT_TIERS = {
  strength: [
    ['hp_flat', 'armor'],
    ['hp_regen', 'block'],
    ['hp_flat', 'damage_flat'],
    ['armor', 'block'],
    ['hp_flat', 'hp_regen', 'damage_flat'],
    ['armor', 'lifesteal'],
    ['hp_flat', 'block'],
    ['hp_regen', 'damage_flat'],
    ['armor', 'hp_flat', 'block'],
    ['damage_flat', 'lifesteal']
  ],
  agility: [
    ['atk_speed', 'evasion'],
    ['crit_chance', 'damage_flat'],
    ['atk_speed', 'crit_chance'],
    ['evasion', 'armor'],
    ['atk_speed', 'evasion', 'crit_chance'],
    ['damage_flat', 'lifesteal'],
    ['crit_chance', 'block'],
    ['atk_speed', 'damage_flat'],
    ['evasion', 'crit_chance', 'atk_speed'],
    ['lifesteal', 'damage_flat']
  ],
  intelligence: [
    ['mana_flat', 'spell_amp'],
    ['hp_regen', 'mana_flat'],
    ['spell_amp', 'damage_flat'],
    ['mana_flat', 'hp_regen'],
    ['spell_amp', 'mana_flat', 'hp_regen'],
    ['damage_flat', 'spell_amp'],
    ['mana_flat', 'block'],
    ['hp_regen', 'spell_amp'],
    ['mana_flat', 'spell_amp', 'hp_flat'],
    ['damage_flat', 'lifesteal']
  ],
  universal: [
    ['hp_flat', 'atk_speed'],
    ['mana_flat', 'armor'],
    ['damage_flat', 'evasion'],
    ['hp_regen', 'crit_chance'],
    ['hp_flat', 'spell_amp', 'block'],
    ['damage_flat', 'lifesteal'],
    ['armor', 'atk_speed'],
    ['mana_flat', 'hp_regen'],
    ['evasion', 'crit_chance', 'damage_flat'],
    ['damage_flat', 'lifesteal']
  ]
};

function getHeroTalentTiers(heroId) {
  const h = state.heroes[heroId];
  const type = (h && HERO_TALENT_TIERS[h.type]) ? h.type : 'universal';
  return HERO_TALENT_TIERS[type];
}

function isTalentTierUnlocked(heroId, tierIdx) {
  const h = state.heroes[heroId];
  return !!h && h.level >= TALENT_TIER_LEVELS[tierIdx];
}

function getTalentRank(heroId, talentId) {
  const h = state.heroes[heroId];
  return (h && h.talentRanks && h.talentRanks[talentId]) || 0;
}

// --- MULTI-LAYER ITEM SYSTEM DATABASE ---
// Base types that roll stats dynamically
let BASE_ITEMS_DB = {
  sword: { name: 'Broadsword', emoji: '🗡️', slotType: 'weapon', desc: 'Balanced iron blade.', stats: { damage: 6, critChance: 0.05 } },
  bow: { name: 'Hunter Bow', emoji: '🏹', slotType: 'weapon', desc: 'Flexible composite wood bow.', stats: { damage: 4, attackSpeed: 10 } },
  staff: { name: 'Wizard Staff', emoji: '🔮', slotType: 'weapon', desc: 'Focuses inner magical aura.', stats: { int: 4, spellAmp: 0.04 } },
  shield: { name: 'Stout Shield', emoji: '🛡️', slotType: 'armor', desc: 'Sturdy wooden protection.', stats: { armor: 3, block: 10 } },
  helmet: { name: 'Iron Helmet', emoji: '🪖', slotType: 'armor', desc: 'Plate head protection.', stats: { str: 3, hpRegen: 1.5 } },
  plate: { name: 'Plate Armor', emoji: '👕', slotType: 'armor', desc: 'Steel body plate.', stats: { armor: 5, hp: 80 } },
  boots: { name: 'Speed Boots', emoji: '🥾', slotType: 'accessory', desc: 'Light leather footwear.', stats: { attackSpeed: 15 } },
  ring: { name: 'Regen Ring', emoji: '💍', slotType: 'accessory', desc: 'Imbued with a soft light.', stats: { hpRegen: 2.0, manaRegen: 0.8 } }
};

// Artifacts (Unique/Set items with high stats placed in slot 7)
let ARTIFACTS_DB = {
  divine_rapier: { id: 'divine_rapier', name: 'Divine Rapier', emoji: '🔱', slotType: 'artifact', stats: { damage: 250 }, desc: 'DANGER: Item drops if your entire team is wiped!' },
  butterfly: { id: 'butterfly', name: 'Butterfly', emoji: '🦋', slotType: 'artifact', stats: { agi: 25, attackSpeed: 20, evasion: 0.25 }, desc: 'Improves reflexes and dodging.' },
  daedalus: { id: 'daedalus', name: 'Daedalus', emoji: '🏹', slotType: 'artifact', stats: { damage: 65, critChance: 0.25, critMult: 2.0 }, desc: 'Deals massive critical physical damage.' },
  heart_tarrasque: { id: 'heart_tarrasque', name: 'Heart of Tarrasque', emoji: '💚', slotType: 'artifact', stats: { hp: 500, hpRegen: 20.0 }, desc: 'Deep health and recovery.' },
  assault_cuirass: { id: 'assault_cuirass', name: 'Assault Cuirass', emoji: '👚', slotType: 'artifact', stats: { armor: 12, attackSpeed: 25 }, desc: 'Gives attack speed aura to all teammates.' },
  abyssal_blade: { id: 'abyssal_blade', name: 'Abyssal Blade', emoji: '🗡️', slotType: 'artifact', stats: { damage: 40, hp: 200, stunChance: 0.2 }, desc: 'Attacks can stun targets.' },
  satanic: { id: 'satanic', name: 'Satanic', emoji: '🎭', slotType: 'artifact', stats: { damage: 30, hp: 250, lifesteal: 0.25 }, desc: 'Unholy physical lifesteal.' },
  black_king_bar: { id: 'black_king_bar', name: 'Black King Bar', emoji: '🛡️', slotType: 'artifact', stats: { str: 15, damage: 20, spellImmunity: 0.50 }, desc: 'Reduces magical damage taken.' }
};

// Item Modifiers list (obtained dynamically when rolling Rare+)
const ITEM_MODIFIERS = [
  { id: 'bounce', text: 'Ataques possuem 10% de chance de ricochetear', target: 'ranged' },
  { id: 'crit_mana', text: 'Ataques críticos recuperam +5% de mana máxima', target: 'all' },
  { id: 'splash', text: 'Ataques corpo a corpo causam 15% de dano em área', target: 'melee' },
  { id: 'shield_low', text: 'Ganha um escudo de 30% da vida máxima quando abaixo de 30% HP', target: 'all' },
  { id: 'double_cast', text: 'Habilidades possuem 15% de chance de serem lançadas duas vezes', target: 'all' },
  { id: 'chill_boost', text: 'Inimigos lentos/congelados sofrem 20% mais dano físico', target: 'all' },
  { id: 'haste_on_kill', text: 'Matar um inimigo concede +25% de velocidade de ataque por 5s', target: 'all' },
  { id: 'gold_boost', text: '+15% de ganho de ouro', target: 'all' }
];

// Compendium collection definitions
const COMPENDIUM_COLS = {
  weapon: { name: 'Weapons', items: ['sword', 'bow', 'staff'], bonus: '+3% Dano Global', discovered: [] },
  armor: { name: 'Armor Protection', items: ['shield', 'helmet', 'plate'], bonus: '+3 Armadura Global', discovered: [] },
  accessory: { name: 'Accessories & Speed', items: ['boots', 'ring'], bonus: '+5% Velocidade de Ataque Global', discovered: [] }
};

// ─── TEAM SYNERGIES DEFINITIONS ──────────────────────────────────────────────
// Each synergy: icon, name, cssClass, description (for tooltip), check(ids[]) → bool, bonuses object
const TEAM_SYNERGIES = [
  // ── Attribute synergies ─────────────────────────────────────────────────────
  {
    id: 'str2', icon: '💪', name: 'Linha de Frente', cssClass: 'syn-strength',
    badge: 'FORÇA ×2',
    desc: '+12% HP máx do time',
    check: ids => ids.filter(id => HERO_TEMPLATES[id] && HERO_TEMPLATES[id].type === 'strength').length >= 2,
    bonuses: { hpMult: 1.12 }
  },
  {
    id: 'str3', icon: '🛡️', name: 'Muralha de Aço', cssClass: 'syn-strength',
    badge: 'FORÇA ×3',
    desc: '+25% HP máx + 8 de armadura',
    check: ids => ids.filter(id => HERO_TEMPLATES[id] && HERO_TEMPLATES[id].type === 'strength').length >= 3,
    bonuses: { hpMult: 1.25, armor: 8 }
  },
  {
    id: 'agi2', icon: '⚡', name: 'Reflexos Ágeis', cssClass: 'syn-agility',
    badge: 'AGI ×2',
    desc: '+18% velocidade de ataque',
    check: ids => ids.filter(id => HERO_TEMPLATES[id] && HERO_TEMPLATES[id].type === 'agility').length >= 2,
    bonuses: { attackSpeedMult: 1.18 }
  },
  {
    id: 'agi3', icon: '🏹', name: 'Dança das Lâminas', cssClass: 'syn-agility',
    badge: 'AGI ×3',
    desc: '+30% velocidade de ataque + 8% de evasão',
    check: ids => ids.filter(id => HERO_TEMPLATES[id] && HERO_TEMPLATES[id].type === 'agility').length >= 3,
    bonuses: { attackSpeedMult: 1.30, evasion: 0.08 }
  },
  {
    id: 'int2', icon: '🧠', name: 'Mentes Arcanas', cssClass: 'syn-intel',
    badge: 'INT ×2',
    desc: '+20% regen de mana + 8% amp mágico',
    check: ids => ids.filter(id => HERO_TEMPLATES[id] && HERO_TEMPLATES[id].type === 'intelligence').length >= 2,
    bonuses: { manaRegenMult: 1.20, spellAmpFlat: 0.08 }
  },
  {
    id: 'int3', icon: '🔮', name: 'Círculo Arcano', cssClass: 'syn-intel',
    badge: 'INT ×3',
    desc: '+35% regen de mana + 20% amp mágico',
    check: ids => ids.filter(id => HERO_TEMPLATES[id] && HERO_TEMPLATES[id].type === 'intelligence').length >= 3,
    bonuses: { manaRegenMult: 1.35, spellAmpFlat: 0.20 }
  },
  // ── Named hero combos ────────────────────────────────────────────────────────
  {
    id: 'fire_ice', icon: '🔥❄️', name: 'Fogo e Gelo', cssClass: 'syn-combo',
    badge: 'COMBO',
    desc: 'Lina + CM: +25% amp mágico total',
    check: ids => ids.includes('lina') && ids.includes('crystal_maiden'),
    bonuses: { spellAmpFlat: 0.25 }
  },
  {
    id: 'brawlers', icon: '🪓⚔️', name: 'Os Brutais', cssClass: 'syn-combo',
    badge: 'COMBO',
    desc: 'Axe + Sven: +20% dano físico + taunt chance +10%',
    check: ids => ids.includes('axe') && ids.includes('sven'),
    bonuses: { damageMult: 1.20 }
  },
  {
    id: 'carry_duo', icon: '🏹🛡️', name: 'Dupla de Carry', cssClass: 'syn-combo',
    badge: 'COMBO',
    desc: 'Drow + Jugg: +22% velocidade de ataque juntos',
    check: ids => ids.includes('drow_ranger') && ids.includes('juggernaut'),
    bonuses: { attackSpeedMult: 1.22 }
  },
  {
    id: 'invoker_cm', icon: '🔮❄️', name: 'Mestres dos Elementos', cssClass: 'syn-combo',
    badge: 'COMBO',
    desc: 'Invoker + CM: +30% regen mana + Freezing Field ampliado',
    check: ids => ids.includes('invoker') && ids.includes('crystal_maiden'),
    bonuses: { manaRegenMult: 1.30, spellAmpFlat: 0.10 }
  },
  {
    id: 'classics', icon: '⭐', name: 'Os Clássicos', cssClass: 'syn-combo',
    badge: 'ICONIC',
    desc: 'Sven + CM + Drow: +10% em todas as stats',
    check: ids => ids.includes('sven') && ids.includes('crystal_maiden') && ids.includes('drow_ranger'),
    bonuses: { hpMult: 1.10, damageMult: 1.10, attackSpeedMult: 1.10, manaRegenMult: 1.10 }
  },
  {
    id: 'full_strength', icon: '🏆', name: 'Força Pura', cssClass: 'syn-strength',
    badge: 'MASTERY',
    desc: 'Time 100% Força: +40% HP + 15 armadura',
    check: ids => ids.length > 0 && ids.every(id => HERO_TEMPLATES[id] && HERO_TEMPLATES[id].type === 'strength'),
    bonuses: { hpMult: 1.40, armor: 15 }
  },
  {
    id: 'full_intel', icon: '✨', name: 'Supremacia Arcana', cssClass: 'syn-intel',
    badge: 'MASTERY',
    desc: 'Time 100% Int: +50% amp mágico total',
    check: ids => ids.length > 0 && ids.every(id => HERO_TEMPLATES[id] && HERO_TEMPLATES[id].type === 'intelligence'),
    bonuses: { spellAmpFlat: 0.50 }
  }
];

/**
 * Returns the list of synergy definitions that are currently ACTIVE
 * given the heroes in the active lineup.
 */
function getActiveSynergies(heroIds) {
  return TEAM_SYNERGIES.filter(syn => syn.check(heroIds));
}

/**
 * Aggregates all bonuses from active synergies into a single object.
 * Returns multipliers and flat additions that getHeroStats() applies.
 */
function getSynergyBonuses(heroIds) {
  const active = getActiveSynergies(heroIds);
  const result = {
    hpMult: 1.0,
    damageMult: 1.0,
    attackSpeedMult: 1.0,
    manaRegenMult: 1.0,
    spellAmpFlat: 0.0,
    armor: 0,
    evasion: 0.0
  };
  // Higher-tier attribute synergies supersede lower ones for the same axis
  // (they're additive for combo, multiplicative for attrs — keep it simple: stack all)
  active.forEach(syn => {
    if (syn.bonuses.hpMult)          result.hpMult          *= syn.bonuses.hpMult;
    if (syn.bonuses.damageMult)      result.damageMult       *= syn.bonuses.damageMult;
    if (syn.bonuses.attackSpeedMult) result.attackSpeedMult  *= syn.bonuses.attackSpeedMult;
    if (syn.bonuses.manaRegenMult)   result.manaRegenMult    *= syn.bonuses.manaRegenMult;
    if (syn.bonuses.spellAmpFlat)    result.spellAmpFlat     += syn.bonuses.spellAmpFlat;
    if (syn.bonuses.armor)           result.armor            += syn.bonuses.armor;
    if (syn.bonuses.evasion)         result.evasion          += syn.bonuses.evasion;
  });
  return result;
}

/**
 * Renders the synergy panel in the HUD sidebar.
 * Shows all synergies — active ones lit up, inactive ones dimmed.
 */
function renderSynergies() {
  const panel = document.getElementById('synergy-panel');
  if (!panel) return;

  const activeSynergies = getActiveSynergies(activeHeroes);
  const activeIds = new Set(activeSynergies.map(s => s.id));

  if (activeHeroes.length === 0) {
    panel.innerHTML = '<div style="font-size:0.7rem;color:var(--text-dark);text-align:center;padding:6px 0;">Adicione heróis ao time para ver sinergias.</div>';
  } else {
    // Collapsed view with active icons and count
    const iconsHtml = TEAM_SYNERGIES.map(syn => {
      const isActive = activeIds.has(syn.id);
      if (!isActive) return '';
      return `<span style="font-size: 1.1rem; background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); padding: 4px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px;" title="${syn.name}">${syn.icon}</span>`;
    }).join('');

    const activeCount = TEAM_SYNERGIES.filter(syn => activeIds.has(syn.id)).length;
    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-light); border-radius: 8px; width: 100%;">
        <div style="display: flex; gap: 4px; flex-wrap: wrap; flex: 1;">
          ${iconsHtml || '<span style="font-size: 0.75rem; color: var(--text-dark);">Nenhuma ativa</span>'}
        </div>
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--secondary-gold); display: flex; align-items: center; gap: 2px; margin-left: 8px; white-space: nowrap;">
          <span>${activeCount} / 5 Ativas</span>
          <span>&gt;</span>
        </div>
      </div>
    `;
  }

  // Populate the modal list
  const modalList = document.getElementById('synergies-modal-list');
  if (modalList) {
    const hiddenIfHigher = { 'str2': 'str3', 'agi2': 'agi3', 'int2': 'int3' };
    modalList.innerHTML = TEAM_SYNERGIES.map(syn => {
      const isActive = activeIds.has(syn.id);
      const suppressedBy = hiddenIfHigher[syn.id];
      if (suppressedBy && activeIds.has(suppressedBy)) return '';

      return `
        <div class="synergy-row ${isActive ? 'active' : 'inactive'}" style="display: flex; align-items: center; gap: 12px; padding: 10px; background: ${isActive ? 'rgba(46,204,113,0.08)' : 'rgba(255,255,255,0.02)'}; border: 1px solid ${isActive ? 'var(--xp-green)' : 'var(--border-light)'}; border-radius: 8px;">
          <span class="synergy-icon" style="font-size: 1.3rem;">${syn.icon}</span>
          <div class="synergy-info" style="flex: 1; min-width: 0; text-align: left;">
            <div class="synergy-name" style="font-weight: 700; font-size: 0.85rem; color: ${isActive ? 'var(--xp-green)' : 'var(--text-primary)'};">${syn.name}</div>
            <div class="synergy-desc" style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">${syn.desc}</div>
          </div>
          <span class="synergy-badge" style="font-size: 0.7rem; background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; color: ${isActive ? 'var(--xp-green)' : 'var(--text-dark)'}; border: 1px solid ${isActive ? 'var(--xp-green)' : 'var(--border-light)'}; font-weight: 700; white-space: nowrap;">${syn.badge}</span>
        </div>
      `;
    }).join('');
  }
}

function openSynergiesModal() {
  const modal = document.getElementById('synergies-modal');
  if (modal) {
    modal.style.display = 'flex';
    renderSynergies();
  }
}



// --- INITIAL STATE ---
let state = {
  gold: 4520,
  dotaCoins: 200,
  essence: 50,
  shards: 10,
  ancestralEssence: 0,
  dotaPlus: false,
  currentStage: 1,
  highestStageReached: 1,
  farmingMode: false, // true = stay on stage, false = push
  loopingStage: false, // true = repeat current stage forever (no advance/regression)
  teamSize: 3,
  stashCapacity: 24,
  heroes: {},
  inventory: [],
  unlockedHeroIds: ['sven', 'crystal_maiden', 'drow_ranger'],
  marketListings: [],
  npcMarketListings: [],
  discoveredItems: [], // tracks compendium progress
  
  // Pity system counters
  pityEpic: 0,
  pityLegendary: 0,

  // Prestige Talents
  talents: {
    gold: 0,
    xp: 0,
    drops: 0,
    autosell: 0,
    bossdmg: 0,
    startstage: 0
  },

  lastTick: Date.now(),

  // Tactical Maneuvers
  maneuvers: {
    stackCd: 0,
    pullCd: 0,
    obsCd: 0,
    sentryCd: 0,
    obsActive: 0,      // seconds remaining for obs ward buff
    sentryActive: 0    // seconds remaining for sentry ward buff
  },

  // PvP Arena
  pvp: {
    active: false,
    mmr: 1000,
    lockTimer: 0,       // seconds remaining in lock
    lockDuration: 0,
    battleTimer: 0,     // counts up to trigger next battle
    lockedTeam: [],
    wins: 0,
    losses: 0
  },

  // ─── Ancient Rune Web ──────────────────────────────────────────────
  runeFragments: 0,
  ancestralSigils: 0,
  roshanDefeated: false,
  prestigeCount: 0,
  runeLevels: {},      // { nodeId: currentLevel }
  equippedKeystones: [], // array of keystone node ids currently equipped

  // ─── Ancestral Forge ─────────────────────────────────────────────
  forge: {
    level: 1,
    xp: 0,
    materials: { common: 0, rare: 0, epic: 0 },
    alchemyUses: 0,
    altarFavor: 0,
    grandRitualFavor: 0,
    activeBlessing: null,
    blessingSecondsRemaining: 0,
    gemInventory: {},          // { `${type}_${level}`: qty }
    extractionSeals: 0,
    discoveredReforgeStats: []
  }
};

const MAX_EQUIPPED_KEYSTONES = 3;

function setupInitialHeroes() {
  for (let key in HERO_TEMPLATES) {
    const t = HERO_TEMPLATES[key];
    const isDefault = ['sven', 'crystal_maiden', 'drow_ranger'].includes(key);
    state.heroes[key] = {
      ...t,
      level: isDefault ? 9 : 0,
      xp: 0,
      items: [null, null, null, null, null, null, null], // 6 normal + 1 artifact
      cooldowns: [0, 0, 0],
      permanentDmgBonus: 0,
      skillPoints: 0,
      talentRanks: {}
    };
  }
  state.heroes.drow_ranger.level = 10;
}

function validateStateStructure() {
  if (!state.heroes || Object.keys(state.heroes).length === 0) {
    setupInitialHeroes();
  } else {
    for (let key in HERO_TEMPLATES) {
      if (!state.heroes[key]) {
        state.heroes[key] = {
          ...HERO_TEMPLATES[key],
          level: 0,
          xp: 0,
          items: [null, null, null, null, null, null, null],
          cooldowns: [0, 0, 0],
          permanentDmgBonus: 0,
          skillPoints: 0,
          talentRanks: {}
        };
      } else {
        // Ensure they have 7 slots (6 items + 1 artifact)
        if (!state.heroes[key].items) {
          state.heroes[key].items = [null, null, null, null, null, null, null];
        } else if (state.heroes[key].items.length < 7) {
          while (state.heroes[key].items.length < 7) {
            state.heroes[key].items.push(null);
          }
        }
        state.heroes[key].skills = HERO_TEMPLATES[key].skills.map((sk, idx) => {
          const currentLvl = state.heroes[key].skills && state.heroes[key].skills[idx] ? state.heroes[key].skills[idx].level : 0;
          return { ...sk, level: currentLvl };
        });
        if (state.heroes[key].permanentDmgBonus === undefined) state.heroes[key].permanentDmgBonus = 0;
        if (state.heroes[key].skillPoints === undefined) state.heroes[key].skillPoints = 0;
        if (!state.heroes[key].talentRanks) state.heroes[key].talentRanks = {};
      }
    }
  }

  if (!state.unlockedHeroIds) {
    state.unlockedHeroIds = ['sven', 'crystal_maiden', 'drow_ranger'];
  }
  if (!state.teamSize) state.teamSize = 3;
  if (!state.stashCapacity) state.stashCapacity = 24;
  if (!state.dotaCoins) state.dotaCoins = 0;
  if (!state.essence) state.essence = 0;
  if (!state.shards) state.shards = 0;
  if (!state.ancestralEssence) state.ancestralEssence = 0;
  if (state.dotaPlus === undefined) state.dotaPlus = false;
  if (!state.marketListings) state.marketListings = [];
  if (!state.npcMarketListings) state.npcMarketListings = [];
  if (!state.discoveredItems) state.discoveredItems = [];
  
  if (!state.talents) {
    state.talents = { gold: 0, xp: 0, drops: 0, autosell: 0, bossdmg: 0, startstage: 0 };
  }
  if (!state.maneuvers) {
    state.maneuvers = { stackCd: 0, pullCd: 0, obsCd: 0, sentryCd: 0, obsActive: 0, sentryActive: 0 };
  }
  if (!state.pvp) {
    state.pvp = { active: false, mmr: 1000, lockTimer: 0, lockDuration: 0, battleTimer: 0, lockedTeam: [], wins: 0, losses: 0 };
  }
  if (!state.runeFragments) state.runeFragments = 0;
  if (!state.ancestralSigils) state.ancestralSigils = 0;
  if (state.roshanDefeated === undefined) state.roshanDefeated = false;
  if (!state.prestigeCount) state.prestigeCount = 0;
  if (state.loopingStage === undefined) state.loopingStage = false;
  if (!state.runeLevels) state.runeLevels = {};
  if (!state.equippedKeystones) state.equippedKeystones = [];

  function applyForgeItemDefaults(item) {
    if (item.affinity === undefined) item.affinity = null;
    if (item.gemSlots === undefined) item.gemSlots = [];
    if (item.gemSlotsOpened === undefined) item.gemSlotsOpened = 0;
    if (item.reforgedStat === undefined) item.reforgedStat = null;
    if (item.reforgeCount === undefined) item.reforgeCount = 0;
    if (item.inscription === undefined) item.inscription = null;
    if (item.minorInscription === undefined) item.minorInscription = null;
    return item;
  }

  state.inventory = state.inventory.map(item => {
    if (typeof item === 'string') item = { id: item, rarity: 'common', tier: 0, level: 1, modifiers: [] };
    if (item.modifiers === undefined) item.modifiers = [];
    if (item.level === undefined) item.level = 1;
    return applyForgeItemDefaults(item);
  });

  for (let key in state.heroes) {
    const h = state.heroes[key];
    if (h && Array.isArray(h.items)) {
      h.items = h.items.map(inst => inst ? applyForgeItemDefaults(inst) : inst);
    }
  }

  if (!state.forge) {
    state.forge = {
      level: 1, xp: 0, materials: { common: 0, rare: 0, epic: 0 }, alchemyUses: 0,
      altarFavor: 0, grandRitualFavor: 0, activeBlessing: null, blessingSecondsRemaining: 0,
      gemInventory: {}, extractionSeals: 0, discoveredReforgeStats: []
    };
  } else {
    if (!state.forge.level) state.forge.level = 1;
    if (!state.forge.xp) state.forge.xp = 0;
    if (!state.forge.materials) state.forge.materials = { common: 0, rare: 0, epic: 0 };
    else {
      if (state.forge.materials.common === undefined) state.forge.materials.common = 0;
      if (state.forge.materials.rare === undefined) state.forge.materials.rare = 0;
      if (state.forge.materials.epic === undefined) state.forge.materials.epic = 0;
    }
    if (!state.forge.alchemyUses) state.forge.alchemyUses = 0;
    if (!state.forge.altarFavor) state.forge.altarFavor = 0;
    if (!state.forge.grandRitualFavor) state.forge.grandRitualFavor = 0;
    if (state.forge.activeBlessing === undefined) state.forge.activeBlessing = null;
    if (!state.forge.blessingSecondsRemaining) state.forge.blessingSecondsRemaining = 0;
    if (!state.forge.gemInventory) state.forge.gemInventory = {};
    if (!state.forge.extractionSeals) state.forge.extractionSeals = 0;
    if (!state.forge.discoveredReforgeStats) state.forge.discoveredReforgeStats = [];
  }

  activeHeroes = state.unlockedHeroIds.slice(0, state.teamSize);
}


// Runtime variables
let activeHeroes = ['sven', 'crystal_maiden', 'drow_ranger'];
let currentWaveEnemies = []; // array of enemy objects in the current wave
let currentWaveIndex = 0;    // 0-based index of wave within the current stage
let stageWaveCount = 3;      // total waves for the current stage
let viewingStage = null;     // non-null while free-farming an already-cleared stage (doesn't touch state.currentStage progression)
let nextWaveTimer = 0;       // counts down; if it hits 0 before the current wave dies, the next wave spawns in on top

function getActiveStage() {
  return viewingStage !== null ? viewingStage : state.currentStage;
}
let selectedHeroId = 'sven';
let dpsTracker = 197;
let heroesSubView = 'hero-grid'; // 'hero-grid' | 'hero-team'
let heroGridFilter = 'all';
let heroGridSearch = '';
let teamSwapSlotIdx = null; // slot index awaiting a bench hero pick
let blacksmithSelectedIdx = -1;
let forgeSubView = 'upgrade'; // 'upgrade' | 'fusion'
let fusionRarityFilter = 'common';
let fusionSelectedIdxs = [];
let marketRefreshSeconds = 300;
let stageTimer = 30.0;
let victoryPoseTimer = 0.0;
let waveTransitionActive = false;
let lastAttackAnimTimes = {};
let berserkersCallTimer = 0.0; // forces enemy to target Axe
let berserkersCallTarget = '';  // which hero Axe taunted
let stackedCreepSpawned = false;

// ─── PvP Arena bots ───────────────────────────────────────────────
const PVP_BOTS = [
  { name: 'Dendi',          mmr: 9820 },
  { name: 'Miracle-',       mmr: 11450 },
  { name: 'Arteezy',        mmr: 10600 },
  { name: 'N0tail',         mmr: 8930 },
  { name: 'Gorgc',          mmr: 7450 },
  { name: 'SirActionSlacks',mmr: 3200 },
  { name: 'BootsHD',        mmr: 5800 },
  { name: 'UNiVeRsE',       mmr: 8100 },
  { name: 'w33',            mmr: 9100 },
  { name: 'EternalEnvy',    mmr: 7200 }
];

function getPvPDivision(mmr) {
  if (mmr >= 10000) return '🏆 Immortal';
  if (mmr >= 7000)  return '⭐ Divine';
  if (mmr >= 5000)  return '💜 Ancient';
  if (mmr >= 3500)  return '🟣 Legend';
  if (mmr >= 2500)  return '🔷 Archon';
  if (mmr >= 1500)  return '🟢 Crusader';
  if (mmr >= 1000)  return '⚪ Guardian';
  return '🟤 Herald';
}

const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'immortal'];
const RARITY_PROBS = [0.55, 0.27, 0.12, 0.045, 0.014, 0.001, 0.0]; // immortal rolled by bosses

// --- CORE UTILITY: MATH AND HERO STATS RECALCULATION ---

function getHeroStats(heroId) {
  const h = state.heroes[heroId];
  if (!h || h.level === 0) return null;

  const levelMult = h.level - 1;
  const str = h.baseStr + (h.strGrowth * levelMult);
  const agi = h.baseAgi + (h.agiGrowth * levelMult);
  const int = h.baseInt + (h.intGrowth * levelMult);

  let bonusStr = 0, bonusAgi = 0, bonusInt = 0;
  let bonusHp = 0, bonusHpRegen = 0, bonusDmg = 0, bonusAS = 0, bonusBlock = 0, bonusEvasion = 0, bonusSpellImmunity = 0, bonusLifesteal = 0, bonusSpellTrigger = 0;
  let bonusArmor = 0, bonusASFlat = 0, bonusEvasionPct = 0, bonusCritChance = 0, bonusMana = 0, bonusSpellAmpPct = 0, bonusLifestealPct = 0;
  let stunChance = 0, corruption = 0, percentRegen = 0;
  let hasAegis = false;
  let critChance = 0, critMult = 1.0;
  let moveSpeedStat = 0;

  // Compendium bonuses
  let compDmg = 1.0;
  let compArmor = 0;
  let compAS = 0;
  if (state.discoveredItems) {
    if (state.discoveredItems.includes('sword') && state.discoveredItems.includes('bow') && state.discoveredItems.includes('staff')) compDmg += 0.03;
    if (state.discoveredItems.includes('shield') && state.discoveredItems.includes('helmet') && state.discoveredItems.includes('plate')) compArmor += 3;
    if (state.discoveredItems.includes('boots') && state.discoveredItems.includes('ring')) compAS += 5;
  }

  // Prestige talent modifiers
  let prestigeDmg = 1.0 + (state.talents.bossdmg * 0.03);

  // ─── Ancestral Forge accumulators (affinity + gems + inscriptions + reforged stat) ──
  let forgeSpellDmgPct = 0, forgeHpRegenPct = 0, forgeManaRegenPct = 0, forgeLifestealPct = 0, forgeCritChancePct = 0;
  let forgeMana = 0, forgeAttackSpeedPct = 0, forgeEvasionPct = 0, forgeArmorFlat = 0, forgeMagicResPct = 0, forgeBossDmgPct = 0;
  let forgeCritMultPct = 0, forgeReforgeArmor = 0, forgeReforgeHpRegen = 0, forgeReforgeBlock = 0, forgeReforgeEvasion = 0;

  h.items.forEach((inst, idx) => {
    if (!inst) return;

    // Check if artifact
    if (idx === 6) {
      const art = ARTIFACTS_DB[inst.id];
      if (!art) return;
      if (art.stats.damage) bonusDmg += art.stats.damage;
      if (art.stats.str) bonusStr += art.stats.str;
      if (art.stats.agi) bonusAgi += art.stats.agi;
      if (art.stats.int) bonusInt += art.stats.int;
      if (art.stats.attackSpeed) bonusAS += art.stats.attackSpeed;
      if (art.stats.hp) bonusHp += art.stats.hp;
      if (art.stats.hpRegen) bonusHpRegen += art.stats.hpRegen;
      if (art.stats.evasion) bonusEvasion = Math.max(bonusEvasion, art.stats.evasion);
      if (art.stats.spellImmunity) bonusSpellImmunity = Math.max(bonusSpellImmunity, art.stats.spellImmunity);
      if (art.stats.stunChance) stunChance = Math.max(stunChance, art.stats.stunChance);
      if (art.stats.lifesteal) bonusLifesteal = Math.max(bonusLifesteal, art.stats.lifesteal);
      applyForgeItemStatBonuses(inst);
      return;
    }

    const item = BASE_ITEMS_DB[inst.id];
    if (!item) return;

    const rarityIdx = RARITIES.indexOf(inst.rarity || 'common');
    const rarityScale = 1.0 + (rarityIdx * 0.25);
    const tierScale = 1.0 + ((inst.tier || 0) * 0.15);
    const scale = rarityScale * tierScale;

    if (item.stats.str) bonusStr += item.stats.str * scale;
    if (item.stats.agi) bonusAgi += item.stats.agi * scale;
    if (item.stats.int) bonusInt += item.stats.int * scale;
    if (item.stats.hp) bonusHp += item.stats.hp * scale;
    if (item.stats.hpRegen) bonusHpRegen += item.stats.hpRegen * scale;
    if (item.stats.damage) bonusDmg += item.stats.damage * scale;
    if (item.stats.attackSpeed) bonusAS += item.stats.attackSpeed * scale;
    if (item.stats.block) bonusBlock += item.stats.block * scale;
    if (item.stats.critChance) {
      if (item.stats.critChance * scale > critChance) {
        critChance = item.stats.critChance * scale;
        critMult = 1.5;
      }
    }

    // Process Modifiers
    if (inst.modifiers) {
      inst.modifiers.forEach(modId => {
        if (modId === 'gold_boost') { /* handled globally */ }
        if (modId === 'crit_mana') { /* handled during crit */ }
        if (modId === 'splash') bonusBlock += 5; // auxiliary
      });
    }

    applyForgeItemStatBonuses(inst);
  });

  // Applies Ancestral Forge bonuses (affinity/gems/inscriptions + reforged stat) for one item instance.
  // Defined as a closure so it can reach into the accumulator variables above.
  function applyForgeItemStatBonuses(inst) {
    if (typeof getForgeItemBonuses !== 'function') return;
    const fb = getForgeItemBonuses(inst);
    if (fb.spellDmgPct) forgeSpellDmgPct += fb.spellDmgPct;
    if (fb.hpRegenPct) forgeHpRegenPct += fb.hpRegenPct;
    if (fb.manaRegenPct) forgeManaRegenPct += fb.manaRegenPct;
    if (fb.lifestealPct) forgeLifestealPct += fb.lifestealPct;
    if (fb.critChancePct) forgeCritChancePct += fb.critChancePct;
    if (fb.slowOnHitChance) { /* cosmetic/partial: stored for tooltip, no combat hook yet */ }
    if (fb.damage) bonusDmg += fb.damage;
    if (fb.mana) forgeMana += fb.mana;
    if (fb.attackSpeedPct) forgeAttackSpeedPct += fb.attackSpeedPct;
    if (fb.evasionPct) forgeEvasionPct += fb.evasionPct;
    if (fb.armor) forgeArmorFlat += fb.armor;
    if (fb.magicResPct) forgeMagicResPct += fb.magicResPct;
    if (fb.bossDmgPct) forgeBossDmgPct += fb.bossDmgPct;
    if (fb.critMultPct) forgeCritMultPct += fb.critMultPct;
    // goldPct / dropChancePct / xpPct / dropChanceRelPct / bossDropChancePct handled in handleCreepDeath via getForgeCombatBonuses()
    // lowHpDmgPct / shieldOnHpLossPct / chainLightningChance / frozenDmgPct / firstSkillEchoChance:
    // cosmetic/partial for now — stored on the item and shown in tooltip, not simulated in the combat loop.

    // Reforged stat (Gravacao) — apply directly to the relevant accumulator
    if (inst.reforgedStat) {
      const rv = 0; // placeholder base; actual magnitude scales with item rarity/tier below
      const rarityIdx2 = RARITIES.indexOf(inst.rarity || 'common');
      const magnitude = (1 + rarityIdx2 * 0.3) * (1 + (inst.tier || 0) * 0.1);
      switch (inst.reforgedStat) {
        case 'critChance': forgeCritChancePct += 0.02 * magnitude; break;
        case 'critMult': forgeCritMultPct += 0.05 * magnitude; break;
        case 'attackSpeed': forgeAttackSpeedPct += 0.015 * magnitude; break;
        case 'bossDmgPct': forgeBossDmgPct += 0.02 * magnitude; break;
        case 'damage': bonusDmg += 2 * magnitude; break;
        case 'armor': forgeReforgeArmor += 1.2 * magnitude; break;
        case 'magicResPct': forgeMagicResPct += 0.015 * magnitude; break;
        case 'hpRegen': forgeReforgeHpRegen += 0.8 * magnitude; break;
        case 'block': forgeReforgeBlock += 1.5 * magnitude; break;
        case 'evasion': forgeReforgeEvasion += 0.015 * magnitude; break;
      }
    }
  }

  // ─── Hero Talent Tree bonuses ─────────────────────────────────────
  if (h.talentRanks) {
    for (let talentId in h.talentRanks) {
      const rank = h.talentRanks[talentId];
      const def = TALENT_DEFS[talentId];
      if (!def || !rank) continue;
      const amount = def.perRank * rank;
      switch (def.statKey) {
        case 'bonusHp': bonusHp += amount; break;
        case 'bonusHpRegen': bonusHpRegen += amount; break;
        case 'bonusDmg': bonusDmg += amount; break;
        case 'bonusBlock': bonusBlock += amount; break;
        case 'bonusArmor': bonusArmor += amount; break;
        case 'bonusASFlat': bonusASFlat += amount; break;
        case 'bonusEvasionPct': bonusEvasionPct += amount; break;
        case 'bonusCritChance': bonusCritChance += amount; break;
        case 'bonusMana': bonusMana += amount; break;
        case 'bonusSpellAmpPct': bonusSpellAmpPct += amount; break;
        case 'bonusLifestealPct': bonusLifestealPct += amount; break;
      }
    }
  }

  const finalStr = str + bonusStr;
  const finalAgi = agi + bonusAgi;
  const finalInt = int + bonusInt;

  const maxHp = h.baseHp + (finalStr * 22) + bonusHp;
  const hpRegen = (finalStr * 0.1) + bonusHpRegen + forgeReforgeHpRegen;

  const maxMana = h.baseMana + (finalInt * 12) + forgeMana + bonusMana;
  const manaRegen = (1.0 + (finalInt * 0.05)) * (1 + forgeManaRegenPct);
  const spellAmp = 1.0 + (finalInt * 0.001) + forgeSpellDmgPct + bonusSpellAmpPct;

  const attackSpeed = (100 + finalAgi + bonusAS + bonusASFlat + compAS) * (1 + forgeAttackSpeedPct);
  const armor = (finalAgi * 0.16) + compArmor + forgeArmorFlat + forgeReforgeArmor + bonusArmor;
  const physicalResistance = (armor * 0.06) / (1 + armor * 0.06);

  let mainAttributeVal = 0;
  if (h.type === 'strength') mainAttributeVal = finalStr;
  else if (h.type === 'agility') mainAttributeVal = finalAgi;
  else if (h.type === 'intelligence') mainAttributeVal = finalInt;

  let baseDmg = (h.baseDamage + mainAttributeVal + bonusDmg + (h.permanentDmgBonus || 0)) * compDmg * prestigeDmg;

  if (heroId === 'sven') {
    const cleave = h.skills[1];
    if (cleave.level > 0) baseDmg *= (1.0 + (cleave.level * 0.15));
  }
  if (heroId === 'drow_ranger') {
    const frost = h.skills[0];
    if (frost.level > 0) baseDmg += (15 + frost.level * 10);
  }

  // Attack cooldown. Max movespeed from items speeds this up!
  const attackRate = (attackSpeed / 100) / 1.7;
  const attackCooldown = 1.0 / attackRate;

  // ─── Apply Team Synergy Bonuses ──────────────────────────────────
  // Only apply to heroes actually in the active lineup
  let synHpMult = 1.0, synDmgMult = 1.0, synASMult = 1.0;
  let synManaRegenMult = 1.0, synSpellAmpFlat = 0.0, synArmor = 0, synEvasion = 0;
  if (typeof activeHeroes !== 'undefined' && activeHeroes.includes(heroId)) {
    const syn = getSynergyBonuses(activeHeroes);
    synHpMult        = syn.hpMult;
    synDmgMult       = syn.damageMult;
    synASMult        = syn.attackSpeedMult;
    synManaRegenMult = syn.manaRegenMult;
    synSpellAmpFlat  = syn.spellAmpFlat;
    synArmor         = syn.armor;
    synEvasion       = syn.evasion;
  }

  const finalAttackCooldown = parseFloat((attackCooldown / synASMult).toFixed(2));

  // ─── Apply Ancient Rune Web bonuses (additive stack before synergy multiply) ──
  const runes = (typeof getRuneStatTotals === 'function') ? getRuneStatTotals() : {};
  const runeDmgPct       = (runes.dmgPct || 0) + (runes.spellDmgPct || 0) * 0; // spellDmgPct handled separately in cast logic
  const runeHpPct        = runes.hpPct || 0;
  const runeAsPct        = runes.attackSpeedPct || 0;
  const runeCritChance   = runes.critChancePct || 0;
  const runeCritMultPct  = runes.critMultPct || 0;
  const runeLifestealPct = runes.lifestealPct || 0;
  const runeCdrPct       = Math.min(0.6, runes.cdrPct || 0);

  const keystones = getEquippedKeystoneEffects();
  let keystoneDmgFlat = 0;
  if (keystones.includes('arcane_echo')) keystoneDmgFlat -= 0.10;
  const isSoloHero = typeof activeHeroes !== 'undefined' && activeHeroes.length === 1 && activeHeroes[0] === heroId;
  let keystoneHpMult = 1.0, keystoneDmgMult = 1.0, keystoneAsMult = 1.0;
  if (keystones.includes('lone_champion') && isSoloHero) {
    keystoneDmgMult *= 1.60; keystoneHpMult *= 1.50; keystoneAsMult *= 1.25;
  }
  if (keystones.includes('glass_cannon')) {
    keystoneDmgMult *= 1.40; keystoneHpMult *= 0.75;
  }

  // ─── Ancestral Forge: Altar blessing global multipliers (bossDmg only affects combat stats here;
  // gold/xp/drop/materials blessing effects are applied in handleCreepDeath via getForgeActiveBlessingEffect()) ──
  const forgeBlessing = (typeof getForgeActiveBlessingEffect === 'function') ? getForgeActiveBlessingEffect() : {};
  const forgeBlessingBossDmgPct = forgeBlessing.bossDmgPct || 0;

  const finalDamage = Math.round(baseDmg * (1 + runeDmgPct + keystoneDmgFlat) * synDmgMult * keystoneDmgMult);
  const finalMaxHp = Math.round(maxHp * (1 + runeHpPct) * synHpMult * keystoneHpMult);
  const finalAttackCooldownWithRunes = parseFloat((finalAttackCooldown / (1 + runeAsPct) / keystoneAsMult).toFixed(2));

  return {
    maxHp: finalMaxHp,
    hpRegen: parseFloat((hpRegen * (1 + forgeHpRegenPct)).toFixed(1)),
    maxMana: Math.round(maxMana),
    manaRegen: parseFloat((manaRegen * synManaRegenMult).toFixed(2)),
    damage: finalDamage,
    attackCooldown: finalAttackCooldownWithRunes,
    cdrPct: runeCdrPct,
    block: bonusBlock + forgeReforgeBlock,
    evasion: Math.min(0.80, bonusEvasion + synEvasion + forgeEvasionPct + forgeReforgeEvasion + bonusEvasionPct),
    spellImmunity: bonusSpellImmunity + forgeMagicResPct,
    lifesteal: bonusLifesteal + runeLifestealPct + forgeLifestealPct + bonusLifestealPct,
    spellTriggerRate: bonusSpellTrigger,
    stunChance,
    corruption,
    hasAegis,
    critChance: Math.min(0.95, critChance + runeCritChance + forgeCritChancePct + bonusCritChance),
    critMult: critMult + runeCritMultPct + forgeCritMultPct,
    spellAmp: spellAmp + synSpellAmpFlat + (runes.spellDmgPct || 0),
    bossDmgPct: forgeBossDmgPct + forgeBlessingBossDmgPct,
    synArmor,
    keystones
  };
}

function getGlobalManaRegenBonus() {
  const cm = state.heroes.crystal_maiden;
  if (cm && cm.level > 0 && cm.skills[1].level > 0) {
    return cm.skills[1].level * 0.5;
  }
  return 0;
}

// ═══════════════════ ANCIENT RUNE WEB ENGINE ═══════════════════

function runeLevel(nodeId) {
  return state.runeLevels[nodeId] || 0;
}

function totalRuneLevelsInvested() {
  return Object.values(state.runeLevels).reduce((sum, lvl) => sum + lvl, 0);
}

// Ring a node belongs to is unlocked if its gating requirements are met.
function isRuneRingUnlocked(ring) {
  const cfg = RUNE_RINGS[ring];
  if (!cfg) return true;
  if (totalRuneLevelsInvested() < cfg.minInvested) return false;
  if (cfg.requiresRoshan && !state.roshanDefeated) return false;
  if (cfg.requiresPrestige && state.prestigeCount <= 0) return false;
  return true;
}

// A node is purchasable if its ring is unlocked AND its prereq node has at least 1 level.
function isRuneNodeAvailable(nodeId) {
  const node = RUNE_NODES[nodeId];
  if (!node) return false;
  if (node.type === 'core') return true;
  if (!isRuneRingUnlocked(node.ring)) return false;
  if (node.prereq && runeLevel(node.prereq) <= 0) return false;
  return true;
}

function getRuneNodeCost(nodeId, targetLevel) {
  const node = RUNE_NODES[nodeId];
  if (!node) return Infinity;
  if (node.currency === 'sigils') return node.baseCost; // flat cost for keystones
  return runeLevelCost(node.baseCost, targetLevel);
}

function getRuneCurrencyAmount(currency) {
  if (currency === 'gold') return state.gold;
  if (currency === 'fragments') return state.runeFragments;
  if (currency === 'sigils') return state.ancestralSigils;
  return 0;
}

function spendRuneCurrency(currency, amount) {
  if (currency === 'gold') state.gold -= amount;
  else if (currency === 'fragments') state.runeFragments -= amount;
  else if (currency === 'sigils') state.ancestralSigils -= amount;
}

function canBuyRuneLevel(nodeId) {
  const node = RUNE_NODES[nodeId];
  if (!node) return false;
  const lvl = runeLevel(nodeId);
  if (lvl >= node.maxLevel) return false;
  if (!isRuneNodeAvailable(nodeId)) return false;
  const cost = getRuneNodeCost(nodeId, lvl + 1);
  return getRuneCurrencyAmount(node.currency) >= cost;
}

function buyRuneLevel(nodeId) {
  const node = RUNE_NODES[nodeId];
  if (!node || !canBuyRuneLevel(nodeId)) return false;

  const lvl = runeLevel(nodeId);
  const cost = getRuneNodeCost(nodeId, lvl + 1);
  spendRuneCurrency(node.currency, cost);
  state.runeLevels[nodeId] = lvl + 1;

  sfx.playLevelUp();
  const isMaxNow = state.runeLevels[nodeId] >= node.maxLevel;
  addCombatLog(`🔷 <span class="log-crit">Rune Web:</span> ${node.name} agora está no nível ${state.runeLevels[nodeId]}/${node.maxLevel}${isMaxNow ? ' — MAESTRIA ALCANÇADA!' : ''}.`, 'log-crit');

  updateHUD();
  renderRuneNexusTab();
  return true;
}

function toggleEquipKeystone(nodeId) {
  const node = RUNE_NODES[nodeId];
  if (!node || node.type !== 'keystone') return;
  if (runeLevel(nodeId) <= 0) return;

  const idx = state.equippedKeystones.indexOf(nodeId);
  if (idx !== -1) {
    state.equippedKeystones.splice(idx, 1);
    addCombatLog(`🔷 Keystone desequipada: ${node.name}.`, 'log-system');
  } else {
    if (state.equippedKeystones.length >= MAX_EQUIPPED_KEYSTONES) {
      addCombatLog(`⚠️ Máximo de ${MAX_EQUIPPED_KEYSTONES} Keystones equipadas simultaneamente!`, 'log-system');
      return;
    }
    state.equippedKeystones.push(nodeId);
    sfx.playSpell();
    addCombatLog(`🔷 <span class="log-spell">Keystone equipada: ${node.name}!</span>`, 'log-spell');
  }
  renderRuneNexusTab();
  updateHUD();
}

function isKeystoneEquipped(nodeId) {
  return state.equippedKeystones.includes(nodeId);
}

// Aggregates all purchased common/special node effects (perLevel stats) into flat totals.
// Cached per call — cheap enough to recompute on demand since the tree is small.
function getRuneStatTotals() {
  const totals = {};
  for (let nodeId in RUNE_NODES) {
    const node = RUNE_NODES[nodeId];
    const lvl = runeLevel(nodeId);
    if (lvl <= 0 || !node.effect || !node.effect.stat) continue;
    const key = node.effect.stat;
    totals[key] = (totals[key] || 0) + (node.effect.perLevel * lvl);
    // Mastery bonus flag for UI/log purposes when node is maxed
    if (lvl >= node.maxLevel) totals[`${key}__mastery`] = true;
  }
  return totals;
}

function hasRuneUnlock(unlockId) {
  for (let nodeId in RUNE_NODES) {
    const node = RUNE_NODES[nodeId];
    if (node.effect && node.effect.unlock === unlockId && runeLevel(nodeId) > 0) return true;
  }
  return false;
}

function getEquippedKeystoneEffects() {
  return state.equippedKeystones
    .map(id => RUNE_NODES[id])
    .filter(n => n && n.effect && n.effect.keystone)
    .map(n => n.effect.keystone);
}

function generateItem(level, forceRarity = null, stage = null) {
  let rarity = 'common';
  if (forceRarity) {
    rarity = forceRarity;
  } else {
    // Bad luck protection pity roll
    state.pityEpic++;
    state.pityLegendary++;

    if (state.pityEpic >= 25) {
      state.pityEpic = 0;
      const roll = Math.random();
      rarity = roll < 0.2 ? 'epic' : (roll < 0.35 ? 'legendary' : 'mythic');
    } else if (state.pityLegendary >= 150) {
      state.pityLegendary = 0;
      rarity = Math.random() < 0.1 ? 'mythic' : 'legendary';
    } else {
      let roll = Math.random();
      // scale legendary rate slightly if legendaryPity is high
      let legBonus = Math.max(0, (state.pityLegendary - 100) * 0.01);

      // Fortune rune: Treasure Hunter / Treasure Seeker shift probability mass toward higher rarities
      const runes = (typeof getRuneStatTotals === 'function') ? getRuneStatTotals() : {};
      let rarityUpBonus = runes.rarityUpRelPct || 0;
      const keystones = (typeof getEquippedKeystoneEffects === 'function') ? getEquippedKeystoneEffects() : [];
      if (keystones.includes('treasure_seeker')) rarityUpBonus += 0.25;
      if (keystones.includes('greed')) rarityUpBonus -= 0.20;

      let probs = RARITY_PROBS.slice();
      if (rarityUpBonus !== 0) {
        // Redistribute weight from common/uncommon into rare+ proportional to rarityUpBonus
        const shift = Math.max(-0.4, Math.min(0.6, rarityUpBonus)) * probs[0] * 0.5;
        probs[0] = Math.max(0.02, probs[0] - shift);
        for (let i = 2; i < probs.length; i++) probs[i] += shift / (probs.length - 2);
      }

      let cumulative = 0;
      for (let i = 0; i < probs.length; i++) {
        let prob = probs[i];
        if (RARITIES[i] === 'legendary') prob += legBonus;
        cumulative += prob;
        if (roll <= cumulative) {
          rarity = RARITIES[i];
          break;
        }
      }
    }
  }

  // Reset pity counters if rolled
  if (RARITIES.indexOf(rarity) >= RARITIES.indexOf('epic')) state.pityEpic = 0;
  if (RARITIES.indexOf(rarity) >= RARITIES.indexOf('legendary')) state.pityLegendary = 0;

  // Retrieve current region to restrict loot to its valid items list
  const currentStageNum = stage || (typeof getActiveStage === 'function' ? getActiveStage() : (state ? state.currentStage : 1));
  const region = getRegionDetails(currentStageNum);
  const baseList = (region && region.drops && region.drops.length > 0) ? region.drops : Object.keys(BASE_ITEMS_DB);
  
  // Filter baseList to make sure all elements exist in BASE_ITEMS_DB
  const validList = baseList.filter(id => BASE_ITEMS_DB[id]);
  const finalIdList = validList.length > 0 ? validList : Object.keys(BASE_ITEMS_DB);
  const baseId = finalIdList[Math.floor(Math.random() * finalIdList.length)];
  const item = BASE_ITEMS_DB[baseId];

  // Roll modifiers based on rarity
  let modifiers = [];
  const rarityIdx = RARITIES.indexOf(rarity);

  if (rarityIdx >= RARITIES.indexOf('rare')) {
    let modsCount = 1;
    if (rarity === 'epic') modsCount = Math.random() < 0.4 ? 2 : 1;
    if (rarity === 'legendary') modsCount = 2;
    if (rarity === 'mythic') modsCount = 3;

    for (let m = 0; m < modsCount; m++) {
      const rolledMod = ITEM_MODIFIERS[Math.floor(Math.random() * ITEM_MODIFIERS.length)];
      if (!modifiers.includes(rolledMod.id)) {
        modifiers.push(rolledMod.id);
      }
    }
  }

  // Masterwork rune: chance for an extra bonus modifier regardless of rarity
  if (typeof getRuneStatTotals === 'function') {
    const masterworkChance = getRuneStatTotals().masterworkChance || 0;
    if (masterworkChance > 0 && Math.random() < masterworkChance && modifiers.length < ITEM_MODIFIERS.length) {
      const rolledMod = ITEM_MODIFIERS[Math.floor(Math.random() * ITEM_MODIFIERS.length)];
      if (!modifiers.includes(rolledMod.id)) modifiers.push(rolledMod.id);
    }
  }

  return {
    id: baseId,
    rarity: rarity,
    tier: 0,
    level: level,
    modifiers: modifiers
  };
}

// ═══════════════════ ANCESTRAL FORGE ENGINE ═══════════════════
// 8 modules: Sintese, Alquimia, Criacao, Lapidacao, Gravacao, Inscricao, Extracao, Oferenda.
// All logic here is pure state manipulation; DOM rendering lives in renderForgeTab() & friends.

function isForgeModuleUnlocked(moduleKey) {
  for (let lvl in FORGE_LEVEL_UNLOCKS) {
    if (FORGE_LEVEL_UNLOCKS[lvl] === moduleKey) {
      return state.forge.level >= parseInt(lvl, 10);
    }
  }
  // offering base module unlocks at level 1 alongside synthesis (offering_advanced gates the Grand Ritual extras)
  if (moduleKey === 'offering') return true;
  return true;
}

function forgeUnlockLevelFor(moduleKey) {
  for (let lvl in FORGE_LEVEL_UNLOCKS) {
    if (FORGE_LEVEL_UNLOCKS[lvl] === moduleKey) return parseInt(lvl, 10);
  }
  return 1;
}

function forgeAddXp(amount) {
  if (!amount || amount <= 0) return;
  state.forge.xp += amount;
  let leveled = false;
  while (state.forge.xp >= getForgeLevelXpReq(state.forge.level)) {
    state.forge.xp -= getForgeLevelXpReq(state.forge.level);
    state.forge.level++;
    leveled = true;
  }
  if (leveled) {
    sfx.playLevelUp();
    addCombatLog(`⚒️ <span class="log-crit">Forja Ancestral atingiu o nível ${state.forge.level}!</span>`, 'log-crit');
  }
}

// ─── Generic material helpers ──────────────────────────────────────
function forgeAddMaterial(tier, amount) {
  if (!FORGE_MATERIAL_TIERS.includes(tier) || amount <= 0) return;
  state.forge.materials[tier] = (state.forge.materials[tier] || 0) + amount;
}

function forgeCanAfford(costObj) {
  if (!costObj) return true;
  if (costObj.gold && state.gold < costObj.gold) return false;
  if (costObj.materials) {
    for (let tier in costObj.materials) {
      if ((state.forge.materials[tier] || 0) < costObj.materials[tier]) return false;
    }
  }
  return true;
}

function forgeSpendMaterials(costObj) {
  if (!costObj) return true;
  if (!forgeCanAfford(costObj)) return false;
  if (costObj.gold) state.gold -= costObj.gold;
  if (costObj.materials) {
    for (let tier in costObj.materials) {
      state.forge.materials[tier] -= costObj.materials[tier];
    }
  }
  return true;
}

// ─── 1. Sintese (Synthesis) — Tier Upgrade + Rarity Fusion ────────────────────────
function forgeSynthesizeUpgradeTier(invIdx) {
  if (invIdx < 0 || invIdx >= state.inventory.length) return false;
  const inst = state.inventory[invIdx];
  const isArtifact = ARTIFACTS_DB[inst.id] !== undefined;
  const item = isArtifact ? ARTIFACTS_DB[inst.id] : BASE_ITEMS_DB[inst.id];
  const rarityIdx = RARITIES.indexOf(inst.rarity || 'common');
  const upgradeGoldCost = Math.round(150 * Math.pow(1.12, inst.tier) * (rarityIdx + 1));
  const upgradeEssenceCost = Math.round((inst.tier + 1) * (rarityIdx + 1) * 3);
  if (inst.tier >= 10 || state.gold < upgradeGoldCost || state.essence < upgradeEssenceCost) return false;

  state.gold -= upgradeGoldCost;
  state.essence -= upgradeEssenceCost;
  inst.tier++;
  forgeAddXp(10 + rarityIdx * 5);
  sfx.playLevelUp();
  addCombatLog(`⛒️ Síntese: ${item ? item.name : inst.id} elevado a Tier +${inst.tier}!`, 'log-crit');
  return true;
}
function forgeSynthesizeFuse(rarity) {
  const rarityIdx = RARITIES.indexOf(rarity);
  if (rarityIdx < 0 || rarityIdx >= RARITIES.indexOf('mythic')) return false;

  // Collect all items of this rarity
  const candidates = [];
  state.inventory.forEach((it, idx) => {
    if (it.rarity === rarity) candidates.push(idx);
  });

  if (candidates.length < 3) {
    addCombatLog(`⚠️ Fusão falhou: precisa de 3 itens [${rarity.toUpperCase()}], tem apenas ${candidates.length}.`, 'log-system');
    return false;
  }

  // Remove 3 items of this rarity (last 3 in inventory, reverse order for stable splicing)
  const toRemove = candidates.slice(-3).sort((a, b) => b - a);
  toRemove.forEach(idx => state.inventory.splice(idx, 1));

  // Pick a random item from BASE_ITEMS_DB for the next rarity
  const allBaseKeys = Object.keys(BASE_ITEMS_DB);
  const resultKey = allBaseKeys[Math.floor(Math.random() * allBaseKeys.length)];
  const resultItemDef = BASE_ITEMS_DB[resultKey];
  const nextRarity = RARITIES[rarityIdx + 1];

  const fusedItem = {
    id: resultKey,
    rarity: nextRarity,
    tier: 0,
    level: 1,
    modifiers: [],
    affinity: null,
    gemSlots: [],
    gemSlotsOpened: 0,
    reforgedStat: null,
    reforgeCount: 0,
    inscription: null,
    minorInscription: null
  };
  state.inventory.push(fusedItem);

  forgeAddXp(20 + rarityIdx * 8);
  sfx.playRareDrop();
  addCombatLog(`⛒️ Síntese: 3x [${rarity.toUpperCase()}] fundidos → [${nextRarity.toUpperCase()}] ${resultItemDef.name}! ✨`, 'log-crit');
  saveGame();
  return true;
}

// ─── 2. Alquimia (Alchemy) ──────────────────────────────────────────
function forgeConvertMaterials(fromTier) {
  const idx = FORGE_MATERIAL_TIERS.indexOf(fromTier);
  if (idx < 0 || idx >= FORGE_MATERIAL_TIERS.length - 1) return false;
  const ratio = getAlchemyRatio(state.forge.alchemyUses);
  if ((state.forge.materials[fromTier] || 0) < ratio) return false;

  state.forge.materials[fromTier] -= ratio;
  const toTier = FORGE_MATERIAL_TIERS[idx + 1];
  forgeAddMaterial(toTier, 1);
  state.forge.alchemyUses++;
  forgeAddXp(5);
  addCombatLog(`🧪 Alquimia: Converteu ${ratio}x ${FORGE_MATERIAL_NAMES[fromTier]} em 1x ${FORGE_MATERIAL_NAMES[toTier]}.`, 'log-system');
  return true;
}

const FORGE_AFFINITY_CHANGE_COST = { materials: { rare: 6 } };

function forgeChangeAffinity(invIdx, newAffinityKey) {
  if (invIdx < 0 || invIdx >= state.inventory.length) return false;
  if (newAffinityKey !== null && !AFFINITIES[newAffinityKey]) return false;
  const inst = state.inventory[invIdx];
  if (!forgeSpendMaterials(FORGE_AFFINITY_CHANGE_COST)) return false;
  inst.affinity = newAffinityKey;
  forgeAddXp(8);
  addCombatLog(`🧪 Alquimia: Afinidade alterada para ${newAffinityKey ? AFFINITIES[newAffinityKey].name : 'Nenhuma'}.`, 'log-system');
  return true;
}

// ─── 3. Criacao (Crafting) ──────────────────────────────────────────
function forgeCraftCost(catalystKey) {
  const catalyst = CRAFT_CATALYSTS[catalystKey] || CRAFT_CATALYSTS.none;
  const cost = { gold: CRAFT_BASE_COST.gold, materials: { ...CRAFT_BASE_COST.materials } };
  if (catalyst.cost) {
    for (let tier in catalyst.cost) {
      cost.materials[tier] = (cost.materials[tier] || 0) + catalyst.cost[tier];
    }
  }
  return cost;
}

function forgeCraftItem(slotType, catalystKey = 'none') {
  if (state.inventory.length >= 24) return null;
  const cost = forgeCraftCost(catalystKey);
  if (!forgeSpendMaterials(cost)) return null;

  const pool = Object.keys(BASE_ITEMS_DB).filter(id => BASE_ITEMS_DB[id].slotType === slotType);
  if (pool.length === 0) return null;
  const baseId = pool[Math.floor(Math.random() * pool.length)];

  const rarity = rollCraftRarity(catalystKey);
  const rarityIdx = RARITIES.indexOf(rarity);
  let modifiers = [];
  if (rarityIdx >= RARITIES.indexOf('rare')) {
    let modsCount = 1;
    if (rarity === 'epic') modsCount = Math.random() < 0.4 ? 2 : 1;
    if (rarity === 'legendary') modsCount = 2;
    if (rarity === 'mythic') modsCount = 3;
    for (let m = 0; m < modsCount; m++) {
      const rolledMod = ITEM_MODIFIERS[Math.floor(Math.random() * ITEM_MODIFIERS.length)];
      if (!modifiers.includes(rolledMod.id)) modifiers.push(rolledMod.id);
    }
  }

  const region = getRegionDetails(state.currentStage);
  const inst = {
    id: baseId, rarity, tier: 0, level: Math.max(1, region.lvl * 2), modifiers,
    affinity: null, gemSlots: [], gemSlotsOpened: 0, reforgedStat: null, reforgeCount: 0, inscription: null, minorInscription: null
  };
  state.inventory.push(inst);
  forgeAddXp(15 + rarityIdx * 10);
  sfx.playRareDrop();
  addCombatLog(`⚒️ Criação: Forjado [${rarity.toUpperCase()}] ${BASE_ITEMS_DB[baseId].name}!`, 'log-crit');
  return inst;
}

// ─── 4. Lapidacao (Gem sockets) ──────────────────────────────────────
function forgeOpenGemSlot(invIdx) {
  if (invIdx < 0 || invIdx >= state.inventory.length) return false;
  const inst = state.inventory[invIdx];
  const maxSlots = GEM_SLOTS_BY_RARITY[inst.rarity || 'common'] || 0;
  if (inst.gemSlotsOpened >= maxSlots) return false;
  // 3rd slot only for legendary/mythic/immortal
  if (inst.gemSlotsOpened === 2) {
    const rarityIdx = RARITIES.indexOf(inst.rarity || 'common');
    if (rarityIdx < RARITIES.indexOf('legendary')) return false;
  }
  const cost = getGemSlotOpenCost(inst.gemSlotsOpened);
  if (state.gold < cost.gold || !forgeCanAfford(cost)) return false;
  state.gold -= cost.gold;
  forgeSpendMaterials(cost);
  inst.gemSlotsOpened++;
  inst.gemSlots.push(null);
  forgeAddXp(12);
  addCombatLog(`💎 Lapidação: Novo slot de gema aberto (${inst.gemSlotsOpened}/${maxSlots}).`, 'log-crit');
  return true;
}

function forgeGemKey(type, level) { return `${type}_${level}`; }

function forgeSocketGem(invIdx, slotIndex, gemKey, gemLevel) {
  if (invIdx < 0 || invIdx >= state.inventory.length) return false;
  const inst = state.inventory[invIdx];
  if (!inst.gemSlots || slotIndex < 0 || slotIndex >= inst.gemSlots.length) return false;
  if (!GEM_TYPES[gemKey]) return false;
  const invKey = forgeGemKey(gemKey, gemLevel);
  if ((state.forge.gemInventory[invKey] || 0) <= 0) return false;

  // Return any existing gem in this slot first
  const existing = inst.gemSlots[slotIndex];
  if (existing) {
    const exKey = forgeGemKey(existing.type, existing.level);
    state.forge.gemInventory[exKey] = (state.forge.gemInventory[exKey] || 0) + 1;
  }

  state.forge.gemInventory[invKey]--;
  inst.gemSlots[slotIndex] = { type: gemKey, level: gemLevel };
  forgeAddXp(6);
  addCombatLog(`💎 Lapidação: ${GEM_TYPES[gemKey].name} Nv.${gemLevel} engastada.`, 'log-system');
  return true;
}

function forgeUnsocketGem(invIdx, slotIndex) {
  if (invIdx < 0 || invIdx >= state.inventory.length) return false;
  const inst = state.inventory[invIdx];
  if (!inst.gemSlots || slotIndex < 0 || slotIndex >= inst.gemSlots.length) return false;
  const gem = inst.gemSlots[slotIndex];
  if (!gem) return false;
  const invKey = forgeGemKey(gem.type, gem.level);
  state.forge.gemInventory[invKey] = (state.forge.gemInventory[invKey] || 0) + 1;
  inst.gemSlots[slotIndex] = null;
  addCombatLog(`💎 Lapidação: Gema removida e devolvida ao inventário.`, 'log-system');
  return true;
}

function forgeCombineGems(gemKey, gemLevel) {
  if (!GEM_TYPES[gemKey] || gemLevel < 1 || gemLevel >= GEM_LEVELS) return false;
  const invKey = forgeGemKey(gemKey, gemLevel);
  if ((state.forge.gemInventory[invKey] || 0) < GEM_COMBINE_COUNT) return false;
  state.forge.gemInventory[invKey] -= GEM_COMBINE_COUNT;
  const nextKey = forgeGemKey(gemKey, gemLevel + 1);
  state.forge.gemInventory[nextKey] = (state.forge.gemInventory[nextKey] || 0) + 1;
  forgeAddXp(10);
  addCombatLog(`💎 Lapidação: Combinou ${GEM_COMBINE_COUNT}x ${GEM_TYPES[gemKey].name} Nv.${gemLevel} em 1x Nv.${gemLevel + 1}.`, 'log-crit');
  return true;
}

// ─── 5. Gravacao (Reforge secondary stat) ────────────────────────────
function forgeStatPoolForSlot(slotType) {
  if (slotType === 'weapon' || slotType === 'artifact') return REFORGE_STAT_POOL_OFFENSIVE;
  if (slotType === 'armor') return REFORGE_STAT_POOL_DEFENSIVE;
  return REFORGE_STAT_POOL_OFFENSIVE.concat(REFORGE_STAT_POOL_DEFENSIVE); // accessory: both
}

function forgeRerollStat(invIdx, statKey = null) {
  if (invIdx < 0 || invIdx >= state.inventory.length) return null;
  const inst = state.inventory[invIdx];
  const isArtifact = ARTIFACTS_DB[inst.id] !== undefined;
  const item = isArtifact ? ARTIFACTS_DB[inst.id] : BASE_ITEMS_DB[inst.id];
  const slotType = item.slotType;
  const pool = forgeStatPoolForSlot(slotType);

  const cost = getReforgeCost(inst.reforgeCount || 0);
  if (state.gold < cost) return null;

  // First time: sets reforgedStat slot. Afterwards: rerolls the same slot.
  if (!inst.reforgedStat) {
    inst.reforgedStat = statKey && pool.includes(statKey) ? statKey : pool[Math.floor(Math.random() * pool.length)];
  }

  state.gold -= cost;
  inst.reforgeCount = (inst.reforgeCount || 0) + 1;

  let resultStat;
  if (statKey && state.forge.discoveredReforgeStats.includes(statKey) && pool.includes(statKey)) {
    // Player may pick a discovered stat outright
    resultStat = statKey;
    inst.reforgedStat = statKey;
  } else {
    resultStat = pool[Math.floor(Math.random() * pool.length)];
    inst.reforgedStat = resultStat;
    if (!state.forge.discoveredReforgeStats.includes(resultStat)) {
      state.forge.discoveredReforgeStats.push(resultStat);
      addCombatLog(`📜 Gravação: Novo atributo descoberto — ${resultStat}!`, 'log-crit');
    }
  }

  forgeAddXp(14);
  addCombatLog(`📜 Gravação: ${item.name} regravado com atributo "${inst.reforgedStat}".`, 'log-system');
  return inst.reforgedStat;
}

// ─── 6. Inscricao (Runewords) ────────────────────────────────────────
function forgeApplyInscription(invIdx, inscriptionKey, isMinor = false) {
  if (invIdx < 0 || invIdx >= state.inventory.length) return false;
  const inst = state.inventory[invIdx];
  const isArtifact = ARTIFACTS_DB[inst.id] !== undefined;
  const item = isArtifact ? ARTIFACTS_DB[inst.id] : BASE_ITEMS_DB[inst.id];
  const insDef = INSCRIPTIONS[inscriptionKey];
  if (!insDef) return false;
  if (!insDef.compatible.includes(item.slotType)) return false;

  if (isMinor) {
    const rarityIdx = RARITIES.indexOf(inst.rarity || 'common');
    if (rarityIdx < RARITIES.indexOf(MINOR_INSCRIPTION_MIN_RARITY)) return false;
    if (inst.inscription && inst.inscription.id) {
      const mainFamily = INSCRIPTIONS[inst.inscription.id].family;
      if (mainFamily === insDef.family) return false; // must differ from main family
    }
  }

  if (!forgeSpendMaterials(INSCRIPTION_COST)) return false;

  if (isMinor) inst.minorInscription = { id: inscriptionKey };
  else inst.inscription = { id: inscriptionKey };

  forgeAddXp(18);
  sfx.playSpell();
  addCombatLog(`🔯 Inscrição: ${insDef.name} aplicada em ${item.name}${isMinor ? ' (menor)' : ''}.`, 'log-crit');
  return true;
}

// ─── 7. Extracao (Component recovery) ────────────────────────────────
function forgeExtractComponent(invIdx, componentType, safe = false) {
  if (invIdx < 0 || invIdx >= state.inventory.length) return null;
  const inst = state.inventory[invIdx];
  const rarity = inst.rarity || 'common';

  let cost = { gold: EXTRACTION_BASE_COST };
  let usedSeal = false;
  if (safe) {
    cost = { gold: Math.round(EXTRACTION_BASE_COST * EXTRACTION_SAFE_COST_MULT) };
    if (state.forge.extractionSeals > 0) usedSeal = true;
  }
  if (state.gold < cost.gold) return null;

  let recovered = null;
  let success = safe; // safe extraction with or without seal guarantees success
  if (!safe) {
    const rate = (EXTRACTION_RECOVERY_RATES[componentType] || {})[rarity] || 0;
    success = Math.random() < rate;
  }

  if (componentType === 'gem') {
    // Extract first filled gem slot
    const slotIdx = (inst.gemSlots || []).findIndex(g => g);
    if (slotIdx === -1) return null;
    const gem = inst.gemSlots[slotIdx];
    inst.gemSlots[slotIdx] = null;
    if (success) {
      const key = forgeGemKey(gem.type, gem.level);
      state.forge.gemInventory[key] = (state.forge.gemInventory[key] || 0) + 1;
      recovered = gem;
    }
  } else if (componentType === 'inscription' || componentType === 'minorInscription') {
    const field = componentType;
    if (!inst[field]) return null;
    const insId = inst[field].id;
    inst[field] = null;
    if (success) recovered = { id: insId };
  } else {
    return null;
  }

  state.gold -= cost.gold;
  if (usedSeal) state.forge.extractionSeals--;
  forgeAddXp(10);
  addCombatLog(`⚗️ Extração: ${success ? 'Sucesso — componente recuperado.' : 'Componente perdido no processo.'}`, success ? 'log-crit' : 'log-system');
  return { success, recovered };
}

// ─── 8. Oferenda (Altar / sacrifice) ─────────────────────────────────
function forgeOfferItem(invIdx) {
  if (invIdx < 0 || invIdx >= state.inventory.length) return null;
  const inst = state.inventory[invIdx];
  const value = getOfferingValue(inst, inst.level || 1);
  const rarityIdx = RARITIES.indexOf(inst.rarity || 'common');

  state.inventory.splice(invIdx, 1);
  state.forge.altarFavor += value;
  if (rarityIdx >= RARITIES.indexOf('legendary')) state.forge.grandRitualFavor += value;
  forgeAddXp(Math.round(value * 0.5));

  let blessingReady = false;
  if (state.forge.altarFavor >= ALTAR_FAVOR_THRESHOLD) {
    state.forge.altarFavor -= ALTAR_FAVOR_THRESHOLD;
    blessingReady = true;
  }

  let grandRitualReady = false;
  if (state.forge.grandRitualFavor >= GRAND_RITUAL_THRESHOLD) {
    state.forge.grandRitualFavor -= GRAND_RITUAL_THRESHOLD;
    grandRitualReady = true;
    forgeGrantGrandRitualReward();
  }

  sfx.playCoin();
  addCombatLog(`🕯️ Oferenda: Item sacrificado por ${value} pontos de Favor do Altar.`, 'log-system');
  return { value, blessingReady, grandRitualReady };
}

function forgeChooseBlessing(blessingId) {
  const bl = ALTAR_BLESSINGS.find(b => b.id === blessingId);
  if (!bl) return false;
  state.forge.activeBlessing = { id: bl.id };
  state.forge.blessingSecondsRemaining = bl.durationSec;
  sfx.playLevelUp();
  addCombatLog(`🕯️ Altar: Bênção ativada — ${bl.name}!`, 'log-crit');
  return true;
}

function forgeGrantGrandRitualReward() {
  // Simple, deterministic-ish special reward: sigils/fragments + a guaranteed legendary item.
  state.ancestralSigils = (state.ancestralSigils || 0) + 3;
  state.runeFragments = (state.runeFragments || 0) + 15;
  if (state.inventory.length < 24) {
    const region = getRegionDetails(state.currentStage);
    const inst = generateItem(Math.max(1, region.lvl * 2), 'legendary');
    inst.affinity = null; inst.gemSlots = []; inst.gemSlotsOpened = 0;
    inst.reforgedStat = null; inst.reforgeCount = 0; inst.inscription = null; inst.minorInscription = null;
    state.inventory.push(inst);
  }
  addCombatLog(`🌟 <span class="log-crit">RITUAL ANCESTRAL COMPLETO!</span> +3 Selos Ancestrais, +15 Fragmentos de Runa, e um item Lendário garantido!`, 'log-crit');
}

// ─── Forge tick (blessing timer) — called every 1s alongside tickManeuvers ──
function tickForge() {
  if (state.forge.blessingSecondsRemaining > 0) {
    state.forge.blessingSecondsRemaining = Math.max(0, state.forge.blessingSecondsRemaining - 1);
    if (state.forge.blessingSecondsRemaining === 0) {
      addCombatLog(`🕯️ Altar: A bênção ativa expirou.`, 'log-system');
      state.forge.activeBlessing = null;
    }
  }
}

function getForgeActiveBlessingEffect() {
  if (!state.forge.activeBlessing || state.forge.blessingSecondsRemaining <= 0) return {};
  const bl = ALTAR_BLESSINGS.find(b => b.id === state.forge.activeBlessing.id);
  return bl ? bl.effect : {};
}

// Base per-power stat values applied by socketed gems (design choice, tunable).
const FORGE_GEM_BASE_VALUES = {
  ruby:     { damage: 3 },
  sapphire: { mana: 15 },
  emerald:  { attackSpeedPct: 0.01 },
  topaz:    { goldPct: 0.01, dropChancePct: 0.01, xpPct: 0.01 },
  onyx:     { armor: 1.5, bossDmgPct: 0.01 }
};

// Aggregates all forge-driven bonuses (affinity + gems + inscriptions) for a single item instance.
// Returns a flat additive bag; caller (getHeroStats) decides how to apply each key.
function getForgeItemBonuses(inst) {
  const bonuses = {};
  const add = (key, val) => { bonuses[key] = (bonuses[key] || 0) + val; };

  if (inst.affinity && AFFINITIES[inst.affinity]) {
    const eff = AFFINITIES[inst.affinity].effect;
    for (let k in eff) add(k, eff[k]);
  }

  if (inst.gemSlots) {
    inst.gemSlots.forEach(gem => {
      if (!gem) return;
      const power = GEM_LEVEL_POWER[Math.max(0, Math.min(GEM_LEVELS - 1, gem.level - 1))];
      const baseVals = FORGE_GEM_BASE_VALUES[gem.type];
      if (!baseVals) return;
      for (let k in baseVals) add(k, baseVals[k] * power);
    });
  }

  if (inst.inscription && INSCRIPTIONS[inst.inscription.id]) {
    const eff = INSCRIPTIONS[inst.inscription.id].effect;
    for (let k in eff) add(k, eff[k]);
  }
  if (inst.minorInscription && INSCRIPTIONS[inst.minorInscription.id]) {
    const eff = INSCRIPTIONS[inst.minorInscription.id].effect;
    for (let k in eff) add(k, eff[k]);
  }

  return bonuses;
}

// Get region from stage
function getRegionDetails(stage) {
  if (stage <= 12) return { id: 'safe_lane', name: 'Safe Lane', lvl: 1, drops: ['iron_branch', 'slippers', 'circlet'] };
  if (stage <= 27) return { id: 'small_camp', name: 'Small Camp', lvl: 3, drops: ['gauntlets', 'mantle', 'ring_of_regen'] };
  if (stage <= 42) return { id: 'mid_lane', name: 'Mid Lane', lvl: 5, drops: ['boots_of_speed', 'gloves', 'blades_of_attack'] };
  if (stage <= 57) return { id: 'medium_camp', name: 'Medium Camp', lvl: 8, drops: ['ring_of_health', 'vitality_booster', 'morbid_mask', 'chainmail'] };
  if (stage <= 72) return { id: 'offlane', name: 'Offlane Lane', lvl: 11, drops: ['ogre_axe', 'broadsword', 'helm_of_iron_will'] };
  if (stage <= 87) return { id: 'hard_camp', name: 'Hard Camp', lvl: 15, drops: ['mithril_hammer', 'claymore', 'platemail'] };
  if (stage <= 102) return { id: 'ancient_camp', name: 'Ancient Camp', lvl: 20, drops: ['sacred_relic', 'hyperstone', 'blink_dagger'] };
  return { id: 'roshan_pit', name: "Roshan's Pit", lvl: 30, drops: ['aegis_of_the_immortal'] };
}

// --- RANK (PATENTE) SYSTEM ---
// Each rank spans exactly 30 stages. Rank is derived from state.currentStage.
const RANKS_DB = [
  { index: 1, id: 'herald',    name: 'Arauto',     nameEn: 'Herald',    difficultyLabel: 'Fácil / Tutorial', minStage: 1,   maxStage: 12 },
  { index: 2, id: 'guardian',  name: 'Guardião',   nameEn: 'Guardian',  difficultyLabel: 'Normal',            minStage: 13,  maxStage: 27 },
  { index: 3, id: 'crusader',  name: 'Cruzado',    nameEn: 'Crusader',  difficultyLabel: 'Intermediário',     minStage: 28,  maxStage: 42 },
  { index: 4, id: 'archon',    name: 'Arconte',    nameEn: 'Archon',    difficultyLabel: 'Desafiador',        minStage: 43,  maxStage: 57 },
  { index: 5, id: 'legend',    name: 'Lenda',      nameEn: 'Legend',    difficultyLabel: 'Difícil',           minStage: 58,  maxStage: 72 },
  { index: 6, id: 'ancient',   name: 'Ancestral',  nameEn: 'Ancient',   difficultyLabel: 'Muito Difícil',     minStage: 73,  maxStage: 87 },
  { index: 7, id: 'divine',    name: 'Divino',     nameEn: 'Divine',    difficultyLabel: 'Extremo',           minStage: 88,  maxStage: 102 },
  { index: 8, id: 'immortal',  name: 'Imortal',    nameEn: 'Immortal',  difficultyLabel: 'Pesadelo / Sem Fim', minStage: 103, maxStage: Infinity }
];

function getRankDetails(stage) {
  const rank = RANKS_DB.find(r => stage >= r.minStage && stage <= r.maxStage) || RANKS_DB[RANKS_DB.length - 1];
  const stagesCount = (rank.maxStage === Infinity) ? 30 : (rank.maxStage - rank.minStage + 1);
  return { ...rank, stageInRank: stage - rank.minStage + 1, stagesPerRank: stagesCount };
}

// Per-rank difficulty multiplier tables (index 0 = rank 1 "Arauto")
const RANK_HP_MULTIPLIERS  = [1.0, 1.15, 1.35, 1.6, 1.9, 2.3, 2.8, 3.4];
const RANK_DMG_MULTIPLIERS = [1.0, 1.1, 1.25, 1.45, 1.7, 2.1, 2.7, 3.5];
const RANK_REWARD_MULTIPLIERS = [1.0, 1.1, 1.2, 1.35, 1.5, 1.7, 1.9, 2.2];

function getRankMultiplier(rankIndex) {
  const i = Math.min(RANK_HP_MULTIPLIERS.length, Math.max(1, rankIndex)) - 1;
  return { hp: RANK_HP_MULTIPLIERS[i], dmg: RANK_DMG_MULTIPLIERS[i], reward: RANK_REWARD_MULTIPLIERS[i] };
}

// --- VIEW RENDERING ---

function renderMaps() {
  const container = document.getElementById('map-selector');
  container.innerHTML = "";
  
  // Render a list of all regions with current lock status based on stage
  MAPS_DB.forEach(map => {
    const card = document.createElement('div');
    const regionOfStage = getRegionDetails(state.currentStage);
    card.className = `map-card ${map.id === regionOfStage.id ? 'active' : ''}`;
    
    card.innerHTML = `
      <div class="map-name">${map.name}</div>
      <div class="map-level">Lvl ${map.lvl} • Stage</div>
    `;
    
    container.appendChild(card);
  });
}

// Top-level dispatcher for the Hero Lineup tab's 3 sub-views
function renderHeroesTab() {
  renderMyTeamView();
  renderHeroSelectGrid();
  renderHeroDetails();
}

// Dota-style "hero select screen" grid — all heroes visible at once, grouped by attribute
function renderHeroSelectGrid() {
  const grid = document.getElementById('hero-select-grid');
  grid.innerHTML = "";

  const categories = {
    strength: { name: 'Strength', emoji: '💪', color: '#ff6b6b', heroes: [] },
    agility: { name: 'Agility', emoji: '⚡', color: '#2ecc71', heroes: [] },
    intelligence: { name: 'Intelligence', emoji: '🧠', color: '#3498db', heroes: [] },
    universal: { name: 'Universal', emoji: '🌌', color: '#b983d6', heroes: [] }
  };

  for (let id in state.heroes) {
    const h = state.heroes[id];
    const type = h.type || 'strength';
    if (categories[type]) categories[type].heroes.push({ id, ...h });
  }
  for (let type in categories) categories[type].heroes.sort((a, b) => a.name.localeCompare(b.name));

  const search = heroGridSearch.trim().toLowerCase();

  for (let type in categories) {
    if (heroGridFilter !== 'all' && heroGridFilter !== type) continue;
    const cat = categories[type];
    const visibleHeroes = cat.heroes.filter(hd => !search || hd.name.toLowerCase().includes(search));
    if (visibleHeroes.length === 0) continue;

    const section = document.createElement('div');
    section.className = 'hero-select-section';

    const header = document.createElement('div');
    header.className = `hero-group-header ${type}`;
    header.innerHTML = `<span>${cat.emoji}</span> <span>${cat.name.toUpperCase()}</span>`;
    section.appendChild(header);

    const row = document.createElement('div');
    row.className = 'hero-select-row';

    visibleHeroes.forEach(heroData => {
      const isUnlocked = state.unlockedHeroIds.includes(heroData.id);
      const isActive = activeHeroes.includes(heroData.id);
      const isPremium = PREMIUM_HERO_IDS.includes(heroData.id);
      const card = document.createElement('div');
      card.className = `hero-select-card ${!isUnlocked ? 'locked' : ''} ${isActive ? 'in-team' : ''} ${isPremium && !isUnlocked ? 'premium' : ''}`;

      const iconUrl = heroData.image ? heroData.image.replace('/heroes/', '/heroes/icons/') : '';
      card.innerHTML = `
        <div class="hero-select-portrait">${iconUrl ? `<img src="${iconUrl}" alt="${heroData.name}">` : heroData.emoji}</div>
        ${isUnlocked ? `<span class="hero-select-level">${heroData.level}</span>` : `<span class="hero-select-lock">${isPremium ? '🌟' : '🔒'}</span>`}
        ${isActive ? `<span class="hero-select-active-badge" title="In active team">★</span>` : ''}
        <div class="hero-select-name-tag">${heroData.name}</div>
      `;
      if (isUnlocked) {
        card.title = `${heroData.name} — Lvl ${heroData.level}`;
      } else if (isPremium) {
        card.title = `${heroData.name} — Exclusivo Dota Plus (🪙 ${getPremiumHeroCoinCost(heroData.id).toLocaleString()} Dota Coins)`;
      } else {
        card.title = `${heroData.name} — Locked (💎 ${heroData.recruitCost.toLocaleString()} Shards)`;
      }
      card.addEventListener('click', () => {
        if (isUnlocked && teamSwapSlotIdx !== null) {
          const alreadyIdx = activeHeroes.indexOf(heroData.id);
          if (alreadyIdx !== -1) {
            activeHeroes[alreadyIdx] = activeHeroes[teamSwapSlotIdx];
          }
          activeHeroes[teamSwapSlotIdx] = heroData.id;
          teamSwapSlotIdx = null;
          renderHeroesTab();
          renderSynergies();
          updateHUD();
        } else {
          selectedHeroId = heroData.id;
          renderHeroesTab();
        }
      });
      row.appendChild(card);
    });

    section.appendChild(row);
    grid.appendChild(section);
  }
}

function renderHeroDetails() {
  const detail = document.getElementById('hero-details-container');
  const h = state.heroes[selectedHeroId];
  const isUnlocked = state.unlockedHeroIds.includes(selectedHeroId);
  
  if (!isUnlocked) {
    const isPremium = PREMIUM_HERO_IDS.includes(selectedHeroId);

    if (isPremium) {
      const coinCost = getPremiumHeroCoinCost(selectedHeroId);
      const canAfford = state.dotaPlus && state.dotaCoins >= coinCost;
      detail.innerHTML = `
        <div class="recruit-panel">
          <div class="hero-avatar-large">${h.image ? `<img src="${h.image}" alt="${h.name}">` : h.emoji}</div>
          <h2 class="hero-name-large">${h.name} <span style="color: var(--secondary-gold); font-size: 0.8rem;">★ EXCLUSIVE</span></h2>
          <p style="color: var(--text-secondary); max-width: 300px;">${h.role}</p>
          <div class="hero-type-tag ${h.type}">${h.type}</div>
          <div class="recruit-price">Requires: 🌟 Dota Plus + 🪙 ${coinCost.toLocaleString()} Dota Coins</div>
          ${!state.dotaPlus ? `<p style="color: var(--dota-red); font-size: 0.75rem;">Ative o Dota Plus na Secret Shop → Dota Coins Store para desbloquear este herói.</p>` : ''}
          <button class="btn-recruit" id="btn-recruit-hero" ${!canAfford ? 'disabled' : ''}>Recruit Hero (Dota Coins)</button>
        </div>
      `;

      document.getElementById('btn-recruit-hero').addEventListener('click', () => {
        if (state.dotaPlus && state.dotaCoins >= coinCost) {
          state.dotaCoins -= coinCost;
          state.unlockedHeroIds.push(selectedHeroId);
          state.heroes[selectedHeroId].level = 1;
          if (state.teamSize > activeHeroes.length) {
            activeHeroes.push(selectedHeroId);
          }
          sfx.playLevelUp();
          addCombatLog(`🌟 Recruited exclusive hero ${h.name} with Dota Coins!`, "log-loot");
          renderHeroesTab();
          renderSynergies();
          updateHUD();
        }
      });
      return;
    }

    detail.innerHTML = `
      <div class="recruit-panel">
        <div class="hero-avatar-large">${h.image ? `<img src="${h.image}" alt="${h.name}">` : h.emoji}</div>
        <h2 class="hero-name-large">${h.name}</h2>
        <p style="color: var(--text-secondary); max-width: 300px;">${h.role}</p>
        <div class="hero-type-tag ${h.type}">${h.type}</div>
        <div class="recruit-price">Recruitment Cost: 💎 ${h.recruitCost.toLocaleString()} Shards</div>
        <button class="btn-recruit" id="btn-recruit-hero" ${state.shards < h.recruitCost ? 'disabled' : ''}>Recruit Hero</button>
      </div>
    `;

    document.getElementById('btn-recruit-hero').addEventListener('click', () => {
      if (state.shards >= h.recruitCost) {
        state.shards -= h.recruitCost;
        state.unlockedHeroIds.push(selectedHeroId);
        state.heroes[selectedHeroId].level = 1;
        if (state.teamSize > activeHeroes.length) {
          activeHeroes.push(selectedHeroId);
        }
        sfx.playLevelUp();
        addCombatLog(`Recruited ${h.name}!`, "log-loot");
        renderHeroesTab();
        renderSynergies();
        updateHUD();
      }
    });
    return;
  }
  
  const stats = getHeroStats(selectedHeroId);
  const nextXpThreshold = Math.round(150 * Math.pow(h.level, 1.8));
  
  detail.innerHTML = `
    <div class="hero-details-header">
      <div class="hero-details-identity">
        <div class="hero-avatar-large">${h.image ? `<img src="${h.image}" alt="${h.name}">` : h.emoji}</div>
        <div>
          <h2 class="hero-name-large">${h.name}</h2>
          <div style="display: flex; gap: 10px; align-items: center; margin-top: 4px;">
            <div class="hero-type-tag ${h.type}">${h.type}</div>
            <span style="font-size: 0.85rem; color: var(--text-secondary);">Level ${h.level}</span>
            ${h.permanentDmgBonus > 0 ? `<span style="font-size: 0.8rem; color: var(--rarity-arcana);">Duel Damage: +${h.permanentDmgBonus}</span>` : ''}
          </div>
        </div>
      </div>
      <div style="width: 200px; display: flex; flex-direction: column; gap: 4px;">
        <span style="font-size: 0.75rem; color: var(--text-secondary);">Experience (${h.xp}/${nextXpThreshold})</span>
        <div class="bar-container">
          <div class="bar-fill xp" style="width: ${(h.xp / nextXpThreshold) * 100}%;"></div>
        </div>
      </div>
    </div>
    
    <div class="hero-grid-panels">
      <div class="hero-stats-panel">
        <h3 class="hud-section-title">Hero Stats</h3>
        <div class="stats-grid">
          <div class="stat-item"><span class="stat-label">Health</span><span class="stat-value" style="color: #2ecc71;">${stats.maxHp} (+${stats.hpRegen}/s)</span></div>
          <div class="stat-item"><span class="stat-label">Mana</span><span class="stat-value" style="color: #3498db;">${stats.maxMana} (+${(stats.manaRegen + getGlobalManaRegenBonus()).toFixed(2)}/s)</span></div>
          <div class="stat-item"><span class="stat-label">Damage</span><span class="stat-value" style="color: var(--secondary-gold);">${stats.damage}</span></div>
          <div class="stat-item"><span class="stat-label">Attack Speed</span><span class="stat-value">${stats.attackCooldown}s CD</span></div>
          <div class="stat-item"><span class="stat-label">Physical Block</span><span class="stat-value">${stats.block}</span></div>
          <div class="stat-item"><span class="stat-label">Evasion</span><span class="stat-value">${(stats.evasion * 100).toFixed(0)}%</span></div>
        </div>
        
        <h3 class="hud-section-title" style="margin-top: 10px; display: flex; justify-content: space-between;">
          <span>Abilities</span>
          <span style="color: var(--secondary-gold); font-size: 0.8rem;">Points: ${h.skillPoints || 0}</span>
        </h3>
        <div class="hero-skills-list" id="hero-skills-list"></div>
      </div>
      
      <div class="hero-equipment-panel">
        <h3 class="hud-section-title">Equipment Slots (6 + 1 Artifact)</h3>
        <div class="equipment-grid" id="equipment-grid"></div>
      </div>
    </div>

    <div class="hero-talent-tree-panel">
      <h3 class="hud-section-title" style="display: flex; justify-content: space-between;">
        <span>Árvore de Talentos</span>
        <span style="color: var(--secondary-gold); font-size: 0.8rem;">Points: ${h.skillPoints || 0}</span>
      </h3>
      <div class="talent-tree-tiers" id="hero-talent-tiers"></div>
    </div>
  `;
  
  // Render skills
  const skillsList = document.getElementById('hero-skills-list');
  h.skills.forEach((skill, idx) => {
    const row = document.createElement('div');
    row.className = 'skill-row';
    const isUltimate = idx === 2;
    const canSkillUp = (h.skillPoints > 0) && (skill.level < 4) && (!isUltimate || (skill.level === 0 && h.level >= 6) || (skill.level === 1 && h.level >= 12) || (skill.level === 2 && h.level >= 18));
    
    row.innerHTML = `
      <div class="skill-avatar">${isUltimate ? '🔥' : '✨'}</div>
      <div class="skill-info">
        <div class="skill-name-row">
          <span class="skill-name">${skill.name}</span>
          <span class="skill-level">Lvl ${skill.level}/4</span>
        </div>
        <p class="skill-desc">${skill.desc}</p>
      </div>
      <button class="btn-skill-up" ${!canSkillUp ? 'disabled' : ''}>+</button>
    `;
    
    row.querySelector('.btn-skill-up').addEventListener('click', () => {
      h.skillPoints--;
      h.skills[idx].level++;
      sfx.playLevelUp();
      renderHeroesTab();
      updateHUD();
    });
    skillsList.appendChild(row);
  });

  renderHeroTalentTree(selectedHeroId);

  // Render equipment grid (6 normal + 1 artifact)
  const equipGrid = document.getElementById('equipment-grid');
  h.items.forEach((inst, idx) => {
    const slot = document.createElement('div');
    const isArtifact = idx === 6;
    slot.className = `equip-slot ${isArtifact ? 'artifact-slot' : ''}`;
    
    if (inst) {
      const item = isArtifact ? ARTIFACTS_DB[inst.id] : BASE_ITEMS_DB[inst.id];
      slot.classList.add('filled');
      slot.classList.add(`rarity-${inst.rarity || 'common'}`);
      
      const tierLabel = inst.tier > 0 ? `+${inst.tier}` : '';
      slot.innerHTML = `
        <div class="equip-item-icon">${item.image ? `<img src="${item.image}" alt="${item.name}">` : item.emoji}</div>
        <div class="equip-item-name">${item.name} ${tierLabel}</div>
        <button class="btn-unequip" title="Unequip">×</button>
      `;
      
      slot.querySelector('.btn-unequip').addEventListener('click', (e) => {
        e.stopPropagation();
        if (state.inventory.length < state.stashCapacity) {
          h.items[idx] = null;
          state.inventory.push(inst);
          sfx.playCoin();
          renderHeroesTab();
          updateHUD();
        } else {
          addCombatLog("Stash Bag is full!", "log-system");
        }
      });
      slot.addEventListener('mouseenter', (e) => showItemInstanceTooltip(e, inst, isArtifact));
      slot.addEventListener('mouseleave', hideTooltip);
    } else {
      slot.innerHTML = `<span class="equip-slot-label">${isArtifact ? 'Artifact' : 'Empty'}</span>`;
    }
    equipGrid.appendChild(slot);
  });

  // Always refresh synergy panel when heroes tab renders (team may have changed)
  renderSynergies();
}

function formatTalentValue(def, rank) {
  const isPct = def.statKey.endsWith('Pct') || def.statKey === 'bonusCritChance' || def.statKey === 'bonusEvasionPct';
  const amount = def.perRank * rank;
  return isPct ? `+${(amount * 100).toFixed(1)}%` : `+${amount % 1 === 0 ? amount : amount.toFixed(1)}`;
}

function renderHeroTalentTree(heroId) {
  const container = document.getElementById('hero-talent-tiers');
  if (!container) return;
  const h = state.heroes[heroId];
  const tiers = getHeroTalentTiers(heroId);

  container.innerHTML = '';

  tiers.forEach((talentIds, tierIdx) => {
    const reqLevel = TALENT_TIER_LEVELS[tierIdx];
    const unlocked = isTalentTierUnlocked(heroId, tierIdx);

    const row = document.createElement('div');
    row.className = `talent-tier-row ${unlocked ? 'unlocked' : 'locked'}`;

    const levelLabel = document.createElement('div');
    levelLabel.className = 'talent-tier-level-label';
    levelLabel.textContent = reqLevel === 0 ? 'Lvl 0' : `Lvl ${reqLevel}`;
    row.appendChild(levelLabel);

    const nodeGroup = document.createElement('div');
    nodeGroup.className = 'talent-node-group';

    talentIds.forEach(talentId => {
      const def = TALENT_DEFS[talentId];
      if (!def) return;
      const rank = getTalentRank(heroId, talentId);
      const isMaxed = rank >= def.maxRank;
      const canBuy = unlocked && !isMaxed && (h.skillPoints || 0) > 0;

      let statusClass = 'locked';
      if (unlocked) statusClass = isMaxed ? 'maxed' : (rank > 0 ? 'partial' : 'available');

      const node = document.createElement('div');
      node.className = `talent-node ${statusClass}`;
      node.innerHTML = `
        <div class="talent-node-icon">${def.icon}<span class="talent-node-badge">${rank}/${def.maxRank}</span></div>
        <div class="talent-node-name">${def.name}</div>
      `;

      node.addEventListener('mouseenter', (e) => {
        const nextVal = formatTalentValue(def, Math.min(rank + 1, def.maxRank));
        const curVal = rank > 0 ? formatTalentValue(def, rank) : '+0';
        const lockNote = !unlocked ? `<div class="talent-tooltip-lock">Requer nível ${reqLevel}</div>` : '';
        showTooltip(e, `
          <div class="talent-tooltip-title">${def.name}</div>
          <div class="talent-tooltip-body">Atual: ${curVal} • Próximo rank: ${nextVal}</div>
          ${lockNote}
        `);
      });
      node.addEventListener('mouseleave', hideTooltip);

      node.addEventListener('click', () => {
        if (!canBuy) return;
        h.skillPoints--;
        h.talentRanks[talentId] = rank + 1;
        sfx.playLevelUp();
        renderHeroesTab();
        updateHUD();
      });

      nodeGroup.appendChild(node);
    });

    row.appendChild(nodeGroup);
    container.appendChild(row);
  });
}

function renderMyTeamView() {
  const slotsWrap = document.getElementById('my-team-slots');
  if (!slotsWrap) return;
  slotsWrap.innerHTML = "";

  const slotLabels = [
    { label: '🛡️ Frontline', role: 'Tank' },
    { label: '✨ Midline', role: 'Support' },
    { label: '🏹 Backline', role: 'Carry' },
    { label: '➕ Support / Bench', role: 'Bench' }
  ];

  for (let i = 0; i < 4; i++) {
    const heroId = activeHeroes[i];
    const slot = document.createElement('div');
    slot.className = `team-slot-card ${heroId ? 'filled' : 'empty'} ${teamSwapSlotIdx === i ? 'awaiting-swap' : ''}`;
    slot.style.cssText = 'flex: 1; min-width: 120px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-light); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; min-height: 150px; position: relative; cursor: pointer; transition: all 0.2s ease;';

    // Highlight slot if selected for swap
    if (teamSwapSlotIdx === i) {
      slot.style.borderColor = 'var(--secondary-gold)';
      slot.style.boxShadow = '0 0 10px rgba(229, 193, 88, 0.2)';
    }

    // Label above slot inside card
    const labelEl = document.createElement('div');
    labelEl.style.cssText = 'font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: bold; margin-bottom: 6px; letter-spacing: 0.5px;';
    labelEl.textContent = slotLabels[i].label;
    slot.appendChild(labelEl);

    if (heroId && state.heroes[heroId]) {
      const h = state.heroes[heroId];
      const stats = getHeroStats(heroId);
      const iconUrl = h.image ? h.image.replace('/heroes/', '/heroes/icons/') : '';
      
      // Calculate hero power
      let heroPower = h.level * 100;
      state.inventory.forEach(inst => {
        if (inst.equippedTo === heroId) {
          heroPower += (inst.tier + 1) * (RARITIES.indexOf(inst.rarity) + 1) * 35;
        }
      });

      // Role tag based on type
      let roleTag = h.type === 'strength' ? '🛡️ Tank' : (h.type === 'agility' ? '🏹 Carry' : '✨ Support');

      const content = document.createElement('div');
      content.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 4px; width: 100%; flex: 1; justify-content: center;';
      content.innerHTML = `
        <div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; border: 2px solid var(--primary-gold); margin-bottom: 2px;">
          ${iconUrl ? `<img src="${iconUrl}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="font-size: 1.5rem; text-align: center; line-height: 44px;">${h.emoji}</div>`}
        </div>
        <div style="font-size: 0.75rem; font-weight: 700; text-align: center; color: var(--text-primary); text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width: 100%;" title="${h.name}">${h.name}</div>
        <div style="font-size: 0.65rem; color: var(--text-secondary);">Lvl ${h.level} • ${roleTag}</div>
        <div style="font-size: 0.65rem; color: var(--secondary-gold); font-weight: bold; font-family: 'JetBrains Mono', monospace;">⚔️ ${heroPower} Power</div>
      `;
      slot.appendChild(content);

      // Remove button (top right)
      const removeBtn = document.createElement('button');
      removeBtn.innerHTML = '×';
      removeBtn.style.cssText = 'position: absolute; top: 4px; right: 6px; background: transparent; border: none; color: var(--text-secondary); font-size: 1.1rem; cursor: pointer; padding: 2px; line-height: 1;';
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        activeHeroes.splice(i, 1);
        renderHeroesTab();
        renderSynergies();
        updateHUD();
      });
      slot.appendChild(removeBtn);

      slot.addEventListener('click', () => {
        selectedHeroId = heroId;
        teamSwapSlotIdx = (teamSwapSlotIdx === i) ? null : i;
        renderHeroesTab();
      });

    } else {
      const content = document.createElement('div');
      content.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; justify-content: center; opacity: 0.5;';
      content.innerHTML = `
        <div style="font-size: 2rem; color: var(--text-dark); font-weight: 300;">+</div>
        <div style="font-size: 0.65rem; color: var(--text-secondary); text-align: center;">Vazio</div>
      `;
      slot.appendChild(content);

      slot.addEventListener('click', () => {
        teamSwapSlotIdx = (teamSwapSlotIdx === i) ? null : i;
        renderMyTeamView();
      });
    }

    slotsWrap.appendChild(slot);
  }

  // Update total team power display
  const powerVal = getTeamPower();
  const powerEl = document.getElementById('team-power-lineup-display');
  if (powerEl) powerEl.textContent = powerVal.toLocaleString();
}

// MERCHANT TAB
function renderShopTab() {
  const grid = document.getElementById('shop-items-grid');
  grid.innerHTML = "";
  
  for (let id in BASE_ITEMS_DB) {
    const item = BASE_ITEMS_DB[id];
    const card = document.createElement('div');
    const calcCost = Math.round(item.stats.damage ? item.stats.damage * 150 : 120);
    card.className = 'shop-item-card';
    
    card.innerHTML = `
      <div class="shop-item-icon">${item.image ? `<img src="${item.image}" alt="${item.name}">` : item.emoji}</div>
      <div class="shop-item-name">${item.name}</div>
      <div class="shop-item-cost">${calcCost}</div>
    `;
    card.addEventListener('click', () => buyItem(id, calcCost));
    card.addEventListener('mouseenter', (e) => showItemTooltip(e, item, calcCost));
    card.addEventListener('mouseleave', hideTooltip);
    grid.appendChild(card);
  }
  
  // Render stash inventory
  const invGrid = document.getElementById('inventory-grid');
  invGrid.innerHTML = "";
  document.getElementById('inventory-count').textContent = `${state.inventory.length} / ${state.stashCapacity}`;

  for (let i = 0; i < state.stashCapacity; i++) {
    const slot = document.createElement('div');
    slot.className = 'inventory-slot';
    
    if (i < state.inventory.length) {
      const inst = state.inventory[i];
      const isArtifact = ARTIFACTS_DB[inst.id] !== undefined;
      const item = isArtifact ? ARTIFACTS_DB[inst.id] : BASE_ITEMS_DB[inst.id];
      slot.classList.add('filled');
      slot.classList.add(`rarity-${inst.rarity || 'common'}`);
      
      const tierLabel = inst.tier > 0 ? `+${inst.tier}` : '';
      slot.innerHTML = `
        <div class="inventory-slot-icon">${item.image ? `<img src="${item.image}" alt="${item.name}">` : item.emoji}</div>
        <div style="font-size: 0.6rem; color: var(--text-primary); font-weight: bold; position: absolute; top: 2px; right: 4px;">${tierLabel}</div>
        <button class="btn-unequip" title="Sell" style="display: none; top: 4px; right: 4px;">$</button>
      `;
      
      const sellBtn = slot.querySelector('.btn-unequip');
      slot.addEventListener('mouseenter', () => sellBtn.style.display = 'flex');
      slot.addEventListener('mouseleave', () => sellBtn.style.display = 'none');
      
      sellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sellItem(i);
      });
      slot.addEventListener('click', () => equipItemToHero(i, selectedHeroId));
      slot.addEventListener('mouseenter', (e) => showItemInstanceTooltip(e, inst, isArtifact));
      slot.addEventListener('mouseleave', hideTooltip);
    } else {
      slot.innerHTML = `<span style="font-size: 0.6rem; color: var(--text-dark);">EMPTY</span>`;
    }
    invGrid.appendChild(slot);
  }
}

// FORGE BLACKSMITH — dispatcher for Upgrade/Dismantle vs Fusion sub-views
// ═══════════════════ ANCESTRAL FORGE UI ═══════════════════
let activeForgeModule = 'synthesis';
let forgeSelectedInvIdx = -1; // item currently selected for item-based modules

const FORGE_MODULE_ORDER = ['synthesis', 'alchemy', 'creation', 'lapidary', 'reforge', 'inscription', 'extraction', 'offering'];
const FORGE_MODULE_ICONS = { synthesis: '⚒️', alchemy: '🧪', creation: '🛠️', lapidary: '💎', reforge: '📜', inscription: '🔯', extraction: '⚗️', offering: '🕯️' };

function itemDbFor(inst) {
  return ARTIFACTS_DB[inst.id] !== undefined ? ARTIFACTS_DB[inst.id] : BASE_ITEMS_DB[inst.id];
}

function renderBlacksmithTab() { renderForgeTab(); }

function renderForgeTab() {
  // Header: level/xp + materials
  document.getElementById('forge-level-val').textContent = state.forge.level;
  const xpReq = getForgeLevelXpReq(state.forge.level);
  document.getElementById('forge-xp-bar-fill').style.width = `${Math.min(100, (state.forge.xp / xpReq) * 100)}%`;
  document.getElementById('forge-xp-text').textContent = `${Math.floor(state.forge.xp)} / ${xpReq} XP`;

  const matRow = document.getElementById('forge-materials-row');
  matRow.innerHTML = FORGE_MATERIAL_TIERS.map(tier => `
    <div class="forge-material-chip ${tier}">
      <span class="forge-material-icon">${tier === 'common' ? '🧪' : tier === 'rare' ? '🧫' : '⚗️'}</span>
      <span>${state.forge.materials[tier] || 0}</span>
    </div>
  `).join('');

  // Module nav
  const nav = document.getElementById('forge-module-nav');
  nav.innerHTML = FORGE_MODULE_ORDER.map(key => {
    const unlocked = isForgeModuleUnlocked(key);
    const reqLvl = forgeUnlockLevelFor(key);
    return `
      <button class="btn-forge-module ${activeForgeModule === key ? 'active' : ''} ${!unlocked ? 'locked' : ''}"
        data-forge-module="${key}" ${!unlocked ? `title="Desbloqueia no nível ${reqLvl}"` : ''}>
        <span>${FORGE_MODULE_ICONS[key]}</span> ${FORGE_MODULE_NAMES[key]}${!unlocked ? ' 🔒' : ''}
      </button>
    `;
  }).join('');

  nav.querySelectorAll('.btn-forge-module').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.forgeModule;
      if (!isForgeModuleUnlocked(key)) return;
      activeForgeModule = key;
      forgeSelectedInvIdx = -1;
      renderForgeTab();
    });
  });

  const body = document.getElementById('forge-module-body');
  if (!isForgeModuleUnlocked(activeForgeModule)) {
    const reqLvl = forgeUnlockLevelFor(activeForgeModule);
    body.innerHTML = `<div class="forge-module-locked-msg"><span class="lock-icon">🔒</span><div>Módulo bloqueado.<br>Desbloqueia no nível ${reqLvl} da Forja.</div></div>`;
    return;
  }

  switch (activeForgeModule) {
    case 'synthesis': renderForgeSynthesisModule(body); break;
    case 'alchemy': renderForgeAlchemyModule(body); break;
    case 'creation': renderForgeCreationModule(body); break;
    case 'lapidary': renderForgeLapidaryModule(body); break;
    case 'reforge': renderForgeReforgeModule(body); break;
    case 'inscription': renderForgeInscriptionModule(body); break;
    case 'extraction': renderForgeExtractionModule(body); break;
    case 'offering': renderForgeOfferingModule(body); break;
  }
}

// ─── 1. Sintese ──────────────────────────────────────────────────────────────────────────────
const RARITY_COLORS = {
  common: '#aaa', uncommon: '#4caf50', rare: '#2196f3',
  epic: '#9c27b0', legendary: '#ff9800', mythic: '#e91e63', immortal: '#f44336'
};

function renderForgeSynthesisModule(body) {
  // Left side: still shows selected item for TIER UPGRADE
  const actionPanel = forgeTwoColumnShell(body, 'Selecione item para Tier Up');

  // ── Tier Upgrade section (item-based) ─────────────────────────────
  let upgradeHtml = `<div class="forge-action-section"><h4>🔼 Upgrade de Tier</h4>`;
  if (forgeSelectedInvIdx >= 0 && forgeSelectedInvIdx < state.inventory.length) {
    const inst = state.inventory[forgeSelectedInvIdx];
    const item = itemDbFor(inst);
    const rarityIdx = RARITIES.indexOf(inst.rarity || 'common');
    const upgradeGoldCost = Math.round(150 * Math.pow(1.12, inst.tier) * (rarityIdx + 1));
    const upgradeEssenceCost = Math.round((inst.tier + 1) * (rarityIdx + 1) * 3);
    const canUpgrade = (state.gold >= upgradeGoldCost) && (state.essence >= upgradeEssenceCost) && (inst.tier < 10);
    upgradeHtml += `
      <div class="forge-item-display rarity-${inst.rarity || 'common'}" style="margin-bottom:8px;">
        <div style="font-size:2rem;">${item && item.image ? `<img src="${item.image}" alt="${item.name}" style="width:40px;">` : (item ? item.emoji : '❓')}</div>
        <div style="font-weight:800;font-size:0.8rem;">${item ? item.name : inst.id}</div>
        <div class="forge-item-tier">Tier +${inst.tier}</div>
        <div style="font-size:0.65rem;text-transform:uppercase;color:var(--text-secondary);">${inst.rarity}</div>
      </div>
      <button class="btn-forge-action upgrade-btn" id="btn-forge-upgrade" ${!canUpgrade ? 'disabled' : ''}>
        MELHORAR TIER<br><span style="font-size:0.7rem;font-weight:normal;">🪙 ${upgradeGoldCost} • 🧪 ${upgradeEssenceCost}</span>
      </button>`;
  } else {
    upgradeHtml += `<p style="color:var(--text-secondary);font-size:0.75rem;">Selecione um item no stash para ver opções de Tier Up.</p>`;
  }
  upgradeHtml += `</div>`;

  // ── Fusion section (rarity-based, any 3 items) ─────────────────────
  let fuseHtml = `<div class="forge-action-section"><h4>⛒️ Fusão de Raridade</h4>
    <p style="font-size:0.7rem;color:var(--text-secondary);margin-bottom:8px;">Funde 3 itens quaisquer de uma raridade → 1 item aleatório de grau superior.</p>`;

  // Count items per rarity
  const rarityCount = {};
  state.inventory.forEach(it => { rarityCount[it.rarity] = (rarityCount[it.rarity] || 0) + 1; });

  const fusibleRarities = RARITIES.slice(0, RARITIES.indexOf('mythic'));
  fusibleRarities.forEach(rarity => {
    const count = rarityCount[rarity] || 0;
    const nextRarity = RARITIES[RARITIES.indexOf(rarity) + 1];
    const canFuse = count >= 3;
    const color = RARITY_COLORS[rarity] || '#aaa';
    fuseHtml += `
      <button class="btn-forge-action upgrade-btn forge-fuse-rarity-btn"
        data-rarity="${rarity}" ${!canFuse ? 'disabled' : ''}
        style="margin-bottom:6px; border-left: 3px solid ${color}; ${canFuse ? 'background:linear-gradient(135deg,#8a2387 0%,#e94057 100%);' : ''}">
        3x <span style="color:${color};font-weight:800;text-transform:uppercase;">${rarity}</span>
        → 1x <span style="color:${RARITY_COLORS[nextRarity]};font-weight:800;text-transform:uppercase;">${nextRarity}</span>
        <span style="font-size:0.65rem;opacity:0.8;"> (${count}/3)</span>
      </button>`;
  });
  fuseHtml += `</div>`;

  actionPanel.innerHTML = upgradeHtml + fuseHtml;

  // Wire upgrade button
  const upgradeBtn = document.getElementById('btn-forge-upgrade');
  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', () => {
      if (forgeSynthesizeUpgradeTier(forgeSelectedInvIdx)) { renderForgeTab(); updateHUD(); }
    });
  }

  // Wire fusion buttons
  actionPanel.querySelectorAll('.forge-fuse-rarity-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const rarity = btn.dataset.rarity;
      if (forgeSynthesizeFuse(rarity)) { forgeSelectedInvIdx = -1; renderForgeTab(); updateHUD(); }
    });
  });
}

// Generic inventory-grid-with-selection builder used by item-based modules.
function forgeBuildInventoryGrid(gridEl, filterFn) {
  gridEl.innerHTML = '';
  const cap = state.stashCapacity || 24;
  for (let i = 0; i < cap; i++) {
    const slot = document.createElement('div');
    const inst = i < state.inventory.length ? state.inventory[i] : null;
    const eligible = inst && (!filterFn || filterFn(inst));
    slot.className = `inventory-slot ${i === forgeSelectedInvIdx ? 'equipped' : ''} ${inst && !eligible ? 'dimmed' : ''}`;
    if (inst) {
      const item = itemDbFor(inst) || { name: 'Unknown Item', emoji: '❓' };
      slot.classList.add('filled', `rarity-${inst.rarity || 'common'}`);
      const tierLabel = inst.tier > 0 ? `+${inst.tier}` : '';
      slot.innerHTML = `
        <div class="inventory-slot-icon">${item.image ? `<img src="${item.image}" alt="${item.name}">` : item.emoji}</div>
        <div style="font-size: 0.6rem; color: var(--text-primary); font-weight: bold; position: absolute; top: 2px; right: 4px;">${tierLabel}</div>
      `;
      if (eligible) {
        slot.addEventListener('click', () => {
          forgeSelectedInvIdx = (forgeSelectedInvIdx === i) ? -1 : i;
          renderForgeTab();
        });
      }
      slot.addEventListener('mouseenter', (e) => showItemInstanceTooltip(e, inst, ARTIFACTS_DB[inst.id] !== undefined));
      slot.addEventListener('mouseleave', hideTooltip);
    } else {
      slot.innerHTML = `<span style="font-size: 0.6rem; color: var(--text-dark);">EMPTY</span>`;
    }
    gridEl.appendChild(slot);
  }
}

function forgeTwoColumnShell(body, title, filterFn) {
  body.innerHTML = `
    <div class="shop-grid-container">
      <div class="inventory-panel">
        <h3 class="hud-section-title">${title}</h3>
        <div class="inventory-grid" id="forge-module-inv-grid"></div>
      </div>
      <div class="shop-panel">
        <h3 class="hud-section-title">Ações</h3>
        <div class="forge-action-panel" id="forge-module-action-panel"></div>
      </div>
    </div>
  `;
  forgeBuildInventoryGrid(document.getElementById('forge-module-inv-grid'), filterFn);
  return document.getElementById('forge-module-action-panel');
}

// ─── 2. Alquimia ──────────────────────────────────────────────────
function renderForgeAlchemyModule(body) {
  const actionPanel = forgeTwoColumnShell(body, 'Selecione um item (afinidade)');
  const ratio = getAlchemyRatio(state.forge.alchemyUses);

  let html = `
    <div class="forge-action-section">
      <h4>Conversão de Materiais</h4>
      <div style="font-size:0.72rem;color:var(--text-secondary);margin-bottom:8px;">Taxa atual: ${ratio}:1</div>
  `;
  FORGE_MATERIAL_TIERS.slice(0, -1).forEach((tier, i) => {
    const nextTier = FORGE_MATERIAL_TIERS[i + 1];
    const can = (state.forge.materials[tier] || 0) >= ratio;
    html += `<button class="btn-forge-action upgrade-btn forge-convert-btn" data-from="${tier}" ${!can ? 'disabled' : ''} style="margin-bottom:6px;">
      ${ratio}x ${FORGE_MATERIAL_NAMES[tier]} → 1x ${FORGE_MATERIAL_NAMES[nextTier]}
    </button>`;
  });
  html += `</div><div class="forge-action-section"><h4>Afinidade Elemental</h4>`;

  if (forgeSelectedInvIdx < 0 || forgeSelectedInvIdx >= state.inventory.length) {
    html += `<p style="color:var(--text-secondary);font-size:0.75rem;">Selecione um item para atribuir afinidade.</p>`;
  } else {
    const inst = state.inventory[forgeSelectedInvIdx];
    html += `<div style="font-size:0.72rem;margin-bottom:6px;">Atual: ${inst.affinity ? AFFINITIES[inst.affinity].icon + ' ' + AFFINITIES[inst.affinity].name : 'Nenhuma'}</div>`;
    html += `<div class="forge-affinity-grid">`;
    for (let key in AFFINITIES) {
      const aff = AFFINITIES[key];
      html += `<div class="forge-chip-btn ${inst.affinity === key ? 'selected' : ''}" data-affinity="${key}" title="${aff.name}">${aff.icon}<br>${aff.name}</div>`;
    }
    html += `</div><button class="btn-forge-action upgrade-btn" id="btn-forge-affinity-apply" style="margin-top:8px;">APLICAR (🧫 6 Rara)</button>`;
  }
  html += `</div>`;
  actionPanel.innerHTML = html;

  actionPanel.querySelectorAll('.forge-convert-btn').forEach(btn => {
    btn.addEventListener('click', () => { if (forgeConvertMaterials(btn.dataset.from)) { renderForgeTab(); updateHUD(); } });
  });

  let pendingAffinity = null;
  actionPanel.querySelectorAll('[data-affinity]').forEach(el => {
    el.addEventListener('click', () => {
      actionPanel.querySelectorAll('[data-affinity]').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
      pendingAffinity = el.dataset.affinity;
    });
  });
  const applyBtn = document.getElementById('btn-forge-affinity-apply');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      if (pendingAffinity && forgeChangeAffinity(forgeSelectedInvIdx, pendingAffinity)) { renderForgeTab(); updateHUD(); }
    });
  }
}

// ─── 3. Criacao ───────────────────────────────────────────────────
let forgeCraftSlotType = 'weapon';
let forgeCraftCatalyst = 'none';
function renderForgeCreationModule(body) {
  body.innerHTML = `
    <div class="shop-panel" style="max-width: 520px; margin: 0 auto;">
      <h3 class="hud-section-title">Forjar Novo Item</h3>
      <div class="forge-action-section">
        <h4>Tipo de Item</h4>
        <div class="forge-craft-slot-grid" id="forge-craft-slot-grid"></div>
      </div>
      <div class="forge-action-section">
        <h4>Catalisador</h4>
        <div class="forge-catalyst-grid" id="forge-craft-catalyst-grid"></div>
      </div>
      <button class="btn-forge-action upgrade-btn" id="btn-forge-craft" style="margin-top:10px;">FORJAR ITEM</button>
      <div id="forge-craft-result" style="margin-top:10px; text-align:center; font-size:0.8rem;"></div>
    </div>
  `;
  const slotTypes = ['weapon', 'armor', 'accessory'];
  const slotGrid = document.getElementById('forge-craft-slot-grid');
  slotGrid.innerHTML = slotTypes.map(st => `<div class="forge-chip-btn ${forgeCraftSlotType === st ? 'selected' : ''}" data-slot="${st}">${st}</div>`).join('');
  slotGrid.querySelectorAll('[data-slot]').forEach(el => {
    el.addEventListener('click', () => { forgeCraftSlotType = el.dataset.slot; renderForgeCreationModule(body); });
  });

  const catGrid = document.getElementById('forge-craft-catalyst-grid');
  catGrid.innerHTML = Object.keys(CRAFT_CATALYSTS).map(key => {
    const c = CRAFT_CATALYSTS[key];
    const costStr = Object.entries(c.cost || {}).filter(([,v]) => v > 0).map(([t, v]) => `${v}x ${t}`).join(', ') || 'grátis';
    return `<div class="forge-chip-btn ${forgeCraftCatalyst === key ? 'selected' : ''}" data-cat="${key}">${c.name}<br><span style="font-size:0.6rem;">${costStr}</span></div>`;
  }).join('');
  catGrid.querySelectorAll('[data-cat]').forEach(el => {
    el.addEventListener('click', () => { forgeCraftCatalyst = el.dataset.cat; renderForgeCreationModule(body); });
  });

  const cost = forgeCraftCost(forgeCraftCatalyst);
  const craftBtn = document.getElementById('btn-forge-craft');
  craftBtn.disabled = !forgeCanAfford(cost) || state.gold < cost.gold || state.inventory.length >= (state.stashCapacity || 24);
  craftBtn.innerHTML = `FORJAR ITEM<br><span style="font-size:0.7rem;font-weight:normal;">🪙 ${cost.gold} • ${Object.entries(cost.materials).filter(([,v]) => v > 0).map(([t, v]) => `${v}x ${t}`).join(', ')}</span>`;
  craftBtn.addEventListener('click', () => {
    const inst = forgeCraftItem(forgeCraftSlotType, forgeCraftCatalyst);
    const resultEl = document.getElementById('forge-craft-result');
    if (inst) {
      const item = itemDbFor(inst);
      resultEl.innerHTML = `<span class="rarity-${inst.rarity}">Forjado: [${inst.rarity.toUpperCase()}] ${item.name}!</span>`;
      updateHUD();
      renderForgeCreationModule(body);
    } else {
      resultEl.textContent = 'Recursos insuficientes ou stash cheio.';
    }
  });
}

// ─── 4. Lapidacao ─────────────────────────────────────────────────
function renderForgeLapidaryModule(body) {
  const actionPanel = forgeTwoColumnShell(body, 'Selecione um item (gemas)');
  if (forgeSelectedInvIdx < 0 || forgeSelectedInvIdx >= state.inventory.length) {
    actionPanel.innerHTML = `<p style="color:var(--text-secondary);text-align:center;">Selecione um item para abrir/engastar slots de gema.</p>`;
    return;
  }
  const inst = state.inventory[forgeSelectedInvIdx];
  const maxSlots = GEM_SLOTS_BY_RARITY[inst.rarity || 'common'] || 0;

  let slotsHtml = '<div class="forge-gem-slots-row">';
  for (let i = 0; i < Math.max(maxSlots, inst.gemSlotsOpened); i++) {
    const opened = i < inst.gemSlotsOpened;
    const gem = opened ? inst.gemSlots[i] : null;
    if (opened) {
      slotsHtml += `<div class="forge-gem-slot ${gem ? 'filled' : ''}" data-slot-idx="${i}" title="${gem ? GEM_TYPES[gem.type].name + ' Nv.' + gem.level : 'Slot vazio'}">${gem ? GEM_TYPES[gem.type].icon : '➕'}</div>`;
    } else {
      slotsHtml += `<div class="forge-gem-slot empty-openable" data-open-slot="${i}" title="Abrir slot">🔒</div>`;
    }
  }
  slotsHtml += '</div>';

  let html = `<div class="forge-action-section"><h4>${itemDbFor(inst).name} — Slots (${inst.gemSlotsOpened}/${maxSlots})</h4>${slotsHtml}</div>`;
  html += `<div class="forge-action-section"><h4>Inventário de Gemas</h4><div class="forge-gem-inventory-grid" id="forge-gem-inv-grid"></div></div>`;
  html += `<div class="forge-action-section"><h4>Combinar Gemas</h4><div class="forge-gem-type-grid" id="forge-gem-combine-grid"></div></div>`;
  actionPanel.innerHTML = html;

  // Open slot handlers
  actionPanel.querySelectorAll('[data-open-slot]').forEach(el => {
    el.addEventListener('click', () => {
      if (forgeOpenGemSlot(forgeSelectedInvIdx)) { renderForgeTab(); updateHUD(); }
    });
  });

  // Unsocket handlers
  actionPanel.querySelectorAll('.forge-gem-slot[data-slot-idx]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.dataset.slotIdx, 10);
      if (inst.gemSlots[idx]) {
        if (forgeUnsocketGem(forgeSelectedInvIdx, idx)) { renderForgeTab(); updateHUD(); }
      }
    });
  });

  // Gem inventory list (click to socket into first empty slot)
  const gemInvGrid = document.getElementById('forge-gem-inv-grid');
  const entries = Object.entries(state.forge.gemInventory).filter(([, qty]) => qty > 0);
  if (entries.length === 0) {
    gemInvGrid.innerHTML = `<div style="font-size:0.7rem;color:var(--text-dark);">Nenhuma gema no inventário.</div>`;
  } else {
    gemInvGrid.innerHTML = entries.map(([key, qty]) => {
      const [type, level] = key.split('_');
      return `<div class="forge-gem-inv-item" data-gem-key="${key}" data-type="${type}" data-level="${level}">${GEM_TYPES[type].icon} ${GEM_TYPES[type].name}<br>Nv.${level} x${qty}</div>`;
    }).join('');
    gemInvGrid.querySelectorAll('[data-gem-key]').forEach(el => {
      el.addEventListener('click', () => {
        const emptySlotIdx = inst.gemSlots.findIndex((g, i) => i < inst.gemSlotsOpened && !g);
        if (emptySlotIdx === -1) { addCombatLog('💎 Nenhum slot vazio disponível — abra um slot ou remova uma gema.', 'log-system'); return; }
        if (forgeSocketGem(forgeSelectedInvIdx, emptySlotIdx, el.dataset.type, parseInt(el.dataset.level, 10))) {
          renderForgeTab(); updateHUD();
        }
      });
    });
  }

  // Combine grid
  const combineGrid = document.getElementById('forge-gem-combine-grid');
  let combineHtml = '';
  for (let type in GEM_TYPES) {
    for (let lvl = 1; lvl < GEM_LEVELS; lvl++) {
      const key = `${type}_${lvl}`;
      const qty = state.forge.gemInventory[key] || 0;
      if (qty >= GEM_COMBINE_COUNT) {
        combineHtml += `<div class="forge-chip-btn" data-combine-type="${type}" data-combine-level="${lvl}">${GEM_TYPES[type].icon} Nv.${lvl}→${lvl + 1}<br>(${qty} disp.)</div>`;
      }
    }
  }
  combineGrid.innerHTML = combineHtml || `<div style="font-size:0.7rem;color:var(--text-dark);">Nenhuma combinação disponível (precisa de ${GEM_COMBINE_COUNT}x mesma gema/nível).</div>`;
  combineGrid.querySelectorAll('[data-combine-type]').forEach(el => {
    el.addEventListener('click', () => {
      if (forgeCombineGems(el.dataset.combineType, parseInt(el.dataset.combineLevel, 10))) { renderForgeTab(); updateHUD(); }
    });
  });
}

// ─── 5. Gravacao ──────────────────────────────────────────────────
function renderForgeReforgeModule(body) {
  const actionPanel = forgeTwoColumnShell(body, 'Selecione um item (regravar)');
  if (forgeSelectedInvIdx < 0 || forgeSelectedInvIdx >= state.inventory.length) {
    actionPanel.innerHTML = `<p style="color:var(--text-secondary);text-align:center;">Selecione um item para regravar um atributo secundário.</p>`;
    return;
  }
  const inst = state.inventory[forgeSelectedInvIdx];
  const item = itemDbFor(inst);
  const pool = forgeStatPoolForSlot(item.slotType);
  const cost = getReforgeCost(inst.reforgeCount || 0);

  let html = `<div class="forge-action-section"><h4>${item.name}</h4>`;
  html += `<div style="font-size:0.75rem;margin-bottom:6px;">Atributo gravado: <b>${inst.reforgedStat || 'Nenhum'}</b> (regravado ${inst.reforgeCount || 0}x)</div>`;
  html += `<button class="btn-forge-action upgrade-btn" id="btn-forge-reroll" ${state.gold < cost ? 'disabled' : ''}>
    ${inst.reforgedStat ? 'REGRAVAR (ALEATÓRIO)' : 'GRAVAR NOVO ATRIBUTO'}<br><span style="font-size:0.7rem;font-weight:normal;">🪙 ${cost}</span>
  </button></div>`;

  html += `<div class="forge-action-section"><h4>Biblioteca de Atributos Descobertos</h4><div class="forge-stat-pool-list">`;
  pool.forEach(stat => {
    const discovered = state.forge.discoveredReforgeStats.includes(stat);
    const isCurrent = inst.reforgedStat === stat;
    html += `<div class="forge-stat-pool-row ${isCurrent ? 'current' : ''} ${!discovered ? 'undiscovered' : ''}" ${discovered ? `data-pick-stat="${stat}"` : ''}>
      <span>${discovered ? stat : '???'}</span><span>${discovered ? (isCurrent ? 'ATUAL' : 'Escolher') : 'Não descoberto'}</span>
    </div>`;
  });
  html += `</div></div>`;
  actionPanel.innerHTML = html;

  document.getElementById('btn-forge-reroll').addEventListener('click', () => {
    if (forgeRerollStat(forgeSelectedInvIdx)) { renderForgeTab(); updateHUD(); }
  });
  actionPanel.querySelectorAll('[data-pick-stat]').forEach(el => {
    el.addEventListener('click', () => {
      if (state.gold < cost) return;
      if (forgeRerollStat(forgeSelectedInvIdx, el.dataset.pickStat)) { renderForgeTab(); updateHUD(); }
    });
  });
}

// ─── 6. Inscricao ─────────────────────────────────────────────────
function renderForgeInscriptionModule(body) {
  const actionPanel = forgeTwoColumnShell(body, 'Selecione um item (inscrição)');
  if (forgeSelectedInvIdx < 0 || forgeSelectedInvIdx >= state.inventory.length) {
    actionPanel.innerHTML = `<p style="color:var(--text-secondary);text-align:center;">Selecione um item para aplicar uma Inscrição.</p>`;
    return;
  }
  const inst = state.inventory[forgeSelectedInvIdx];
  const item = itemDbFor(inst);
  const rarityIdx = RARITIES.indexOf(inst.rarity || 'common');
  const canMinor = rarityIdx >= RARITIES.indexOf(MINOR_INSCRIPTION_MIN_RARITY);

  let html = `<div class="forge-action-section"><h4>Principal: ${inst.inscription ? INSCRIPTIONS[inst.inscription.id].name : 'Nenhuma'}</h4>`;
  html += `<div class="forge-inscription-list">`;
  for (let key in INSCRIPTIONS) {
    const ins = INSCRIPTIONS[key];
    const compatible = ins.compatible.includes(item.slotType);
    const applied = inst.inscription && inst.inscription.id === key;
    html += `<div class="forge-inscription-card ${applied ? 'applied' : ''} ${!compatible ? 'incompatible' : ''}" ${compatible ? `data-apply-main="${key}"` : ''}>
      <div class="forge-inscription-name">${ins.icon} ${ins.name}</div>
      <div class="forge-inscription-desc">${ins.desc}</div>
    </div>`;
  }
  html += `</div></div>`;

  html += `<div class="forge-action-section"><h4>Menor (só Mítico+): ${inst.minorInscription ? INSCRIPTIONS[inst.minorInscription.id].name : 'Nenhuma'}</h4>`;
  if (!canMinor) {
    html += `<p style="font-size:0.72rem;color:var(--text-dark);">Requer raridade Mítica ou superior.</p>`;
  } else {
    html += `<div class="forge-inscription-list">`;
    for (let key in INSCRIPTIONS) {
      const ins = INSCRIPTIONS[key];
      const compatible = ins.compatible.includes(item.slotType);
      const sameFamily = inst.inscription && INSCRIPTIONS[inst.inscription.id].family === ins.family;
      const applied = inst.minorInscription && inst.minorInscription.id === key;
      const usable = compatible && !sameFamily;
      html += `<div class="forge-inscription-card ${applied ? 'applied' : ''} ${!usable ? 'incompatible' : ''}" ${usable ? `data-apply-minor="${key}"` : ''}>
        <div class="forge-inscription-name">${ins.icon} ${ins.name}</div>
        <div class="forge-inscription-desc">${ins.desc}</div>
      </div>`;
    }
    html += `</div>`;
  }
  html += `</div>`;
  actionPanel.innerHTML = html;

  actionPanel.querySelectorAll('[data-apply-main]').forEach(el => {
    el.addEventListener('click', () => {
      if (forgeApplyInscription(forgeSelectedInvIdx, el.dataset.applyMain, false)) { renderForgeTab(); updateHUD(); }
    });
  });
  actionPanel.querySelectorAll('[data-apply-minor]').forEach(el => {
    el.addEventListener('click', () => {
      if (forgeApplyInscription(forgeSelectedInvIdx, el.dataset.applyMinor, true)) { renderForgeTab(); updateHUD(); }
    });
  });
}

// ─── 7. Extracao ──────────────────────────────────────────────────
function renderForgeExtractionModule(body) {
  const actionPanel = forgeTwoColumnShell(body, 'Selecione um item (extração)');
  if (forgeSelectedInvIdx < 0 || forgeSelectedInvIdx >= state.inventory.length) {
    actionPanel.innerHTML = `<p style="color:var(--text-secondary);text-align:center;">Selecione um item para extrair gemas/inscrições.</p>`;
    return;
  }
  const inst = state.inventory[forgeSelectedInvIdx];
  const rarity = inst.rarity || 'common';
  const hasGem = (inst.gemSlots || []).some(g => g);
  const hasInscription = !!inst.inscription;
  const hasMinor = !!inst.minorInscription;

  const gemRate = Math.round((EXTRACTION_RECOVERY_RATES.gem[rarity] || 0) * 100);
  const insRate = Math.round((EXTRACTION_RECOVERY_RATES.inscription[rarity] || 0) * 100);
  const safeCost = Math.round(EXTRACTION_BASE_COST * EXTRACTION_SAFE_COST_MULT);

  let html = `<div class="forge-action-section"><h4>Selos de Extração: ${state.forge.extractionSeals}</h4>
    <p style="font-size:0.7rem;color:var(--text-secondary);">Extração segura garante 100% de recuperação (consome 1 selo, se disponível).</p></div>`;

  html += `<div class="forge-action-section"><h4>Componentes</h4>`;
  html += `<div style="display:flex;flex-direction:column;gap:6px;">`;
  html += `<button class="btn-forge-action upgrade-btn" data-extract="gem" data-safe="0" ${!hasGem || state.gold < EXTRACTION_BASE_COST ? 'disabled' : ''}>EXTRAIR GEMA (${gemRate}%)<br><span style="font-size:0.65rem;font-weight:normal;">🪙 ${EXTRACTION_BASE_COST}</span></button>`;
  html += `<button class="btn-forge-action upgrade-btn" data-extract="gem" data-safe="1" ${!hasGem || state.gold < safeCost ? 'disabled' : ''}>EXTRAIR GEMA SEGURA (100%)<br><span style="font-size:0.65rem;font-weight:normal;">🪙 ${safeCost}</span></button>`;
  html += `<button class="btn-forge-action upgrade-btn" data-extract="inscription" data-safe="0" ${!hasInscription || state.gold < EXTRACTION_BASE_COST ? 'disabled' : ''}>EXTRAIR INSCRIÇÃO (${insRate}%)<br><span style="font-size:0.65rem;font-weight:normal;">🪙 ${EXTRACTION_BASE_COST}</span></button>`;
  html += `<button class="btn-forge-action upgrade-btn" data-extract="inscription" data-safe="1" ${!hasInscription || state.gold < safeCost ? 'disabled' : ''}>EXTRAIR INSCRIÇÃO SEGURA (100%)<br><span style="font-size:0.65rem;font-weight:normal;">🪙 ${safeCost}</span></button>`;
  html += `<button class="btn-forge-action upgrade-btn" data-extract="minorInscription" data-safe="0" ${!hasMinor || state.gold < EXTRACTION_BASE_COST ? 'disabled' : ''}>EXTRAIR INSCR. MENOR (${insRate}%)<br><span style="font-size:0.65rem;font-weight:normal;">🪙 ${EXTRACTION_BASE_COST}</span></button>`;
  html += `</div></div>`;
  html += `<div id="forge-extract-result" style="text-align:center;font-size:0.78rem;"></div>`;
  actionPanel.innerHTML = html;

  actionPanel.querySelectorAll('[data-extract]').forEach(el => {
    el.addEventListener('click', () => {
      const result = forgeExtractComponent(forgeSelectedInvIdx, el.dataset.extract, el.dataset.safe === '1');
      const resEl = document.getElementById('forge-extract-result');
      if (result) {
        resEl.textContent = result.success ? 'Componente recuperado com sucesso!' : 'Componente perdido.';
        updateHUD();
        renderForgeTab();
      } else if (resEl) {
        resEl.textContent = 'Não foi possível extrair (recursos insuficientes ou nada para extrair).';
      }
    });
  });
}

// ─── 8. Oferenda ──────────────────────────────────────────────────
function renderForgeOfferingModule(body) {
  const actionPanel = forgeTwoColumnShell(body, 'Selecione um item para sacrificar');

  let extra = `<div class="forge-action-section forge-altar-card">`;
  extra += `<h4>Favor do Altar (${state.forge.altarFavor} / ${ALTAR_FAVOR_THRESHOLD})</h4>`;
  extra += `<div class="bar-container forge-altar-bar-container"><div class="bar-fill hp" style="width:${Math.min(100, state.forge.altarFavor / ALTAR_FAVOR_THRESHOLD * 100)}%; background-color: var(--secondary-gold);"></div></div>`;
  extra += `<h4 style="margin-top:10px;">Ritual Ancestral (${state.forge.grandRitualFavor} / ${GRAND_RITUAL_THRESHOLD})</h4>`;
  extra += `<div class="bar-container forge-altar-bar-container"><div class="bar-fill hp" style="width:${Math.min(100, state.forge.grandRitualFavor / GRAND_RITUAL_THRESHOLD * 100)}%; background-color: #e74c3c;"></div></div>`;
  extra += `<div style="font-size:0.7rem;color:var(--text-secondary);margin-top:4px;">Alimentado apenas por ofertas Lendárias+.</div>`;

  if (state.forge.activeBlessing) {
    const bl = ALTAR_BLESSINGS.find(b => b.id === state.forge.activeBlessing.id);
    extra += `<div class="forge-active-blessing-banner">Bênção ativa: ${bl ? bl.icon + ' ' + bl.name : ''} — ${Math.ceil(state.forge.blessingSecondsRemaining)}s restantes</div>`;
  } else if (state.forge.altarFavor >= 0) {
    extra += `<h4 style="margin-top:10px;">Escolher Bênção</h4><div class="forge-blessing-grid" id="forge-blessing-grid"></div>`;
  }

  if (forgeSelectedInvIdx >= 0 && forgeSelectedInvIdx < state.inventory.length) {
    const inst = state.inventory[forgeSelectedInvIdx];
    const value = getOfferingValue(inst, inst.level || 1);
    extra += `<button class="btn-forge-action dismantle-btn" id="btn-forge-offer" style="margin-top:10px;">SACRIFICAR ITEM<br><span style="font-size:0.7rem;font-weight:normal;">+${value} Favor</span></button>`;
  }
  extra += `</div>`;
  actionPanel.innerHTML = extra;

  const blessingGrid = document.getElementById('forge-blessing-grid');
  if (blessingGrid) {
    blessingGrid.innerHTML = ALTAR_BLESSINGS.map(bl => `<div class="forge-blessing-card" data-blessing="${bl.id}">${bl.icon}<br>${bl.name}</div>`).join('');
    blessingGrid.querySelectorAll('[data-blessing]').forEach(el => {
      el.addEventListener('click', () => { forgeChooseBlessing(el.dataset.blessing); renderForgeTab(); updateHUD(); });
    });
  }

  const offerBtn = document.getElementById('btn-forge-offer');
  if (offerBtn) {
    offerBtn.addEventListener('click', () => {
      forgeOfferItem(forgeSelectedInvIdx);
      forgeSelectedInvIdx = -1;
      renderForgeTab();
      updateHUD();
    });
  }
}

// MARKETPLACE
function renderMarketTab() {
  document.getElementById('market-refresh-timer').textContent = `Refresh in: ${Math.floor(marketRefreshSeconds / 60)}:${(marketRefreshSeconds % 60).toString().padStart(2, '0')}`;
  
  const buyGrid = document.getElementById('market-buy-grid');
  buyGrid.innerHTML = "";
  state.npcMarketListings.forEach((listing, idx) => {
    const inst = listing.item;
    const item = BASE_ITEMS_DB[inst.id];
    const card = document.createElement('div');
    card.className = `shop-item-card rarity-${inst.rarity || 'common'}`;
    const tierLabel = inst.tier > 0 ? `+${inst.tier}` : '';
    
    card.innerHTML = `
      <div class="market-item-tag">By ${listing.sellerName}</div>
      <div class="shop-item-icon" style="margin-top: 15px;">${item.image ? `<img src="${item.image}" alt="${item.name}">` : item.emoji}</div>
      <div class="shop-item-name">${item.name} ${tierLabel}</div>
      <div style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase;">${inst.rarity}</div>
      <button class="market-buy-btn">🪙 ${listing.price}</button>
    `;
    
    card.querySelector('button').addEventListener('click', () => {
      if (state.dotaCoins >= listing.price) {
        if (state.inventory.length < state.stashCapacity) {
          state.dotaCoins -= listing.price;
          state.inventory.push(inst);
          state.npcMarketListings.splice(idx, 1);
          sfx.playCoin();
          addCombatLog(`Market: Purchased ${item.emoji} ${item.name} from ${listing.sellerName} for 🪙 ${listing.price} Dota Coins!`, "log-hit");
          renderMarketTab();
          updateHUD();
        } else {
          alert("Stash Bag is full!");
        }
      } else {
        alert("Insufficient Dota Coins!");
      }
    });
    card.addEventListener('mouseenter', (e) => showItemInstanceTooltip(e, inst, false));
    card.addEventListener('mouseleave', hideTooltip);
    buyGrid.appendChild(card);
  });

  const sellGrid = document.getElementById('market-inventory-grid');
  sellGrid.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const slot = document.createElement('div');
    slot.className = 'inventory-slot';
    
    if (i < state.inventory.length) {
      const inst = state.inventory[i];
      const isArtifact = ARTIFACTS_DB[inst.id] !== undefined;
      const item = isArtifact ? ARTIFACTS_DB[inst.id] : BASE_ITEMS_DB[inst.id];
      slot.classList.add('filled');
      slot.classList.add(`rarity-${inst.rarity || 'common'}`);
      slot.innerHTML = `<div class="inventory-slot-icon">${item.image ? `<img src="${item.image}" alt="${item.name}">` : item.emoji}</div>`;
      slot.addEventListener('click', () => {
        const calcPrice = getMarketDotaCoinPrice(item, inst);

        if (state.marketListings.length < 5) {
          state.marketListings.push({
            item: inst,
            price: calcPrice,
            timeRemaining: 60 + Math.random() * 120,
            buyerName: MARKET_BUYER_NAMES[Math.floor(Math.random() * MARKET_BUYER_NAMES.length)]
          });
          state.inventory.splice(i, 1);
          sfx.playCoin();
          addCombatLog(`Market: Listed ${item.name} for 🪙 ${calcPrice} Dota Coins.`, "log-system");
          renderMarketTab();
          updateHUD();
        } else {
          alert("Maximum 5 active listings allowed!");
        }
      });
      slot.addEventListener('mouseenter', (e) => showItemInstanceTooltip(e, inst, isArtifact));
      slot.addEventListener('mouseleave', hideTooltip);
    } else {
      slot.innerHTML = `<span style="font-size: 0.6rem; color: var(--text-dark);">EMPTY</span>`;
    }
    sellGrid.appendChild(slot);
  }

  const listingsList = document.getElementById('market-listings-list');
  listingsList.innerHTML = "";
  if (state.marketListings.length === 0) {
    listingsList.innerHTML = `<div style="text-align: center; color: var(--text-dark); font-size: 0.85rem; padding: 15px;">No active sales listings.</div>`;
  }
  state.marketListings.forEach((lst, idx) => {
    const row = document.createElement('div');
    row.className = 'market-listing-row';
    const isArtifact = ARTIFACTS_DB[lst.item.id] !== undefined;
    const item = isArtifact ? ARTIFACTS_DB[lst.item.id] : BASE_ITEMS_DB[lst.item.id];
    row.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span class="shop-item-icon" style="width: 32px; height: 24px; margin-right: 5px;">${item.image ? `<img src="${item.image}" alt="${item.name}">` : item.emoji}</span>
        <div>
          <span style="font-weight: bold; font-size: 0.85rem;">${item.name} +${lst.item.tier}</span>
          <span style="font-size: 0.7rem; color: var(--text-secondary); margin-left: 5px;">(${lst.item.rarity})</span>
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-weight: bold; color: var(--secondary-gold); font-size: 0.85rem;">🪙 ${lst.price}</div>
        <div style="font-size: 0.65rem; color: var(--text-dark);">${lst.buyerName || 'Buyer'} comprando em: ${Math.round(lst.timeRemaining)}s</div>
      </div>
    `;
    listingsList.appendChild(row);
  });
}

// Marketplace listing price in Dota Coins (much smaller scale than Gold economy)
function getMarketDotaCoinPrice(item, inst) {
  const baseCost = item.cost || 200;
  const rarityVal = RARITIES.indexOf(inst.rarity) + 1;
  const tierVal = inst.tier + 1;
  return Math.max(10, Math.round((baseCost / 20) * (1.0 + rarityVal * 0.2) * (1.0 + tierVal * 0.15) * (0.8 + Math.random() * 0.4)));
}

const MARKET_BUYER_NAMES = ['Dendi', 'Miracle-', 'Puppey', 'Arteezy', 'SumaiL', 'Notail', 'N0tail', 'ana', 'Ame', 'Yatoro'];

// COMPENDIUM
function renderCompendiumTab() {
  const grid = document.getElementById('compendium-grid');
  grid.innerHTML = "";
  
  for (let key in COMPENDIUM_COLS) {
    const col = COMPENDIUM_COLS[key];
    const card = document.createElement('div');
    card.className = 'compendium-card';
    
    // count discovered
    let count = 0;
    col.items.forEach(id => {
      if (state.discoveredItems && state.discoveredItems.includes(id)) count++;
    });

    const bonusActive = count === col.items.length;

    card.innerHTML = `
      <div class="compendium-header">
        <span class="compendium-name">${col.name}</span>
        <span class="compendium-stat" style="color: ${bonusActive ? 'var(--xp-green)' : 'var(--text-dark)'};">${count}/${col.items.length} (${col.bonus})</span>
      </div>
      <div class="compendium-list">
        ${col.items.map(id => {
          const item = BASE_ITEMS_DB[id];
          const isDiscovered = state.discoveredItems && state.discoveredItems.includes(id);
          return `<div class="compendium-item ${isDiscovered ? 'discovered' : ''}" title="${item.name}">${item.image ? `<img src="${item.image}" alt="${item.name}">` : item.emoji}</div>`;
        }).join('')}
      </div>
    `;
    grid.appendChild(card);
  }
}

// PRESTIGE
function renderPrestigeTab() {
  document.getElementById('prestige-max-stage').textContent = state.highestStageReached;
  const yieldAmt = Math.max(0, Math.floor(state.highestStageReached * 0.5));
  document.getElementById('prestige-essence-yield').textContent = `⚜️ ${yieldAmt}`;

  const tree = document.getElementById('prestige-tree');
  tree.innerHTML = "";

  const talentList = [
    { key: 'gold', name: '+5% Gold drop per Lvl', desc: 'Increases all creep gold drops.' },
    { key: 'xp', name: '+5% Experience per Lvl', desc: 'Accelerates party level ups.' },
    { key: 'drops', name: '+2% Item drop chance per Lvl', desc: 'More weapons and armor from combat.' },
    { key: 'bossdmg', name: '+3% Damage against Bosses per Lvl', desc: 'Improves duel outputs.' }
  ];

  talentList.forEach(t => {
    const level = state.talents[t.key] || 0;
    const cost = Math.round((level + 1) * 3);
    const canBuy = state.ancestralEssence >= cost;

    const card = document.createElement('div');
    card.className = 'market-listing-row';
    card.innerHTML = `
      <div>
        <div style="font-weight: bold; font-size: 0.85rem;">${t.name} (Lvl ${level})</div>
        <div style="font-size: 0.7rem; color: var(--text-secondary);">${t.desc}</div>
      </div>
      <button class="market-buy-btn" ${!canBuy ? 'disabled' : ''} style="min-width: 80px;">⚜️ ${cost}</button>
    `;
    card.querySelector('button').addEventListener('click', () => {
      if (state.ancestralEssence >= cost) {
        state.ancestralEssence -= cost;
        state.talents[t.key]++;
        sfx.playLevelUp();
        renderPrestigeTab();
        updateHUD();
      }
    });
    tree.appendChild(card);
  });
}

// PREMIUM COINS
function renderDotaShopTab() {
  document.getElementById('coins-amount').textContent = state.dotaCoins.toLocaleString();
  const dpCard = document.getElementById('shop-card-dota-plus');
  const dpBtn = document.getElementById('btn-buy-dota-plus');
  if (state.dotaPlus) {
    dpCard.style.borderColor = 'var(--xp-green)';
    dpBtn.textContent = 'ACTIVE';
    dpBtn.disabled = true;
    dpBtn.style.color = 'var(--xp-green)';
    dpBtn.style.borderColor = 'var(--xp-green)';
  }

  const slotBtn = document.getElementById('btn-buy-team-slot');
  if (state.teamSize >= 5) {
    slotBtn.textContent = 'ALL UNLOCKED';
    slotBtn.disabled = true;
  } else {
    const nextCost = state.teamSize === 3 ? 3000 : 5000;
    slotBtn.textContent = `Unlock Slot ${state.teamSize + 1} (${nextCost} Coins)`;
  }

  const backpacksOwned = Math.round((state.stashCapacity - 24) / 24);
  const backpackCost = getBackpackCost(backpacksOwned);
  document.getElementById('backpack-count-label').textContent = `Owned: ${backpacksOwned} backpacks (${state.stashCapacity}/${state.stashCapacity} slots)`;
  const backpackBtn = document.getElementById('btn-buy-backpack');
  if (backpacksOwned >= MAX_BACKPACKS) {
    backpackBtn.textContent = 'MAX OWNED';
    backpackBtn.disabled = true;
  } else {
    backpackBtn.textContent = `Buy (${backpackCost.toLocaleString()} Coins)`;
    backpackBtn.disabled = state.dotaCoins < backpackCost;
  }
}

// Backpacks: each grants +24 stash slots, cost scales up, capped at MAX_BACKPACKS total
const MAX_BACKPACKS = 4; // 24 base + 4*24 = up to 120 slots
function getBackpackCost(backpacksOwned) {
  return Math.round(2000 * Math.pow(1.8, backpacksOwned));
}

// --- ITEM TOOLTIP UTILITIES ---

function showTooltip(e, html) {
  const tooltip = document.getElementById('tooltip');
  tooltip.innerHTML = html;
  tooltip.style.display = 'block';
}

function hideTooltip() {
  document.getElementById('tooltip').style.display = 'none';
}

function showItemTooltip(e, item, cost) {
  let statsHtml = "";
  if (item.stats.str) statsHtml += `+${item.stats.str} Strength<br>`;
  if (item.stats.agi) statsHtml += `+${item.stats.agi} Agility<br>`;
  if (item.stats.int) statsHtml += `+${item.stats.int} Intelligence<br>`;
  if (item.stats.damage) statsHtml += `+${item.stats.damage} Damage<br>`;
  if (item.stats.attackSpeed) statsHtml += `+${item.stats.attackSpeed} Attack Speed<br>`;
  if (item.stats.hp) statsHtml += `+${item.stats.hp} Health<br>`;
  if (item.stats.hpRegen) statsHtml += `+${item.stats.hpRegen} HP Regen/s<br>`;
  if (item.stats.block) statsHtml += `+${item.stats.block} Damage Block<br>`;
  if (item.stats.critChance) statsHtml += `+${item.stats.critChance * 100}% Crit Chance<br>`;
  
  showTooltip(e, `
    <div class="tooltip-name">
      <span>${item.image ? `<img src="${item.image}" style="width: 20px; height: 15px; display: inline-block; vertical-align: middle; margin-right: 5px;">` : item.emoji} ${item.name}</span>
      <span style="color: var(--secondary-gold);">🪙 ${cost}</span>
    </div>
    <div class="tooltip-type">BASE ITEM</div>
    <div class="tooltip-stats">${statsHtml}</div>
    <div class="tooltip-desc">${item.desc}</div>
  `);
}

function showItemInstanceTooltip(e, inst, isArtifact = false) {
  const item = isArtifact ? ARTIFACTS_DB[inst.id] : BASE_ITEMS_DB[inst.id];
  if (!item) return;

  const rarityIdx = RARITIES.indexOf(inst.rarity || 'common');
  const rarityScale = 1.0 + (rarityIdx * 0.25);
  const tierScale = 1.0 + ((inst.tier || 0) * 0.15);
  const scale = rarityScale * tierScale;

  let statsHtml = "";
  if (isArtifact) {
    if (item.stats.str) statsHtml += `+${item.stats.str} Strength<br>`;
    if (item.stats.agi) statsHtml += `+${item.stats.agi} Agility<br>`;
    if (item.stats.int) statsHtml += `+${item.stats.int} Intelligence<br>`;
    if (item.stats.damage) statsHtml += `+${item.stats.damage} Damage<br>`;
    if (item.stats.attackSpeed) statsHtml += `+${item.stats.attackSpeed} Attack Speed<br>`;
    if (item.stats.hp) statsHtml += `+${item.stats.hp} Health<br>`;
    if (item.stats.hpRegen) statsHtml += `+${item.stats.hpRegen} HP Regen/s<br>`;
    if (item.stats.evasion) statsHtml += `+${item.stats.evasion * 100}% Evasion<br>`;
    if (item.stats.spellImmunity) statsHtml += `+${item.stats.spellImmunity * 100}% Magic Res<br>`;
    if (item.stats.critChance) statsHtml += `+${item.stats.critChance * 100}% Crit Chance<br>`;
    if (item.stats.lifesteal) statsHtml += `+${item.stats.lifesteal * 100}% Lifesteal<br>`;
  } else {
    if (item.stats.str) statsHtml += `+${Math.round(item.stats.str * scale)} Strength<br>`;
    if (item.stats.agi) statsHtml += `+${Math.round(item.stats.agi * scale)} Agility<br>`;
    if (item.stats.int) statsHtml += `+${Math.round(item.stats.int * scale)} Intelligence<br>`;
    if (item.stats.damage) statsHtml += `+${Math.round(item.stats.damage * scale)} Damage<br>`;
    if (item.stats.attackSpeed) statsHtml += `+${Math.round(item.stats.attackSpeed * scale)} Attack Speed<br>`;
    if (item.stats.hp) statsHtml += `+${Math.round(item.stats.hp * scale)} Health<br>`;
    if (item.stats.hpRegen) statsHtml += `+${(item.stats.hpRegen * scale).toFixed(1)} HP Regen/s<br>`;
    if (item.stats.block) statsHtml += `+${Math.round(item.stats.block * scale)} Damage Block<br>`;
    if (item.stats.critChance) statsHtml += `+${(item.stats.critChance * scale * 100).toFixed(0)}% Crit Chance<br>`;
  }

  // Modifiers
  let modsHtml = "";
  if (inst.modifiers && inst.modifiers.length > 0) {
    modsHtml = `<div class="tooltip-recipe" style="color: var(--rarity-epic); font-weight: 500;">
      Modifiers:<br>
      ${inst.modifiers.map(mId => `• ${ITEM_MODIFIERS.find(m => m.id === mId).text}`).join('<br>')}
    </div>`;
  }

  const rarityName = inst.rarity.toUpperCase();
  const rarityColors = ['#7e8e9f', '#2ecc71', '#3498db', '#9b59b6', '#e67e22', '#e74c3c', '#e5c158'];
  const rColor = rarityColors[rarityIdx];

  showTooltip(e, `
    <div class="tooltip-name">
      <span>${item.image ? `<img src="${item.image}" style="width: 20px; height: 15px; display: inline-block; vertical-align: middle; margin-right: 5px;">` : item.emoji} ${item.name} +${inst.tier}</span>
    </div>
    <div class="tooltip-type" style="color: ${rColor}; font-weight: bold;">RARITY: ${rarityName} (Lvl ${inst.level || 1})</div>
    <div class="tooltip-stats">${statsHtml}</div>
    ${modsHtml}
    <div class="tooltip-desc">${item.desc}</div>
  `);
}

// --- SHOP PURCHASING ---

function buyItem(itemId, cost) {
  if (state.gold >= cost) {
    if (state.inventory.length < state.stashCapacity) {
      state.gold -= cost;
      
      const region = getRegionDetails(state.currentStage);
      const level = Math.max(1, region.lvl * 2);
      const inst = generateItem(level, 'common');
      inst.id = itemId; // overwrite base
      
      state.inventory.push(inst);
      sfx.playCoin();
      addCombatLog(`Bought ${BASE_ITEMS_DB[itemId].image ? `<img src="${BASE_ITEMS_DB[itemId].image}" style="width: 16px; height: 12px; display: inline-block; vertical-align: middle; margin-right: 4px;">` : BASE_ITEMS_DB[itemId].emoji} ${BASE_ITEMS_DB[itemId].name}.`, "log-hit");
      renderShopTab();
      updateHUD();
    } else {
      addCombatLog("Stash Bag is full!", "log-system");
    }
  } else {
    addCombatLog("Insufficient gold!", "log-system");
  }
}

function sellItem(invIdx) {
  if (invIdx < state.inventory.length) {
    const inst = state.inventory[invIdx];
    const isArtifact = ARTIFACTS_DB[inst.id] !== undefined;
    const item = isArtifact ? ARTIFACTS_DB[inst.id] : BASE_ITEMS_DB[inst.id];
    const baseCost = item.cost || 200;
    const refund = Math.round(baseCost * 0.5);
    state.gold += refund;
    state.inventory.splice(invIdx, 1);
    sfx.playCoin();
    addCombatLog(`Sold ${item.image ? `<img src="${item.image}" style="width: 16px; height: 12px; display: inline-block; vertical-align: middle; margin-right: 4px;">` : item.emoji} ${item.name} for 🪙 ${refund}.`, "log-hit");
    renderShopTab();
    updateHUD();
    hideTooltip();
  }
}

function equipItemToHero(invIdx, heroId) {
  const h = state.heroes[heroId];
  if (!h || h.level === 0) return;
  if (invIdx < state.inventory.length) {
    const inst = state.inventory[invIdx];
    const isArtifact = ARTIFACTS_DB[inst.id] !== undefined;

    let slotIdx = -1;
    if (isArtifact) {
      slotIdx = 6; // must place in Artifact slot 7 (index 6)
    } else {
      // Find empty slot between 0 and 5
      slotIdx = h.items.slice(0, 6).findIndex(slot => slot === null);
    }

    if (slotIdx !== -1) {
      // swap item if exists
      const existing = h.items[slotIdx];
      h.items[slotIdx] = inst;
      if (existing) {
        state.inventory[invIdx] = existing;
      } else {
        state.inventory.splice(invIdx, 1);
      }
      
      // Add to compendium collections
      if (!isArtifact && state.discoveredItems && !state.discoveredItems.includes(inst.id)) {
        state.discoveredItems.push(inst.id);
        addCombatLog(`📚 Compendium: Discovered new type: ${BASE_ITEMS_DB[inst.id].image ? `<img src="${BASE_ITEMS_DB[inst.id].image}" style="width: 16px; height: 12px; display: inline-block; vertical-align: middle; margin-right: 4px;">` : BASE_ITEMS_DB[inst.id].emoji} ${BASE_ITEMS_DB[inst.id].name}!`, "log-crit");
      }

      sfx.playCoin();
      const itemDb = isArtifact ? ARTIFACTS_DB[inst.id] : BASE_ITEMS_DB[inst.id];
      addCombatLog(`Equipped ${itemDb.image ? `<img src="${itemDb.image}" style="width: 16px; height: 12px; display: inline-block; vertical-align: middle; margin-right: 4px;">` : itemDb.emoji} to ${h.name}.`, "log-system");
      renderShopTab();
      updateHUD();
      hideTooltip();
    } else {
      addCombatLog(`${h.name} has no empty normal slots!`, "log-system");
    }
  }
}

// --- GACHA TREASURE OPENER ---

function openTreasure(type) {
  const cost = type === 'common' ? 500 : 2000;
  if (state.dotaCoins < cost) {
    alert("Insufficient Dota Coins!");
    return;
  }
  if (state.inventory.length >= state.stashCapacity) {
    alert("Stash Bag is full!");
    return;
  }

  state.dotaCoins -= cost;
  updateHUD();
  renderDotaShopTab();
  
  const spinner = document.getElementById('chest-gacha-spinner');
  const chestVisual = document.getElementById('gacha-visual-roll');
  const resultText = document.getElementById('gacha-item-result');
  
  spinner.style.display = 'flex';
  chestVisual.textContent = type === 'common' ? '📦' : '🏆';
  chestVisual.classList.add('wobbling');
  resultText.textContent = "Unlocking...";
  sfx.playSpell();

  setTimeout(() => {
    chestVisual.classList.remove('wobbling');
    let inst = null;
    
    const region = getRegionDetails(state.currentStage);
    const itemLvl = Math.max(1, region.lvl * 2);

    if (type === 'common') {
      inst = generateItem(itemLvl);
    } else {
      // Roll dynamic unique Artifact
      const advPool = Object.keys(ARTIFACTS_DB);
      const rolledId = advPool[Math.floor(Math.random() * advPool.length)];
      
      const rolls = ['rare', 'epic', 'legendary', 'mythic', 'immortal'];
      const probs = [0.45, 0.35, 0.14, 0.055, 0.005];
      const roll = Math.random();
      let cumulative = 0;
      let rolledRarity = 'rare';
      for (let i = 0; i < probs.length; i++) {
        cumulative += probs[i];
        if (roll <= cumulative) { rolledRarity = rolls[i]; break; }
      }
      inst = { id: rolledId, rarity: rolledRarity, tier: 0 };
    }

    const item = ARTIFACTS_DB[inst.id] !== undefined ? ARTIFACTS_DB[inst.id] : BASE_ITEMS_DB[inst.id];
    state.inventory.push(inst);
    sfx.playLevelUp();
    
    chestVisual.innerHTML = item.image ? `<img src="${item.image}" style="width: 60px; height: 45px; border-radius: 4px;">` : item.emoji;
    resultText.innerHTML = `Found: <span class="rarity-${inst.rarity}" style="font-weight: bold;">[${inst.rarity.toUpperCase()}] ${item.name}</span>`;
    addCombatLog(`Premium Shop: Opened chest and found: [${inst.rarity.toUpperCase()}] ${item.image ? `<img src="${item.image}" style="width: 16px; height: 12px; display: inline-block; vertical-align: middle; margin-right: 4px;">` : item.emoji} ${item.name}!`, "log-crit");
    
    updateHUD();
    renderDotaShopTab();
  }, 1200);
}

function refreshNpcListings() {
  state.npcMarketListings = [];
  const itemsList = Object.keys(BASE_ITEMS_DB);

  for (let i = 0; i < 6; i++) {
    const randomItemId = itemsList[Math.floor(Math.random() * itemsList.length)];
    const item = BASE_ITEMS_DB[randomItemId];
    const rarityRoll = Math.random();
    let rarity = 'common';
    let cumulative = 0;
    for (let r = 0; r < RARITY_PROBS.length; r++) {
      cumulative += RARITY_PROBS[r];
      if (rarityRoll <= cumulative) { rarity = RARITIES[r]; break; }
    }
    const tier = Math.floor(Math.random() * 4);
    const inst = { id: randomItemId, rarity, tier, level: 10, modifiers: [] };
    const costFluct = Math.round(getMarketDotaCoinPrice(item, inst) * (0.9 + Math.random() * 0.3));

    state.npcMarketListings.push({
      item: inst,
      price: costFluct,
      sellerName: MARKET_BUYER_NAMES[Math.floor(Math.random() * MARKET_BUYER_NAMES.length)]
    });
  }
}

// Trigger Prestige reset
function triggerPrestigeReset() {
  const yieldAmt = Math.max(0, Math.floor(state.highestStageReached * 0.5));
  if (yieldAmt <= 0) {
    alert("You need to clear higher stages to prestige!");
    return;
  }

  if (confirm(`Prestige now? You will gain ⚜️ ${yieldAmt} Ancestral Essence, reset campaign to Stage 1, but KEEP all heroes, collections and talents!`)) {
    state.ancestralEssence += yieldAmt;
    state.currentStage = 1;
    state.prestigeCount = (state.prestigeCount || 0) + 1;
    stageTimer = 30.0;
    currentWaveEnemies = [];
    currentWaveIndex = 0;

    // Ancient Memory rune: heroes start at a higher level after Prestige
    const ancientMemory = hasRuneUnlock('ancient_memory');

    // Revive and heal party
    activeHeroes.forEach(id => {
      if (ancientMemory) {
        state.heroes[id].level = Math.max(state.heroes[id].level, 5);
      }
      const stats = getHeroStats(id);
      if (stats) {
        state.heroes[id].currentHp = stats.maxHp;
        state.heroes[id].currentMana = stats.maxMana;
      }
    });

    sfx.playRareDrop();
    addCombatLog(`⚜️ Campaign Prestige triggered! Gained +${yieldAmt} Ancestral Essence.`, "log-crit");
    renderPrestigeTab();
    spawnWave(0);
    updateHUD();
  }
}

// --- COMBAT CORE LOOP WITH POSITIONED FIGHTERS ---

// Builds a single enemy object scaled by stage, rank, and optional boss/elite multiplier
function buildEnemy(region, rank, rankMult, creepType, spriteSymbol, bossClass, eliteClass, idx) {
  const stage = getActiveStage();
  const specialMult = bossClass ? 3.5 : (eliteClass ? 2.0 : 1.0);
  const variance = 0.9 + Math.random() * 0.2; // ±10% so a wave isn't identical clones

  const hp = Math.round((250 * Math.pow(1.20, stage - 1)) * specialMult * rankMult.hp * variance);
  const dmg = Math.round(14 * Math.pow(1.16, stage - 1) * rankMult.dmg * variance);
  const goldYield = Math.round(15 * Math.pow(1.12, stage - 1) * rankMult.reward * variance);
  const xpYield = Math.round(22 * Math.pow(1.12, stage - 1) * rankMult.reward * variance);

  let enemyImage = '';
  if (bossClass) {
    if (region.id === 'roshan_pit') {
      enemyImage = 'assets/monsters/boss_roshan.png';
    } else {
      enemyImage = 'assets/monsters/boss_generic.png';
    }
  } else if (eliteClass) {
    enemyImage = 'assets/monsters/creep_elite.png';
  } else {
    if (region.id === 'small_camp') {
      enemyImage = 'assets/monsters/creep_jungle_small.png';
    } else if (region.id === 'medium_camp') {
      enemyImage = 'assets/monsters/creep_jungle_medium.png';
    } else if (region.id === 'hard_camp') {
      enemyImage = 'assets/monsters/creep_jungle_hard.png';
    } else if (region.id === 'ancient_camp') {
      enemyImage = 'assets/monsters/creep_jungle_ancient.png';
    } else {
      enemyImage = 'assets/monsters/creep_common.png';
    }
  }

  return {
    id: `${Date.now()}_${idx}_${Math.floor(Math.random() * 100000)}`,
    name: `${region.name} ${creepType}`,
    maxHp: hp,
    hp: hp,
    dmg: dmg,
    gold: goldYield,
    xp: xpYield,
    level: stage,
    attackTimer: 0,
    boss: bossClass,
    elite: eliteClass,
    sprite: spriteSymbol,
    image: enemyImage
  };
}

function getStageWaveCount(stage) {
  if (stage <= 2) return 10;
  if (stage <= 6) return 11;
  if (stage <= 12) return 12; // Arauto ends at stage 12
  if (stage <= 27) return 15; // Guardian (15 stages: 13 to 27)
  if (stage <= 42) return 18; // Crusader
  if (stage <= 57) return 20; // Archon
  if (stage <= 72) return 22; // Legend
  if (stage <= 87) return 25; // Ancient
  if (stage <= 102) return 28; // Divine
  return 30; // Immortal
}

function getStageMobCountRange(stage) {
  if (stage <= 12) return [2, 3]; // Arauto: "2-3 mobs por wave"
  if (stage <= 27) return [7, 7]; // Guardian: "7 mobs por wave"
  if (stage <= 42) return [8, 8];
  if (stage <= 57) return [9, 9];
  if (stage <= 72) return [10, 10];
  if (stage <= 87) return [11, 11];
  return [12, 12];
}

// Builds the enemy list for wave `waveIdx` of the active stage (without touching currentWaveEnemies)
function buildWaveEnemies(waveIdx) {
  const stage = getActiveStage();
  const region = getRegionDetails(stage);
  const rank = getRankDetails(stage);
  const rankMult = getRankMultiplier(rank.index);

  const isLastWave = waveIdx === stageWaveCount - 1;
  const isLastStageOfRank = (stage === rank.maxStage);

  const enemies = [];
  if (isLastWave) {
    const creepType = isLastStageOfRank ? "BOSS" : "Mini-Boss";
    const spriteSymbol = isLastStageOfRank ? "🐉" : "👿";
    enemies.push(buildEnemy(region, rank, rankMult, creepType, spriteSymbol, isLastStageOfRank, !isLastStageOfRank, 0));
  } else {
    const mobRange = getStageMobCountRange(stage);
    const enemyCount = mobRange[0] + Math.floor(Math.random() * (mobRange[1] - mobRange[0] + 1));
    for (let i = 0; i < enemyCount; i++) {
      enemies.push(buildEnemy(region, rank, rankMult, "Common Wave", "👹", false, false, i));
    }
  }

  // Stack Camp: if flag is set, buff the first enemy in the wave with bonus loot
  if (stackedCreepSpawned && !isLastWave) {
    stackedCreepSpawned = false;
    const enemy = enemies[0];
    enemy.hp    = Math.round(enemy.hp    * 1.50);
    enemy.maxHp = enemy.hp;
    enemy.dmg   = Math.round(enemy.dmg   * 1.30);
    enemy.gold  = Math.round(enemy.gold  * 1.80);
    enemy.xp    = Math.round(enemy.xp    * 1.80);
    enemy.name  = `⚡ Stacked ${enemy.name}`;
  }

  return enemies;
}

// Spawns wave `waveIdx` of the active stage into currentWaveEnemies (replaces whatever's on screen)
function spawnWave(waveIdx) {
  waveTransitionActive = false;
  const stage = getActiveStage();
  const region = getRegionDetails(stage);
  const rank = getRankDetails(stage);

  if (waveIdx === 0) {
    stageWaveCount = getStageWaveCount(stage);
  }

  currentWaveIndex = waveIdx;
  currentWaveEnemies = buildWaveEnemies(waveIdx);

  stageTimer = 30.0;
  nextWaveTimer = (waveIdx < stageWaveCount - 1) ? 20.0 : Infinity; // no overlap-spawn after the last wave

  // Set details overlay
  document.getElementById('arena-stage-num').textContent = stage;
  document.getElementById('arena-stage-name').textContent = `${region.name} — ${rank.name} (${rank.difficultyLabel})`;

  renderBattlefieldUnits();
  updateHUD();
}

// Adds the next wave's enemies on top of whatever's still alive (used when the current wave is taking too long)
function overlapNextWave() {
  if (currentWaveIndex + 1 >= stageWaveCount) return;
  currentWaveIndex++;
  const fresh = buildWaveEnemies(currentWaveIndex);
  currentWaveEnemies = currentWaveEnemies.concat(fresh);
  nextWaveTimer = (currentWaveIndex < stageWaveCount - 1) ? 20.0 : Infinity;
  addCombatLog(`⚠️ A onda demorou demais! Reforços inimigos estão chegando!`, "log-system");
  renderBattlefieldUnits();
  updateHUD();
}

function getFrontTarget() {
  return currentWaveEnemies.find(e => e.hp > 0) || null;
}

function renderBattlefieldUnits() {
  const battlefield = document.getElementById('battlefield');
  
  // Save current floating damages or projectiles inside container
  const floats = battlefield.querySelectorAll('.floating-dmg, .projectile, .physical-loot');
  
  battlefield.innerHTML = "";
  
  // Restore floating stuff
  floats.forEach(f => battlefield.appendChild(f));

  // Render player active heroes
  activeHeroes.forEach((id, idx) => {
    const h = state.heroes[id];
    const stats = getHeroStats(id);
    if (!stats) return;

    if (h.currentHp === undefined) h.currentHp = stats.maxHp;
    if (h.currentMana === undefined) h.currentMana = stats.maxMana;

    // Slots positioning logic
    let leftPos = 40; // Sven (slot 0)
    if (idx === 1) leftPos = 24; // CM (slot 1)
    if (idx === 2) leftPos = 8; // Drow (slot 2)
    if (idx === 3) leftPos = 16;
    if (idx === 4) leftPos = 32;

    const unit = document.createElement('div');
    unit.className = `battle-unit player ${id} ${h.currentHp <= 0 ? 'dead' : ''}`;
    unit.id = `unit-${id}`;
    unit.style.left = `${leftPos}%`;
    
    // Skill cooldown status
    let cdsHtml = h.skills.map((sk, sIdx) => {
      if (sk.level <= 0) return '';
      const cdState = h.cooldowns[sIdx] || 0;
      const pct = (cdState / sk.cd) * 100;
      return `
        <div class="cd-icon" title="${sk.name}">
          <span>${sIdx === 2 ? '🔥' : '✨'}</span>
          <div class="cd-overlay" style="height: ${pct}%;"></div>
        </div>
      `;
    }).join('');

    unit.innerHTML = `
      <div class="unit-avatar" id="sprite-${id}">${h.arenaImage ? `<img src="${h.arenaImage}" alt="${h.name}" class="arena-sprite">` : (h.image ? `<img src="${h.image}" alt="${h.name}">` : h.emoji)}</div>
      <div class="unit-name-label">${h.name} (Nvl ${h.level})</div>
      <div class="unit-bars">
        <div class="unit-bar-container"><div class="unit-bar-fill hp" id="bar-${id}-hp" style="width: ${(h.currentHp / stats.maxHp) * 100}%;"></div></div>
        <div class="unit-bar-container"><div class="unit-bar-fill mana" id="bar-${id}-mp" style="width: ${(h.currentMana / stats.maxMana) * 100}%;"></div></div>
      </div>
      <div class="unit-cooldowns">${cdsHtml}</div>
    `;

    battlefield.appendChild(unit);
  });

  // Render Enemies (wave)
  const enemyLeftPositions = { 0: 75, 1: 91, 2: 59, 3: 83, 4: 67 };
  currentWaveEnemies.forEach((enemy, idx) => {
    if (enemy.hp <= 0) return;
    const enemyUnit = document.createElement('div');
    enemyUnit.className = `battle-unit enemy ${enemy.boss ? 'boss' : ''}`;
    enemyUnit.id = `unit-enemy-${enemy.id}`;
    enemyUnit.style.left = `${enemyLeftPositions[idx] ?? 75}%`;
    enemyUnit.innerHTML = `
      <div class="unit-avatar" id="enemy-sprite-${enemy.id}">${enemy.image ? `<img src="${enemy.image}" alt="${enemy.name}">` : enemy.sprite}</div>
      <div class="unit-name-label">${enemy.name} (Nvl ${enemy.level})</div>
      <div class="unit-bars">
        <div class="unit-bar-container"><div class="unit-bar-fill hp" id="bar-enemy-hp-${enemy.id}" style="width: ${(enemy.hp / enemy.maxHp) * 100}%;"></div></div>
      </div>
    `;
    battlefield.appendChild(enemyUnit);
  });
}

// Spawn physical floating text on battle arena canvas
function createFloatingText(battlefield, text, styleClass, isCrit = false, targetElId = null) {
  const enemyEl = document.getElementById(targetElId || `unit-enemy-${currentWaveEnemies[0] ? currentWaveEnemies[0].id : 0}`);
  if (!enemyEl) return;
  
  const rect = enemyEl.getBoundingClientRect();
  const canvasRect = battlefield.getBoundingClientRect();
  
  const el = document.createElement('div');
  el.className = `floating-dmg ${styleClass} ${isCrit ? 'critical' : ''}`;
  el.textContent = text;
  
  // position around enemy
  const x = rect.left - canvasRect.left + Math.random() * 20;
  const y = rect.top - canvasRect.top - 20;
  
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  
  battlefield.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

// Animate physical loot items falling from the top of the canvas
function spawnPhysicalLoot(symbol, rarity = 'common', sourceElId = null) {
  const battlefield = document.getElementById('battlefield');
  const enemyEl = document.getElementById(sourceElId || `unit-enemy-${currentWaveEnemies[0] ? currentWaveEnemies[0].id : 0}`);
  if (!enemyEl) return;

  const rect = enemyEl.getBoundingClientRect();
  const canvasRect = battlefield.getBoundingClientRect();
  const x = rect.left - canvasRect.left;
  const y = rect.top - canvasRect.top + 30;

  const el = document.createElement('div');
  el.className = `physical-loot glowing-loot-${rarity}`;
  el.innerHTML = symbol;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  // Bad luck protection beam light
  if (RARITIES.indexOf(rarity) >= RARITIES.indexOf('epic')) {
    const beam = document.createElement('div');
    beam.className = 'glowing-beam';
    el.appendChild(beam);
  }

  battlefield.appendChild(el);

  // Animate flight to wallet/stash after 1.2s
  setTimeout(() => {
    el.classList.add('fly-to-wallet');
    el.style.left = `-50px`;
    el.style.top = `380px`;
    
    setTimeout(() => el.remove(), 600);
  }, 1200);
}

// Trigger attack projectile anim from source coordinates to enemy
function fireProjectile(symbol, sourceId) {
  const battlefield = document.getElementById('battlefield');
  const src = document.getElementById(sourceId);
  const target = getFrontTarget();
  const dst = target ? document.getElementById(`unit-enemy-${target.id}`) : null;
  if (!src || !dst) return;

  const canvasRect = battlefield.getBoundingClientRect();
  const srcRect = src.getBoundingClientRect();
  const dstRect = dst.getBoundingClientRect();

  const startX = srcRect.left - canvasRect.left + 25;
  const startY = srcRect.top - canvasRect.top + 15;
  
  const endX = dstRect.left - canvasRect.left + 20;
  const endY = dstRect.top - canvasRect.top + 25;

  const el = document.createElement('div');
  el.className = 'projectile';
  el.textContent = symbol;
  el.style.left = `${startX}px`;
  el.style.top = `${startY}px`;

  battlefield.appendChild(el);

  // animate via CSS transition
  setTimeout(() => {
    el.style.left = `${endX}px`;
    el.style.top = `${endY}px`;
    
    setTimeout(() => el.remove(), 260);
  }, 20);
}

function updateStageProgressBar() {
  const fillEl = document.getElementById('stage-progress-fill');
  if (!fillEl) return;

  const waveHpTotal = currentWaveEnemies.reduce((sum, e) => sum + e.maxHp, 0);
  const waveHpRemaining = currentWaveEnemies.reduce((sum, e) => sum + Math.max(0, e.hp), 0);
  const waveFraction = waveHpTotal > 0 ? (1 - waveHpRemaining / waveHpTotal) : 0;

  const overallFraction = (currentWaveIndex + waveFraction) / stageWaveCount;
  fillEl.style.width = `${Math.min(100, Math.max(0, overallFraction * 100))}%`;

  const textEl = document.getElementById('stage-progress-text');
  if (textEl) {
    textEl.textContent = `Onda ${currentWaveIndex + 1} / ${stageWaveCount}`;
  }
}

function updateHUD() {
  updateStageProgressBar();
  document.getElementById('gold-amount').textContent = Math.round(state.gold).toLocaleString();
  document.getElementById('coins-amount').textContent = state.dotaCoins.toLocaleString();
  document.getElementById('essence-amount').textContent = state.essence.toLocaleString();
  document.getElementById('shards-amount').textContent = state.shards.toLocaleString();
  document.getElementById('ancestral-amount').textContent = state.ancestralEssence.toLocaleString();

  const runeGoldEl = document.getElementById('rune-gold-display');
  if (runeGoldEl) runeGoldEl.textContent = Math.round(state.gold).toLocaleString();
  const runeFragEl = document.getElementById('rune-fragments-display');
  if (runeFragEl) runeFragEl.textContent = state.runeFragments.toLocaleString();
  const runeSigilEl = document.getElementById('rune-sigils-display');
  if (runeSigilEl) runeSigilEl.textContent = state.ancestralSigils.toLocaleString();
  const runeInvestedEl = document.getElementById('rune-invested-display');
  if (runeInvestedEl) runeInvestedEl.textContent = totalRuneLevelsInvested();


  // Compute total DPS
  let totalDps = 0;
  activeHeroes.forEach(id => {
    const stats = getHeroStats(id);
    if (stats) {
      let dps = stats.damage / stats.attackCooldown;
      const h = state.heroes[id];
      h.skills.forEach((sk, sIdx) => {
        if (sk.level > 0 && sk.cd > 0) {
          totalDps += (sIdx === 2 ? 30 : 15) * sk.level / sk.cd;
        }
      });
      totalDps += dps;
    }
  });

  dpsTracker = Math.round(totalDps) || 197;
  document.getElementById('hud-dps-value').textContent = dpsTracker;

  let dpMultiplier = (state.dotaPlus ? 1.2 : 1.0) * (1.0 + (state.talents.gold * 0.05));
  document.getElementById('hud-gold-mult').textContent = `${dpMultiplier.toFixed(1)}x`;

  const frontTarget = getFrontTarget();
  const goldRate = frontTarget ? ((frontTarget.gold * dpMultiplier) / (frontTarget.maxHp / (totalDps || 1) + 2)) : 0.0;
  document.getElementById('gold-rate').textContent = `+${goldRate.toFixed(1)}/s`;

  // Battlefield unit HP/MP bars (avatars on the arena canvas)
  activeHeroes.forEach(id => {
    const h = state.heroes[id];
    const stats = getHeroStats(id);
    if (!stats) return;
    const hpBar = document.getElementById(`bar-${id}-hp`);
    if (hpBar) hpBar.style.width = `${Math.max(0, (h.currentHp / stats.maxHp) * 100)}%`;
    const mpBar = document.getElementById(`bar-${id}-mp`);
    if (mpBar) mpBar.style.width = `${Math.max(0, (h.currentMana / stats.maxMana) * 100)}%`;
  });
  currentWaveEnemies.forEach(enemy => {
    const enemyBar = document.getElementById(`bar-enemy-hp-${enemy.id}`);
    if (enemyBar) enemyBar.style.width = `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%`;
  });

  const hudEnemyFillEl = document.getElementById('hud-enemy-hp-fill');
  const hudEnemyTextEl = document.getElementById('hud-enemy-hp-text');
  if (hudEnemyFillEl && hudEnemyTextEl) {
    if (frontTarget) {
      hudEnemyFillEl.style.width = `${(frontTarget.hp / frontTarget.maxHp) * 100}%`;
      hudEnemyTextEl.textContent = `${Math.round(frontTarget.hp)} / ${frontTarget.maxHp}`;
    } else {
      hudEnemyFillEl.style.width = '0%';
      hudEnemyTextEl.textContent = 'Dead';
    }
  }

  // Recommended vs Team power calculate
  const recPower = Math.round(100 * Math.pow(1.15, getActiveStage() - 1));
  let teamPower = 0;
  activeHeroes.forEach(id => {
    const h = state.heroes[id];
    const stats = getHeroStats(id);
    if (stats) {
      let heroPower = h.level * 100;
      h.items.forEach(inst => {
        if (inst) heroPower += (inst.tier + 1) * (RARITIES.indexOf(inst.rarity) + 1) * 35;
      });
      teamPower += heroPower;
    }
  });

  document.getElementById('rec-power-val').textContent = recPower.toLocaleString();
  document.getElementById('team-power-val').textContent = teamPower.toLocaleString();
  document.getElementById('max-stage-val').textContent = state.highestStageReached;
  updateFarmStageUI();

  // Party visual right sidebar HUD
  const partyList = document.getElementById('hud-party-list');
  partyList.innerHTML = "";
  activeHeroes.forEach(id => {
    const h = state.heroes[id];
    const stats = getHeroStats(id);
    if (!stats) return;

    const iconUrl = h.image ? h.image.replace('/heroes/', '/heroes/icons/') : '';
    const card = document.createElement('div');
    card.className = `hud-hero-card ${h.currentHp <= 0 ? 'dead' : ''}`;
    card.style.cssText = 'padding: 8px; border-radius: 8px; border: 1px solid var(--border-light); background: rgba(0,0,0,0.15); margin-bottom: 8px; transition: border-color 0.2s;';

    // Calculate XP progress for this hero
    const xpThreshold = Math.round(150 * Math.pow(h.level, 1.8));
    const xpPct = xpThreshold > 0 ? Math.min(100, (h.xp / xpThreshold) * 100) : 0;

    card.innerHTML = `
      <div style="display: flex; gap: 8px; align-items: center; width: 100%;">
        <!-- Hero icon -->
        <div style="width: 32px; height: 32px; border-radius: 50%; overflow: hidden; border: 1px solid var(--border-light); flex-shrink: 0; background: rgba(0,0,0,0.3);">
          ${iconUrl ? `<img src="${iconUrl}" style="width: 100%; height: 100%; object-fit: cover;">` : `<div style="font-size: 1.1rem; text-align: center; line-height: 30px;">${h.emoji}</div>`}
        </div>
        <!-- Hero info & bars -->
        <div style="flex: 1; min-width: 0; display: flex; flex-direction: column;">
          <div class="hud-hero-header" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; font-weight: 700; margin-bottom: 2px;">
            <span class="hud-hero-name" style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;" title="${h.name}">${h.name}</span>
            <span class="hud-hero-level" style="color: var(--secondary-gold); font-family: 'JetBrains Mono', monospace; font-size: 0.7rem;">Lvl ${h.level}</span>
          </div>
          <div class="bar-container" style="height: 4px; margin-bottom: 2px; width: 100%;">
            <div class="bar-fill hp" style="width: ${(h.currentHp / stats.maxHp) * 100}%;"></div>
          </div>
          <div class="bar-container" style="height: 2px; width: 100%;">
            <div class="bar-fill mana" style="width: ${(h.currentMana / stats.maxMana) * 100}%;"></div>
          </div>
          <!-- XP Bar -->
          <div class="bar-container" style="height: 2px; width: 100%; margin-top: 1px; background: rgba(255,255,255,0.05);">
            <div style="height: 100%; width: ${xpPct}%; background: linear-gradient(90deg, #f39c12, #f1c40f); border-radius: 2px; transition: width 0.3s;"></div>
          </div>
          <div class="bar-values" style="margin-top: 2px; display: flex; justify-content: space-between; font-size: 0.6rem; color: var(--text-secondary); font-family: 'JetBrains Mono', monospace;">
            <span>HP: ${Math.round(Math.max(0, h.currentHp))} / ${stats.maxHp}</span>
            <span style="color: #f1c40f;">XP ${Math.round(xpPct)}%</span>
          </div>
        </div>
      </div>
    `;
    partyList.appendChild(card);
  });
}

function addCombatLog(text, className = "") {
  const body = document.getElementById('combat-log-body');
  if (body.children.length > 50) body.removeChild(body.firstChild);
  
  const entry = document.createElement('div');
  entry.className = `log-entry ${className}`;
  
  const now = new Date();
  const hr = now.getHours().toString().padStart(2, '0');
  const min = now.getMinutes().toString().padStart(2, '0');
  const sec = now.getSeconds().toString().padStart(2, '0');
  const timeStr = `[${hr}:${min}:${sec}]`;
  
  entry.innerHTML = `<span style="color: var(--text-dark); margin-right: 8px;">${timeStr}</span> ${text}`;
  body.appendChild(entry);
  body.scrollTop = body.scrollHeight;
}

// Tick loop (100ms interval)
function gameTick() {
  const delta = (Date.now() - state.lastTick) / 1000;
  state.lastTick = Date.now();

  // Team is locked into a PvP match — pause all PvE combat until it ends
  if (state.pvp.active) {
    return;
  }

  // Tactical Battle Speed is 1.0x (items adjust action rate)
  const simulatedSeconds = delta * 1.0;

  if (currentWaveEnemies.length === 0 && !waveTransitionActive && !victoryPoseTimer) {
    spawnWave(currentWaveIndex);
  }

  const battlefield = document.getElementById('battlefield');

  // Stage timer check
  if (currentWaveEnemies.length > 0 && !victoryPoseTimer) {
    stageTimer -= simulatedSeconds;

    // Next-wave overlap: if the current wave is taking too long, reinforcements pile in early
    if (nextWaveTimer !== Infinity) {
      nextWaveTimer -= simulatedSeconds;
      if (nextWaveTimer <= 0) {
        overlapNextWave();
      }
    }

    if (stageTimer <= 0) {
      stageTimer = 30.0;
      if (viewingStage !== null) {
        addCombatLog(`⏱️ TIMEOUT! Reiniciando a onda no Estágio ${viewingStage}.`, "log-system");
      } else {
        addCombatLog(`⏱️ STAGE TIMEOUT! Reverting to Stage ${Math.max(1, state.currentStage - 1)}.`, "log-system");
        state.currentStage = Math.max(1, state.currentStage - 1);
      }
      currentWaveIndex = 0;
      spawnWave(0);
      return;
    }
    const timerFill = document.getElementById('stage-timer-fill');
    if (timerFill) timerFill.style.width = `${(stageTimer / 30.0) * 100}%`;
    const timerText = document.getElementById('stage-timer-text');
    if (timerText) timerText.textContent = `${stageTimer.toFixed(1)}s`;
  }

  // MARKET TIMER
  marketRefreshSeconds -= simulatedSeconds;
  if (marketRefreshSeconds <= 0) {
    marketRefreshSeconds = 300;
    refreshNpcListings();
  }

  // Sell listings player
  let soldListings = [];
  state.marketListings.forEach((lst, idx) => {
    lst.timeRemaining -= simulatedSeconds;
    if (lst.timeRemaining <= 0) soldListings.push(idx);
  });
  if (soldListings.length > 0) {
    soldListings.sort((a,b) => b-a).forEach(idx => {
      const lst = state.marketListings[idx];
      state.dotaCoins += lst.price;
      addCombatLog(`💰 Marketplace: ${lst.buyerName || 'A buyer'} purchased your listing! Gained <span class="log-loot">🪙 ${lst.price} Dota Coins</span>.`, "log-loot");
      sfx.playCoin();
      state.marketListings.splice(idx, 1);
    });
    updateHUD();
  }

  // Regen Health & Mana
  activeHeroes.forEach(id => {
    const h = state.heroes[id];
    const stats = getHeroStats(id);
    if (!stats || h.level === 0) return;

    if (h.currentHp > 0) {
      h.currentHp = Math.min(stats.maxHp, h.currentHp + (stats.hpRegen * simulatedSeconds));
      const totalManaRegen = stats.manaRegen + getGlobalManaRegenBonus();
      h.currentMana = Math.min(stats.maxMana, h.currentMana + (totalManaRegen * simulatedSeconds));
    }
  });

  const allDead = activeHeroes.every(id => state.heroes[id].currentHp <= 0);
  if (allDead) {
    handleDefeat();
    return;
  }

  // Victory pose delay check
  if (victoryPoseTimer > 0) {
    victoryPoseTimer -= simulatedSeconds;
    if (victoryPoseTimer <= 0) {
      activeHeroes.forEach(id => {
        const u = document.getElementById(`unit-${id}`);
        if (u) u.classList.remove('victory-pose');
      });
      spawnWave(currentWaveIndex);
    }
    return;
  }

  // Attack routines
  activeHeroes.forEach(id => {
    const h = state.heroes[id];
    const stats = getHeroStats(id);
    if (!stats || h.level === 0 || h.currentHp <= 0) return;

    if (h.attackTimer === undefined) h.attackTimer = 0;
    h.attackTimer += simulatedSeconds;
    h.cooldowns = h.cooldowns.map(cd => Math.max(0, cd - simulatedSeconds));

    // Skill double casts
    const doubleCastMod = h.items.some(inst => inst && inst.modifiers && inst.modifiers.includes('double_cast'));

    // Cast triggers
    h.skills.forEach((sk, idx) => {
      if (sk.level > 0 && h.currentMana >= sk.cost && h.cooldowns[idx] <= 0 && Math.random() < (0.15 * simulatedSeconds)) {
        h.currentMana -= sk.cost;
        h.cooldowns[idx] = sk.cd;
        
        let casts = doubleCastMod && Math.random() < 0.15 ? 2 : 1;
        
        for (let c = 0; c < casts; c++) {
          setTimeout(() => {
            let dmg = 0;
            let pure = false;

            if (id === 'sven' && idx === 0) {
              dmg = (80 + sk.level * 40) * stats.spellAmp;
              fireProjectile('✨', `unit-${id}`);
              addCombatLog(`Sven casts Storm Hammer! Deals <span class="log-spell">${Math.round(dmg)} magic damage</span>.`, "log-spell");
              sfx.playSpell();
            } else if (id === 'sven' && idx === 2) {
              h.godStrengthTimer = 12.0;
              addCombatLog("Sven activates <span class=\"log-spell\">God's Strength</span>! Damage doubled.", "log-spell");
              sfx.playSpell();
            } else if (id === 'crystal_maiden' && idx === 0) {
              dmg = (60 + sk.level * 35) * stats.spellAmp;
              fireProjectile('❄️', `unit-${id}`);
              addCombatLog(`Crystal Maiden casts Crystal Nova! Deals <span class="log-spell">${Math.round(dmg)} damage</span>.`, "log-spell");
              sfx.playSpell();
            } else if (id === 'crystal_maiden' && idx === 2) {
              dmg = (200 + sk.level * 100) * stats.spellAmp;
              fireProjectile('❄️', `unit-${id}`);
              addCombatLog(`Crystal Maiden channels <span class="log-spell">Freezing Field</span>! Deals ${Math.round(dmg)} damage.`, "log-spell");
              sfx.playSpell();
            } else if (id === 'drow_ranger' && idx === 2) {
              dmg = stats.damage * 2.0;
              fireProjectile('🏹', `unit-${id}`);
              addCombatLog(`Drow Ranger fires Marksmanship! Deals <span class="log-spell">${Math.round(dmg)} damage</span>.`, "log-spell");
              sfx.playSpell();
            } else if (id === 'juggernaut' && idx === 0) {
              dmg = (80 + sk.level * 40) * stats.spellAmp;
              addCombatLog(`Juggernaut spins Blade Fury! Deals <span class="log-spell">${Math.round(dmg)} magic damage</span>.`, "log-spell");
              sfx.playSpell();
            } else if (id === 'juggernaut' && idx === 2) {
              dmg = (300 + sk.level * 150);
              addCombatLog(`Juggernaut Omnislashes! Deals <span class="log-spell">${Math.round(dmg)} physical burst</span>.`, "log-spell");
              sfx.playSpell();
            } else if (id === 'lina' && idx === 0) {
              dmg = (90 + sk.level * 45) * stats.spellAmp;
              fireProjectile('🔥', `unit-${id}`);
              addCombatLog(`Lina casts Dragon Slave! Deals <span class="log-spell">${Math.round(dmg)} damage</span>.`, "log-spell");
              sfx.playSpell();
            } else if (id === 'lina' && idx === 2) {
              dmg = (450 + sk.level * 250) * stats.spellAmp;
              fireProjectile('⚡', `unit-${id}`);
              addCombatLog(`⚡ Lina Laguna Blade! Deals <span class="log-spell">${Math.round(dmg)} massive lightning damage</span>!`, "log-crit");
              sfx.playSpell();
            } else if (id === 'axe' && idx === 0) {
              // Berserker's Call: force enemy to target Axe for 4 seconds
              berserkersCallTimer = 4.0;
              berserkersCallTarget = 'axe';
              addCombatLog("🪓 Axe casts Berserker's Call! Enemy forced to target Axe.", "log-spell");
              sfx.playSpell();
            } else if (id === 'axe' && idx === 2) {
              const cullTarget = getFrontTarget();
              if (cullTarget && cullTarget.hp < (250 + sk.level * 150)) {
                dmg = cullTarget.hp;
                addCombatLog(`🪓 Axe executes with <span class="log-crit">Culling Blade</span>!`, "log-crit");
              } else {
                dmg = 100 * stats.spellAmp;
                addCombatLog(`Axe strikes Culling Blade! Deals ${Math.round(dmg)} damage.`, "log-spell");
              }
              sfx.playSpell();
            }

            if (dmg > 0) applyDamageToEnemy(dmg, pure, true, false, id);
          }, c * 200);
        }
      }
    });

    // Attacks
    // Bloodlust keystone: below 50% HP, hero attacks faster (bonus damage-per-tick proxy) and lifesteals more
    const bloodlustActive = (stats.keystones || []).includes('bloodlust') && (h.currentHp / stats.maxHp) < 0.5;
    let attackCd = stats.attackCooldown / (bloodlustActive ? 1.35 : 1.0);
    if (h.attackTimer >= attackCd) {
      h.attackTimer = 0;
      let dmg = stats.damage;

      // Sven God Strength
      if (h.godStrengthTimer && h.godStrengthTimer > 0) {
        h.godStrengthTimer -= simulatedSeconds;
        dmg *= 2.0;
      }

      // Executioner keystone: enemies below 20% HP take 40% more damage
      const executionerTarget = getFrontTarget();
      if ((stats.keystones || []).includes('executioner') && executionerTarget && (executionerTarget.hp / executionerTarget.maxHp) < 0.2) {
        dmg *= 1.40;
      }

      // Roll crit
      let isCrit = false;
      let roll = Math.random();

      if (id === 'juggernaut' && h.skills[1].level > 0) {
        if (roll < (0.20 + h.skills[1].level * 0.05)) {
          dmg *= 1.8;
          isCrit = true;
        }
      } else if (roll < stats.critChance) {
        dmg *= stats.critMult;
        isCrit = true;
      }

      // Crit mana restore modifier
      if (isCrit && h.items.some(inst => inst && inst.modifiers && inst.modifiers.includes('crit_mana'))) {
        h.currentMana = Math.min(stats.maxMana, h.currentMana + (stats.maxMana * 0.05));
      }

      // Attack animations
      if (id === 'sven') {
        const u = document.getElementById('unit-sven');
        if (u) {
          u.classList.add('melee-strike');
          setTimeout(() => u.classList.remove('melee-strike'), 300);
        }
      } else if (id === 'drow_ranger') {
        fireProjectile('🏹', `unit-${id}`);
      } else {
        fireProjectile('❄️', `unit-${id}`);
      }

      applyDamageToEnemy(dmg, false, false, isCrit, id);

      // Lifesteal (Bloodlust keystone adds +15% while active)
      const effectiveLifesteal = stats.lifesteal + (bloodlustActive ? 0.15 : 0);
      if (effectiveLifesteal > 0) {
        h.currentHp = Math.min(stats.maxHp, h.currentHp + (dmg * effectiveLifesteal));
      }

      sfx.playHit();
    }
  });

  // Berserker's Call countdown (shared across the whole wave)
  if (berserkersCallTimer > 0) {
    berserkersCallTimer = Math.max(0, berserkersCallTimer - simulatedSeconds);
  }

  // Enemy creep attacks — each enemy in the wave acts independently
  currentWaveEnemies.forEach(enemy => {
    if (enemy.hp <= 0) return;
    enemy.attackTimer += simulatedSeconds;
    if (enemy.attackTimer < 1.5) return;
    enemy.attackTimer = 0;

    // ─── Creep Aggro System ────────────────────────────────────────
    // Berserker's Call forces every enemy in the wave to target Axe
    let targetId = '';
    if (berserkersCallTimer > 0 && berserkersCallTarget && state.heroes[berserkersCallTarget] && state.heroes[berserkersCallTarget].currentHp > 0) {
      targetId = berserkersCallTarget;
    } else {
      // Weight-based targeting: Strength=6, Agility/Universal=2, Intelligence=1
      const AGGRO_WEIGHTS = { strength: 6, agility: 2, universal: 2, intelligence: 1 };
      const alive = activeHeroes.filter(id => state.heroes[id] && state.heroes[id].currentHp > 0);
      if (alive.length > 0) {
        const totalWeight = alive.reduce((sum, id) => {
          const type = (state.heroes[id].type || 'strength').toLowerCase();
          return sum + (AGGRO_WEIGHTS[type] || 2);
        }, 0);
        let roll = Math.random() * totalWeight;
        for (const id of alive) {
          const type = (state.heroes[id].type || 'strength').toLowerCase();
          roll -= (AGGRO_WEIGHTS[type] || 2);
          if (roll <= 0) { targetId = id; break; }
        }
        if (!targetId) targetId = alive[alive.length - 1];
      }
    }

    if (targetId) {
      const h = state.heroes[targetId];
      const stats = getHeroStats(targetId);
      let dmg = enemy.dmg;

      // Evasion check
      if (Math.random() < stats.evasion) {
        createFloatingText(battlefield, "MISS", 'physical', false, `unit-enemy-${enemy.id}`);
        return;
      }

      // Shield modifier check
      const shieldLowMod = h.items.some(inst => inst && inst.modifiers && inst.modifiers.includes('shield_low'));
      if (shieldLowMod && (h.currentHp / stats.maxHp) <= 0.3 && !h.shieldCooldown) {
        h.shieldCooldown = 30.0; // 30s cd
        h.currentHp = Math.min(stats.maxHp, h.currentHp + (stats.maxHp * 0.3));
        addCombatLog(`🛡️ Shield modifier activated on ${h.name}! Restored 30% HP.`, "log-spell");
      }

      if (stats.block > 0) {
        dmg = Math.max(0, dmg - stats.block);
      }

      const armVal = (stats.evasion * 0.16) || 0;
      const physRes = (armVal * 0.06) / (1 + armVal * 0.06) || 0;
      let finalDmg = Math.max(1, Math.round(dmg * (1 - physRes)));

      h.currentHp = Math.max(0, h.currentHp - finalDmg);

      // Shake visual
      const enemyEl = document.getElementById(`unit-enemy-${enemy.id}`);
      if (enemyEl) {
        enemyEl.classList.add('melee-strike');
        setTimeout(() => enemyEl.classList.remove('melee-strike'), 300);
      }

      // Camera shake on heavy hits
      if (finalDmg > stats.maxHp * 0.1) {
        const canvas = document.getElementById('arena-canvas');
        canvas.classList.add('camera-shake');
        setTimeout(() => canvas.classList.remove('camera-shake'), 250);
      }

      // Float hit text on unit
      const heroEl = document.getElementById(`unit-${targetId}`);
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        const canvasRect = battlefield.getBoundingClientRect();
        const fl = document.createElement('div');
        fl.className = 'floating-dmg physical';
        fl.textContent = `-${finalDmg}`;
        fl.style.left = `${rect.left - canvasRect.left + 10}px`;
        fl.style.top = `${rect.top - canvasRect.top - 10}px`;
        battlefield.appendChild(fl);
        setTimeout(() => fl.remove(), 800);
      }

      addCombatLog(`${enemy.name} hits ${h.name} for ${finalDmg} damage.`, "log-system");
      updateHUD();
    }
  });

  // Update cooldown timers
  activeHeroes.forEach(id => {
    const h = state.heroes[id];
    if (h.shieldCooldown) h.shieldCooldown = Math.max(0, h.shieldCooldown - simulatedSeconds);
  });
}

function applyDamageToEnemy(dmg, pure = false, spell = false, crit = false, attackerId = "") {
  const roundedDmg = Math.round(dmg);
  
  const target = getFrontTarget();
  if (target) {
    target.hp = Math.max(0, target.hp - roundedDmg);

    // Set Center canvas damage number directly
    const battlefield = document.getElementById('battlefield');
    createFloatingText(battlefield, roundedDmg, spell ? 'magic' : (crit ? 'critical' : 'physical'), crit, `unit-enemy-${target.id}`);

    if (target.hp <= 0) {
      handleEnemyDeath(target);
    } else {
      updateHUD();
    }
  }
}

// Grants loot for a single enemy's death, then advances the wave or clears the stage
function handleEnemyDeath(enemy) {
  sfx.playCoin();

  const isBossKill = !!enemy.boss;
  const isEliteKill = !!enemy.elite;
  const runes = getRuneStatTotals();

  // ─── Ancestral Forge: active Altar blessing global multipliers ──────────
  const forgeBlessingFx = (typeof getForgeActiveBlessingEffect === 'function') ? getForgeActiveBlessingEffect() : {};

  let dpMultiplier = (state.dotaPlus ? 1.2 : 1.0) * (1.0 + (state.talents.gold * 0.05)) * (1 + (runes.goldCreepPct || 0)) * (1 + (forgeBlessingFx.goldPct || 0));
  if (isBossKill) dpMultiplier *= (1 + (runes.goldBossPct || 0));
  let xpMultiplier = (state.dotaPlus ? 1.2 : 1.0) * (1.0 + (state.talents.xp * 0.05)) * (1 + (runes.heroXpPct || 0)) * (1 + (forgeBlessingFx.xpPct || 0));

  const keystones = getEquippedKeystoneEffects();
  if (keystones.includes('greed')) dpMultiplier *= 1.0; // Greed affects drop quantity, not gold directly

  const gGain = Math.round(enemy.gold * dpMultiplier);
  const xpGain = Math.round(enemy.xp * xpMultiplier);

  state.gold += gGain;

  // Shards recruitment currency drops from Elites/Bosses — boosted by Sentry Ward
  let shardGain = 0;
  if (isBossKill) {
    shardGain = Math.round(5 + Math.random() * 5);
  } else if (isEliteKill) {
    shardGain = Math.round(1 + Math.random() * 2);
  }
  if (state.maneuvers.sentryActive > 0 && shardGain > 0) {
    shardGain = Math.round(shardGain * 1.25);
  }
  state.shards += shardGain;

  // ─── Rune Fragments: dropped by Elites, Bosses, and first stage clears ──────
  let fragmentGain = 0;
  if (isBossKill) fragmentGain = Math.round(8 + Math.random() * 7);
  else if (isEliteKill) fragmentGain = Math.round(2 + Math.random() * 3);
  if (fragmentGain > 0) {
    state.runeFragments += fragmentGain;
    spawnPhysicalLoot('🔷', 'common', `unit-enemy-${enemy.id}`);
  }

  addCombatLog(`☠️ <span class="log-kill">Defeated ${enemy.name}! Gained</span> <span class="log-loot">🪙 ${gGain}</span>, <span class="log-crit">⭐ ${xpGain} XP</span>${shardGain > 0 ? `, and <span class="log-spell">💎 ${shardGain} Shards</span>` : ''}${fragmentGain > 0 ? `, and <span class="log-spell">🔷 ${fragmentGain} Rune Fragments</span>` : ''}.`, "log-kill");

  // Animate loot physically falling on ground
  spawnPhysicalLoot('🪙', 'common', `unit-enemy-${enemy.id}`);
  if (shardGain > 0) spawnPhysicalLoot('💎', 'common', `unit-enemy-${enemy.id}`);

  // Distribute XP (with Catch-Up Training and Shared Knowledge runes)
  const maxAccountLevel = Math.max(1, ...Object.values(state.heroes).map(h => h.level || 0));
  activeHeroes.forEach(id => {
    const h = state.heroes[id];
    if (h.level === 0 || h.currentHp <= 0) return;

    let heroXpGain = xpGain;
    if (runes.catchUpXpPct && h.level < maxAccountLevel) {
      heroXpGain = Math.round(heroXpGain * (1 + runes.catchUpXpPct));
    }
    h.xp += heroXpGain;

    let threshold = Math.round(150 * Math.pow(h.level, 1.8));
    if (h.xp >= threshold) {
      h.xp -= threshold;
      h.level++;
      h.skillPoints = (h.skillPoints || 0) + 1;

      const stats = getHeroStats(id);
      h.currentHp = stats.maxHp;
      h.currentMana = stats.maxMana;

      addCombatLog(`⭐ LEVEL UP! ${h.name} reached Level ${h.level}!`, "log-loot");
      sfx.playLevelUp();
    }
  });

  // Shared Knowledge rune: heroes outside the active team get a fraction of XP
  if (runes.sharedXpPct) {
    for (let id in state.heroes) {
      if (activeHeroes.includes(id)) continue;
      const h = state.heroes[id];
      if (h.level === 0) continue;
      h.xp += Math.round(xpGain * runes.sharedXpPct);
    }
  }

  // Roll item drop — boosted by Observer Ward and Fortune runes
  const region = getRegionDetails(getActiveStage());
  const obsBonus = (state.maneuvers.obsActive > 0) ? 0.25 : 0;
  const sentryBonus = (state.maneuvers.sentryActive > 0) ? 0.25 : 0;
  let dropProb = (0.10 + (state.talents.drops * 0.02) + obsBonus) * (1 + (runes.dropChanceRelPct || 0)) * (1 + (forgeBlessingFx.dropChanceRelPct || 0));
  if (keystones.includes('greed')) dropProb *= 1.50;
  if (keystones.includes('treasure_seeker')) dropProb *= 0.70;
  const isBoss = isBossKill;
  const isElite = isEliteKill;

  // ─── Ancestral Forge: material drops (Essencia Comum/Rara/Epica), similar shape to Rune Fragments ──
  let forgeMaterialGain = 0;
  let forgeMaterialTier = 'common';
  if (isBoss) {
    forgeMaterialTier = Math.random() < 0.35 ? 'epic' : 'rare';
    forgeMaterialGain = Math.round(4 + Math.random() * 4);
  } else if (isElite) {
    forgeMaterialTier = Math.random() < 0.15 ? 'epic' : 'rare';
    forgeMaterialGain = Math.round(1 + Math.random() * 2);
  } else if (Math.random() < 0.20) {
    forgeMaterialTier = 'common';
    forgeMaterialGain = Math.round(1 + Math.random() * 2);
  }
  if (forgeMaterialGain > 0) {
    forgeMaterialGain = Math.round(forgeMaterialGain * (1 + (forgeBlessingFx.materialsPct || 0)));
    forgeAddMaterial(forgeMaterialTier, forgeMaterialGain);
    spawnPhysicalLoot('🧪', 'common', `unit-enemy-${enemy.id}`);
    addCombatLog(`⚒️ Forja: +${forgeMaterialGain} ${FORGE_MATERIAL_NAMES[forgeMaterialTier]}.`, 'log-system');
  }

  // Kill-count cooldown: common enemies can only drop items every 20 kills
  if (!state._killsSinceLastDrop) state._killsSinceLastDrop = 0;
  state._killsSinceLastDrop++;
  const dropCooldownMet = state._killsSinceLastDrop >= 20;

  if ((dropCooldownMet && Math.random() < dropProb) || isBoss || isElite) {
    if (isBoss || isElite || dropCooldownMet) state._killsSinceLastDrop = 0; // reset counter
    if (state.inventory.length < state.stashCapacity) {
      let inst = null;
      if (isBoss) {
        // Boss gives guaranteed Rare+ item or boss material
        const itemLvl = Math.max(1, region.lvl * 2);
        inst = generateItem(itemLvl);
        if (RARITIES.indexOf(inst.rarity) < RARITIES.indexOf('rare')) {
          inst.rarity = 'rare';
        }

        // Yield Essence on Boss kill
        const essDrop = Math.round(5 + Math.random() * 5);
        state.essence += essDrop;
        spawnPhysicalLoot('🧪', 'common', `unit-enemy-${enemy.id}`);
        addCombatLog(`🧪 Gained +${essDrop} Essence from boss!`, "log-loot");
      } else {
        const itemLvl = Math.max(1, region.lvl * 2);
        inst = generateItem(itemLvl);
      }

      state.inventory.push(inst);

      // Bad luck protection chimes and logs
      const rarityColors = { common: 'var(--rarity-common)', uncommon: 'var(--xp-green)', rare: 'var(--rarity-rare)', epic: 'var(--rarity-epic)', legendary: 'var(--rarity-legendary)', mythic: 'var(--rarity-mythic)', immortal: 'var(--rarity-immortal)' };
      addCombatLog(`🎁 Loot drop! Found: <span style="color: ${rarityColors[inst.rarity]}; font-weight: bold;">[${inst.rarity.toUpperCase()}] ${BASE_ITEMS_DB[inst.id].image ? `<img src="${BASE_ITEMS_DB[inst.id].image}" style="width: 16px; height: 12px; display: inline-block; vertical-align: middle; margin-right: 4px;">` : BASE_ITEMS_DB[inst.id].emoji} ${BASE_ITEMS_DB[inst.id].name}</span>!`, "log-loot");

      // physical fall animation
      spawnPhysicalLoot(BASE_ITEMS_DB[inst.id].image ? `<img src="${BASE_ITEMS_DB[inst.id].image}" style="width: 32px; height: 24px; border-radius: 4px;">` : BASE_ITEMS_DB[inst.id].emoji, inst.rarity, `unit-enemy-${enemy.id}`);
      sfx.playRareDrop();
    } else {
      addCombatLog("Stash Bag is full!", "log-system");
    }
  }

  // Remove this enemy from the wave
  currentWaveEnemies = currentWaveEnemies.filter(e => e.hp > 0);

  if (currentWaveEnemies.length > 0) {
    // More enemies still alive in this wave — keep fighting
    updateHUD();
    return;
  }

  if (currentWaveIndex + 1 < stageWaveCount) {
    // Wave cleared, more waves remain in this stage
    waveTransitionActive = true;
    setTimeout(() => { if (currentWaveEnemies.length === 0) spawnWave(currentWaveIndex + 1); }, 600);
    return;
  }

  // Last wave of the stage cleared — full stage-clear logic
  handleStageCleared(isBoss, isElite);
}

function handleStageCleared(isBoss, isElite) {
  const region = getRegionDetails(getActiveStage());
  const isFreeFarming = viewingStage !== null;

  // Boss defeat celebration pose
  if (isBoss) {
    victoryPoseTimer = 3.0;
    activeHeroes.forEach(id => {
      const u = document.getElementById(`unit-${id}`);
      if (u) u.classList.add('victory-pose');
    });
    addCombatLog("🏆 BOSS DEFEATED! Heroes celebrating victory!", "log-crit");

    // Roshan's Pit boss kills grant Ancestral Sigils and unlock Ring 3 of the Rune Web (only on real progress, not free-farming)
    if (region.id === 'roshan_pit' && !isFreeFarming) {
      const sigilGain = 1;
      state.ancestralSigils += sigilGain;
      spawnPhysicalLoot('⚜️');
      if (!state.roshanDefeated) {
        state.roshanDefeated = true;
        addCombatLog("🔷⚜️ <span class=\"log-crit\">Ancient Runes unlocked!</span> A new part of the Rune Nexus constellation ignites.", "log-crit");
      }
      addCombatLog(`⚜️ Roshan slain! Gained +${sigilGain} Ancestral Sigil.`, "log-crit");
    }
  }

  // Push stage if not farming an old stage, not in farming-mode, and not looping
  if (!isFreeFarming && !state.farmingMode && !state.loopingStage) {
    state.currentStage++;
    if (state.currentStage > state.highestStageReached) {
      state.highestStageReached = state.currentStage;
    }
  }

  // When looping: add a short log to confirm the loop
  if (state.loopingStage) {
    addCombatLog(`🔄 LOOP: Stage ${getActiveStage()} concluído! Repetindo...`, 'log-system');
  }

  currentWaveIndex = 0;
  currentWaveEnemies = [];
  const fill = document.getElementById('hud-enemy-hp-fill');
  if (fill) fill.style.width = '0%';
  const txt = document.getElementById('hud-enemy-hp-text');
  if (txt) txt.textContent = "Dead";

  if (!isBoss) {
    waveTransitionActive = true;
    setTimeout(() => { if (currentWaveEnemies.length === 0) spawnWave(0); }, 600);
  }
}

function handleDefeat() {
  waveTransitionActive = true;
  sfx.playDefeat();
  addCombatLog("💀 PARTY WIPED! Your heroes fell in battle.", "log-kill");

  // ─── Deny Mechanic ──────────────────────────────────────────────
  // If there's an alive Intelligence (support) hero, 30% chance to deny the wipe
  const intelligenceAlive = activeHeroes.find(id => {
    const h = state.heroes[id];
    return h && h.type === 'intelligence' && h.currentHp > 0;
  });
  if (intelligenceAlive && Math.random() < 0.30) {
    const denier = state.heroes[intelligenceAlive];
    addCombatLog(`✋ DENIED! ${denier.name} denies the defeat — stage regression prevented!`, "log-spell");
    currentWaveEnemies = [];
    stageTimer = 30.0;
    setTimeout(() => {
      activeHeroes.forEach(id => {
        const stats = getHeroStats(id);
        if (stats) {
          state.heroes[id].currentHp = Math.max(1, Math.round(stats.maxHp * 0.25));
          state.heroes[id].currentMana = Math.max(0, Math.round(stats.maxMana * 0.1));
        }
      });
      spawnWave(currentWaveIndex);
      updateHUD();
    }, 3000);
    return;
  }

  // If looping: repeat the exact same stage (no regression, no advance)
  if (state.loopingStage) {
    addCombatLog(`💀 DERROTA em loop! Repetindo Stage ${getActiveStage()}...`, 'log-kill');
    currentWaveEnemies = [];
    currentWaveIndex = 0;
    setTimeout(() => {
      activeHeroes.forEach(id => {
        const stats = getHeroStats(id);
        if (stats) {
          state.heroes[id].currentHp = stats.maxHp;
          state.heroes[id].currentMana = stats.maxMana;
        }
      });
      spawnWave(0);
      updateHUD();
    }, 3000);
    return;
  }

  // Revert stage to last efficient farming stage (only affects real progress, not a free-farmed old stage)
  if (viewingStage === null) {
    state.currentStage = Math.max(1, state.currentStage - 1);
    addCombatLog(`Respawning. Campaign reverted to stage ${state.currentStage}.`, "log-system");
  } else {
    addCombatLog(`Respawning at Stage ${viewingStage}.`, "log-system");
  }

  currentWaveEnemies = [];
  currentWaveIndex = 0;
  stageTimer = 30.0;

  setTimeout(() => {
    activeHeroes.forEach(id => {
      const stats = getHeroStats(id);
      if (stats) {
        state.heroes[id].currentHp = stats.maxHp;
        state.heroes[id].currentMana = stats.maxMana;
      }
    });
    spawnWave(0);
    updateHUD();
  }, 5000);
}

// --- SAVING AND LOADING ---

function loadSavedGame() {
  try {
    const saved = localStorage.getItem('dota_idle_save');
    if (saved) {
      const decoded = JSON.parse(atob(saved));
      if (decoded.gold !== undefined && decoded.heroes !== undefined) {
        state = decoded;
        validateStateStructure();
        calculateOfflineProgress();
      }
    } else {
      validateStateStructure();
    }
  } catch (e) {
    console.warn("LocalStorage access blocked, using memory mode.", e);
    validateStateStructure();
  }
}

function saveGame() {
  state.lastTick = Date.now();
  try {
    const encoded = btoa(JSON.stringify(state));
    localStorage.setItem('dota_idle_save', encoded);
  } catch (e) {
    console.warn("LocalStorage save blocked.", e);
  }
}

function calculateOfflineProgress() {
  const offlineMs = Date.now() - state.lastTick;
  const offlineSec = Math.floor(offlineMs / 1000);

  const runes = getRuneStatTotals();
  const offlineCapSec = Math.min(86400, (8 * 3600) + ((runes.offlineCapMinutes || 0) * 60));

  if (offlineSec > 30) {
    const capOfflineSec = Math.min(offlineCapSec, offlineSec);
    const region = getRegionDetails(state.currentStage);

    let totalDps = 0;
    activeHeroes.forEach(id => {
      const stats = getHeroStats(id);
      if (stats) totalDps += (stats.damage / stats.attackCooldown) + 15;
    });
    if (totalDps <= 0) totalDps = 10;

    const rank = getRankDetails(state.currentStage);
    const rankMult = getRankMultiplier(rank.index);

    const creepHpAvg = 100 * Math.pow(1.15, state.currentStage - 1) * rankMult.hp;
    const timeToKill = creepHpAvg / totalDps;
    const combatCycle = timeToKill + 2.0;
    const creepPerSecond = 1.0 / combatCycle;

    let dpMultiplier = (state.dotaPlus ? 1.2 : 1.0) * (1.0 + (state.talents.gold * 0.05)) * (1 + (runes.offlineRewardPct || 0));
    const baseGold = 15 * Math.pow(1.12, state.currentStage - 1) * rankMult.reward;
    const goldEarned = Math.round(baseGold * creepPerSecond * capOfflineSec * dpMultiplier);

    const baseXP = 22 * Math.pow(1.12, state.currentStage - 1) * rankMult.reward;
    const xpEarned = Math.round(baseXP * creepPerSecond * capOfflineSec * dpMultiplier);

    state.gold += goldEarned;
    
    activeHeroes.forEach(id => {
      const h = state.heroes[id];
      if (h.level === 0) return;
      h.xp += xpEarned;
      
      let threshold = Math.round(150 * Math.pow(h.level, 1.8));
      while (h.xp >= threshold && h.level < 100) {
        h.xp -= threshold;
        h.level++;
        h.skillPoints = (h.skillPoints || 0) + 1;
        threshold = Math.round(150 * Math.pow(h.level, 1.8));
      }
    });
    
    let itemsFound = [];
    const expectedCreeps = Math.floor(creepPerSecond * capOfflineSec);
    const dropAttempts = Math.min(100, expectedCreeps);
    const dropProb = 0.10 + (state.talents.drops * 0.02);

    for (let i = 0; i < dropAttempts; i++) {
      if (Math.random() < dropProb && state.inventory.length < state.stashCapacity) {
        const inst = generateItem(region.lvl * 2);
        state.inventory.push(inst);
        itemsFound.push(BASE_ITEMS_DB[inst.id].emoji + ' ' + BASE_ITEMS_DB[inst.id].name);
      }
    }
    
    const hrs = Math.floor(capOfflineSec / 3600);
    const mins = Math.floor((capOfflineSec % 3600) / 60);
    const secs = capOfflineSec % 60;
    const formattedTime = `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
    
    document.getElementById('offline-time-val').textContent = formattedTime;
    document.getElementById('offline-gold-val').textContent = `🪙 ${goldEarned.toLocaleString()}`;
    document.getElementById('offline-xp-val').textContent = `⭐ ${xpEarned.toLocaleString()}`;
    document.getElementById('offline-items-val').textContent = itemsFound.length > 0 ? itemsFound.slice(0, 5).join(', ') + (itemsFound.length > 5 ? '...' : '') : 'None';
    document.getElementById('welcome-modal').style.display = 'flex';
  }
}

// --- INIT & UI BINDINGS ---

function triggerSubNav(subId) {
  document.querySelectorAll('.sub-pane').forEach(p => p.classList.remove('active'));
  const targetSub = document.getElementById(`subpane-${subId}`);
  if (targetSub) targetSub.classList.add('active');
  
  if (subId === 'shop-items') renderShopTab();
  else if (subId === 'shop-forge') renderBlacksmithTab();
  else if (subId === 'shop-market') renderMarketTab();
  else if (subId === 'shop-compendium') renderCompendiumTab();
  else if (subId === 'shop-prestige') renderPrestigeTab();
  else if (subId === 'shop-chests') renderDotaShopTab();
}

// Farm any already-cleared stage without touching real campaign progress
function enterFarmStage(stage) {
  const clamped = Math.max(1, Math.min(state.highestStageReached, Math.round(stage)));
  viewingStage = (clamped === state.currentStage) ? null : clamped;
  currentWaveEnemies = [];
  currentWaveIndex = 0;
  spawnWave(0);
  updateFarmStageUI();
}

function returnToProgress() {
  viewingStage = null;
  currentWaveEnemies = [];
  currentWaveIndex = 0;
  spawnWave(0);
  updateFarmStageUI();
}

function updateFarmStageUI() {
  const returnBtn = document.getElementById('btn-farm-stage-return');
  if (returnBtn) {
    returnBtn.style.display = viewingStage !== null ? 'inline-block' : 'none';
  }
}

// ─── Stage Map Modal (Rank tabs + 30-stage grid) ──────────────────────
let stageMapActiveRankIndex = null;

function openStageMap() {
  const currentRank = getRankDetails(state.currentStage);
  stageMapActiveRankIndex = currentRank.index;
  renderStageMap();
  document.getElementById('stage-map-modal').style.display = 'flex';
}

function closeStageMap() {
  document.getElementById('stage-map-modal').style.display = 'none';
}

function renderStageMap() {
  const tabsEl = document.getElementById('stage-map-rank-tabs');
  const gridEl = document.getElementById('stage-map-grid');
  if (!tabsEl || !gridEl) return;

  const highestRankIndex = getRankDetails(state.highestStageReached).index;

  tabsEl.innerHTML = "";
  RANKS_DB.forEach(rank => {
    const unlocked = rank.index <= highestRankIndex;
    const btn = document.createElement('button');
    btn.className = `btn-sub-nav ${rank.index === stageMapActiveRankIndex ? 'active' : ''}`;
    btn.disabled = !unlocked;
    btn.style.opacity = unlocked ? '1' : '0.4';
    btn.textContent = rank.name;
    btn.title = `${rank.nameEn} — ${rank.difficultyLabel}`;
    if (unlocked) {
      btn.addEventListener('click', () => {
        stageMapActiveRankIndex = rank.index;
        renderStageMap();
      });
    }
    tabsEl.appendChild(btn);
  });

  const activeRank = RANKS_DB.find(r => r.index === stageMapActiveRankIndex);
  gridEl.innerHTML = "";
  for (let stage = activeRank.minStage; stage <= Math.min(activeRank.maxStage, activeRank.minStage + 29); stage++) {
    const node = document.createElement('button');
    const cleared = stage <= state.highestStageReached;
    const isCurrentProgress = stage === state.currentStage;
    const isBossStage = stage % 10 === 0;
    const isEliteStage = !isBossStage && stage % 5 === 0;

    node.className = `stage-map-node ${cleared ? 'cleared' : 'locked'} ${isCurrentProgress ? 'current' : ''} ${isBossStage ? 'boss' : (isEliteStage ? 'elite' : '')}`;
    node.disabled = !cleared;
    node.textContent = stage;
    node.title = isBossStage ? 'Boss' : (isEliteStage ? 'Elite' : '');
    if (cleared) {
      node.addEventListener('click', () => {
        enterFarmStage(stage);
        closeStageMap();
      });
    }
    gridEl.appendChild(node);
  }
}

function switchMainTab(tabId) {
  const sidebarBtn = document.querySelector(`.sidebar .nav-item[data-tab="${tabId}"]`);
  if (sidebarBtn) {
    document.querySelectorAll('.sidebar .nav-item').forEach(b => b.classList.remove('active'));
    sidebarBtn.classList.add('active');
  }
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  const targetPane = document.getElementById(`${tabId}-tab`);
  if (targetPane) targetPane.classList.add('active');

  // Show right HUD panel only on Combat Arena tab
  const hudPanel = document.getElementById('combat-hud-panel');
  if (hudPanel) hudPanel.style.display = (tabId === 'arena') ? '' : 'none';
  
  if (tabId === 'arena') {
    updateHUD();
  } else if (tabId === 'heroes') {
    renderHeroesTab();
  } else if (tabId === 'secret-shop') {
    const activeSubBtn = document.querySelector('.btn-sub-nav.active');
    const activeSub = activeSubBtn ? activeSubBtn.dataset.sub : 'shop-items';
    triggerSubNav(activeSub);
  } else if (tabId === 'rune-nexus') {
    renderRuneNexusTab();
  }
}

function initUI() {
  // Stage Map modal
  const openMapBtn = document.getElementById('btn-open-stage-map');
  if (openMapBtn) openMapBtn.addEventListener('click', () => openStageMap());
  const closeMapBtn = document.getElementById('btn-close-stage-map');
  if (closeMapBtn) closeMapBtn.addEventListener('click', () => closeStageMap());

  const farmReturnBtn = document.getElementById('btn-farm-stage-return');
  if (farmReturnBtn) {
    farmReturnBtn.addEventListener('click', () => returnToProgress());
  }

  // Looping Stage Toggle
  const loopingBtn = document.getElementById('btn-looping-stage');
  if (loopingBtn) {
    // Sync visual state on init
    function syncLoopingBtn() {
      if (state.loopingStage) {
        loopingBtn.style.borderColor = 'var(--secondary-gold)';
        loopingBtn.style.color = 'var(--secondary-gold)';
        loopingBtn.style.background = 'rgba(240,180,0,0.12)';
        loopingBtn.textContent = '\ud83d\udd04 LOOP ON';
        loopingBtn.title = 'LOOPING STAGE: ATIVO — heroes repetem este stage infinitamente. Clique para desativar.';
      } else {
        loopingBtn.style.borderColor = 'var(--text-dark)';
        loopingBtn.style.color = 'var(--text-dark)';
        loopingBtn.style.background = '';
        loopingBtn.textContent = '\ud83d\udd04 LOOPING';
        loopingBtn.title = 'LOOPING STAGE: trava neste stage e repete infinitamente para farmar';
      }
    }
    syncLoopingBtn();
    loopingBtn.addEventListener('click', () => {
      state.loopingStage = !state.loopingStage;
      syncLoopingBtn();
      if (state.loopingStage) {
        addCombatLog(`\ud83d\udd04 LOOPING STAGE ATIVADO: Stage ${getActiveStage()} ser\u00e1 repetido indefinidamente.`, 'log-system');
      } else {
        addCombatLog(`\u27a1\ufe0f Progresso resumido: heroes avan\u00e7ar\u00e3o para o pr\u00f3ximo stage ap\u00f3s concluir.`, 'log-system');
      }
    });
  }

  // Main Tab Navigation
  document.querySelectorAll('.sidebar .nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      
      // Update sidebar nav UI
      document.querySelectorAll('.sidebar .nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update tab pane visibility
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      const targetPane = document.getElementById(`${tabId}-tab`);
      if (targetPane) targetPane.classList.add('active');
      
      // Render/Update specific tabs
      if (tabId === 'arena') {
        updateHUD();
      } else if (tabId === 'heroes') {
        renderHeroesTab();
      } else if (tabId === 'secret-shop') {
        const activeSubBtn = document.querySelector('.btn-sub-nav.active');
        const activeSub = activeSubBtn ? activeSubBtn.dataset.sub : 'shop-items';
        triggerSubNav(activeSub);
      } else if (tabId === 'rune-nexus') {
        renderRuneNexusTab();
      } else if (tabId === 'wiki') {
        renderWikiTab();
      } else if (tabId === 'forge') {
        renderForgeTab();
      }
    });
  });

  // Sub Tab Navigation: Hero Lineup (All Heroes / My Team)
  document.querySelectorAll('#heroes-tab .btn-sub-nav[data-heroes-sub]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#heroes-tab .btn-sub-nav[data-heroes-sub]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      heroesSubView = btn.dataset.heroesSub;
      teamSwapSlotIdx = null;
      renderHeroesTab();
    });
  });

  // Back button from hero details -> All Heroes grid
  const backBtn = document.getElementById('btn-back-to-grid');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      heroesSubView = 'hero-grid';
      document.querySelectorAll('#heroes-tab .btn-sub-nav[data-heroes-sub]').forEach(b => b.classList.remove('active'));
      const gridBtn = document.querySelector('#heroes-tab .btn-sub-nav[data-heroes-sub="hero-grid"]');
      if (gridBtn) gridBtn.classList.add('active');
      renderHeroesTab();
    });
  }

  // Hero grid search & attribute filter
  const heroSearchInput = document.getElementById('hero-search-input');
  if (heroSearchInput) {
    heroSearchInput.addEventListener('input', (e) => {
      heroGridSearch = e.target.value;
      renderHeroSelectGrid();
    });
  }
  document.querySelectorAll('.btn-hero-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-hero-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      heroGridFilter = btn.dataset.filter;
      renderHeroSelectGrid();
    });
  });

  // Sub Tab Navigation in Secret Shop
  document.querySelectorAll('#secret-shop-tab .btn-sub-nav').forEach(btn => {
    btn.addEventListener('click', () => {
      const subId = btn.dataset.sub;

      // Update subnav buttons UI
      document.querySelectorAll('#secret-shop-tab .btn-sub-nav').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      triggerSubNav(subId);
    });
  });

  // Sound settings
  const volSlider = document.getElementById('audio-volume');
  if (volSlider) {
    volSlider.addEventListener('input', (e) => {
      sfx.volume = parseFloat(e.target.value);
    });
  }
  const muteBtn = document.getElementById('btn-audio-toggle');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      sfx.muted = !sfx.muted;
      muteBtn.textContent = sfx.muted ? 'Unmute' : 'Mute';
    });
  }

  // Dota Coins Store / Premium cash triggers
  document.getElementById('btn-buy-common-chest').addEventListener('click', () => openTreasure('common'));
  document.getElementById('btn-buy-immortal-chest').addEventListener('click', () => openTreasure('immortal'));
  
  document.getElementById('btn-cash-topup').addEventListener('click', () => {
    state.dotaCoins += 5000;
    sfx.playCoin();
    addCombatLog("💰 Top-up: Added 🪙 5,000 Dota Coins!", "log-crit");
    updateHUD();
    renderDotaShopTab();
  });

  document.getElementById('btn-buy-dota-plus').addEventListener('click', () => {
    if (!state.dotaPlus && state.dotaCoins >= 10000) {
      state.dotaCoins -= 10000;
      state.dotaPlus = true;
      sfx.playLevelUp();
      addCombatLog("🌟 Dota Plus Activated! Enjoy permanent +20% Gold & XP, plus access to exclusive heroes!", "log-crit");
      updateHUD();
      renderDotaShopTab();
      renderHeroesTab();
    } else if (state.dotaPlus) {
      alert("Dota Plus is already active!");
    } else {
      alert("Insufficient Dota Coins!");
    }
  });

  document.getElementById('btn-buy-backpack').addEventListener('click', () => {
    const backpacksOwned = Math.round((state.stashCapacity - 24) / 24);
    const cost = getBackpackCost(backpacksOwned);
    if (backpacksOwned < MAX_BACKPACKS && state.dotaCoins >= cost) {
      state.dotaCoins -= cost;
      state.stashCapacity += 24;
      sfx.playLevelUp();
      addCombatLog(`🎒 New Backpack acquired! Stash capacity increased to ${state.stashCapacity} slots!`, "log-crit");
      updateHUD();
      renderDotaShopTab();
    } else if (backpacksOwned >= MAX_BACKPACKS) {
      alert("Maximum backpacks already owned!");
    } else {
      alert("Insufficient Dota Coins!");
    }
  });

  // Cashout modal (simulated PIX/Crypto — no real payment processing)
  let cashoutMethod = 'PIX';
  const cashoutModal = document.getElementById('cashout-modal');
  const cashoutAmountInput = document.getElementById('cashout-amount-input');
  const cashoutBrlVal = document.getElementById('cashout-brl-val');
  const COIN_TO_BRL_RATE = 5.00 / 1000; // 1000 coins = R$5,00

  function refreshCashoutModal() {
    document.getElementById('cashout-balance-val').textContent = `🪙 ${state.dotaCoins.toLocaleString()}`;
    const amt = Math.max(0, parseInt(cashoutAmountInput.value) || 0);
    cashoutBrlVal.textContent = `R$ ${(amt * COIN_TO_BRL_RATE).toFixed(2).replace('.', ',')}`;
  }

  document.getElementById('btn-open-cashout').addEventListener('click', () => {
    refreshCashoutModal();
    cashoutModal.style.display = 'flex';
  });
  document.getElementById('btn-cancel-cashout').addEventListener('click', () => {
    cashoutModal.style.display = 'none';
  });
  cashoutAmountInput.addEventListener('input', refreshCashoutModal);

  document.getElementById('cashout-method-pix').addEventListener('click', () => {
    cashoutMethod = 'PIX';
    document.getElementById('cashout-method-pix').classList.add('active');
    document.getElementById('cashout-method-crypto').classList.remove('active');
  });
  document.getElementById('cashout-method-crypto').addEventListener('click', () => {
    cashoutMethod = 'Crypto';
    document.getElementById('cashout-method-crypto').classList.add('active');
    document.getElementById('cashout-method-pix').classList.remove('active');
  });

  document.getElementById('btn-confirm-cashout').addEventListener('click', () => {
    const amt = Math.max(0, parseInt(cashoutAmountInput.value) || 0);
    if (amt < 1000) {
      alert("Saque mínimo: 1.000 Dota Coins.");
      return;
    }
    if (amt > state.dotaCoins) {
      alert("Saldo insuficiente de Dota Coins!");
      return;
    }
    state.dotaCoins -= amt;
    const brlAmount = (amt * COIN_TO_BRL_RATE).toFixed(2).replace('.', ',');
    sfx.playCoin();
    addCombatLog(`💸 [SIMULADO] Saque de 🪙 ${amt.toLocaleString()} via ${cashoutMethod} — R$ ${brlAmount} (nenhum valor real processado).`, "log-crit");
    cashoutModal.style.display = 'none';
    updateHUD();
    renderDotaShopTab();
  });

  document.getElementById('btn-buy-team-slot').addEventListener('click', () => {
    const cost = state.teamSize === 3 ? 3000 : 5000;
    if (state.teamSize < 5 && state.dotaCoins >= cost) {
      state.dotaCoins -= cost;
      state.teamSize++;
      sfx.playLevelUp();
      addCombatLog(`🚀 Team Slot Unlocked! Team size increased to ${state.teamSize}!`, "log-crit");
      validateStateStructure(); // recalculate active heroes and refresh
      updateHUD();
      renderDotaShopTab();
      renderBattlefieldUnits();
    } else if (state.teamSize >= 5) {
      alert("Max team size reached!");
    } else {
      alert("Insufficient Dota Coins!");
    }
  });

  // Sandbox Cheats bindings
  document.getElementById('cheat-add-gold').addEventListener('click', () => {
    state.gold += 100000;
    sfx.playCoin();
    addCombatLog("🔧 Cheat: Added 100,000 Gold!", "log-system");
    updateHUD();
  });
  document.getElementById('cheat-add-coins').addEventListener('click', () => {
    state.dotaCoins += 10000;
    sfx.playCoin();
    addCombatLog("🔧 Cheat: Added 10,000 Dota Coins!", "log-system");
    updateHUD();
    renderDotaShopTab();
  });
  document.getElementById('cheat-add-scrap').addEventListener('click', () => {
    state.shards += 500;
    state.essence += 100;
    sfx.playLevelUp();
    addCombatLog("🔧 Cheat: Added 500 Shards & 100 Essence!", "log-system");
    updateHUD();
  });
  document.getElementById('cheat-level-up').addEventListener('click', () => {
    activeHeroes.forEach(id => {
      const h = state.heroes[id];
      if (h.level > 0) {
        h.level += 5;
        h.skillPoints += 5;
        const stats = getHeroStats(id);
        if (stats) {
          h.currentHp = stats.maxHp;
          h.currentMana = stats.maxMana;
        }
      }
    });
    sfx.playLevelUp();
    addCombatLog("🔧 Cheat: Party Level +5!", "log-system");
    renderHeroesTab();
    updateHUD();
  });
  document.getElementById('cheat-spawn-boss').addEventListener('click', () => {
    const rank = getRankDetails(state.currentStage);
    state.currentStage = rank.maxStage;
    stageWaveCount = getStageWaveCount(state.currentStage);
    spawnWave(stageWaveCount - 1);
    addCombatLog(`🔧 Cheat: Spawned Rank Boss on stage ${state.currentStage}!`, "log-system");
  });
  document.getElementById('cheat-spawn-items').addEventListener('click', () => {
    const list = Object.keys(BASE_ITEMS_DB);
    for (let i = 0; i < 5; i++) {
      if (state.inventory.length < state.stashCapacity) {
        const itemLvl = Math.max(1, getRegionDetails(state.currentStage).lvl * 2);
        const forceRarity = ['rare', 'epic', 'legendary', 'mythic'][Math.floor(Math.random() * 4)];
        const inst = generateItem(itemLvl, forceRarity);
        state.inventory.push(inst);
      }
    }
    sfx.playRareDrop();
    addCombatLog("🔧 Cheat: Filled Stash with Rare+ items!", "log-system");
    const activeSubBtn = document.querySelector('.btn-sub-nav.active');
    const activeSub = activeSubBtn ? activeSubBtn.dataset.sub : 'shop-items';
    if (activeSub === 'shop-items') {
      renderShopTab();
    }
  });

  // Manual save and export bindings
  document.getElementById('btn-manual-save').addEventListener('click', () => {
    saveGame();
    addCombatLog("💾 Game saved successfully!", "log-system");
    alert("Game progress manually saved!");
  });
  document.getElementById('btn-export-save').addEventListener('click', () => {
    saveGame();
    try {
      const encoded = btoa(JSON.stringify(state));
      document.getElementById('save-string-box').value = encoded;
      addCombatLog("💾 Save code generated!", "log-system");
    } catch (e) {
      alert("Error generating save code.");
    }
  });
  document.getElementById('btn-import-save').addEventListener('click', () => {
    const code = document.getElementById('save-string-box').value.trim();
    if (!code) {
      alert("Please paste a save code first.");
      return;
    }
    try {
      const decoded = JSON.parse(atob(code));
      if (decoded.gold !== undefined && decoded.heroes !== undefined) {
        state = decoded;
        validateStateStructure();
        saveGame();
        location.reload();
      } else {
        alert("Invalid save code format.");
      }
    } catch (e) {
      alert("Failed to parse save code. Make sure it is a valid base64 string.");
    }
  });

  // Welcome modal close
  const welcomeModal = document.getElementById('welcome-modal');
  if (welcomeModal) {
    const closeBtn = welcomeModal.querySelector('.btn-recruit') || welcomeModal.querySelector('button');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        welcomeModal.style.display = 'none';
      });
    }
    // Close on overlay click
    welcomeModal.addEventListener('click', (e) => {
      if (e.target === welcomeModal) welcomeModal.style.display = 'none';
    });
  }
  // ─── Tactical Maneuvers ───────────────────────────────────────────
  document.getElementById('btn-maneuver-stack').addEventListener('click', () => {
    if (state.maneuvers.stackCd > 0) return;
    state.maneuvers.stackCd = 60;
    stackedCreepSpawned = true;
    addCombatLog('🌾 <span class="log-spell">Stack Camp!</span> A powerful camp has been stacked — stronger creep incoming!', 'log-spell');
    updateManeuverUI();
  });

  document.getElementById('btn-maneuver-pull').addEventListener('click', () => {
    if (state.maneuvers.pullCd > 0) return;
    state.maneuvers.pullCd = 60;
    stageTimer = 30.0;
    const healPct = 0.20;
    activeHeroes.forEach(id => {
      const stats = getHeroStats(id);
      if (stats && state.heroes[id].currentHp > 0) {
        state.heroes[id].currentHp = Math.min(stats.maxHp, state.heroes[id].currentHp + stats.maxHp * healPct);
      }
    });
    addCombatLog('🚜 <span class="log-spell">Lane Pulled!</span> Stage timer reset. Party restored 20% HP.', 'log-spell');
    updateManeuverUI();
    updateHUD();
  });

  document.getElementById('btn-maneuver-obs').addEventListener('click', () => {
    if (state.maneuvers.obsCd > 0) return;
    state.maneuvers.obsCd = 180;
    state.maneuvers.obsActive = 180;
    addCombatLog('👁️ <span class="log-loot">Observer Ward</span> placed! +25% item drop rate for 3 min.', 'log-loot');
    updateManeuverUI();
  });

  document.getElementById('btn-maneuver-sentry').addEventListener('click', () => {
    if (state.maneuvers.sentryCd > 0) return;
    state.maneuvers.sentryCd = 180;
    state.maneuvers.sentryActive = 180;
    addCombatLog('👁️ <span class="log-loot">Sentry Ward</span> placed! +25% shard drop rate for 3 min.', 'log-loot');
    updateManeuverUI();
  });

  // ─── PvP Arena Lobby Buttons ────────────────────────────────────
  const btnCreateLobby = document.getElementById('btn-create-lobby');
  if (btnCreateLobby) btnCreateLobby.addEventListener('click', createPvPLobby);

  const btnConfirmTeam = document.getElementById('btn-pvp-confirm-team');
  if (btnConfirmTeam) btnConfirmTeam.addEventListener('click', confirmPvPPlayerTeam);

  const btnStartDuel = document.getElementById('btn-pvp-start-duel');
  if (btnStartDuel) btnStartDuel.addEventListener('click', startPvPDuel);

  const btnLeaveLobby = document.getElementById('btn-pvp-leave-lobby');
  if (btnLeaveLobby) btnLeaveLobby.addEventListener('click', leavePvPLobby);

  const btnBackToLobby = document.getElementById('btn-pvp-back-to-lobby');
  if (btnBackToLobby) btnBackToLobby.addEventListener('click', leavePvPLobby);

  // ─── Formation Buttons ──────────────────────────────────────────
  const btnAutoForm = document.getElementById('btn-team-auto-form');
  if (btnAutoForm) btnAutoForm.addEventListener('click', () => {
    const sorted = [...state.unlockedHeroIds].sort((a, b) => {
      const lvlA = state.heroes[a] ? state.heroes[a].level : 1;
      const lvlB = state.heroes[b] ? state.heroes[b].level : 1;
      return lvlB - lvlA;
    });
    activeHeroes = sorted.slice(0, 4);
    renderHeroesTab();
    renderSynergies();
    updateHUD();
    addCombatLog("⚡ Auto Formation: Selected highest level heroes!", "log-system");
  });

  const btnResetTeam = document.getElementById('btn-team-reset');
  if (btnResetTeam) btnResetTeam.addEventListener('click', () => {
    activeHeroes = [];
    renderHeroesTab();
    renderSynergies();
    updateHUD();
    addCombatLog("🧹 Team formation reset.", "log-system");
  });

  const btnSaveTeam = document.getElementById('btn-team-save');
  if (btnSaveTeam) btnSaveTeam.addEventListener('click', () => {
    saveGame();
    addCombatLog("💾 Loadout saved successfully!", "log-system");
  });

  const btnDeployTeam = document.getElementById('btn-team-deploy');
  if (btnDeployTeam) btnDeployTeam.addEventListener('click', () => {
    switchMainTab('arena');
    addCombatLog("⚔️ Party deployed to Combat Arena!", "log-system");
  });

  renderPvPLeaderboard();
}

window.addEventListener('load', async () => {
  // Load dynamic databases from global variables loaded via script tags
  try {
    if (typeof HEROES_DATA !== 'undefined' && Object.keys(HEROES_DATA).length > 0) {
      HERO_TEMPLATES = HEROES_DATA;
      console.log("Loaded heroes database from JS variable:", Object.keys(HERO_TEMPLATES).length);
    } else {
      const heroesRes = await fetch('heroes_db.json');
      if (heroesRes.ok) {
        const heroesData = await heroesRes.json();
        if (heroesData && Object.keys(heroesData).length > 0) {
          HERO_TEMPLATES = heroesData;
          console.log("Loaded heroes database from vault:", Object.keys(HERO_TEMPLATES).length);
        }
      }
    }

    if (typeof ITEMS_DATA !== 'undefined' && Object.keys(ITEMS_DATA).length > 0) {
      BASE_ITEMS_DB = {};
      ARTIFACTS_DB = {};
      for (let id in ITEMS_DATA) {
        const it = ITEMS_DATA[id];
        if (it.slotType === 'artifact') {
          ARTIFACTS_DB[id] = it;
        } else {
          BASE_ITEMS_DB[id] = it;
        }
      }
      console.log("Loaded items database from JS variable:", Object.keys(ITEMS_DATA).length);
    } else {
      const itemsRes = await fetch('items_db.json');
      if (itemsRes.ok) {
        const itemsData = await itemsRes.json();
        if (itemsData && Object.keys(itemsData).length > 0) {
          BASE_ITEMS_DB = {};
          ARTIFACTS_DB = {};
          for (let id in itemsData) {
            const it = itemsData[id];
            if (it.slotType === 'artifact') {
              ARTIFACTS_DB[id] = it;
            } else {
              BASE_ITEMS_DB[id] = it;
            }
          }
          console.log("Loaded items database from vault:", Object.keys(itemsData).length);
        }
      }
    }
  } catch (e) {
    console.warn("Failed to load databases, using default fallbacks.", e);
  }

  loadSavedGame();
  
  // Custom prestige button hook
  document.getElementById('btn-trigger-prestige').addEventListener('click', triggerPrestigeReset);

  // Sound chimes settings
  sfx.muted = true;
  const audioToggleBtn = document.getElementById('btn-audio-toggle');
  if (audioToggleBtn) {
    audioToggleBtn.textContent = 'Unmute';
  }

  initUI();
  spawnWave(currentWaveIndex);
  renderPvPLockedArenaOverlay();
  renderHeroesTab();
  refreshNpcListings();
  
  setInterval(gameTick, 100);
  setInterval(saveGame, 10000);
  setInterval(tickManeuvers, 1000);
  setInterval(tickPvP, 1000);
  setInterval(tickForge, 1000);
});

// ─── Maneuver Tick (called every second) ─────────────────────────
function tickManeuvers() {
  const m = state.maneuvers;
  if (m.stackCd > 0)   m.stackCd   = Math.max(0, m.stackCd   - 1);
  if (m.pullCd > 0)    m.pullCd    = Math.max(0, m.pullCd    - 1);
  if (m.obsCd > 0)     m.obsCd     = Math.max(0, m.obsCd     - 1);
  if (m.sentryCd > 0)  m.sentryCd  = Math.max(0, m.sentryCd  - 1);
  if (m.obsActive > 0)    m.obsActive    = Math.max(0, m.obsActive    - 1);
  if (m.sentryActive > 0) m.sentryActive = Math.max(0, m.sentryActive - 1);
  updateManeuverUI();
}

function updateManeuverUI() {
  const m = state.maneuvers;
  const fmtCd = s => s > 0 ? `[${s}s]` : '';

  const btnStack   = document.getElementById('btn-maneuver-stack');
  const btnPull    = document.getElementById('btn-maneuver-pull');
  const btnObs     = document.getElementById('btn-maneuver-obs');
  const btnSentry  = document.getElementById('btn-maneuver-sentry');

  if (btnStack)  { btnStack.disabled  = m.stackCd  > 0; document.getElementById('maneuver-stack-cooldown').textContent  = fmtCd(Math.ceil(m.stackCd));  }
  if (btnPull)   { btnPull.disabled   = m.pullCd   > 0; document.getElementById('maneuver-pull-cooldown').textContent   = fmtCd(Math.ceil(m.pullCd));   }
  if (btnObs)    { btnObs.disabled    = m.obsCd    > 0; document.getElementById('maneuver-obs-cooldown').textContent    = fmtCd(Math.ceil(m.obsCd));    }
  if (btnSentry) { btnSentry.disabled = m.sentryCd > 0; document.getElementById('maneuver-sentry-cooldown').textContent = fmtCd(Math.ceil(m.sentryCd)); }

  const wardRow = document.getElementById('wards-status-row');
  if (wardRow) {
    wardRow.style.display = (m.obsActive > 0 || m.sentryActive > 0) ? 'flex' : 'none';
    document.getElementById('ward-obs-status').textContent    = m.obsActive    > 0 ? `👁️ OBS: ${Math.ceil(m.obsActive)}s`    : '👁️ OBS: --';
    document.getElementById('ward-sentry-status').textContent = m.sentryActive > 0 ? `👁️ SEN: ${Math.ceil(m.sentryActive)}s` : '👁️ SEN: --';
  }
}

// ─── PvP Arena Lobby ─────────────────────────────────────────────
let pvpLobby = {
  active: false,
  playerReady: false,
  oppReady: false,
  oppBot: null,
  oppPower: 0,
  oppTeam: []
};

function getTeamPower() {
  let teamPower = 0;
  activeHeroes.forEach(id => {
    const h = state.heroes[id];
    if (!h) return;
    let heroPower = h.level * 100;
    state.inventory.forEach(inst => {
      if (inst.equippedTo === id) {
        if (inst) heroPower += (inst.tier + 1) * (RARITIES.indexOf(inst.rarity) + 1) * 35;
      }
    });
    teamPower += heroPower;
  });
  return teamPower;
}

function createPvPLobby() {
  if (activeHeroes.length === 0) {
    addCombatLog('⚠️ No heroes in active lineup!', 'log-system');
    return;
  }

  // Pick a random bot
  const bot = PVP_BOTS[Math.floor(Math.random() * PVP_BOTS.length)];
  
  // Calculate power values
  const playerPower = getTeamPower();
  const oppPower = Math.round(bot.mmr * 2.8 + Math.random() * 150);

  // Generate a random team for the bot (3 unique heroes)
  const heroPool = ['sven', 'crystal_maiden', 'drow_ranger', 'axe', 'juggernaut', 'omniknight', 'windranger', 'shadow_fiend', 'vengeful_spirit', 'pugna', 'witch_doctor', 'lina'];
  const shuffled = heroPool.sort(() => 0.5 - Math.random());
  const oppTeam = [shuffled[0], shuffled[1], shuffled[2]];

  pvpLobby = {
    active: true,
    playerReady: false,
    oppReady: false,
    oppBot: bot,
    oppPower: oppPower,
    oppTeam: oppTeam
  };

  // Update UI Elements
  document.getElementById('pvp-create-lobby-card').style.display = 'none';
  document.getElementById('pvp-active-lobby-card').style.display = 'flex';
  document.getElementById('pvp-duel-result-card').style.display = 'none';

  // Fill details
  document.getElementById('pvp-lobby-player-power').textContent = playerPower.toLocaleString();
  document.getElementById('pvp-player-mmr-label').textContent = `${state.pvp.mmr} MMR`;
  
  document.getElementById('pvp-lobby-opp-name').textContent = bot.name;
  document.getElementById('pvp-lobby-opp-mmr').textContent = `${bot.mmr} MMR (${getPvPDivision(bot.mmr)})`;
  document.getElementById('pvp-lobby-opp-power').textContent = oppPower.toLocaleString();

  // Reset statuses
  const pReadyEl = document.getElementById('pvp-player-ready-status');
  pReadyEl.textContent = 'Aguardando...';
  pReadyEl.style.color = 'var(--dota-red)';

  const oReadyEl = document.getElementById('pvp-opp-ready-status');
  oReadyEl.textContent = 'Procurando oponente...';
  oReadyEl.style.color = 'var(--text-dark)';

  const btnConfirm = document.getElementById('btn-pvp-confirm-team');
  btnConfirm.disabled = false;
  btnConfirm.style.opacity = '1';
  btnConfirm.style.cursor = 'pointer';

  const btnStart = document.getElementById('btn-pvp-start-duel');
  btnStart.disabled = true;
  btnStart.style.opacity = '0.5';
  btnStart.style.cursor = 'not-allowed';

  addPvPLog(`[Lobby] 🏠 Saguão criado. Procurando pelo oponente ${bot.name}...`, 'log-system');

  // Opponent ready delay
  setTimeout(() => {
    if (!pvpLobby.active) return;
    pvpLobby.oppReady = true;
    oReadyEl.textContent = 'PRONTO';
    oReadyEl.style.color = 'var(--xp-green)';
    addPvPLog(`[Lobby] 🤝 Oponente ${bot.name} confirmou prontidão!`, 'log-spell');
    checkPvPLobbyReady();
  }, 1500);

  renderPvPLeaderboard();
}

function confirmPvPPlayerTeam() {
  if (!pvpLobby.active) return;
  pvpLobby.playerReady = true;

  const pReadyEl = document.getElementById('pvp-player-ready-status');
  pReadyEl.textContent = 'PRONTO';
  pReadyEl.style.color = 'var(--xp-green)';

  const btnConfirm = document.getElementById('btn-pvp-confirm-team');
  btnConfirm.disabled = true;
  btnConfirm.style.opacity = '0.5';
  btnConfirm.style.cursor = 'not-allowed';

  addPvPLog(`[Lobby] ⚔️ Você confirmou seu time para a batalha!`, 'log-spell');
  checkPvPLobbyReady();
}

function checkPvPLobbyReady() {
  if (pvpLobby.playerReady && pvpLobby.oppReady) {
    const btnStart = document.getElementById('btn-pvp-start-duel');
    btnStart.disabled = false;
    btnStart.style.opacity = '1';
    btnStart.style.cursor = 'pointer';
  }
}

function startPvPDuel() {
  if (!pvpLobby.active || !pvpLobby.playerReady || !pvpLobby.oppReady) return;

  const bot = pvpLobby.oppBot;
  const playerPower = getTeamPower();
  const oppPower = pvpLobby.oppPower;

  // Win chance formula
  const diff = state.pvp.mmr - bot.mmr;
  const powerBonus = (playerPower - oppPower) / 500; // Power difference adjustment
  const winChance = 1 / (1 + Math.exp(-(diff / 800 + powerBonus)));
  const playerWins = Math.random() < winChance;

  // Transition to Result Screen
  document.getElementById('pvp-active-lobby-card').style.display = 'none';
  const resultCard = document.getElementById('pvp-duel-result-card');
  resultCard.style.display = 'flex';

  const outcomeText = document.getElementById('pvp-duel-outcome-text');
  if (playerWins) {
    outcomeText.textContent = 'VITÓRIA';
    outcomeText.style.color = 'var(--xp-green)';
    const mmrGain = Math.round(15 + Math.random() * 10);
    state.pvp.mmr += mmrGain;
    state.pvp.wins++;
    addPvPLog(`[Duelo] ✅ Vitória contra <b>${bot.name}</b> (${bot.mmr} MMR). +${mmrGain} MMR → ${state.pvp.mmr}`, 'log-loot');
    sfx.playLevelUp && sfx.playLevelUp();
  } else {
    outcomeText.textContent = 'DERROTA';
    outcomeText.style.color = 'var(--dota-red)';
    const mmrLoss = Math.round(10 + Math.random() * 8);
    state.pvp.mmr = Math.max(0, state.pvp.mmr - mmrLoss);
    state.pvp.losses++;
    addPvPLog(`[Duelo] ❌ Defeat contra <b>${bot.name}</b> (${bot.mmr} MMR). -${mmrLoss} MMR → ${state.pvp.mmr}`, 'log-system');
  }

  // Rewards
  const shardsGain = playerWins ? 20 : 5;
  const coinsGain = playerWins ? 150 : 50;
  state.shards += shardsGain;
  state.dotaCoins += coinsGain;
  document.getElementById('pvp-duel-rewards-desc').innerHTML = `Recompensas ganhas: <span style="color:var(--xp-green);">+${shardsGain} Shards</span> | <span style="color:var(--primary-gold);">+${coinsGain} Dota Coins</span>`;

  // Render Revealed Teams
  // 1. Player Team
  const playerAvatars = document.getElementById('pvp-player-revealed-avatars');
  playerAvatars.innerHTML = '';
  activeHeroes.forEach(id => {
    const h = state.heroes[id];
    if (!h) return;
    const item = document.createElement('div');
    item.style.cssText = 'display:flex;flex-direction:column;align-items:center;background:rgba(0,0,0,0.4);border:1px solid var(--border-light);border-radius:4px;padding:4px;width:50px;';
    item.innerHTML = `
      <div style="font-size: 1.1rem;">${h.emoji || '👤'}</div>
      <div style="font-size: 0.6rem; color: var(--text-secondary); text-align: center; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width: 100%;" title="${h.name}">${h.name}</div>
    `;
    playerAvatars.appendChild(item);
  });

  // 2. Opponent Team
  const oppAvatars = document.getElementById('pvp-opp-revealed-avatars');
  oppAvatars.innerHTML = '';
  document.getElementById('pvp-opp-revealed-title').textContent = `TIME DE ${bot.name.toUpperCase()}`;
  pvpLobby.oppTeam.forEach(id => {
    const template = HERO_TEMPLATES[id] || { name: id, emoji: '👤' };
    const item = document.createElement('div');
    item.style.cssText = 'display:flex;flex-direction:column;align-items:center;background:rgba(0,0,0,0.4);border:1px solid var(--border-light);border-radius:4px;padding:4px;width:50px;';
    item.innerHTML = `
      <div style="font-size: 1.1rem;">${template.emoji || '👤'}</div>
      <div style="font-size: 0.6rem; color: var(--text-secondary); text-align: center; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width: 100%;" title="${template.name}">${template.name}</div>
    `;
    oppAvatars.appendChild(item);
  });

  renderPvPLeaderboard();
  updateHUD();
}

function leavePvPLobby() {
  pvpLobby.active = false;
  document.getElementById('pvp-create-lobby-card').style.display = 'flex';
  document.getElementById('pvp-active-lobby-card').style.display = 'none';
  document.getElementById('pvp-duel-result-card').style.display = 'none';
}

function tickPvP() {
  // Empty, lobby-based PVP is manual
}

function renderPvPLockedArenaOverlay() {
  const overlay = document.getElementById('pvp-lock-overlay');
  if (overlay) overlay.style.display = 'none';
}

function addPvPLog(msg, cls = 'log-system') {
  const feed = document.getElementById('pvp-feed-logs');
  if (!feed) return;
  const now = new Date();
  const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
  const entry = document.createElement('div');
  entry.className = `pvp-feed-log-entry ${cls}`;
  entry.innerHTML = `<span style="color:var(--text-dark);">[${ts}]</span> ${msg}`;
  feed.appendChild(entry);
  feed.scrollTop = feed.scrollHeight;
}

function renderPvPLeaderboard() {
  const tbody = document.querySelector('#pvp-leaderboard-table tbody');
  if (!tbody) return;

  // Merge bots + player
  const allPlayers = [
    ...PVP_BOTS.map(b => ({ name: b.name, mmr: b.mmr, isPlayer: false })),
    { name: 'YOU', mmr: state.pvp.mmr, isPlayer: true }
  ];
  allPlayers.sort((a, b) => b.mmr - a.mmr);

  tbody.innerHTML = '';
  allPlayers.forEach((p, i) => {
    const tr = document.createElement('tr');
    if (p.isPlayer) tr.className = 'player-row';
    tr.innerHTML = `
      <td style="font-family:'JetBrains Mono',monospace;font-weight:700;">#${i + 1}</td>
      <td>${p.isPlayer ? '⚡ ' : ''}${p.name}</td>
      <td style="font-family:'JetBrains Mono',monospace;">${p.mmr.toLocaleString()}</td>
      <td>${getPvPDivision(p.mmr)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ═══════════════════ RUNE NEXUS UI (Ancient Rune Web) ═══════════════════

let runePathFilter = 'all'; // 'all' or a path key
let selectedRuneNodeId = null;

function getRuneNodeStatus(nodeId) {
  const node = RUNE_NODES[nodeId];
  const lvl = runeLevel(nodeId);
  if (node.type === 'core') return 'core';
  if (lvl >= node.maxLevel) return 'maxed';
  if (lvl > 0) return 'partial';
  if (isRuneNodeAvailable(nodeId)) return 'available';
  return 'locked';
}

function renderRunePathFilters() {
  const row = document.getElementById('rune-path-filter-row');
  if (!row) return;

  let html = `<div class="rune-path-chip ${runePathFilter === 'all' ? 'active' : ''}" data-path="all" style="${runePathFilter === 'all' ? 'border-color:#fff;' : ''}">🌌 Todos</div>`;
  for (let key in RUNE_PATHS) {
    const p = RUNE_PATHS[key];
    const isActive = runePathFilter === key;
    html += `<div class="rune-path-chip ${isActive ? 'active' : ''}" data-path="${key}" style="${isActive ? `border-color:${p.color};background:${p.color}22;` : ''}">${p.icon} ${p.name}</div>`;
  }
  row.innerHTML = html;

  row.querySelectorAll('.rune-path-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      runePathFilter = chip.dataset.path;
      renderRunePathFilters();
      renderRuneConstellation();
    });
  });
}

function renderRuneConstellation() {
  const container = document.getElementById('rune-constellation-container');
  if (!container) return;

  const visibleNodeIds = Object.keys(RUNE_NODES).filter(id => {
    const node = RUNE_NODES[id];
    if (runePathFilter !== 'all' && node.path !== runePathFilter && node.path !== 'core') return false;
    // Hide locked nodes until their direct prereq has at least 1 level invested
    return getRuneNodeStatus(id) !== 'locked';
  });

  let svgLines = '';
  visibleNodeIds.forEach(id => {
    const node = RUNE_NODES[id];
    if (!node.prereq || !visibleNodeIds.includes(node.prereq)) return;
    const from = RUNE_NODES[node.prereq];
    const isLit = runeLevel(id) > 0;
    const pathColor = RUNE_PATHS[node.path] ? RUNE_PATHS[node.path].color : '#888';
    svgLines += `<line class="rune-connection-line ${isLit ? 'lit' : ''}" style="${isLit ? `stroke:${pathColor};color:${pathColor};` : ''}" x1="${from.pos.x}%" y1="${from.pos.y}%" x2="${node.pos.x}%" y2="${node.pos.y}%"></line>`;
  });

  // Core links (visual only, from center to each path's first node)
  if (runePathFilter === 'all') {
    RUNE_CORE_LINKS.forEach(id => {
      const node = RUNE_NODES[id];
      const isLit = runeLevel(id) > 0;
      const pathColor = RUNE_PATHS[node.path] ? RUNE_PATHS[node.path].color : '#888';
      svgLines += `<line class="rune-connection-line ${isLit ? 'lit' : ''}" style="${isLit ? `stroke:${pathColor};color:${pathColor};` : ''}" x1="50%" y1="50%" x2="${node.pos.x}%" y2="${node.pos.y}%"></line>`;
    });
  }

  let nodesHtml = '';
  visibleNodeIds.forEach(id => {
    const node = RUNE_NODES[id];
    const status = getRuneNodeStatus(id);
    const pathColor = RUNE_PATHS[node.path] ? RUNE_PATHS[node.path].color : '#e5c158';
    const lvl = runeLevel(id);
    const equipped = node.type === 'keystone' && isKeystoneEquipped(id);
    const glowColor = (status === 'partial' || status === 'maxed' || equipped) ? pathColor : '';

    nodesHtml += `
      <div class="rune-node type-${node.type} ${status} ${equipped ? 'equipped' : ''}" data-node-id="${id}" style="left:${node.pos.x}%; top:${node.pos.y}%; color:${glowColor};">
        <div class="rune-node-orb" style="${status === 'partial' || status === 'maxed' || equipped ? `border-color:${pathColor};` : ''}">
          <span>${node.type === 'core' ? '🌌' : (RUNE_PATHS[node.path] ? RUNE_PATHS[node.path].icon : '✨')}</span>
          ${node.maxLevel > 1 ? `<span class="rune-node-level-badge">${lvl}/${node.maxLevel}</span>` : ''}
        </div>
        <div class="rune-node-label">${node.name}</div>
      </div>
    `;
  });

  container.innerHTML = `
    <div class="rune-constellation-inner">
      <div class="rune-star-bg"></div>
      <svg class="rune-connections-svg">${svgLines}</svg>
      ${nodesHtml}
    </div>
  `;

  container.querySelectorAll('.rune-node').forEach(el => {
    el.addEventListener('click', () => {
      selectedRuneNodeId = el.dataset.nodeId;
      renderRuneDetailCard();
    });
  });
}

function renderRuneDetailCard() {
  const card = document.getElementById('rune-detail-card');
  if (!card) return;

  if (!selectedRuneNodeId || !RUNE_NODES[selectedRuneNodeId]) {
    card.style.display = 'none';
    return;
  }

  const node = RUNE_NODES[selectedRuneNodeId];
  if (node.type === 'core') {
    card.style.display = 'none';
    return;
  }

  const lvl = runeLevel(selectedRuneNodeId);
  const pathInfo = RUNE_PATHS[node.path] || { name: 'Core', color: '#e5c158' };
  const available = isRuneNodeAvailable(selectedRuneNodeId);
  const isMax = lvl >= node.maxLevel;
  const currencyIcon = { gold: '🪙', fragments: '🔷', sigils: '⚜️' }[node.currency];
  const currencyName = { gold: 'Gold', fragments: 'Fragments', sigils: 'Sigils' }[node.currency];

  let bodyHtml = `
    <div class="rune-detail-header">
      <div>
        <div class="rune-detail-title">${node.name}</div>
        <span class="rune-detail-path-tag" style="background:${pathInfo.color}22; color:${pathInfo.color};">${pathInfo.name}</span>
      </div>
      <button class="rune-detail-close" id="rune-detail-close-btn">×</button>
    </div>
    <div class="rune-detail-desc">${node.desc}</div>
  `;

  if (node.type === 'keystone') {
    const equipped = isKeystoneEquipped(selectedRuneNodeId);
    bodyHtml += `<div class="rune-detail-level-row"><span>Desbloqueada</span><span>${lvl > 0 ? 'SIM' : 'NÃO'}</span></div>`;
    if (lvl <= 0) {
      if (!available) {
        bodyHtml += `<div class="rune-detail-lock-note">Requer nó anterior e anel desbloqueado.</div>`;
      }
      bodyHtml += `<button class="rune-detail-buy-btn" id="rune-detail-action-btn" ${!available || getRuneCurrencyAmount('sigils') < node.baseCost ? 'disabled' : ''}>Desbloquear — ${currencyIcon} ${node.baseCost}</button>`;
    } else {
      bodyHtml += `<button class="rune-detail-equip-btn ${equipped ? 'is-equipped' : ''}" id="rune-detail-equip-btn">${equipped ? '✓ Equipada' : `Equipar (${state.equippedKeystones.length}/${MAX_EQUIPPED_KEYSTONES})`}</button>`;
    }
  } else if (node.type === 'unlock') {
    bodyHtml += `<div class="rune-detail-level-row"><span>Status</span><span>${lvl > 0 ? 'DESBLOQUEADO' : 'BLOQUEADO'}</span></div>`;
    if (lvl <= 0) {
      if (!available) bodyHtml += `<div class="rune-detail-lock-note">Requer nó anterior e anel desbloqueado.</div>`;
      const cost = getRuneNodeCost(selectedRuneNodeId, 1);
      bodyHtml += `<button class="rune-detail-buy-btn" id="rune-detail-action-btn" ${!available || getRuneCurrencyAmount(node.currency) < cost ? 'disabled' : ''}>Desbloquear — ${currencyIcon} ${cost.toLocaleString()}</button>`;
    }
  } else {
    // common / special leveled nodes
    bodyHtml += `<div class="rune-detail-level-row"><span>Nível</span><span>${lvl} / ${node.maxLevel}</span></div>`;
    if (node.effect && node.effect.stat) {
      const curTotal = (node.effect.perLevel * lvl * 100).toFixed(1);
      const nextTotal = (node.effect.perLevel * Math.min(lvl + 1, node.maxLevel) * 100).toFixed(1);
      bodyHtml += `<div class="rune-detail-effect-line">Atual: +${curTotal}% • Próximo nível: +${nextTotal}%</div>`;
    }
    if (node.effect && node.effect.mastery) {
      bodyHtml += `<div class="rune-detail-mastery-line">${isMax ? '✓ ' : ''}Maestria (nível máx): ${node.effect.mastery}</div>`;
    }
    if (!isMax) {
      if (!available) bodyHtml += `<div class="rune-detail-lock-note">Requer nó anterior e anel desbloqueado.</div>`;
      const cost = getRuneNodeCost(selectedRuneNodeId, lvl + 1);
      bodyHtml += `<button class="rune-detail-buy-btn" id="rune-detail-action-btn" ${!available || getRuneCurrencyAmount(node.currency) < cost ? 'disabled' : ''}>Melhorar — ${currencyIcon} ${cost.toLocaleString()} ${currencyName}</button>`;
    }
  }

  card.innerHTML = bodyHtml;
  card.style.display = 'flex';

  const closeBtn = document.getElementById('rune-detail-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', () => { selectedRuneNodeId = null; renderRuneDetailCard(); });

  const actionBtn = document.getElementById('rune-detail-action-btn');
  if (actionBtn) actionBtn.addEventListener('click', () => {
    if (node.type === 'keystone') {
      if (getRuneCurrencyAmount('sigils') >= node.baseCost) {
        buyRuneLevel(selectedRuneNodeId);
        renderRuneDetailCard();
      }
    } else {
      buyRuneLevel(selectedRuneNodeId);
      renderRuneDetailCard();
    }
  });

  const equipBtn = document.getElementById('rune-detail-equip-btn');
  if (equipBtn) equipBtn.addEventListener('click', () => {
    toggleEquipKeystone(selectedRuneNodeId);
    renderRuneDetailCard();
  });
}

function renderRuneNexusTab() {
  renderRunePathFilters();
  renderRuneConstellation();
  renderRuneDetailCard();
  updateHUD();
}

// ─── Wiki Tab Rendering ──────────────────────────────────────────
let wikiActiveHeroFilter = 'all';
let wikiActiveItemFilter = 'all';
let wikiItemSearchQuery = '';

function renderWikiStages() {
  const list = document.getElementById('wiki-stages-list');
  if (!list) return;
  
  const regionsList = [
    { id: 'safe_lane', name: 'Safe Lane (Arauto)', minStage: 1, maxStage: 12, lvl: 1, drops: ['iron_branch', 'slippers', 'circlet'], waveCount: '10 - 12 waves', description: 'Lugar inicial para heróis iniciantes. Estágio 1 e 2 tem 10 waves. Estágio 3 a 6 tem 11 waves. Estágio 7 a 12 tem 12 waves. Monstros por onda: 2-3.' },
    { id: 'small_camp', name: 'Small Camp (Guardião)', minStage: 13, maxStage: 27, lvl: 3, drops: ['gauntlets', 'mantle', 'ring_of_regen'], waveCount: '15 waves', description: 'Primeiro acampamento da selva (Guardião). Monstros por onda: 7.' },
    { id: 'mid_lane', name: 'Mid Lane (Cruzado)', minStage: 28, maxStage: 42, lvl: 5, drops: ['boots_of_speed', 'gloves', 'blades_of_attack'], waveCount: '18 waves', description: 'Rota do meio com ritmo de farm intermediário. Monstros por onda: 8.' },
    { id: 'medium_camp', name: 'Medium Camp (Arconte)', minStage: 43, maxStage: 57, lvl: 8, drops: ['ring_of_health', 'vitality_booster', 'morbid_mask', 'chainmail'], waveCount: '20 waves', description: 'Acampamento médio da selva. Monstros por onda: 9.' },
    { id: 'offlane', name: 'Offlane Lane (Lenda)', minStage: 58, maxStage: 72, lvl: 11, drops: ['ogre_axe', 'broadsword', 'helm_of_iron_will'], waveCount: '22 waves', description: 'Fronteira difícil com drops de itens de mid-game. Monstros por onda: 10.' },
    { id: 'hard_camp', name: 'Hard Camp (Ancestral)', minStage: 73, maxStage: 87, lvl: 15, drops: ['mithril_hammer', 'claymore', 'platemail'], waveCount: '25 waves', description: 'Acampamento difícil na floresta com monstros fortes. Monstros por onda: 11.' },
    { id: 'ancient_camp', name: 'Ancient Camp (Divino)', minStage: 88, maxStage: 102, lvl: 20, drops: ['sacred_relic', 'hyperstone', 'blink_dagger'], waveCount: '28 waves', description: 'Monstros ancestrais lendários com os melhores drops do jogo. Monstros por onda: 12.' },
    { id: 'roshan_pit', name: "Roshan's Pit (Imortal)", minStage: 103, maxStage: 103, lvl: 30, drops: ['aegis_of_the_immortal'], waveCount: '30 waves', description: 'A morada de Roshan. O maior desafio do jogo. Monstros por onda: 12.' }
  ];

  const getDropItemInfo = (itemId) => {
    if (typeof ITEMS_DATA !== 'undefined' && ITEMS_DATA[itemId]) return ITEMS_DATA[itemId];
    if (typeof BASE_ITEMS_DB !== 'undefined' && BASE_ITEMS_DB[itemId]) return BASE_ITEMS_DB[itemId];
    if (typeof ARTIFACTS_DB !== 'undefined' && ARTIFACTS_DB[itemId]) return ARTIFACTS_DB[itemId];
    return { name: itemId, emoji: '🔮', image: '' };
  };

  let html = '';
  regionsList.forEach(reg => {
    let rankDetails = getRankDetails(reg.minStage);
    let rankMult = { hp: 1.0, dmg: 1.0, reward: 1.0 };
    if (typeof getRankMultiplier === 'function') {
      rankMult = getRankMultiplier(rankDetails.index);
    }
    
    const stage = reg.minStage;
    const calcStats = (specialMult, rMult) => {
      const hp = Math.round((250 * Math.pow(1.20, stage - 1)) * specialMult * rMult.hp);
      const dmg = Math.round(14 * Math.pow(1.16, stage - 1) * rMult.dmg);
      const gold = Math.round(15 * Math.pow(1.12, stage - 1) * rMult.reward);
      const xp = Math.round(22 * Math.pow(1.12, stage - 1) * rMult.reward);
      return { hp, dmg, gold, xp };
    };

    const commonStats = calcStats(1.0, rankMult);
    const eliteStats = calcStats(2.0, rankMult);
    const bossStats = calcStats(3.5, rankMult);

    const monsters = [];
    let commonImg = 'assets/monsters/creep_common.png';
    if (reg.id === 'small_camp') commonImg = 'assets/monsters/creep_jungle_small.png';
    else if (reg.id === 'medium_camp') commonImg = 'assets/monsters/creep_jungle_medium.png';
    else if (reg.id === 'hard_camp') commonImg = 'assets/monsters/creep_jungle_hard.png';
    else if (reg.id === 'ancient_camp') commonImg = 'assets/monsters/creep_jungle_ancient.png';
    
    monsters.push({
      name: 'Creep Comum',
      type: 'Inimigo Comum',
      image: commonImg,
      sprite: '👹',
      hp: commonStats.hp,
      dmg: commonStats.dmg,
      gold: commonStats.gold,
      xp: commonStats.xp,
      classType: 'common'
    });

    if (reg.id !== 'roshan_pit') {
      monsters.push({
        name: 'Mini-Boss (Onda Final)',
        type: 'Inimigo Elite (Wave Final)',
        image: 'assets/monsters/creep_elite.png',
        sprite: '👿',
        hp: eliteStats.hp,
        dmg: eliteStats.dmg,
        gold: eliteStats.gold,
        xp: eliteStats.xp,
        classType: 'elite'
      });
      
      monsters.push({
        name: 'BOSS (Estágio Final)',
        type: 'Chefe de Patente (Estágio Final)',
        image: 'assets/monsters/boss_generic.png',
        sprite: '🐉',
        hp: bossStats.hp,
        dmg: bossStats.dmg,
        gold: bossStats.gold,
        xp: bossStats.xp,
        classType: 'boss'
      });
    } else {
      monsters.push({
        name: 'Roshan',
        type: 'Chefe Supremo',
        image: 'assets/monsters/boss_roshan.png',
        sprite: '🐉',
        hp: bossStats.hp,
        dmg: bossStats.dmg,
        gold: bossStats.gold,
        xp: bossStats.xp,
        classType: 'boss'
      });
    }

    const dropsHtml = reg.drops.map(dId => {
      const d = getDropItemInfo(dId);
      const img = d.image ? `<img src="${d.image}" alt="${d.name}">` : d.emoji;
      return `<div class="wiki-drop-item">${img} <span>${d.name}</span></div>`;
    }).join('');

    const monstersHtml = monsters.map(m => {
      const avatar = m.image ? `<img src="${m.image}" alt="${m.name}">` : m.sprite;
      const classLabel = m.classType === 'boss' ? 'boss' : (m.classType === 'elite' ? 'elite' : '');
      return `
        <div class="wiki-monster-card ${classLabel}">
          <div class="wiki-monster-avatar">${avatar}</div>
          <div class="wiki-monster-details">
            <div class="wiki-monster-name" title="${m.name}">${m.name}</div>
            <div class="wiki-monster-type">${m.type}</div>
            <div class="wiki-monster-stats-row">
              <span class="wiki-stat-hp">❤️ ${m.hp.toLocaleString()} HP</span>
              <span class="wiki-stat-dmg">⚔️ ${m.dmg.toLocaleString()} DMG</span>
            </div>
            <div class="wiki-monster-stats-row" style="color: var(--text-dark); font-size: 0.7rem;">
              <span>💰 +${m.gold} Gold</span>
              <span>⭐ +${m.xp} XP</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    html += `
      <div class="wiki-stage-card">
        <div class="wiki-stage-header">
          <div class="wiki-stage-title-row">
            <span class="wiki-stage-name">${reg.name}</span>
            <span class="wiki-stage-level">Estágios ${reg.minStage} - ${reg.maxStage}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 600;">Ondas: ${reg.waveCount}</div>
        </div>
        
        <div class="wiki-stage-details">
          <div class="wiki-stage-info-box">
            <div style="font-size: 0.85rem; line-height: 1.4; color: var(--text-secondary);">${reg.description}</div>
            <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px; margin-top: 5px;">
              <div class="wiki-stage-info-label" style="font-size: 0.8rem; font-weight: 700; margin-bottom: 5px;">CHANCES DE DROP (Comum: ~10% | Mini-Boss/BOSS: 100%):</div>
              <div class="wiki-drops-container">${dropsHtml}</div>
            </div>
          </div>
          
          <div class="wiki-stage-monsters-box">
            <div class="wiki-stage-monsters-title">ITENS E ATRIBUTOS DOS INIMIGOS (Escala base da zona)</div>
            <div class="wiki-monsters-grid">${monstersHtml}</div>
          </div>
        </div>
      </div>
    `;
  });

  list.innerHTML = html;
}

function renderWikiHeroes() {
  const list = document.getElementById('wiki-heroes-list');
  if (!list) return;

  let templates = HERO_TEMPLATES;
  if (typeof templates === 'undefined') return;

  let html = '';
  for (let key in templates) {
    const h = templates[key];
    
    if (wikiActiveHeroFilter !== 'all' && h.type !== wikiActiveHeroFilter) {
      continue;
    }

    const portrait = h.image ? `<img src="${h.image}" alt="${h.name}">` : h.emoji;
    
    const skillsHtml = h.skills.map(s => {
      return `
        <div class="wiki-hero-skill-item">
          <div class="wiki-hero-skill-name">
            <span>${s.name}</span>
            ${s.cost > 0 ? `<span class="wiki-hero-skill-cost">💧 ${s.cost} MP</span>` : '<span style="color:var(--text-dark)">Passiva</span>'}
          </div>
          <div class="wiki-hero-skill-desc">${s.desc}</div>
          ${s.cd > 0 ? `<div style="color: var(--text-dark); font-size: 0.65rem; margin-top: 2px;">Recarga: ${s.cd}s</div>` : ''}
        </div>
      `;
    }).join('');

    html += `
      <div class="wiki-hero-card ${h.type}">
        <div class="wiki-hero-header">
          <div class="wiki-hero-portrait">${portrait}</div>
          <div class="wiki-hero-title">
            <div class="wiki-hero-name">${h.name}</div>
            <div class="wiki-hero-attribute">${h.type}</div>
          </div>
        </div>
        
        <div class="wiki-hero-stats-grid">
          <div>❤️ Base HP: <strong>${h.baseHp}</strong></div>
          <div>💧 Base Mana: <strong>${h.baseMana}</strong></div>
          <div>⚔️ Base Dmg: <strong>${h.baseDamage}</strong></div>
          <div>📈 Str Growth: <strong>+${h.strGrowth}</strong></div>
          <div>📈 Agi Growth: <strong>+${h.agiGrowth}</strong></div>
          <div>📈 Int Growth: <strong>+${h.intGrowth}</strong></div>
        </div>
        
        <div class="wiki-hero-skills-title">HABILIDADES:</div>
        <div class="wiki-hero-skills-list">${skillsHtml}</div>
      </div>
    `;
  }

  list.innerHTML = html;
}

function renderWikiItems() {
  const list = document.getElementById('wiki-items-list');
  if (!list) return;

  let allItems = {};
  if (typeof ITEMS_DATA !== 'undefined' && Object.keys(ITEMS_DATA).length > 0) {
    allItems = ITEMS_DATA;
  } else {
    allItems = { ...BASE_ITEMS_DB, ...ARTIFACTS_DB };
  }

  let html = '';
  for (let key in allItems) {
    const item = allItems[key];

    if (wikiItemSearchQuery && !item.name.toLowerCase().includes(wikiItemSearchQuery.toLowerCase())) {
      continue;
    }

    if (wikiActiveItemFilter !== 'all' && item.rarity !== wikiActiveItemFilter) {
      continue;
    }

    const icon = item.image ? `<img src="${item.image}" alt="${item.name}">` : item.emoji;

    let statsLines = [];
    if (item.stats) {
      for (let sKey in item.stats) {
        let val = item.stats[sKey];
        if (sKey === 'stunChance' || sKey === 'bashChance' || sKey === 'evasion' || sKey === 'critChance' || sKey === 'lifesteal' || sKey === 'blockChance' || sKey === 'cleave') {
          statsLines.push(`+${(val * 100).toFixed(0)}% ${sKey}`);
        } else {
          statsLines.push(`+${val} ${sKey}`);
        }
      }
    }
    const statsStr = statsLines.length > 0 ? statsLines.join(', ') : '';

    html += `
      <div class="wiki-item-card ${item.rarity}">
        <div class="wiki-item-icon">${icon}</div>
        <div class="wiki-item-details">
          <div class="wiki-item-name">${item.name}</div>
          <div style="display: flex; gap: 8px; font-size: 0.7rem; text-transform: uppercase;">
            <span style="font-weight: 700; color: var(--rarity-${item.rarity});">${item.rarity}</span>
            <span style="color: var(--text-dark);">${item.slotType}</span>
          </div>
          <div class="wiki-item-cost">💰 ${item.cost > 0 ? item.cost.toLocaleString() : 'Drop-only'}</div>
          ${statsStr ? `<div style="font-size: 0.75rem; color: #2ecc71; font-weight: 600; margin-top: 3px;">${statsStr}</div>` : ''}
          <div class="wiki-item-desc" style="margin-top: 5px;">${item.desc || ''}</div>
        </div>
      </div>
    `;
  }

  list.innerHTML = html;
}

function renderWikiTab() {
  const container = document.querySelector('.wiki-container');
  if (!container) return;

  const navBtns = document.querySelectorAll('.wiki-nav-btn');
  navBtns.forEach(btn => {
    if (btn.dataset.listenerAdded) return;
    btn.dataset.listenerAdded = 'true';

    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.wiki-sub-pane').forEach(pane => pane.classList.remove('active'));
      
      const sub = btn.dataset.wikiSub;
      const targetPane = document.getElementById(`wikipane-${sub}`);
      if (targetPane) targetPane.classList.add('active');

      if (sub === 'stages') {
        renderWikiStages();
      } else if (sub === 'heroes') {
        renderWikiHeroes();
      } else if (sub === 'items') {
        renderWikiItems();
      }
    });
  });

  const filterBtns = document.querySelectorAll('.btn-wiki-filter');
  filterBtns.forEach(btn => {
    if (btn.dataset.listenerAdded) return;
    btn.dataset.listenerAdded = 'true';

    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      wikiActiveHeroFilter = btn.dataset.heroAttr;
      renderWikiHeroes();
    });
  });

  const itemFilterBtns = document.querySelectorAll('.btn-wiki-item-filter');
  itemFilterBtns.forEach(btn => {
    if (btn.dataset.listenerAdded) return;
    btn.dataset.listenerAdded = 'true';

    btn.addEventListener('click', () => {
      itemFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      wikiActiveItemFilter = btn.dataset.itemRarity;
      renderWikiItems();
    });
  });

  const searchInput = document.getElementById('wiki-item-search');
  if (searchInput && !searchInput.dataset.listenerAdded) {
    searchInput.dataset.listenerAdded = 'true';
    searchInput.addEventListener('input', (e) => {
      wikiItemSearchQuery = e.target.value;
      renderWikiItems();
    });
  }

  const activeBtn = document.querySelector('.wiki-nav-btn.active');
  const activeSub = activeBtn ? activeBtn.dataset.wikiSub : 'stages';
  if (activeSub === 'stages') {
    renderWikiStages();
  } else if (activeSub === 'heroes') {
    renderWikiHeroes();
  } else if (activeSub === 'items') {
    renderWikiItems();
  }
}


