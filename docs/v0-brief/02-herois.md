# Heróis — Dota Idle Arena

O jogo original tinha duas camadas:
1. Um conjunto pequeno (14 heróis) com **lógica de combate totalmente única** (fórmulas de habilidade hardcoded).
2. Um roster grande (127 heróis, todo o elenco real de Dota 2) usado como "recrutáveis genéricos" — mesmos atributos/stats/crescimento, mas sem fórmula de habilidade própria (usam apenas o loop de ataque básico).

**Recomendação para o v0**: implemente a lógica genérica de combate (ataque básico + escala de stats) para todos os heróis, e trate a lista abaixo como os heróis "com habilidade especial de verdade" — pode expandir esse conjunto com mais heróis reais de Dota seguindo o mesmo padrão de fórmula.

## Sistema de stats (aplica a todos os heróis)

```
levelMult = nivel - 1
forcaFinal        = forcaBase        + crescimentoForca        * levelMult
agilidadeFinal     = agilidadeBase    + crescimentoAgilidade    * levelMult
inteligenciaFinal  = inteligenciaBase + crescimentoInteligencia * levelMult

hpMaximo    = hpBase    + forcaFinal * 22 + bonusHpDeItens
manaMaximo  = manaBase  + inteligenciaFinal * 12 + bonusManaDeItens
```

O atributo primário do herói (tipo: força/agilidade/inteligência/universal) soma seu valor final diretamente ao dano de ataque básico.

## Nível, XP e Progressão

- `xpParaProximoNivel = round(150 * nivel^1.8)`
- Cada level-up: +1 ponto de habilidade (gasto nas 3 habilidades normais, máx. nível 4 cada) e cura total.
- Ultimate (4ª habilidade) libera em níveis fixos: nível 6 (pode investir 1º ponto), nível 12 (2º ponto), nível 18 (3º ponto/máximo).

## Árvore de Talentos genérica (separada das habilidades, compartilha o mesmo pool de pontos)

Tiers desbloqueiam em: nível 0, 10, 20, 30, 40, 50, 60, 70, 80, 90. Cada tier oferece 2 opções (escolha 1), variando pelo atributo do herói. Pool de talentos possíveis:

- `hp_flat` — +HP fixo
- `hp_regen` — +regeneração de HP/s
- `armor` — +armadura
- `block` — +bloqueio de dano fixo
- `damage_flat` — +dano fixo
- `atk_speed` — +velocidade de ataque
- `evasion` — +% evasão
- `crit_chance` — +% chance de crítico
- `mana_flat` — +mana fixa
- `spell_amp` — +% amplificação de dano mágico
- `lifesteal` — +% roubo de vida

## Recrutamento

- Heróis começam bloqueados, exceto os 3 iniciais: Sven, Crystal Maiden, Drow Ranger (Drow começa no nível 10, os outros dois no nível 9).
- Heróis normais: recrutados gastando **Shards** (custo varia por herói, ex: Juggernaut 50, Lina 150, Axe 200).
- Heróis "premium": exigem assinatura ativa de Dota Plus **+** gastar Dota Coins (tipicamente 4000–6000 coins).

## Formação de Time

- 3 slots iniciais (Frontline/Midline/Backline), expansível para 5 slots (Backline extra + Support-Bench) via compra com Dota Coins.

### Sinergias de Time (exemplos — pode criar mais seguindo o padrão)

| Sinergia | Condição | Bônus |
|---|---|---|
| Força Pura | Todos os heróis do time são de Força | +40% HP, +15 armadura |
| Fogo e Gelo | Lina + Crystal Maiden no time | +25% amplificação de dano mágico |
| Os Clássicos | Sven + Crystal Maiden + Drow Ranger no time | +10% em todos os atributos |
| Duo/Trio de Atributo | 2 ou 3 heróis do mesmo atributo primário | Bônus escalonado por atributo (força=tankiness, agilidade=dano/veloc., inteligência=mana/regen) |

(No total o jogo original tinha ~10 sinergias definidas — sinta-se livre para criar variações adicionais nesse espírito: bônus por composição de atributos e por combos de heróis específicos com sinergia temática Dota.)

---

## Heróis com habilidade única (implementar com fórmula própria)

### Sven — Força
- **Stats base**: Dano 38, HP 620, Mana 200
- **Crescimento**: Força +3.2/nível, Agilidade +2.0/nível, Inteligência +1.3/nível
- **Storm Hammer** (habilidade 1, dano mágico com stun): `80 + 40 * nivelHabilidade`
- **Great Cleave** (passiva): multiplica dano base: `danoBase *= 1 + 0.15 * nivelHabilidade`
- **God's Strength** (ultimate, buff 12s): `dano *= 2.0` durante a duração

### Crystal Maiden — Inteligência
- **Stats base**: Dano 28, HP 500, Mana 260
- **Crescimento**: Força +2.0, Agilidade +1.6, Inteligência +3.3
- **Crystal Nova** (habilidade, dano em área): `60 + 35 * nivelHabilidade`
- **Arcane Aura** (passiva, GLOBAL — afeta o time todo): `+0.5 de regeneração de mana/s por nível` para todos os heróis ativos
- **Freezing Field** (ultimate, canalização): `200 + 100 * nivelHabilidade`

