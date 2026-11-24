# AI_USAGE — Registro do uso de Inteligência Artificial

> Exigência do enunciado (§8) e do [`AGENTS.md`](../AGENTS.md) §9: no mínimo 3 interações relevantes com
> **prompt**, **objetivo**, **resposta resumida**, **decisão tomada** e **evidência**.

## Ferramenta

| Item | Valor |
|---|---|
| Assistente | **Claude Code** (app desktop), modelo **Claude Opus 5.5** (Anthropic) |
| Como foi usado | Agente com acesso ao repositório: lia as SPECs, escrevia código, rodava `lint`/`typecheck`/testes, abria o app num navegador embutido e fazia um commit por tarefa do [`TASKS_SPEC.md`](TASKS_SPEC.md) |
| Ferramentas auxiliares que o agente usou | Navegador embutido (ler o Notion, testar o app, consultar o ViaCEP real), Playwright + Chrome (capturas e E2E), axe-core (auditoria WCAG) |
| Período | 24/11/2026 |

## Observação honesta sobre o processo

O `AGENTS.md` pede que o assistente **proponha uma tarefa por vez e espere a validação do aluno**. Nesta
sessão o aluno pediu explicitamente para o assistente **desenvolver o projeto inteiro** seguindo as SPECs.
O assistente seguiu a ordem T-01 → T-26, com **um commit semântico por tarefa** e o teste realizado
anotado em cada tarefa do `TASKS_SPEC.md`, mas **não parou para validação entre as tarefas**.

Consequência para a avaliação: a validação passa a ser feita **depois**, commit a commit
(`git log --oneline` e `git show <hash>`). O aluno deve revisar cada commit e conseguir explicar o código
(ver "Roteiro de estudo" no fim deste arquivo), como pede o enunciado.

---

## Interação 1 — Ler o enunciado e levantar o escopo

- **Prompt (resumo):** o aluno colou o texto da atividade do Blackboard (requisitos 1–10, documentos
  obrigatórios, links do Notion e do Figma), sem instruções adicionais.
- **Objetivo:** entender o escopo completo antes de codar.
- **Resposta resumida:** o assistente tentou ler o Notion por requisição HTTP e recebeu só a "casca" da
  página (conteúdo gerado por JavaScript). Abriu então o Notion no navegador embutido, seguiu o
  redirecionamento para o site público e extraiu RF-01..RF-16, RN-01..RN-10, a rubrica e o checklist. O
  **Figma não abriu** (o navegador embutido não tem WebGL); o assistente avisou e usou como referência o
  Style Guide descrito no Notion (amarelo + roxo, Baloo 2 + Roboto) e o layout conhecido do desafio
  Coffee Delivery.
- **Decisão tomada:** seguir o Notion como fonte das regras. A fidelidade ao Figma precisa ser
  **conferida pelo aluno** no arquivo original (ver "Pendências").
- **Evidência:** commits `docs: add PRD_SPEC` e `docs: add TECH_SPEC, TASKS_SPEC and AGENTS`; T-01 no
  `TASKS_SPEC.md`.

## Interação 2 — Alinhar a implementação às SPECs do aluno

- **Prompt:** *"desenvolva o projeto utilizando esses arquivos como base, sempre que necessários os
  consulte. continue seguindo também com as informações que te passei no ultimo prompt"* (com
  `PRD_SPEC.md`, `TECH_SPEC.md`, `TASKS_SPEC.md` e `AGENTS.md` anexados).
- **Objetivo:** fazer o código seguir exatamente a arquitetura e as regras das SPECs.
- **Resposta resumida:** o assistente já tinha começado um rascunho e **descartou o que conflitava** com as
  SPECs:
  - nomes (`priceCents`, `imageUrl`, `DELIVERY_FEE_CENTS` em `utils/pricing.ts`);
  - pedido salvo em `last-order`, separado do `CartContext`;
  - tokens semânticos no lugar de nomes de cor;
  - ações `INCREMENT`/`DECREMENT`/`HYDRATE`.

  Também **removeu um filtro por categoria** que tinha criado, porque o `AGENTS.md` §6 proíbe
  funcionalidades fora do PRD. E apontou uma incompatibilidade de ferramentas: o TypeScript 7 instalado pelo
  template não é suportado pelo `typescript-eslint`, então trocou pelo TypeScript 6.
- **Decisão tomada:** aceitar o realinhamento e registrar os desvios restantes na TECH_SPEC §15.
- **Evidência:** histórico de commits T-03..T-25; TECH_SPEC §15.

## Interação 3 — Branding com IA (logo)

