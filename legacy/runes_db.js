// Ancient Rune Web - Talent Tree Database
// Node types: 'common' (5 levels), 'special' (3 levels), 'unlock' (1 level), 'keystone' (1 level, equip-limited)
//
// Cost formula for leveled nodes: cost(level) = baseCost * costMult ^ (level-1)
// currency: 'gold' | 'fragments' | 'sigils'
//
// Position coordinates are in an abstract 0-100 grid used to lay out the constellation SVG.

const RUNE_PATHS = {
  war:        { name: 'War',        color: '#ff3344', icon: '⚔️', desc: 'Dano e velocidade' },
  survival:   { name: 'Survival',   color: '#2ecc71', icon: '❤️', desc: 'Resistência' },
  fortune:    { name: 'Fortune',    color: '#e5c158', icon: '💰', desc: 'Drops e ouro' },
  wisdom:     { name: 'Wisdom',     color: '#3498db', icon: '📖', desc: 'Experiência' },
  formation:  { name: 'Formation',  color: '#9b59b6', icon: '🛡️', desc: 'Estratégia da equipe' },
  automation: { name: 'Automation', color: '#e67e22', icon: '⚙️', desc: 'Qualidade de vida' }
};

// Ring gating: minimum total invested levels (across whole tree) to unlock nodes in that ring.
// Ring 3 additionally requires Roshan defeated; Ring 4 requires Prestige triggered at least once.
const RUNE_RINGS = {
  1: { name: 'Apprentice Runes', minInvested: 0,  requiresRoshan: false, requiresPrestige: false },
  2: { name: 'Heroic Runes',     minInvested: 15, requiresRoshan: false, requiresPrestige: false },
  3: { name: 'Ancient Runes',    minInvested: 40, requiresRoshan: true,  requiresPrestige: false },
  4: { name: 'Divine Runes',     minInvested: 70, requiresRoshan: true,  requiresPrestige: true  }
};

// Geometric cost curve helper, exported for reuse by game.js
function runeLevelCost(baseCost, level, mult = 2.25) {
  return Math.round(baseCost * Math.pow(mult, level - 1));
}

