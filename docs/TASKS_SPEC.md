# TASKS_SPEC — Plano de implementação

> **Projeto Final 05 — Coffee Delivery (React + TypeScript + IA)**
> Requisitos: [`PRD_SPEC.md`](./PRD_SPEC.md) · Técnica: [`TECH_SPEC.md`](./TECH_SPEC.md) · IA: [`../AGENTS.md`](../AGENTS.md)

## Como usar este checklist
1. Trabalhar **uma tarefa por vez**, na ordem. Não iniciar a seguinte sem concluir a atual.
2. Ao finalizar: marcar `[x]`, atualizar o **Status**, registrar o **teste realizado** (comando ou verificação manual) e fazer **commit semântico** (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `style:`).
3. Cada tarefa deve caber em um commit pequeno. Se crescer, dividir.
4. Registrar pelo menos 3 interações relevantes com a IA em `docs/AI_USAGE.md` (prompt, objetivo, resposta resumida, decisão, evidência).

**Status:** `A fazer` · `Em andamento` · `Concluída` · `Bloqueada`

---

## Fase 0 — Análise e planejamento

### [x] T-01 — Análise do Figma e rascunho do PRD
- **Objetivo:** identificar telas, estados, componentes e fluxos; entregar o 1º rascunho do PRD.
- **Requisitos:** todos (visão geral), RF-01..RF-16, RN-01..RN-10
- **Arquivos:** `docs/PRD_SPEC.md`
- **Pronto quando:** PRD com visão, escopo/exclusões, fluxos, RF/RN e decisões de produto (frete, quantidades, marca, tema, estados vazios).
- **Teste:** revisão do PRD contra o enunciado e o Figma (Home, Checkout, Sucesso).
- **Commit:** `docs: add PRD_SPEC`
- **Status:** Concluída
- **Teste realizado:** Revisão do PRD contra o enunciado (Blackboard) e a página do Notion (RF-01..16, RN-01..10, rubrica). Figma não pôde ser aberto no navegador de apoio (sem WebGL); layout seguido a partir do Style Guide descrito no enunciado.

### [x] T-02 — TECH_SPEC, TASKS_SPEC e AGENTS.md
- **Objetivo:** fechar o planejamento técnico antes de codar.
- **Requisitos:** todos (rastreabilidade)
- **Arquivos:** `docs/TECH_SPEC.md`, `docs/TASKS_SPEC.md`, `AGENTS.md`
- **Pronto quando:** stack justificada, tipos, reducer, rotas, schema, testes e matriz PRD→técnica; checklist e diretrizes da IA prontos.
- **Teste:** conferir que todo RF/RN aparece na matriz da TECH_SPEC.
- **Commit:** `docs: add TECH_SPEC, TASKS_SPEC and AGENTS`
- **Status:** Concluída
- **Teste realizado:** Conferido que todos os RF/RN aparecem na matriz da TECH_SPEC §14.

---

## Fase 1 — Configuração

### [x] T-03 — Criar projeto Vite + React + TypeScript e repositório
- **Objetivo:** projeto rodando com Git/GitHub configurado.
- **Requisitos:** RF-07 (base), qualidade
- **Arquivos:** `package.json`, `tsconfig.json` (`strict`), `vite.config.ts`, `.gitignore`, `README.md`
- **Pronto quando:** `npm run dev` abre a página; repositório no GitHub com 1º commit.
- **Teste:** `npm run dev`, `npm run build`, `npm run typecheck` sem erros.
- **Commit:** `chore: scaffold vite react typescript` *(usar `docs:`/`feat:` se preferir manter só os prefixos exigidos)*
- **Status:** Concluída
- **Teste realizado:** npm run typecheck e npm run build sem erros (Vite 8, React 19, TypeScript 6 strict).