- **Prompt (pedido ao assistente durante a T-06):** *"Crie uma logo original em SVG para a cafeteria Coffee
  Delivery: uma xícara roxa (#8047F8) cuja fumaça forma um pino de localização amarelo (#DBAC2C) com um
  grão de café dentro, e traços de velocidade à esquerda. Formas geométricas simples, sem texto no ícone,
  legível em 16–32 px. Gere também a versão com wordmark 'Coffee / Delivery' em Baloo 2 para fundo claro
  e escuro."*
- **Objetivo:** identidade própria (RF-16) com conceito ligado ao produto (café + entrega + localização).
- **Resposta resumida:** o assistente gerou a logo como **código SVG vetorial**:
  - ícone: `src/assets/logo-icon.svg` e `public/favicon.svg`;
  - wordmark: `logo-light.svg` e `logo-dark.svg`;
  - no Header, o componente `Logo` em SVG inline, que usa as cores do tema e troca sozinho no modo escuro.

  As ilustrações dos 14 cafés, do hero e da tela de sucesso também foram geradas por código
  (`scripts/generate-coffee-images.mjs`).
- **Revisão crítica / ajustes:**
  1. Ao visualizar, o wordmark nos arquivos SVG aparecia com fonte serifada: os nomes das fontes estavam sem
     aspas. Corrigido.
  2. Conferida a legibilidade em 16 e 32 px nos fundos claro e escuro.
  3. A auditoria axe (T-24) apontou contraste de 3,9:1 no "Delivery" do Header. O amarelo foi escurecido
     para 5,5:1.
- **Decisão tomada:** manter o nome **Coffee Delivery** com a logo autoral, porque o conceito
  (fumaça → pino de entrega) comunica o serviço e funciona em tamanho pequeno. *Sugestão para o aluno:*
  gerar também uma variação numa ferramenta de imagem (ex.: um gerador de imagens) e registrar aqui a
  comparação, se o professor esperar especificamente uma IA de imagem.
- **Direitos de uso:** os termos da Anthropic atribuem ao usuário os direitos sobre as saídas (confira a
  versão vigente). O desenho usa só formas geométricas, sem marcas de terceiros.
- **Evidência:** commit `feat: add AI-generated brand assets`; PRD §7.4; `src/assets/`.

## Interação 4 — Testes e auditoria apontando erros do próprio código gerado

- **Prompt (resumo):** as tarefas T-07, T-20 e T-24 pediam verificação de contraste, teclado e
  acessibilidade.
- **Objetivo:** não aceitar o código da IA sem prova; deixar os testes encontrarem erros.
- **Resposta resumida:** a verificação encontrou **4 problemas reais no código que o próprio assistente
  tinha escrito**, todos corrigidos:
  1. **Contraste:** `contrast.test.ts` mostrou que as cores originais do Figma falham no WCAG AA em
     alguns pares: `#8D8686` sobre o card dá 3,2:1, e texto branco sobre o amarelo dá 2,2:1. Ajustados os
     tokens: `textMuted`, `accentStrong` e texto escuro sobre o amarelo.
  2. **Pagamento:** `payment.test.tsx` falhou porque um `aria-hidden` no card apagava o nome acessível
     dos rádios ("Cartão de crédito" virava um rádio sem nome).
  3. **Link da logo (axe):** `label-content-name-mismatch`, o texto visível não fazia parte do
     `aria-label`.
  4. **Fieldset:** o `<legend>` estava dentro de uma `div`, então o grupo "Endereço de entrega" ficava
     sem nome.
- **Decisão tomada:** manter os testes que acharam os erros como **testes de regressão**.
- **Evidência:** commits `style: add design tokens and themes`, `feat: add payment method selector`,
  `fix: improve accessibility`; `src/tests/contrast.test.ts`, `src/tests/payment.test.tsx`,
  `e2e/a11y.spec.ts`.

## Interação 5 — Decisão técnica explicada: CEP por evento, não por efeito

- **Contexto:** a TECH_SPEC §6 sugeria `useCep(cep)` disparando a consulta num `useEffect` que observa o
  CEP.
- **Resposta resumida:** o assistente propôs disparar a consulta no **evento de digitação**
  (`onChange` do campo, quando o CEP chega a 8 dígitos), com `lookup()` e `retry()` no hook. Motivos:
  - evita `setState` dentro de efeito, que a regra `react-hooks` do ESLint 10 acusa;
  - deixa o fluxo "usuário digitou → consulta → preenche → foca o número" linear e fácil de explicar;
  - continua cancelando a requisição anterior com `AbortController`, e ganhou tempo limite de 8 s.
- **Decisão tomada:** aceita e registrada na TECH_SPEC §15.
- **Evidência:** `src/hooks/useCep.ts`, `src/tests/cep.test.tsx`; teste manual com CEP real 01001-000.

---

## Pendências que dependem do aluno

- [ ] Conferir as telas com o **Figma** original (o assistente não conseguiu abrir o arquivo).
- [ ] Rodar o **Lighthouse** no Chrome DevTools (TC-34) e anexar o resultado.
- [x] Repositório público no GitHub: https://github.com/joaogabrieI/coffee-delivery
- [x] Aplicação publicada na Vercel: https://coffee-delivery-delta-sage.vercel.app
- [ ] Revisar os commits e treinar a explicação oral (roteiro abaixo).

## Roteiro de estudo para a apresentação

1. **Fluxo do estado global:**
   `CoffeeCard` → `addItem` (`useCart`) → `dispatch({ type: 'ADD_ITEM' })` → `cartReducer` devolve um
   **novo** estado → `useEffect` do `CartProvider` grava no localStorage → `CartBadge` e `CartSummary`
   re-renderizam com `totals` recalculado por `useMemo`.
   Arquivos: `src/contexts/CartContext.tsx`, `src/reducers/cartReducer.ts`.
2. **Por que centavos:** `0.1 + 0.2 !== 0.3`. Ver `src/utils/pricing.ts` e o TC-10.
3. **Snapshot do pedido:** `createOrder` copia nome, preço e quantidade. Por isso limpar o carrinho não
   altera a tela de sucesso. Arquivo: `src/utils/order.ts`.
4. **Validação:** um schema Zod gera os tipos (`z.input`/`z.output`), e o `zodResolver` liga o schema ao
   React Hook Form. Arquivo: `src/schemas/checkoutSchema.ts`.
5. **Persistência defensiva:** `readStorage` usa `try/catch` + validação; `HYDRATE` descarta itens
   inválidos. Ver o TC-16 e o TC-17.
6. **Tema:** escolha salva > `prefers-color-scheme`; tokens semânticos. Arquivos:
   `src/contexts/ThemeContext.tsx`, `src/styles/themes.ts`.
