# PvP Arena e Sistemas de Progressão — Dota Idle Arena

## PvP Arena (sistema de lobby + resolução por fórmula, não simulação real)

### Fluxo
1. Jogador clica "Criar Lobby" → sistema sorteia um oponente "bot" de uma lista fixa de nomes de jogadores pro reais de Dota (ex: Dendi, Miracle-, Arteezy, N0tail, Gorgc, SirActionSlacks, BootsHD, UNiVeRsE, w33, EternalEnvy), cada um com um MMR fixo pré-definido (variando de ~3200 a ~11450).
2. O sistema calcula o "poder" do time do oponente: `poderOponente = round(mmrOponente * 2.8 + aleatorio(0-150))`.
3. Ambos os lados mostram status "Pronto" — o oponente bot fica pronto automaticamente após 1.5s; o jogador precisa confirmar manualmente seu time.
4. Jogador clica "Iniciar Duelo".

### Resolução do duelo (fórmula, não combate simulado tick-a-tick)
```
diferencaMmr = mmrJogador - mmrOponente
bonusPoder   = (poderJogador - poderOponente) / 500
chanceVitoria = 1 / (1 + e^(-(diferencaMmr/800 + bonusPoder)))

resultado = Math.random() < chanceVitoria ? "vitória" : "derrota"
```

### Poder do time (usado na fórmula acima)
```
poderHeroi = nivel * 100 + soma((tierItem + 1) * (indiceRaridade + 1) * 35) para cada item equipado
poderTime = soma(poderHeroi de todos os heróis no time)
```

### Recompensas
| Resultado | MMR | Shards | Dota Coins |
|---|---|---|---|
| Vitória | `+round(15 + aleatorio(0-10))` | 20 | 150 |
| Derrota | `-round(10 + aleatorio(0-8))` (mínimo 0) | 5 (consolação) | 50 (consolação) |

### Divisões (nomeadas como o sistema de rank real do Dota)
| Divisão | MMR mínimo |
|---|---|
| Arauto (Herald) | 0 |
| Guardião (Guardian) | 1000 |
| Cruzado (Crusader) | 1500 |
| Arconte (Archon) | 2500 |
| Lenda (Legend) | 3500 |
| Ancestral (Ancient) | 5000 |
| Divino (Divine) | 7000 |
| Imortal (Immortal) | 10000 |

### Leaderboard
Combina os 10 bots fixos + a linha do próprio jogador (MMR atual), ordenado decrescente por MMR, atualizado após cada duelo.

### Trava de PvE durante PvP
Enquanto o jogador está numa partida de PvP ativa, o loop de combate PvE fica completamente pausado (overlay de "em batalha PvP" na tela).

---

## Sistema de Prestígio

Reset controlado de progressão de estágio em troca de uma moeda meta permanente.

```
recompensaEssenciaAncestral = floor(maiorEstagioAlcancado * 0.5)
```

**O que reseta**: apenas a posição atual no estágio (`currentStage` volta a 1).

**O que é mantido**: heróis (níveis, habilidades, talentos), itens/inventário, descobertas do Compêndio, níveis do Rune Nexus, progresso da Forja.

**Efeito colateral**: se o nó "Memória Ancestral" do Rune Nexus estiver desbloqueado, os heróis do time ativo não caem abaixo do nível 5 após o reset.

**Gating**: Prestígio é necessário para desbloquear o Anel 4 (Divino) do Rune Nexus.

## Árvore de Talentos Ancestrais (dentro da Loja Secreta, separada e mais simples que o Rune Nexus)

4 talentos, comprados com Essência Ancestral, sem limite de nível:

| Talento | Efeito por nível |
|---|---|
| Ouro | +5% ouro ganho |
| XP | +5% XP ganho |
| Chance de Drop | +2% chance de item dropar |
| Dano vs. Boss | +3% dano contra bosses |

Custo por nível: `(nivelAtual + 1) * 3` Essência Ancestral.

## Manobras Táticas (ações ativas com cooldown, botões na HUD lateral)

| Manobra | Cooldown | Duração | Efeito |
|---|---|---|---|
| 🌾 Empilhar Campo (Stack Camp) | 60s | instantâneo (afeta próxima onda) | Próxima onda ganha um inimigo "empilhado": 1.5x HP, 1.3x dano, 1.8x ouro, 1.8x XP |
| 🚜 Puxar Lane (Pull Lane) | 60s | instantâneo | Reseta o timer da onda para 30s e cura o time em 20% do HP máximo |
| 👁️ Sentinela Observadora (Observer Ward) | 180s | 180s ativa | +25% chance de drop de item durante a duração |
| 👁️ Sentinela de Vigia (Sentry Ward) | 180s | 180s ativa | +25% na taxa de drop de Shards (de elites/bosses) durante a duração |

## Compêndio de Coleções

Ver detalhes completos em `03-itens-e-raridades.md`. Resumo: 3 coleções (Armas/Armadura/Acessórios), completar cada uma dá bônus passivo permanente.
