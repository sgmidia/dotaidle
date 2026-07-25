# Fórmulas de Combate — Dota Idle Arena

## Loop de tick

- Tick principal: a cada 100ms.
- Timer de onda (`stageTimer`): começa em 30.0s por onda. Chega a 0 → estágio regride 1, onda reinicia.
- Timer de reforço (`nextWaveTimer`): começa em 20.0s. Se a onda atual não morrer antes disso, a próxima onda é somada por cima da atual (inimigos acumulam).
- Regeneração de HP/mana aplicada a todos os heróis ativos a cada tick.
- Pausa total do PvE enquanto o time está trancado numa partida de PvP.

## Dano do jogador → inimigo

```
baseDmg = (baseDamage + valorAtributoPrincipal + bonusDmgFlat + bonusDmgPermanente)
        * multiplicadorCompendio
        * multiplicadorPrestigio
        * multiplicadorSinergiaTime
        * multiplicadorKeystoneRuneNexus

// Crítico:
se Math.random() < critChance:
    dano *= critMult   // base 1.5x a 2.0x dependendo da fonte (item/talento/habilidade)
```

- `valorAtributoPrincipal` = valor do atributo primário do herói (Força/Agilidade/Inteligência) — soma direto ao dano base.
- Velocidade de ataque: `attackRate = (attackSpeed/100) / 1.7`; `attackCooldown = 1 / attackRate`, depois dividido por multiplicadores de sinergia, runas (`1 + runeAsPct`) e keystones.

## Dano do inimigo → jogador

```
1. Checagem de evasão: se Math.random() < evasao → erra completamente (dano 0)
2. Bloqueio de dano: subtrai valor fixo de "block" do dano bruto
3. Resistência física por armadura (fórmula de retornos decrescentes, estilo Dota):
   resistenciaFisica = (armadura * 0.06) / (1 + armadura * 0.06)
4. danoFinal = max(1, round(dano * (1 - resistenciaFisica)))
```

- Armadura do herói vem principalmente de Agilidade: `armadura = agilidade * 0.16 + bônus de itens/talentos`.
- Inimigos atacam a cada 1.5s (fixo).

## Targeting de inimigos (sistema de aggro)

Peso de aggro por atributo do herói-alvo:

| Atributo | Peso |
|---|---|
| Força | 6 |
| Agilidade | 2 |
| Universal | 2 |
| Inteligência | 1 |

Heróis de Força puxam MUITO mais aggro — funcionam como tanques naturais. Existe também taunt forçado (ex: Berserker's Call do Axe, força todos os inimigos da onda a atacá-lo por alguns segundos, ignorando o peso normal).

## Habilidades (cast probabilístico, não em timer fixo)

Cada habilidade tem uma chance de conjurar por segundo simulado (não é "a cada X segundos" fixo):

```
por segundo simulado, por habilidade disponível (mana ok, sem cooldown ativo):
    se Math.random() < 0.15 * segundosSimulados:
        conjura a habilidade
```

## XP e Level

```
xpNecessarioParaProximoNivel = round(150 * nivel^1.8)
```

- Ao matar um inimigo, TODOS os heróis vivos e ativos no time ganham XP simultaneamente (não é dividido entre eles).
- Heróis não-ativos (banco) podem ganhar uma fração da XP se houver algum talento/rune desbloqueado para isso ("Conhecimento Compartilhado").
- Ao subir de nível: +1 ponto de habilidade, cura total de HP e mana.

## Ouro por kill

```
ouro = ouroBaseDoInimigo
     * (dotaPlusAtivo ? 1.2 : 1.0)
     * (1 + bonusTalentoOuro * 0.05)
     * (1 + bonusRuneOuroCreepPct)
     * (1 + bonusBencaoForjaOuroPct)
     * (bônus extra se for boss)
```

## Escala de inimigos por estágio

```
hp  = round(250 * 1.20^(estagio - 1) * multiplicadorEspecial * multiplicadorRank.hp  * variancia)
dano = round(14  * 1.16^(estagio - 1)                          * multiplicadorRank.dmg * variancia)

variancia = número aleatório entre 0.9 e 1.1 (±10% por inimigo individual)
```

- `multiplicadorEspecial`: Mini-Boss = 2.0x, Boss = 3.5x, inimigo normal = 1.0x.
- Última onda de um estágio = Mini-Boss (exceto se for também a última onda do rank, aí é Boss completo).

## Ondas por estágio e inimigos por onda (escalam por rank)

| Rank | Ondas por estágio | Inimigos por onda |
|---|---|---|
| Arauto (Herald) | 10 | 2–3 |
| ... escala progressivamente ... | ... | ... |
| Imortal (Immortal) | 30 | até 12 |

## Ranks (8 no total, ~15 estágios cada, exceto Imortal que é infinito)

| Rank (PT) | Rank (EN) | Faixa de estágio | Multiplicador HP inimigo | Multiplicador Dano inimigo | Multiplicador Recompensa |
|---|---|---|---|---|---|
| Arauto | Herald | 1–12 | 1.0x (base) | 1.0x (base) | 1.0x (base) |
| Guardião | Guardian | 13–27 | ↑ | ↑ | ↑ |
| Cruzado | Crusader | 28–42 | ↑ | ↑ | ↑ |
| Arconte | Archon | 43–57 | ↑ | ↑ | ↑ |
| Lenda | Legend | 58–72 | ↑ | ↑ | ↑ |
| Ancestral | Ancient | 73–87 | ↑ | ↑ | ↑ |
| Divino | Divine | 88–102 | ↑ | ↑ | ↑ |
| Imortal | Immortal | 103+ (infinito) | 3.4x | 3.5x | 2.2x |

(Interpole os multiplicadores intermediários de forma suave entre 1.0x no Arauto e os valores do Imortal — não há necessidade de replicar números exatos de cada rank intermediário, apenas manter a curva crescente.)

## Regiões (tema visual + tabela de loot restrita por faixa de estágio)

| Região | Até estágio |
|---|---|
| Safe Lane | 12 |
| Small Camp | 27 |
| Mid Lane | 42 |
| Medium Camp | 57 |
| Offlane Lane | 72 |
| Hard Camp | 87 |
| Ancient Camp | 102 |
| Roshan's Pit | 103+ |

Cada região tem um pool restrito de ~3 itens base que podem dropar ali, e define o "nível" usado para escalar os stats dos itens gerados.

## Mecânica de "Deny" (evitar wipe)

Se o time inteiro morre (wipe) e existe pelo menos 1 herói de Inteligência vivo na composição (mesmo banco?): 30% de chance de "negar" o wipe — em vez de regredir o estágio, o time revive com 25% HP e 10% mana.
