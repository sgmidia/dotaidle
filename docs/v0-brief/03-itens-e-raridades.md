# Itens, Raridades e Equipamento — Dota Idle Arena

## Slots de Equipamento

- 6 slots normais (armas/armaduras/acessórios misturados livremente).
- 1 slot exclusivo de **Artefato** (7º slot) — itens únicos, sem sistema de raridade, stats fixos e poderosos.

## Tiers de Raridade (7 níveis)

| Raridade | Cor | Multiplicador de Stats | Chance base de drop |
|---|---|---|---|
| Comum | Cinza `#7e8e9f` | 1.0x | 55% |
| Incomum | Verde `#2ecc71` | 1.25x | 27% |
| Raro | Azul `#3498db` | 1.5x | 12% |
| Épico | Roxo `#9b59b6` | 1.75x | 4.5% |
| Lendário | Laranja `#e67e22` | 2.0x | 1.4% |
| Mítico | Vermelho `#e74c3c` | 2.25x | 0.1% |
| Imortal | Dourado `#e5c158` | 2.5x | 0% via drop normal (só via bosses/eventos especiais) |

Fórmula: `multiplicadorRaridade = 1.0 + indiceRaridade * 0.25`

Existe também uma cor extra "Arcana" (rosa/magenta) reservada para itens cosméticos/especiais futuros.

## Sistema de Tier (upgrade, +0 a +10, feito na Forja)

```
multiplicadorTier = 1.0 + tier * 0.15
```

Stats finais de um item = `statsBase * multiplicadorRaridade * multiplicadorTier`.

## Sistema de Pity (garantia anti-frustração)

- **Pity Épico**: contador de mortes desde o último drop Épico+. Ao atingir 25 mortes, a próxima drop é garantida Épico ou melhor. Reseta ao dropar Épico+ naturalmente também.
- **Pity Lendário**: contador similar, atinge em 150 mortes, garante drop Mítico (10% de chance) ou Lendário (90% de chance).

## Modificadores de Item (rolam em itens Raro+, 1 a 3 modificadores dependendo da raridade)

| Modificador | Efeito |
|---|---|
| Ricochete (bounce) | 10% de chance do ataque (se à distância) ricochetear em outro alvo |
| Crítico com Mana | Acerto crítico restaura 5% da mana máxima |
| Respingo (splash) | 15% de chance de dano em área (se corpo-a-corpo) |
| Escudo de Emergência | Ganha escudo absorvendo 30% do HP máximo quando abaixo de 30% HP |
| Conjuração Dupla | 15% de chance de conjurar a habilidade duas vezes |
| Amplificação Gélida | +20% de dano contra inimigos lentos/enfraquecidos |
| Fúria da Vitória | +25% de velocidade de ataque por 5s após matar um inimigo |
| Fortuna | +15% de ouro ganho |

## Itens Base (exemplos representativos — expanda livremente com mais itens temáticos de Dota)

| Item | Slot | Efeito Base |
|---|---|---|
| Espada Larga (Broadsword) | Arma | +6 dano, 5% crítico |
| Arco de Caçador (Hunter Bow) | Arma | +4 dano, +10% velocidade de ataque |
| Cajado do Mago (Wizard Staff) | Arma | +4 inteligência, 4% amplificação mágica |
| Escudo Robusto (Stout Shield) | Armadura | +3 armadura, 10 bloqueio de dano |
| Botas de Velocidade (Speed Boots) | Acessório | +15% velocidade de ataque |
| Anel de Regeneração (Regen Ring) | Acessório | +2 regen HP/s, +0.8 regen mana/s |

## Artefatos (7º slot, sem raridade, stats fixos — lista completa)

| Artefato | Efeito |
|---|---|
| **Divine Rapier** | +250 dano — **cai no chão se o time inteiro morrer (wipe)**, risco/recompensa |
| **Butterfly** | +25 agilidade, +20% velocidade de ataque, +25% evasão |
| **Daedalus** | +65 dano, 25% chance de crítico, multiplicador de crítico 2.0x |
| **Heart of Tarrasque** | +500 HP, +20 regen HP/s |
| **Assault Cuirass** | +12 armadura, +25% velocidade de ataque (aura — beneficia o time todo) |
| **Abyssal Blade** | +40 dano, +200 HP, 20% chance de atordoar o inimigo ao atacar |
| **Satanic** | +30 dano, +250 HP, 25% roubo de vida |
| **Black King Bar** | +15 força, +20 dano, 50% de imunidade a dano mágico |

## Sistema de Geração de Item (drop de combate)

Ao dropar um item: rola raridade (respeitando pity), rola slot/tipo, rola stats base escalados pela raridade e pelo nível/região do estágio atual, rola quantidade de modificadores (0 em comum/incomum, 1-3 em raro+).

## Compêndio (Compendium) — coleção de itens

3 coleções, completar cada uma (equipar ao menos 1 cópia de cada item base da categoria) dá um bônus passivo permanente global:

| Coleção | Itens | Bônus ao completar |
|---|---|---|
| Armas | Espada, Arco, Cajado | +3% dano global |
| Proteção/Armadura | Escudo, Elmo, Placa | +3 armadura global |
| Acessórios & Velocidade | Botas, Anel | +5% velocidade de ataque global |
