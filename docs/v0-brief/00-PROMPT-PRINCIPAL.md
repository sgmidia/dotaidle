# Prompt para v0.app — Recriar "Dota Idle Arena"

Cole o texto abaixo no v0. Os arquivos anexos (`01-` a `07-`) contêm os dados detalhados (heróis, itens, runas, forja) — referencie-os conforme o v0 for pedindo detalhes de cada sistema, ou anexe todos de uma vez se a ferramenta aceitar múltiplos arquivos.

---

## PROMPT

Quero que você construa um **jogo idle/incremental de navegador** chamado **Dota Idle Arena**, em **Next.js (App Router) + TypeScript + React**, com estado gerenciado em cliente (Zustand ou Context, sua escolha) e persistência via API routes que já existem no meu backend (login, GameSave). Este é um jogo de progressão automática estilo "farm passivo": o jogador recruta heróis de Dota 2, monta um time, e o time luta automaticamente contra ondas de inimigos em estágios progressivamente mais difíceis, ganhando ouro, XP, itens e várias moedas premium/meta ao longo do caminho.

Não é um clone 1:1 de UI — quero que você aplique seu próprio bom gosto de design (o jogo original tinha uma estética "painel de trading/HUD de esports": fundo quase preto, vermelho Dota como cor de destaque, dourado para moeda/premium, tipografia monoespaçada para números). Mas a **lógica de jogo, fórmulas, e progressão devem seguir fielmente** o que descrevo abaixo e nos arquivos anexos — é isso que faz o jogo ser "o jogo", não a pintura por cima.

### Visão geral do loop principal

- O jogador tem um time de heróis (3 slots iniciais, expansível para 5).
- O time avança por **estágios** (stages), cada um com várias **ondas** (waves) de inimigos.
- Cada onda tem um **timer** (30s) — se o time não limpar a onda a tempo, o estágio regride e a onda reinicia. Isso cria pressão constante para o jogador upar dano/velocidade.
- Se a onda não morrer em 20s, a próxima onda é somada por cima (reforço), aumentando a dificuldade se o jogador estiver muito devagar.
- Ao matar inimigos: ganha ouro, XP (todos os heróis vivos ganham XP simultaneamente), e chance de dropar itens.
- A cada 10-30 ondas o estágio muda de "rank" (Arauto → Guardião → Cruzado → Arconte → Lenda → Ancestral → Divino → Imortal), cada rank multiplicando HP/dano/recompensas dos inimigos.
- O último inimigo de cada estágio é um Mini-Boss; o último de cada rank é um Boss completo (mais forte, dropa itens garantidos).

### Combate (resolvido automaticamente, sem input do jogador durante a luta)

- Cada herói ataca no seu próprio ritmo baseado em Velocidade de Ataque.
- Cada herói tem uma habilidade única que conjura probabilisticamente (não em timer fixo) quando tem mana disponível.
- Dano físico dos inimigos é reduzido por Armadura usando fórmula de retornos decrescentes (estilo Dota real): `resistência = (armadura*0.06)/(1+armadura*0.06)`.
- Existe sistema de crítico, evasão, bloqueio de dano, roubo de vida, etc.
- Inimigos escolhem alvo com base em um sistema de "aggro" ponderado por atributo (heróis de Força puxam muito mais agressividade — funcionam como tanques naturais).

Veja `01-formulas-combate.md` para todas as fórmulas exatas (dano, XP, custo de level, HP/dano de inimigo por estágio).

### Sistema de Heróis

- Heróis reais de Dota 2 (Sven, Crystal Maiden, Drow Ranger, Juggernaut, Lina, Axe, Invoker, etc.), cada um com atributo primário (Força/Agilidade/Inteligência/Universal), stats base, crescimento por nível, e uma habilidade única com fórmula própria.
- Heróis avançam de nível ganhando XP em combate; cada nível dá 1 ponto de habilidade (até nível 4 em cada uma das 3 habilidades) e libera a ultimate em certos níveis.
- Existe também uma **árvore de talentos genérica por herói** (separada das habilidades), com tiers desbloqueando a cada 10 níveis, dando bônus passivos (HP, armadura, crítico, etc.).
- Heróis são recrutados com uma moeda chamada **Shards**; alguns heróis "premium" exigem uma assinatura (Dota Plus) + moeda premium (Dota Coins).
- Sinergias de time: bônus por combinações de atributo (time todo-Força, etc.) ou combos nomeados de heróis específicos.

Veja `02-herois.md` para a lista detalhada de heróis com fórmulas de habilidade.

### Itens e Equipamento