// Each node:
// id, path, ring, type, name, desc, maxLevel, baseCost, currency, prereq (node id or null), pos {x,y}
// effect: { stat, perLevel, mastery } describing what a level grants (interpreted by game.js)
const RUNE_NODES = {

  // ══════════════════════ WAR ══════════════════════
  war_damage: {
    id: 'war_damage', path: 'war', ring: 1, type: 'common', maxLevel: 5,
    name: 'Dano', desc: 'Aumenta o dano físico e mágico da equipe.',
    baseCost: 300, currency: 'gold', prereq: null, pos: { x: 50, y: 8 },
    effect: { stat: 'dmgPct', perLevel: 0.015, mastery: 'Chefes: +3% de dano adicional.' }
  },
  war_attackspeed: {
    id: 'war_attackspeed', path: 'war', ring: 1, type: 'common', maxLevel: 5,
    name: 'Velocidade de Ataque', desc: 'Aumenta a velocidade de ataque da equipe.',
    baseCost: 500, currency: 'gold', prereq: 'war_damage', pos: { x: 46, y: 16 },
    effect: { stat: 'attackSpeedPct', perLevel: 0.008, mastery: '+5% de velocidade de ataque contra chefes.' }
  },
  war_critchance: {
    id: 'war_critchance', path: 'war', ring: 2, type: 'common', maxLevel: 5,
    name: 'Chance Crítica', desc: 'Aumenta a chance de acerto crítico.',
    baseCost: 5000, currency: 'gold', prereq: 'war_attackspeed', pos: { x: 38, y: 24 },
    effect: { stat: 'critChancePct', perLevel: 0.003, mastery: '+5% de dano crítico adicional.' }
  },
  war_skilldmg: {
    id: 'war_skilldmg', path: 'war', ring: 2, type: 'common', maxLevel: 5,
    name: 'Dano de Habilidade', desc: 'Aumenta o dano de todas as habilidades.',
    baseCost: 5000, currency: 'gold', prereq: 'war_attackspeed', pos: { x: 54, y: 24 },
    effect: { stat: 'spellDmgPct', perLevel: 0.02, mastery: '-8% de custo de mana das habilidades.' }
  },
  war_critdmg: {
    id: 'war_critdmg', path: 'war', ring: 2, type: 'special', maxLevel: 3,
    name: 'Dano Crítico', desc: 'Aumenta o multiplicador de dano crítico.',
    baseCost: 8000, currency: 'fragments', prereq: 'war_critchance', pos: { x: 30, y: 32 },
    effect: { stat: 'critMultPct', perLevel: 0.05, mastery: 'Críticos têm 10% de chance de atordoar por 0.5s.' }
  },
  war_cdr: {
    id: 'war_cdr', path: 'war', ring: 2, type: 'special', maxLevel: 3,
    name: 'Redução de Recarga', desc: 'Reduz o cooldown das habilidades.',
    baseCost: 8000, currency: 'fragments', prereq: 'war_skilldmg', pos: { x: 62, y: 32 },
    effect: { stat: 'cdrPct', perLevel: 0.03, mastery: 'Primeira habilidade da batalha não gasta mana.' }
  },
  war_bossdmg: {
    id: 'war_bossdmg', path: 'war', ring: 3, type: 'special', maxLevel: 3,
    name: 'Dano contra Chefes', desc: 'Aumenta o dano causado contra chefes e elites.',
    baseCost: 15000, currency: 'fragments', prereq: 'war_critdmg', pos: { x: 26, y: 40 },
    effect: { stat: 'bossDmgPct', perLevel: 0.03, mastery: 'Execução automática em chefes abaixo de 5% HP.' }
  },
  war_doubleattack: {
    id: 'war_doubleattack', path: 'war', ring: 3, type: 'special', maxLevel: 3,
    name: 'Ataque Duplo', desc: 'Chance de desferir um segundo ataque instantâneo.',
    baseCost: 15000, currency: 'fragments', prereq: 'war_cdr', pos: { x: 66, y: 40 },
    effect: { stat: 'doubleAttackChance', perLevel: 0.025, mastery: 'Segundo ataque sempre acerta crítico.' }
  },
  war_keystone_bloodlust: {
    id: 'war_keystone_bloodlust', path: 'war', ring: 3, type: 'keystone', maxLevel: 1,
    name: 'Bloodlust', desc: 'Quando um herói fica abaixo de 50% de HP: +35% velocidade de ataque, +15% roubo de vida.',
    baseCost: 40, currency: 'sigils', prereq: 'war_bossdmg', pos: { x: 40, y: 50 },
    effect: { keystone: 'bloodlust' }
  },
  war_keystone_arcane_echo: {
    id: 'war_keystone_arcane_echo', path: 'war', ring: 3, type: 'keystone', maxLevel: 1,
    name: 'Arcane Echo', desc: 'Habilidades têm 15% de chance de serem lançadas novamente. Penalidade: -10% de dano básico.',
    baseCost: 40, currency: 'sigils', prereq: 'war_bossdmg', pos: { x: 50, y: 50 },
    effect: { keystone: 'arcane_echo' }
  },
  war_keystone_executioner: {
    id: 'war_keystone_executioner', path: 'war', ring: 3, type: 'keystone', maxLevel: 1,
    name: 'Executioner', desc: 'Inimigos abaixo de 20% de HP recebem 40% mais dano.',
    baseCost: 40, currency: 'sigils', prereq: 'war_doubleattack', pos: { x: 60, y: 50 },
    effect: { keystone: 'executioner' }
  },

  // ══════════════════════ SURVIVAL ══════════════════════
  surv_health: {
    id: 'surv_health', path: 'survival', ring: 1, type: 'common', maxLevel: 5,
    name: 'Vida Máxima', desc: 'Aumenta a vida máxima da equipe.',
    baseCost: 300, currency: 'gold', prereq: null, pos: { x: 78, y: 8 },
    effect: { stat: 'hpPct', perLevel: 0.02, mastery: 'Início de batalha concede escudo de 3% da vida máxima.' }
  },
  surv_armor: {
    id: 'surv_armor', path: 'survival', ring: 1, type: 'common', maxLevel: 5,
    name: 'Armadura', desc: 'Aumenta a armadura da equipe.',
    baseCost: 500, currency: 'gold', prereq: 'surv_health', pos: { x: 74, y: 16 },
    effect: { stat: 'armorPct', perLevel: 0.015, mastery: '+5% de bloqueio de dano físico.' }
  },
  surv_regen: {
    id: 'surv_regen', path: 'survival', ring: 2, type: 'common', maxLevel: 5,
    name: 'Regeneração', desc: 'Aumenta a regeneração de vida por segundo.',
    baseCost: 5000, currency: 'gold', prereq: 'surv_armor', pos: { x: 66, y: 24 },
    effect: { stat: 'hpRegenPct', perLevel: 0.02, mastery: 'Fora de combate, regen é triplicada.' }
  },
  surv_magicres: {
    id: 'surv_magicres', path: 'survival', ring: 2, type: 'common', maxLevel: 5,
    name: 'Resistência Mágica', desc: 'Aumenta a resistência a dano mágico.',
    baseCost: 5000, currency: 'gold', prereq: 'surv_armor', pos: { x: 82, y: 24 },
    effect: { stat: 'magicResPct', perLevel: 0.015, mastery: 'Imunidade a stuns por 1s ao cair abaixo de 15% HP (1x por batalha).' }
  },
  surv_lifesteal: {
    id: 'surv_lifesteal', path: 'survival', ring: 2, type: 'special', maxLevel: 3,
    name: 'Roubo de Vida', desc: 'Concede roubo de vida em ataques básicos.',
    baseCost: 8000, currency: 'fragments', prereq: 'surv_regen', pos: { x: 62, y: 32 },
    effect: { stat: 'lifestealPct', perLevel: 0.004, mastery: 'Roubo de vida também cura o aliado com menor HP.' }
  },
  surv_shields: {
    id: 'surv_shields', path: 'survival', ring: 2, type: 'special', maxLevel: 3,
    name: 'Escudos Recebidos', desc: 'Aumenta a força de escudos e efeitos de proteção.',
    baseCost: 8000, currency: 'fragments', prereq: 'surv_magicres', pos: { x: 86, y: 32 },
    effect: { stat: 'shieldPct', perLevel: 0.03, mastery: 'Escudos absorvem 15% a mais de dano.' }
  },
  surv_secondchance: {
    id: 'surv_secondchance', path: 'survival', ring: 3, type: 'unlock', maxLevel: 1,
    name: 'Segunda Chance', desc: 'Uma vez por batalha, sobreviver a um golpe fatal com 1 HP.',
    baseCost: 12000, currency: 'fragments', prereq: 'surv_lifesteal', pos: { x: 66, y: 40 },
    effect: { unlock: 'second_chance' }
  },
  surv_keystone_lone: {
    id: 'surv_keystone_lone', path: 'survival', ring: 3, type: 'keystone', maxLevel: 1,
    name: 'Lone Champion', desc: 'Quando somente um herói está na equipe: +60% de dano, +50% de vida, +25% de velocidade.',
    baseCost: 40, currency: 'sigils', prereq: 'surv_secondchance', pos: { x: 74, y: 50 },
    effect: { keystone: 'lone_champion' }
  },

  // ══════════════════════ FORTUNE ══════════════════════
  fort_creepgold: {
    id: 'fort_creepgold', path: 'fortune', ring: 1, type: 'common', maxLevel: 5,
    name: 'Ouro de Creeps', desc: 'Aumenta o ouro recebido de inimigos comuns.',
    baseCost: 300, currency: 'gold', prereq: null, pos: { x: 8, y: 8 },
    effect: { stat: 'goldCreepPct', perLevel: 0.03, mastery: '+5% de chance de ouro em dobro.' }
  },
  fort_bossgold: {
    id: 'fort_bossgold', path: 'fortune', ring: 1, type: 'common', maxLevel: 5,
    name: 'Ouro de Chefes', desc: 'Aumenta o ouro recebido ao derrotar chefes.',
    baseCost: 500, currency: 'gold', prereq: 'fort_creepgold', pos: { x: 12, y: 16 },
    effect: { stat: 'goldBossPct', perLevel: 0.04, mastery: 'Chefes têm 5% de chance de entregar Fragmentos extras.' }
  },
  fort_sellvalue: {
    id: 'fort_sellvalue', path: 'fortune', ring: 2, type: 'common', maxLevel: 5,
    name: 'Valor de Venda', desc: 'Aumenta o ouro recebido ao vender itens.',
    baseCost: 5000, currency: 'gold', prereq: 'fort_bossgold', pos: { x: 6, y: 24 },
    effect: { stat: 'sellValuePct', perLevel: 0.02, mastery: 'Vendas em massa concedem +10% adicional.' }
  },
  fort_dropchance: {
    id: 'fort_dropchance', path: 'fortune', ring: 2, type: 'common', maxLevel: 5,
    name: 'Chance de Equipamento', desc: 'Aumenta a chance relativa de itens caírem.',
    baseCost: 5000, currency: 'gold', prereq: 'fort_bossgold', pos: { x: 20, y: 24 },
    effect: { stat: 'dropChanceRelPct', perLevel: 0.02, mastery: 'A cada 30 chefes sem Épico, o próximo garante Épico+.' }
  },
  fort_rarityup: {
    id: 'fort_rarityup', path: 'fortune', ring: 2, type: 'special', maxLevel: 3,
    name: 'Treasure Hunter', desc: 'Itens encontrados têm mais chance de ser Raros ou superiores.',
    baseCost: 8000, currency: 'fragments', prereq: 'fort_dropchance', pos: { x: 24, y: 32 },
    effect: { stat: 'rarityUpRelPct', perLevel: 0.025, mastery: '+1 nível mínimo garantido de raridade.' }
  },
  fort_masterwork: {
    id: 'fort_masterwork', path: 'fortune', ring: 2, type: 'special', maxLevel: 3,
    name: 'Masterwork', desc: 'Chance do item possuir um atributo (modificador) adicional.',
    baseCost: 8000, currency: 'fragments', prereq: 'fort_dropchance', pos: { x: 14, y: 32 },
    effect: { stat: 'masterworkChance', perLevel: 0.017, mastery: 'Atributo extra garantido em itens Lendários+.' }
  },
  fort_materials: {
    id: 'fort_materials', path: 'fortune', ring: 2, type: 'special', maxLevel: 3,
    name: 'Materiais ao Desmontar', desc: 'Aumenta materiais/essência recebidos ao desmontar itens.',
    baseCost: 8000, currency: 'fragments', prereq: 'fort_sellvalue', pos: { x: 4, y: 32 },
    effect: { stat: 'salvageMaterialsPct', perLevel: 0.03, mastery: '10% de chance de não consumir o item ao desmontar.' }
  },
  fort_pity: {
    id: 'fort_pity', path: 'fortune', ring: 3, type: 'unlock', maxLevel: 1,
    name: 'Bad Luck Protection', desc: 'Cada chefe sem Épico aumenta a chance no próximo. Reinicia ao achar Épico+.',
    baseCost: 12000, currency: 'fragments', prereq: 'fort_rarityup', pos: { x: 18, y: 40 },
    effect: { unlock: 'pity_boost' }
  },
  fort_keystone_greed: {
    id: 'fort_keystone_greed', path: 'fortune', ring: 3, type: 'keystone', maxLevel: 1,
    name: 'Greed', desc: '+50% de quantidade de drops, -20% de qualidade média dos itens.',
    baseCost: 40, currency: 'sigils', prereq: 'fort_pity', pos: { x: 10, y: 50 },
    effect: { keystone: 'greed' }
  },
  fort_keystone_seeker: {
    id: 'fort_keystone_seeker', path: 'fortune', ring: 3, type: 'keystone', maxLevel: 1,
    name: 'Treasure Seeker', desc: '-30% de quantidade de drops, +25% de chance relativa de itens Épicos+.',
    baseCost: 40, currency: 'sigils', prereq: 'fort_pity', pos: { x: 22, y: 50 },
    effect: { keystone: 'treasure_seeker' }
  },
  fort_keystone_blacksmith: {
    id: 'fort_keystone_blacksmith', path: 'fortune', ring: 3, type: 'keystone', maxLevel: 1,
    name: "Blacksmith's Favor", desc: 'Itens são mais fáceis de melhorar, mas fornecem menos ouro ao vender.',
    baseCost: 40, currency: 'sigils', prereq: 'fort_materials', pos: { x: 6, y: 50 },
    effect: { keystone: 'blacksmiths_favor' }
  },

  // ══════════════════════ WISDOM ══════════════════════
  wis_heroxp: {
    id: 'wis_heroxp', path: 'wisdom', ring: 1, type: 'common', maxLevel: 5,
    name: 'Experiência dos Heróis', desc: 'Aumenta a experiência ganha pelos heróis.',
    baseCost: 300, currency: 'gold', prereq: null, pos: { x: 22, y: 8 },
    effect: { stat: 'heroXpPct', perLevel: 0.03, mastery: 'Chance de XP em dobro em kills de elite.' }
  },
  wis_skillxp: {
    id: 'wis_skillxp', path: 'wisdom', ring: 1, type: 'common', maxLevel: 5,
    name: 'Experiência de Domínio', desc: 'Acelera o ganho de pontos de habilidade.',
    baseCost: 500, currency: 'gold', prereq: 'wis_heroxp', pos: { x: 26, y: 16 },
    effect: { stat: 'masteryXpPct', perLevel: 0.02, mastery: '5% de chance de ganhar 2 pontos de habilidade ao subir de nível.' }
  },
  wis_offlinecap: {
    id: 'wis_offlinecap', path: 'wisdom', ring: 2, type: 'common', maxLevel: 5,
    name: 'Limite de Progresso Offline', desc: 'Aumenta o tempo máximo de progresso offline.',
    baseCost: 5000, currency: 'gold', prereq: 'wis_skillxp', pos: { x: 34, y: 24 },
    effect: { stat: 'offlineCapMinutes', perLevel: 30, mastery: 'Limite fixo estendido para 24h.' }
  },
  wis_offlinereward: {
    id: 'wis_offlinereward', path: 'wisdom', ring: 2, type: 'common', maxLevel: 5,
    name: 'Recompensas Offline', desc: 'Aumenta o ouro e XP ganhos durante o tempo offline.',
    baseCost: 5000, currency: 'gold', prereq: 'wis_skillxp', pos: { x: 18, y: 24 },
    effect: { stat: 'offlineRewardPct', perLevel: 0.03, mastery: 'Chance de item garantido ao voltar (se offline > 4h).' }
  },
  wis_shared: {
    id: 'wis_shared', path: 'wisdom', ring: 2, type: 'special', maxLevel: 3,
    name: 'Shared Knowledge', desc: 'Heróis fora da equipe ativa recebem uma fração da XP ganha.',
    baseCost: 8000, currency: 'fragments', prereq: 'wis_offlinereward', pos: { x: 14, y: 32 },
    effect: { stat: 'sharedXpPct', perLevel: 0.083, mastery: 'Fração compartilhada dobrada por 1 batalha após level up.' }
  },
  wis_catchup: {
    id: 'wis_catchup', path: 'wisdom', ring: 2, type: 'special', maxLevel: 3,
    name: 'Catch-Up Training', desc: 'Heróis abaixo do maior nível da conta recebem XP extra.',
    baseCost: 8000, currency: 'fragments', prereq: 'wis_offlinecap', pos: { x: 38, y: 32 },
    effect: { stat: 'catchUpXpPct', perLevel: 0.11, mastery: 'Heróis em reserva também se beneficiam integralmente.' }
  },
  wis_ancientmemory: {
    id: 'wis_ancientmemory', path: 'wisdom', ring: 3, type: 'unlock', maxLevel: 1,
    name: 'Ancient Memory', desc: 'Após Prestige, heróis começam em um nível superior.',
    baseCost: 12000, currency: 'fragments', prereq: 'wis_shared', pos: { x: 18, y: 40 },
    effect: { unlock: 'ancient_memory' }
  },

  // ══════════════════════ FORMATION ══════════════════════
  form_tactical: {
    id: 'form_tactical', path: 'formation', ring: 1, type: 'unlock', maxLevel: 1,
    name: 'Tactical Positions', desc: 'Libera posicionamento individual: Frontline, Middle, Backline.',
    baseCost: 2000, currency: 'gold', prereq: null, pos: { x: 92, y: 8 },
    effect: { unlock: 'tactical_positions' }
  },
  form_battlecommands: {
    id: 'form_battlecommands', path: 'formation', ring: 1, type: 'unlock', maxLevel: 1,
    name: 'Battle Commands', desc: 'Libera configuração de comportamento de habilidades e alvo prioritário.',
    baseCost: 3000, currency: 'gold', prereq: 'form_tactical', pos: { x: 92, y: 16 },
    effect: { unlock: 'battle_commands' }
  },
  form_dmgres: {
    id: 'form_dmgres', path: 'formation', ring: 2, type: 'common', maxLevel: 5,
    name: 'Coordenação Tática', desc: 'Bonus de dano e resistência por posicionamento correto.',
    baseCost: 5000, currency: 'gold', prereq: 'form_battlecommands', pos: { x: 96, y: 24 },
    effect: { stat: 'formationSynergyPct', perLevel: 0.015, mastery: '+5% adicional quando todas as posições estão preenchidas.' }
  },
  form_supportslot: {
    id: 'form_supportslot', path: 'formation', ring: 2, type: 'unlock', maxLevel: 1,
    name: 'Support Slot', desc: 'Libera um slot de suporte que fornece passiva, habilidade periódica e bonus à equipe.',
    baseCost: 10000, currency: 'fragments', prereq: 'form_dmgres', pos: { x: 90, y: 32 },
    effect: { unlock: 'support_slot' }
  },
  form_reservehero: {
    id: 'form_reservehero', path: 'formation', ring: 2, type: 'unlock', maxLevel: 1,
    name: 'Reserve Hero', desc: 'Libera um quarto herói na reserva. Entra quando um integrante morre.',
    baseCost: 10000, currency: 'fragments', prereq: 'form_dmgres', pos: { x: 98, y: 32 },
    effect: { unlock: 'reserve_hero' }
  },
  form_keystone_trinity: {
    id: 'form_keystone_trinity', path: 'formation', ring: 3, type: 'keystone', maxLevel: 1,
    name: 'Perfect Trinity', desc: 'Com 1 Tank + 1 Support + 1 Carry: +15% dano, +15% resistência, +10% recarga de mana.',
    baseCost: 40, currency: 'sigils', prereq: 'form_supportslot', pos: { x: 90, y: 40 },
    effect: { keystone: 'perfect_trinity' }
  },
  form_keystone_glasscannon: {
    id: 'form_keystone_glasscannon', path: 'formation', ring: 3, type: 'keystone', maxLevel: 1,
    name: 'Glass Cannon Party', desc: '+40% de dano para toda a equipe, -25% de vida máxima.',
    baseCost: 40, currency: 'sigils', prereq: 'form_reservehero', pos: { x: 98, y: 40 },
    effect: { keystone: 'glass_cannon' }
  },

  // ══════════════════════ AUTOMATION ══════════════════════
  auto_progress: {
    id: 'auto_progress', path: 'automation', ring: 1, type: 'unlock', maxLevel: 1,
    name: 'Auto Progress', desc: 'Ao derrotar um estágio, avançar automaticamente para o próximo.',
    baseCost: 2000, currency: 'gold', prereq: null, pos: { x: 64, y: 8 },
    effect: { unlock: 'auto_progress' }
  },
  auto_retreat: {
    id: 'auto_retreat', path: 'automation', ring: 1, type: 'unlock', maxLevel: 1,
    name: 'Smart Retreat', desc: 'Após três derrotas consecutivas, volta ao estágio de farm mais eficiente.',
    baseCost: 3000, currency: 'gold', prereq: 'auto_progress', pos: { x: 60, y: 16 },
    effect: { unlock: 'smart_retreat' }
  },
  auto_salvage: {
    id: 'auto_salvage', path: 'automation', ring: 2, type: 'unlock', maxLevel: 1,
    name: 'Auto Salvage', desc: 'Desmonta automaticamente itens Comuns/Incomuns ou abaixo de um nível.',
    baseCost: 6000, currency: 'gold', prereq: 'auto_retreat', pos: { x: 56, y: 24 },
    effect: { unlock: 'auto_salvage' }
  },
  auto_camproutine: {
    id: 'auto_camproutine', path: 'automation', ring: 2, type: 'unlock', maxLevel: 1,
    name: 'Camp Routine', desc: 'Farma um camp até atingir um objetivo, então troca automaticamente.',
    baseCost: 10000, currency: 'fragments', prereq: 'auto_salvage', pos: { x: 52, y: 32 },
    effect: { unlock: 'camp_routine' }
  },
  auto_bossretry: {
    id: 'auto_bossretry', path: 'automation', ring: 2, type: 'unlock', maxLevel: 1,
    name: 'Boss Retry', desc: 'Tenta novamente o chefe quando o poder da equipe aumentar 10%.',
    baseCost: 10000, currency: 'fragments', prereq: 'auto_salvage', pos: { x: 68, y: 32 },
    effect: { unlock: 'boss_retry' }
  },
  auto_offlineorders: {
    id: 'auto_offlineorders', path: 'automation', ring: 3, type: 'unlock', maxLevel: 1,
    name: 'Offline Orders', desc: 'Define prioridades automáticas para o período offline: farmar, guardar, desmontar, trocar camp.',
    baseCost: 18000, currency: 'fragments', prereq: 'auto_camproutine', pos: { x: 58, y: 40 },
    effect: { unlock: 'offline_orders' }
  },

  // ══════════════════════ CENTRAL NODE (visual root) ══════════════════════
  nexus_core: {
    id: 'nexus_core', path: 'core', ring: 1, type: 'core', maxLevel: 1,
    name: 'Rune Nexus', desc: 'O núcleo da Constelação Ruínica. Sempre ativo.',
    baseCost: 0, currency: 'gold', prereq: null, pos: { x: 50, y: 50 },
    effect: {}
  }
};

// Which node each path's ring-1 node connects FROM (visual line to the core).
const RUNE_CORE_LINKS = ['war_damage', 'surv_health', 'fort_creepgold', 'wis_heroxp', 'form_tactical', 'auto_progress'];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RUNE_PATHS, RUNE_RINGS, RUNE_NODES, RUNE_CORE_LINKS, runeLevelCost };
}