### [x] T-04 — Dependências, ESLint, Prettier e Vitest
- **Objetivo:** instalar bibliotecas e ferramentas de qualidade/teste.
- **Requisitos:** qualidade; base de RF-08, RF-14
- **Arquivos:** `package.json`, `eslint.config.js`, `.prettierrc`, `vitest.config.ts` / `vite.config.ts`, `src/tests/setup.ts`
- **Pronto quando:** scripts `lint`, `typecheck`, `test`, `test:run` funcionam; 1 teste de fumaça passa.
- **Teste:** `npm run lint && npm run typecheck && npm run test:run`.
- **Commit:** `chore: add tooling and test setup`
- **Status:** Concluída
- **Teste realizado:** npm run lint && npm run typecheck && npm run test:run — 1 teste de fumaça passou. (oxlint do template trocado por ESLint + Prettier, conforme TECH_SPEC.)

### [x] T-05 — Estrutura de pastas, rotas e layout base
- **Objetivo:** criar a árvore de diretórios e as 3 rotas com páginas vazias.
- **Requisitos:** RF-07
- **Arquivos:** `src/App.tsx`, `src/main.tsx`, `src/pages/{Home,Checkout,Success}.tsx`, `src/components/PageLayout/`
- **Pronto quando:** `/`, `/checkout` e `/success` navegam sem recarregar a página.
- **Teste:** manual (navegar entre as rotas); TC-30 (parcial).
- **Commit:** `feat: add routes and base layout`
- **Status:** Concluída
- **Teste realizado:** routes.test.tsx: /, /checkout, /success e rota inexistente renderizam o <h1> certo (4 testes). Navegação sem reload verificada depois no navegador com <Link>.

---

## Fase 2 — Identidade e tema

