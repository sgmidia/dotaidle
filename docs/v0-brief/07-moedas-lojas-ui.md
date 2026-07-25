# Moedas, Lojas e Estrutura de UI — Dota Idle Arena

## Todas as moedas do jogo

| Moeda | Ícone | Fonte(s) | Uso(s) |
|---|---|---|---|
| Ouro | 🪙 | Matar inimigos, vender itens, market listings | Compras na loja, upgrades da Forja (Síntese/Criação/Gravação), nós comuns do Rune Nexus |
| Essência | 🧪 | Drop garantido de bosses, Extração na Forja | Custo de Essência no upgrade de Tier (Síntese) |
| Shards | 💎 | Elites (1-3), Bosses (5-10), PvP (20 vitória / 5 derrota) | Recrutar heróis não-premium |
| Essência Ancestral | ⚜️ | Trigger de Prestígio | Árvore de Talentos Ancestrais |
| Dota Coins | 🪙 (dourado) | Vendas no Marketplace, PvP (150 vitória / 50 derrota), Top-up simulado | Dota Plus, slots de time extras, mochilas, baús gacha, heróis premium |
| Fragmentos de Runa | 🔷 | Elites (2-5), Bosses (8-15), primeira vez limpando um estágio | Nós "especiais" do Rune Nexus |
| Sigilos Ancestrais | ⚜️ | Matar o boss Roshan (+1 cada), Ritual Grandioso da Forja (+3) | Keystones do Rune Nexus (custo fixo 40) |
| Materiais de Forja (Comum/Raro/Épico) | — | Inimigos comuns (20% chance, 1-2), Elites (1-3), Bosses (4-8) | Quase todos os módulos da Forja |

## Lojas

### Loja do Mercador (Merchant Shop)
Vende os itens base fixos por ouro (preço = `dano * 150` ou 120 padrão), sempre rola raridade Comum.

### Marketplace (2 lados)
- **Listagens NPC**: 6 itens aleatórios, atualiza a cada 5 minutos, comprável com Dota Coins. Preço: `(custoBase/20) * (1 + raridade*0.2) * (1 + tier*0.15) * aleatorio(0.8-1.2)`.
- **Vender (jogador)**: até 5 listagens simultâneas do jogador; um "comprador bot" com nome de jogador pro compra automaticamente em 60-180s, pagando em Dota Coins.

### Baús Gacha (Dota Coins Store)
- **Baú Comum** (500 coins): rola um item normal via sistema padrão de geração.
- **Tesouro Imortal** (2000 coins): rola um Artefato aleatório com tabela própria: Raro 45%, Épico 35%, Lendário 14%, Mítico 5.5%, Imortal 0.5%. (Sem sistema de pity específico para baús — pity só se aplica a drops de combate.)

### Loja de Dota Coins (itens diretos)
| Item | Custo | Efeito |
|---|---|---|
| Dota Plus | 10.000 coins (permanente) | +20% ouro e XP, desbloqueia 6 heróis premium |
| Slot de Time 4 | 3.000 coins | +1 slot no time |
| Slot de Time 5 | 5.000 coins | +1 slot no time |
| Mochila Extra | `2000 * 1.8^quantidadeJaComprada` (máx 4 mochilas) | +24 slots no baú/inventário |
| Top-up de Cartão | Simulado (não gasta dinheiro real) | +5.000 Dota Coins |

### Saque de Dota Coins
Modal simulado de "saque" (PIX/Crypto), taxa fixa de 1000 coins = R$5,00 — **deixe claro no jogo que é 100% simulado, sem gateway de pagamento real, nenhum valor de verdade é processado.**

---

## Estrutura de Abas / Navegação

Menu lateral (sidebar esquerda) com ícone + label:

1. **Combat Arena** — tela principal, batalha automática acontecendo
2. **Hero Lineup** — gerenciar time, ver detalhes/talentos de heróis, recrutar
3. **Secret Shop** — hub com 5 sub-abas:
   - Merchant Shop
   - Marketplace
   - Compendium
   - Ancestral Prestige
   - Dota Coins Store
4. **PvP Arena** — lobby + leaderboard
5. **Rune Nexus** — constelação de talentos meta
6. **Ancient Forge** — os 8 módulos de crafting
7. **Wiki** — 3 sub-abas: Stages & Monsters, Heroes Encyclopedia (filtro por atributo), Items Compendium (filtro por raridade + busca)
8. **Settings** — áudio, save/export/import, reset

Card fixo de saldo de ouro no rodapé da sidebar.

## Layout da Combat Arena
- Centro: "campo de batalha" animado com overlay de info do estágio (número/nome/rank, barra de progresso da onda, leitura de "Max Stage / Recommended Power / Team Power").
- Ao lado: painel de "Battle Feed" (log de combate em tempo real, rolável).
- HUD direita persistente (visível em todas as abas): Sinergias de Time, card da região atual (thumbnail), botões de Manobras Táticas, mini-cards do time ativo (HP/mana/XP), métricas (DPS total, multiplicador de ouro).

## Modais
- **Bem-vindo de volta**: resumo do progresso offline (tempo ausente, ouro ganho, XP ganho, itens encontrados).
- **Mapa de Estágios**: grid de 30 estágios por rank, navegável por abas de rank.
- **Sinergias de Time**: lista detalhada das sinergias ativas no momento.

## Estética Visual

Tema "painel de HUD de esports/trading terminal" — escuro, denso em informação, números em destaque.

**Paleta de cores**:
- Fundos: quase preto (`#08090c`, `#0d0f13`, cards em `#13161c`)
- Cor de destaque principal: vermelho Dota (`#e32929`, tom mais escuro `#a81c1c`)
- Dourado para moeda/premium: `#d2a138` (primário), `#e5c158` (secundário/destaque)
- Texto: hierarquia de cinza-azulado (`#f0f4f8` primário → `#8e9fae` secundário → `#5c6a7e` terciário/desabilitado)
- Cores de raridade: ver `03-itens-e-raridades.md`

**Tipografia**: fonte sans-serif moderna para UI geral (ex: Outfit, Inter, ou similar) combinada com uma fonte monoespaçada (ex: JetBrains Mono) especificamente para números — DPS, moedas, timers de cooldown — reforçando a sensação de "terminal de dados".

**Áudio**: efeitos sonoros sintetizados (Web Audio API, osciladores simples — não arquivos de áudio) para hit, moeda, conjuração de habilidade, level up, derrota, drop raro. Mudo por padrão.