- 6 slots de equipamento normais + 1 slot exclusivo de "Artefato" (itens lendários únicos, sem sistema de raridade — stats fixos e poderosos).
- 7 tiers de raridade: Comum, Incomum, Raro, Épico, Lendário, Mítico, Imortal — cada um com cor própria e multiplicador de stats.
- Itens têm um sistema de "Tier" adicional (+0 a +10) que pode ser upado na Forja, multiplicando ainda mais os stats.
- Sistema de pity (garantia): após um certo número de mortes sem dropar Épico+, a próxima drop é garantida Épico ou melhor. O mesmo vale para Lendário+ em uma escala maior.
- Itens Raros+ podem rolar "modificadores" especiais (ricochete, dano em área, escudo condicional, etc.)

Veja `03-itens-e-raridades.md` para a lista de itens base, artefatos, e modificadores.

### Forja Ancestral (sistema de crafting profundo, desbloqueado progressivamente por nível da Forja)

8 módulos, cada um desbloqueado em um nível diferente de Forja: Síntese (upgrade de tier + fusão de itens), Alquimia (conversão de materiais + afinidades elementais), Criação (craft de item novo), Lapidação (gemas em slots), Gravação (reroll de stat secundário), Inscrição (runewords com efeitos especiais), Extração (recuperar gemas/inscrições), e Oferenda (sacrificar itens por "Favor do Altar" que compra bênçãos temporárias).

Veja `04-forja.md` para os detalhes completos de cada módulo, custos e fórmulas.

### Rune Nexus (árvore de talentos meta, tipo "constelação")

Uma árvore de nós visualmente conectados (renderizada como SVG, tipo constelação de estrelas) dividida em 6 "caminhos" temáticos (Guerra, Sobrevivência, Fortuna, Sabedoria, Formação, Automação). Nós comuns custam ouro, nós especiais custam "Fragmentos de Runa", e "keystones" (nós de elite, máximo 3 equipados simultaneamente) custam "Sigilos Ancestrais". A árvore é dividida em 4 "anéis" que desbloqueiam progressivamente conforme o jogador investe níveis totais e cumpre marcos (derrotar o boss Roshan, fazer Prestígio).

Veja `05-rune-nexus.md` para a lista completa de nós.

### Moedas (todas devem existir e ter fontes/usos claros)

- **Ouro**: moeda básica, ganho matando inimigos, gasto em quase tudo.
- **Essência** 🧪: drop garantido de bosses, usada para upar Tier de itens na Forja.
- **Shards** 💎: ganho de elites/bosses/PvP, usado para recrutar heróis.
- **Essência Ancestral** ⚜️: ganho ao fazer Prestígio, gasto numa árvore de talentos permanente simples.
- **Dota Coins** 🪙: moeda "premium" (simulada, sem gateway de pagamento real), ganho vendendo no mercado ou PvP, gasto em assinatura Dota Plus, slots de time extras, mochilas extras, heróis premium, baús gacha.
- **Fragmentos de Runa** 🔷 e **Sigilos Ancestrais** ⚜️: moedas do Rune Nexus.
- **Materiais da Forja** (Comum/Raro/Épico): usados em quase todos os módulos da Forja.

### PvP Arena

Sistema de lobby: o jogador cria um lobby, é pareado com um "bot" com nome de jogador pro real de Dota (Dendi, Miracle-, Arteezy, etc.) com MMR fixo, confirma o time, e o duelo é resolvido por uma fórmula de probabilidade (não é uma simulação de combate real — é uma rolagem de "quem ganha" baseada na diferença de MMR e "poder" do time). MMR sobe/desce conforme vitória/derrota, com divisões nomeadas (Arauto → Imortal, espelhando o sistema de rank real do Dota). Há um leaderboard global.

Veja `06-pvp-e-progressao.md` para fórmulas de MMR/poder e a lista completa de sistemas de progressão (Prestígio, Compêndio, Talentos Ancestrais, Manobras Táticas).

### Requisitos técnicos

- Next.js App Router, TypeScript, componentes React (não HTML/JS puro).
- Game loop client-side: um hook (`useGameLoop`) rodando a cada ~100ms atualizando um store global (Zustand), sem tocar DOM diretamente — renderização deve ser reativa via componentes assinando o store.
- Persistência: já tenho endpoints `GET/POST /api/save` que recebem/retornam `{ state: <objeto JSON> }` associado ao usuário logado (auth via NextAuth/next-auth já implementado) — o jogo deve carregar o save ao montar e autosalvar a cada ~10s.
- Priorize implementar primeiro a Combat Arena (loop de combate + progressão de estágio) como base funcional, depois Hero Lineup, depois as demais abas (Loja, Forja, Rune Nexus, PvP, Wiki).
- Use TypeScript com tipos fortes para o shape do estado do jogo (heróis, inventário, moedas, progresso de estágio).

Comece gerando a estrutura de componentes e o store de estado com o shape completo de dados, depois implemente a Combat Arena funcionando de ponta a ponta (herói ataca, inimigo morre, ganha ouro/XP, avança onda).