### Drow Ranger — Agilidade
- **Stats base**: Dano 34, HP 520, Mana 180
- **Crescimento**: Força +1.9, Agilidade +3.4, Inteligência +1.4
- **Frost Arrows** (habilidade passiva, soma ao ataque básico): `+15 + 10 * nivelHabilidade` de dano flat
- **Precision Aura** (passiva): `+8% de velocidade de ataque por nível`
- **Marksmanship** (ultimate): dano de ataque `= statsAtuais.dano * 2.0`

### Juggernaut — Agilidade
- **Stats base**: Dano 30, HP 540, Mana 200
- **Crescimento**: Força +2.2, Agilidade +2.8, Inteligência +1.4
- **Blade Fury** (habilidade, dano mágico contínuo + imunidade a dano): `80 + 40 * nivelHabilidade` de dano mágico por segundo durante a duração
- **Blade Dance** (passiva, substitui o crítico normal): chance de crítico `0.20 + 0.05 * nivelHabilidade`, multiplicador fixo 1.8x
- **Omnislash** (ultimate, dano físico explosivo): `300 + 150 * nivelHabilidade`

### Lina — Inteligência
- **Stats base**: Dano 27, HP 510, Mana 280
- **Crescimento**: Força +2.0, Agilidade +1.5, Inteligência +3.8
- **Dragon Slave** (habilidade, dano em onda): `90 + 45 * nivelHabilidade`
- **Fiery Soul** (passiva): ganha velocidade de ataque temporária a cada conjuração de habilidade
- **Laguna Blade** (ultimate, maior burst do jogo): `450 + 250 * nivelHabilidade` num único alvo

### Axe — Força
- **Stats base**: Dano 26, HP 680, Mana 180
- **Crescimento**: Força +3.6, Agilidade +1.7, Inteligência +1.6
- **Berserker's Call** (habilidade, taunt): força todos os inimigos da onda atual a atacar o Axe por 4 segundos, ignorando o sistema normal de aggro
- **Counter Helix** (passiva): chance de contra-ataque ao ser atingido
- **Culling Blade** (ultimate, execução): se o HP do alvo estiver abaixo de `250 + 150 * nivelHabilidade`, executa (mata instantaneamente); senão, causa 100 de dano

### Invoker — Inteligência (Premium, 6000 Dota Coins)
- **Stats base**: Dano 30, HP 540, Mana 300
- **Crescimento**: Força +2.4, Agilidade +1.9, Inteligência +4.0
- **Cold Snap**, **Alacrity** (habilidades de suporte/utilidade)
- **Sun Strike** (ultimate, dano puro global): `250 + 120 * nivelHabilidade`

### Phantom Assassin — Agilidade (Premium, 4000 Dota Coins)
- **Stats base**: Dano 36, HP 570, Mana 180
- **Crescimento**: Força +2.0, Agilidade +3.2, Inteligência +1.4
- **Coup de Grace** (passiva, crítico massivo): chance `15% + 5% * nivelHabilidade` de crítico com multiplicador de **450%**

### Outros heróis premium mencionados (Sniper, Oracle, Techies)
Existiam no jogo original mas sem detalhamento de fórmula extraído — recrie seguindo o padrão de fórmulas acima (habilidade escalando linearmente com nível, ultimate com maior coeficiente), respeitando o tema de cada herói real de Dota 2.

---

## Roster expandido (127 heróis reais de Dota 2)

O jogo original usava o elenco completo de heróis de Dota 2 (Abaddon, Alchemist, Ancient Apparition, Anti-Mage, Arc Warden, Axe, Bane, Batrider, Beastmaster, Bloodseeker, Bounty Hunter, Brewmaster, Bristleback, Broodmother, Centaur Warrunner, Chaos Knight, Chen, Clinkz, Clockwerk, Crystal Maiden, Dark Seer, Dark Willow, Dawnbreaker, Dazzle, Death Prophet, Disruptor, Doom, Dragon Knight, Drow Ranger, Earth Spirit, Earthshaker, Elder Titan, Ember Spirit, Enchantress, Enigma, Faceless Void, Grimstroke, Gyrocopter, Hoodwink, Huskar, Invoker, Io, Jakiro, Juggernaut, Keeper of the Light, Kez, Kunkka, Legion Commander, Leshrac, Lifestealer, Lina, ... e assim por diante até completar o roster real do jogo).

Para o v0: não é necessário recriar todos os 127 nomes manualmente — gere um dataset com pelo menos 30-40 heróis reais de Dota 2 (misturando os 3 atributos + universal), cada um com:
- Nome real
- Atributo primário
- Stats base (dano/HP/mana) e crescimento por nível, variando de forma sensata pelo atributo (heróis de Força = mais HP/menos dano mágico; Inteligência = mais mana/spell power; Agilidade = mais velocidade de ataque/crítico)
- 3 nomes de habilidade + 1 ultimate (podem ser genéricas/temáticas, sem fórmula única obrigatória para todos — apenas os heróis "principais" listados acima precisam de fórmula custom)
- Custo de recrutamento em Shards (varie entre 50 e 500 dependendo da "força" percebida do herói)
