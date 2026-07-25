# Forja Ancestral — Dota Idle Arena

A Forja tem seu próprio nível e barra de XP (ganha XP fazendo qualquer ação de forja). Cada módulo desbloqueia num nível de Forja diferente.

## Módulo 1 — Síntese (desbloqueia no nível 1 da Forja)

**Upgrade de Tier** (melhora um item existente de +0 até +10):
```
custoOuro    = round(150 * 1.12^tierAtual * (indiceRaridade + 1))
custoEssencia = round((tierAtual + 1) * (indiceRaridade + 1) * 3)
```

**Fusão**: combina 3 itens da mesma raridade → 1 item aleatório da raridade seguinte (funciona até chegar em Mítico).

## Módulo 2 — Alquimia (nível 3)

**Conversão de Materiais** entre 3 tiers (Comum/Raro/Épico), com taxa que piora com o uso (reseta ao fazer Prestígio):
- Primeiros 10 usos: taxa 5:1
- Próximos 20 usos: taxa 6:1
- Depois disso: taxa 8:1

**Afinidades Elementais**: atribui um elemento a um item (custo: 6 materiais Raros), cada um dá um pequeno bônus:

| Afinidade | Bônus |
|---|---|
| Fogo | +5% dano de habilidade |
| Gelo | (efeito de controle/lentidão adicional) |
| Natureza | (regen/sustain adicional) |
| Arcano | (mana/spell amp adicional) |
| Trevas | +3% roubo de vida |
| Físico | (dano físico adicional) |

## Módulo 3 — Criação (nível 2)

Forja um item novo do zero, escolhendo o slot (arma/armadura/acessório) e um catalisador que melhora a chance de raridade alta:

| Catalisador | Efeito na rolagem de raridade |
|---|---|
| Nenhum | Tabela base |
| Menor | Leve aumento nas chances de raro+ |
| Maior | Aumento moderado |
| Grande | Aumento significativo, chance real de lendário/mítico |

Tabela base de raridade no craft: Incomum 55%, Raro 32%, Épico 11%, Lendário 1.9%, Mítico 0.1% (o catalisador desloca essa distribuição para cima).

Custo base: 2000 ouro + 10 materiais comuns.

## Módulo 4 — Lapidação / Gemas (nível 5)

**Slots de gema por raridade do item**:

| Raridade do item | Slots de gema disponíveis |
|---|---|
| Comum | 0 |
| Incomum / Raro | 1 |
| Épico | 2 |
| Lendário+ | 3 |

**Custo para abrir slots** (escalona): 8000 ouro + 5 materiais raros → 30000 ouro + 5 materiais épicos → 90000 ouro + 15 materiais épicos.

**5 tipos de gema**: Rubi, Safira, Esmeralda, Topázio, Ônix — cada um com 5 níveis. Combine 3 gemas do mesmo nível → 1 gema do próximo nível.

**Poder por nível de gema**: `[0.6, 1.0, 1.6, 2.4, 3.4]` (escala não-linear, cada nível vale progressivamente mais).

## Módulo 5 — Gravação / Reforge (nível 7)

Rerola um stat secundário de um item, escolhendo de um pool que depende do tipo de slot:

- **Ofensivo** (armas): chance de crítico, multiplicador de crítico, velocidade de ataque, % dano vs. boss, dano flat.
- **Defensivo** (armaduras): armadura, % resistência mágica, regen HP, bloqueio, evasão.
- **Acessórios**: pool combinado (ofensivo + defensivo).

Custo escala exponencialmente com o número de vezes já reforjado:
```
custo = 1200 * 1.8^vezesJaReforjado
```

Stats descobertos por reforge ficam permanentemente disponíveis para escolher em rerolls futuros.

## Módulo 6 — Inscrição / Runewords (nível 10)

7 efeitos de inscrição, cada um restrito a certos tipos de slot:

| Inscrição | Efeito |
|---|---|
| Tempestade | Corrente elétrica (chain lightning) ao atacar |
| Inverno | Dano congelante adicional |
| Carrasco | Execução de inimigos com HP baixo |
| Eco | Chance de ecoar (repetir) a última habilidade conjurada |
| Guardião | Escudo ativado ao perder HP |
| Fortuna | Bônus percentual de ouro |
| Autômato | Bônus percentual de drop de boss |

Custo: 15000 ouro + 3 materiais épicos.

**Inscrições menores**: itens Mítico+ podem ter uma 2ª inscrição secundária, desde que seja de "família" diferente da principal.

## Módulo 7 — Extração (nível 12)

Recupera gemas/inscrições de um item (destruindo-o no processo). Taxa de sucesso decresce com a raridade do item:

| Raridade | Taxa de sucesso normal |
|---|---|
| Comum | 90% |
| ... escala decrescendo ... | ... |
| Imortal | 10-20% |

Existe uma opção de **Extração Segura** (custa 3x mais recursos) que garante 100% de sucesso.

## Módulo 8 — Oferenda / Altar (nível 15, "Advanced")

Sacrifica itens em troca de **Favor do Altar**, uma moeda de progresso temporário:

```
valorFavor = multiplicadorRaridade[comum=1, incomum=2, raro=4, épico=8, lendário=20, mítico=45, imortal=90]
           * nivelDoItem
           * multiplicadorQualidade(tier)
           * multiplicadorAtributos(quantidade de modificadores)
           * multiplicadorInscricao(1.5x se o item tiver inscrição)
```

Ao atingir **10.000 de Favor**: o jogador escolhe uma **Bênção** temporária (dura 4 horas), com efeitos como +10-15% ouro, +10-15% XP, +10-15% chance de drop, +10-15% materiais, ou +10-15% dano contra bosses.

Ofertas de itens Lendário+ também alimentam um segundo medidor, o **Ritual Grandioso** (limiar de 50.000): ao completar, concede +3 Sigilos Ancestrais, +15 Fragmentos de Runa, e um item Lendário garantido.

---

**Nível da Forja e desbloqueios**:

| Nível da Forja | Módulo desbloqueado |
|---|---|
| 1 | Síntese |
| 2 | Criação |
| 3 | Alquimia |
| 5 | Lapidação |
| 7 | Gravação |
| 10 | Inscrição |
| 12 | Extração |
| 15 | Oferenda (Avançado) |
