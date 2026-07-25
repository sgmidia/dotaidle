# Rune Nexus — Árvore de Talentos Meta (Constelação)

Sistema de progressão de longo prazo, separado dos talentos individuais dos heróis. Visualmente é uma "constelação" — nós conectados por linhas, renderizados como um grafo SVG, irradiando de um nó central (`nexus_core`, puramente visual/decorativo).

## 6 Caminhos temáticos

| Caminho | Ícone | Tema |
|---|---|---|
| Guerra | ⚔️ | Dano, velocidade de ataque, ofensiva geral |
| Sobrevivência | ❤️ | Tankiness, HP, defesa |
| Fortuna | 💰 | Drops, ouro, economia |
| Sabedoria | 📖 | XP, progressão de nível |
| Formação | 🛡️ | Bônus de estratégia/composição de time |
| Automação | ⚙️ | Qualidade de vida, eficiência |

## Tipos de nó

| Tipo | Níveis | Moeda |
|---|---|---|
| `comum` | 5 níveis | Ouro |
| `especial` | 3 níveis | Fragmentos de Runa |
| `desbloqueio` | 1 nível (binário, liga/desliga uma feature) | Ouro ou Fragmentos |
| `keystone` | 1 nível, mas precisa ser **equipado** (máx. 3 keystones equipados simultaneamente no jogo todo) | Sigilos Ancestrais (custo fixo de 40) |
| `núcleo` | Visual apenas, sem efeito | — |

## Fórmula de custo (nós comuns/especiais)

```
custo(nivel) = custoBase * 2.25^(nivel - 1)
```

## Anéis (gating de acesso)

| Anel | Nome | Requisito para desbloquear |
|---|---|---|
| 1 | Aprendiz | Nenhum (disponível desde o início) |
| 2 | Heroico | 15 níveis totais investidos na árvore |
| 3 | Ancestral | 40 níveis totais investidos **+** ter derrotado o boss Roshan |
| 4 | Divino | 70 níveis totais investidos **+** ter feito pelo menos 1 Prestígio |

## Exemplos de nós (crie mais seguindo esse padrão — cada caminho deveria ter ~8-15 nós no total)

### Caminho de Guerra
- **Dano de Guerra** (comum, 5 níveis, 300 ouro base): +1.5% dano por nível. Bônus de maestria (nível 5 completo): +3% dano adicional contra bosses.
- **Dano Crítico** (especial, Fragmentos de Runa): +5% de multiplicador de crítico por nível.
- **Keystone: Sede de Sangue** (40 Sigilos): abaixo de 50% HP, ganha +35% velocidade de ataque e +15% roubo de vida.

### Caminho de Sobrevivência
- **Keystone: Campeão Solitário** (40 Sigilos): se o time tiver apenas 1 herói, esse herói ganha +60% dano, +50% HP, +25% velocidade.

### Caminho de Fortuna
- **Keystone: Ganância** (40 Sigilos): +50% na quantidade de itens dropados, mas -20% na qualidade (raridade rebaixada).

### Caminho de Formação
- **Keystone: Trindade Perfeita** (40 Sigilos): se o time tiver exatamente 1 Tanque + 1 Suporte + 1 Carregador (categorização por papel/atributo), ganha +15% dano, +15% resistência, +10% regen de mana.

### Caminho de Sabedoria
- **Memória Ancestral** (desbloqueio): heróis começam em nível mais alto após fazer Prestígio.

## Moedas usadas neste sistema

- **Ouro**: nós comuns.
- **Fragmentos de Runa** 🔷: nós especiais.
- **Sigilos Ancestrais** ⚜️: keystones (custo fixo de 40 cada).