### [x] T-06 — Branding com IA (logo, paleta, tipografia, favicon)
- **Objetivo:** criar logo original com IA e definir a identidade.
- **Requisitos:** RF-16
- **Arquivos:** `src/assets/logo-*.{svg,png}`, `public/favicon.*`, `docs/PRD_SPEC.md` §7.4 ou `README.md` (seção "Branding com IA")
- **Pronto quando:** logo claro/escuro salva; conceito, prompt, ferramenta e motivo registrados; legível em 32 px; direitos de uso verificados.
- **Teste:** visualizar em 32 px e nos dois fundos; sem imagem quebrada.
- **Commit:** `feat: add AI-generated brand assets`
- **Status:** Concluída
- **Teste realizado:** Logo e favicon visualizados no navegador em 16, 32 e 300 px, sobre fundo claro (#FAFAFA) e escuro (#16120F); nenhuma imagem quebrada.

### [x] T-07 — Tokens e temas claro/escuro (styled-components)
- **Objetivo:** definir tokens semânticos, `lightTheme`/`darkTheme`, `GlobalStyle` e fontes.
- **Requisitos:** RF-14, RF-15
- **Arquivos:** `src/styles/{tokens,themes,GlobalStyle}.ts`, `src/styles/styled.d.ts`, `index.html`
- **Pronto quando:** ambos os temas implementam a mesma interface; contraste AA verificado; fontes Baloo 2 + Roboto carregando.
- **Teste:** checagem de contraste dos pares texto/fundo, botão e foco nos 2 temas.
- **Commit:** `style: add design tokens and themes`
- **Status:** Concluída
- **Teste realizado:** contrast.test.ts: 18 pares texto/fundo, botão e foco verificados nos 2 temas (≥4,5:1 texto, ≥3:1 ícones/foco) + mesma interface nos 2 temas. Ajustes vs. Figma: textMuted #736B69, accentStrong #B06F0F, texto escuro sobre amarelo.

### [x] T-08 — ThemeProvider, `useTheme` e `ThemeToggle`
- **Objetivo:** alternar e persistir o tema (fallback `prefers-color-scheme`).
- **Requisitos:** RF-14
- **Arquivos:** `src/contexts/ThemeContext.tsx`, `src/hooks/{useTheme,useLocalStorage}.ts`, `src/components/ThemeToggle/`
- **Pronto quando:** botão acessível alterna o tema; escolha persiste após refresh; sem escolha usa o do sistema.
- **Teste:** TC-29 + manual (refresh).
- **Commit:** `feat: add theme toggle with persistence`
- **Status:** Concluída
- **Teste realizado:** theme.test.tsx (TC-29): sistema escuro sem escolha → dark; alternar muda data-theme/aria-pressed e grava; escolha salva vence o sistema; valor corrompido ignorado. Manual: alternado no navegador e recarregado (F5) — escolha mantida com sistema em modo escuro.

---

## Fase 3 — Domínio, catálogo e carrinho

### [ ] T-09 — Tipos, catálogo local e utilitários de preço/formatação
- **Objetivo:** modelar o domínio e as regras de cálculo em centavos.
- **Requisitos:** RF-01, RF-10, RN-03, RN-04, RN-08
- **Arquivos:** `src/types/*.ts`, `src/data/coffees.ts`, `src/utils/{pricing,format}.ts`
- **Pronto quando:** `Coffee`, `CartItem`, `DeliveryAddress`, `PaymentMethod`, `Order` tipados; `DELIVERY_FEE_CENTS` único; funções puras exportadas.
- **Teste:** TC-09, TC-10, TC-11, TC-12, TC-13 (Vitest).
- **Commit:** `feat: add domain types, catalog and pricing utils` + `test: cover pricing and formatting`
- **Status:** A fazer

### [ ] T-10 — Header e logo
- **Objetivo:** Header com logo, `ThemeToggle` e espaço para o contador.
- **Requisitos:** RF-04 (base), RF-16
- **Arquivos:** `src/components/Header/`, `src/components/PageLayout/`
- **Pronto quando:** logo visível nos 2 temas; navegação por teclado funcional.
- **Teste:** TC-33 + manual (teclado).
- **Commit:** `feat: add header with brand logo`
- **Status:** A fazer

### [ ] T-11 — Catálogo: `CoffeeCard` e `CoffeeCatalog` (responsivos)
- **Objetivo:** exibir os cafés com imagem, nome, descrição, preço e tags.
- **Requisitos:** RF-01, RF-15
- **Arquivos:** `src/components/{CoffeeCard,CoffeeCatalog}/`, `src/pages/Home.tsx`
- **Pronto quando:** grid 1/2/3/4 colunas conforme breakpoint; sem imagem quebrada; `alt` presente.
- **Teste:** TC-20 + manual em 320/390/768/1280 px.
- **Commit:** `feat: add responsive coffee catalog`
- **Status:** A fazer

### [ ] T-12 — `cartReducer` (puro) com testes
- **Objetivo:** implementar `ADD_ITEM`, `INCREMENT`, `DECREMENT`, `REMOVE_ITEM`, `CLEAR_CART`, `HYDRATE` de forma imutável.
- **Requisitos:** RF-03, RF-05, RF-13, RN-01, RN-02, RN-10
- **Arquivos:** `src/reducers/cartReducer.ts`, `src/tests/cartReducer.test.ts`
- **Pronto quando:** regras RN-01/02 e limite 1..99 cobertos; reducer não muta o estado.
- **Teste:** TC-01..TC-08, TC-17.
- **Commit:** `feat: add cart reducer` + `test: cover cart reducer`
- **Status:** A fazer

### [ ] T-13 — `CartProvider` e `useCart`
- **Objetivo:** expor estado e ações; derivar `lines` e `totals`.
- **Requisitos:** RF-03, RF-04, RF-05, RF-10
- **Arquivos:** `src/contexts/CartContext.tsx`, `src/hooks/useCart.ts`
- **Pronto quando:** ações disponíveis; `totals` derivado por `useMemo`; erro claro fora do provider.
- **Teste:** teste de integração do provider (adicionar/remover e verificar totais).
- **Commit:** `feat: add cart context and useCart hook`
- **Status:** A fazer

### [ ] T-14 — `QuantityInput` e adicionar ao carrinho
- **Objetivo:** selecionar quantidade (1..99) e adicionar cafés.
- **Requisitos:** RF-02, RF-03, RN-01, RN-02
- **Arquivos:** `src/components/QuantityInput/`, `src/components/CoffeeCard/`
- **Pronto quando:** −/+ respeitam limites; adicionar repetido acumula na mesma linha.
- **Teste:** TC-03, TC-04 + TC-21.
- **Commit:** `feat: add quantity input and add-to-cart`
- **Status:** A fazer

### [ ] T-15 — `CartBadge` no Header
- **Objetivo:** mostrar a soma de unidades com link para `/checkout`.
- **Requisitos:** RF-04
- **Arquivos:** `src/components/CartBadge/`, `src/components/Header/`
- **Pronto quando:** contador = soma das quantidades; `aria-label` descreve o total; atualiza imediatamente.
- **Teste:** TC-12, TC-21.
- **Commit:** `feat: add cart badge`
- **Status:** A fazer

### [ ] T-16 — Persistência do carrinho (`localStorage`)
- **Objetivo:** salvar e recuperar o carrinho com leitura defensiva.
- **Requisitos:** RF-06, RN-06, RN-10
- **Arquivos:** `src/hooks/useLocalStorage.ts`, `src/utils/storage.ts`, `src/contexts/CartContext.tsx`
- **Pronto quando:** refresh mantém itens; JSON corrompido/itens inválidos não quebram a app.
- **Teste:** TC-16, TC-17, TC-23 + manual (F5).
- **Commit:** `feat: persist cart in localStorage`
- **Status:** A fazer

---

## Fase 4 — Checkout e sucesso

### [ ] T-17 — Carrinho no Checkout: `CartItem`, `CartSummary`, `EmptyCart`
- **Objetivo:** listar itens, editar/remover e mostrar subtotal, entrega e total.
- **Requisitos:** RF-05, RF-10, RN-03, RN-09
- **Arquivos:** `src/components/{CartItem,CartSummary,EmptyCart}/`, `src/pages/Checkout.tsx`
- **Pronto quando:** totais atualizam na hora; − bloqueado em 1; remover funciona; carrinho vazio mostra `EmptyCart`.
- **Teste:** TC-22 + TC-09.
- **Commit:** `feat: add checkout cart and summary`
- **Status:** A fazer

### [ ] T-18 — Schema Zod e formulário de endereço
- **Objetivo:** formulário com React Hook Form + Zod, labels e erros acessíveis.
- **Requisitos:** RF-08, RF-11, RN-07
- **Arquivos:** `src/schemas/checkoutSchema.ts`, `src/components/DeliveryAddressForm/`
- **Pronto quando:** validações de CEP, número, bairro, cidade e UF; complemento opcional; erros ligados por `aria-describedby`.
- **Teste:** TC-14.
- **Commit:** `feat: add address form with zod validation` + `test: cover checkout schema`
- **Status:** A fazer

### [ ] T-19 — Integração com ViaCEP (`useCep`)
- **Objetivo:** preencher rua, bairro, cidade e UF a partir do CEP.
- **Requisitos:** RF-08, RN-07, RN-08
- **Arquivos:** `src/hooks/useCep.ts`, `src/utils/cep.ts`, `src/components/DeliveryAddressForm/`
- **Pronto quando:** CEP válido preenche os campos e foca o número; trata `loading`, inválido, não encontrado e falha da API (com tentar novamente e edição manual); cancela requisições anteriores.
- **Teste:** TC-24, TC-25 (fetch mockado) + manual com CEP real.
- **Commit:** `feat: integrate ViaCEP lookup`
- **Status:** A fazer

### [ ] T-20 — Seleção de forma de pagamento
- **Objetivo:** escolher crédito, débito ou dinheiro (apenas informativo).
- **Requisitos:** RF-09, RN-05
- **Arquivos:** `src/components/PaymentMethodSelector/`
- **Pronto quando:** exatamente uma opção exigida; navegável por teclado; erro acessível.
- **Teste:** TC-15.
- **Commit:** `feat: add payment method selector`
- **Status:** A fazer

### [ ] T-21 — Confirmar pedido, snapshot e limpeza do carrinho
- **Objetivo:** validar, criar `Order` (snapshot), salvar `last-order`, limpar carrinho e navegar.
- **Requisitos:** RF-11, RF-12, RF-13, RN-06, RN-10
- **Arquivos:** `src/pages/Checkout.tsx`, `src/utils/storage.ts`, `src/schemas/orderSchema.ts`
- **Pronto quando:** confirmar bloqueado com carrinho vazio/formulário inválido; pedido válido vai a `/success` e zera o carrinho.
- **Teste:** TC-26, TC-27.
- **Commit:** `feat: confirm order with snapshot`
- **Status:** A fazer

### [ ] T-22 — Tela de sucesso (`OrderSuccess`) e estado vazio
- **Objetivo:** exibir endereço, pagamento e valores do pedido concluído.
- **Requisitos:** RF-12, RF-13, RN-06, RN-09
- **Arquivos:** `src/components/OrderSuccess/`, `src/pages/Success.tsx`
- **Pronto quando:** resumo correto mesmo com carrinho vazio e após refresh; sem pedido → estado vazio com link p/ Home.
- **Teste:** TC-27, TC-28.
- **Commit:** `feat: add order success page`
- **Status:** A fazer

---

## Fase 5 — Refino, qualidade e entrega

### [ ] T-23 — Responsividade e dark mode em todas as telas
- **Objetivo:** garantir fluxo completo nos 2 temas e em 320–1440 px.
- **Requisitos:** RF-14, RF-15
- **Arquivos:** componentes e páginas (ajustes de estilo)
- **Pronto quando:** sem rolagem horizontal; endereço/resumo em coluna no mobile; alvos de toque ≥ 44 px; checkout e sucesso respeitam o tema.
- **Teste:** TC-30, TC-32 (manual/Playwright em 320, 390, 768, 1280).
- **Commit:** `style: polish responsive layout and dark mode`
- **Status:** A fazer

### [ ] T-24 — Acessibilidade (WCAG 2.2 AA)
- **Objetivo:** revisar teclado, foco, rótulos, contraste e anúncios de erro.
- **Requisitos:** RF-11, RF-14, RNF acessibilidade
- **Arquivos:** componentes e páginas
- **Pronto quando:** navegação 100% por teclado; foco visível nos 2 temas; `aria-live` no contador e nos erros; Lighthouse/axe sem falhas críticas.
- **Teste:** TC-31, TC-34.
- **Commit:** `fix: improve accessibility` *(ou `style:`)*
- **Status:** A fazer

### [ ] T-25 — Testes de fluxo e cobertura dos requisitos
- **Objetivo:** completar integração/E2E e fechar lacunas da matriz de rastreabilidade.
- **Requisitos:** RF-01..RF-16, RN-01..RN-10
- **Arquivos:** `src/tests/*`, `e2e/*` (opcional)
- **Pronto quando:** TC-01..TC-29 passam; fluxo completo demonstrado (TC-30).
- **Teste:** `npm run test:run` e, se houver, `npm run test:e2e`.
- **Commit:** `test: add integration and e2e flow tests`
- **Status:** A fazer

### [ ] T-26 — README, AI_USAGE e atualização das SPECs
- **Objetivo:** documentar execução, branding, decisões e uso da IA.
- **Requisitos:** entrega
- **Arquivos:** `README.md`, `docs/AI_USAGE.md`, `docs/*_SPEC.md`
- **Pronto quando:** README com instruções e link do deploy; ≥ 3 interações com IA registradas (prompt, objetivo, resposta resumida, decisão, evidência); SPECs refletem o que foi feito.
- **Teste:** seguir o README do zero em outra máquina/pasta.
- **Commit:** `docs: update README, AI usage and specs`
- **Status:** A fazer

### [ ] T-27 — Deploy e verificação final
- **Objetivo:** publicar e validar a aplicação.
- **Requisitos:** entrega; RF-07 (fallback de rotas)
- **Arquivos:** `vercel.json` / `public/_redirects` (conforme a plataforma)
- **Pronto quando:** URL pública funciona; refresh em `/checkout` e `/success` não dá 404; fluxo completo OK em celular real ou emulado.
- **Teste:** checklist de aceite geral (PRD §8.1).
- **Commit:** `chore: configure deploy`
- **Status:** A fazer

---

## Quadro-resumo

| Fase | Tarefas | Requisitos cobertos |
|---|---|---|
| 0 — Planejamento | T-01, T-02 | todos |
| 1 — Configuração | T-03, T-04, T-05 | RF-07 |
| 2 — Identidade e tema | T-06, T-07, T-08 | RF-14, RF-16 |
| 3 — Domínio e carrinho | T-09 … T-16 | RF-01..06, RF-10; RN-01..04, 06, 08 |
| 4 — Checkout e sucesso | T-17 … T-22 | RF-05, 08..13; RN-05..07, 09, 10 |
| 5 — Refino e entrega | T-23 … T-27 | RF-14, RF-15; qualidade e entrega |
