# AGENTS.md — Diretrizes para o assistente de IA

> Este arquivo orienta qualquer assistente de IA (Codex, OpenCode, GitHub Copilot, Claude, ChatGPT ou equivalente) que atue neste repositório. **Leia-o por inteiro antes de agir.**

## 1. Regra nº 1 — Leia as SPECs antes de escrever código
Antes de qualquer alteração, leia, nesta ordem:
1. [`docs/PRD_SPEC.md`](docs/PRD_SPEC.md) — o que construir (RF-01..RF-16, RN-01..RN-10).
2. [`docs/TECH_SPEC.md`](docs/TECH_SPEC.md) — como construir (stack, tipos, reducer, rotas, testes).
3. [`docs/TASKS_SPEC.md`](docs/TASKS_SPEC.md) — o que fazer agora (próxima tarefa).
4. O Figma de referência (Home, Checkout, Sucesso, Style Guide).

Se algo contradisser as SPECs, **pare e pergunte**; não decida sozinho. Se uma decisão mudar, proponha a atualização da SPEC correspondente.

## 2. Contexto do projeto
- **Projeto:** Coffee Delivery — projeto final da disciplina Single Page Application (SPA).
- **O que é:** SPA de cafeteria com catálogo, carrinho, checkout (endereço via API de CEP + pagamento fictício) e tela de confirmação.
- **Fora do escopo:** backend, autenticação, banco de dados, pagamento real, painel admin, chatbot dentro do app.
- **Figma:** arquivo "Coffee Delivery | Projeto Final React" — Home (frame 2:1550), Checkout (217:511), Confirmação (222:824) e Style Guide. Identidade de referência: amarelo + roxo; fontes Baloo 2 (títulos) e Roboto (texto). A marca pode ser personalizada (logo criada com IA).
- **Objetivo pedagógico:** o aluno deve **entender e conseguir explicar** o código. Priorize clareza a "esperteza".

## 3. Tecnologias
React + Vite + TypeScript (`strict`) · React Router (`/`, `/checkout`, `/success`) · Context API + `useReducer` · hooks customizados · `localStorage` · React Hook Form + Zod · styled-components · ViaCEP · Vitest + React Testing Library (Playwright opcional) · ESLint + Prettier · Git/GitHub.

Não adicione bibliotecas novas sem justificar e sem registrar na TECH_SPEC (seção 1).

## 4. Como trabalhar (processo)
1. **Uma tarefa pequena por vez**, seguindo `docs/TASKS_SPEC.md`. **Nunca gere a aplicação inteira de uma só vez.**
2. Antes de codar, **proponha a próxima tarefa** com: objetivo, requisitos relacionados (IDs RF/RN), arquivos afetados, critérios de aceite e **plano de testes**. Aguarde a validação do aluno.
3. Implemente em passos curtos; **explique as decisões** (por que, não só o quê), especialmente Context API, `useReducer`, hooks, props, TypeScript, formulários e persistência.
4. Rode lint, typecheck e testes; informe o resultado real (não afirme que passou sem executar).
5. Ao concluir: marque o checklist da tarefa, registre o teste realizado e sugira o commit semântico.
6. Peça ao aluno que **valide o resultado antes de avançar**.

## 5. Boas práticas obrigatórias
**TypeScript**
- `strict: true`; **proibido `any`** (use tipos corretos, `unknown` + validação ou Zod).
- Tipos de domínio em `src/types/`; derive tipos de schemas com `z.infer`.

**Estado e imutabilidade**
- Reducer **puro**; nunca mutar estado (`push`, `splice`, atribuição direta). Use `map`, `filter`, `find`, `reduce` e spread.
- Estado derivado (linhas, totais, unidades) é **calculado**, não armazenado.

**Dinheiro**
- Valores em **centavos (inteiros)**; formatação BRL somente na exibição (`Intl.NumberFormat`).
- A taxa de entrega existe em **um único lugar**: `DELIVERY_FEE_CENTS` em `src/utils/pricing.ts`.

**Arquitetura**
- Separar dados, tipos, componentes, páginas, contextos, reducers, hooks, utilitários, estilos e testes (ver TECH_SPEC §2–3).
- **Não concentrar regras no `App.tsx`.** Regras de negócio ficam em `utils/` e `reducers/`, não em componentes.
- Componentes pequenos, com props tipadas, um por arquivo.

**Acessibilidade e UI**
- WCAG 2.2 AA: teclado, foco visível, `label` associado, `aria-invalid`/`aria-describedby`, `aria-live` para erros e contador, contraste nos dois temas, alvos de toque ≥ 44 px.
- Mobile first (320/375/390, 768, 1280/1440). Tokens semânticos de tema; nada de cores soltas no componente.

**Persistência e dados externos**
- Chaves versionadas (`coffee-delivery:cart:v1`, `:theme`, `:last-order:v1`); leitura defensiva (`try/catch` + validação).
- ViaCEP: consultar só com 8 dígitos, cancelar requisição anterior, tratar `loading`, inválido, não encontrado e falha; **nunca sobrescrever** número e complemento.

**Segurança e privacidade**
- Não coletar dados de cartão nem simular transações reais. Não commitar segredos.

## 6. Limites de escopo (o que o agente NÃO deve fazer)
- Não gerar o app inteiro, nem várias tarefas de uma vez.
- Não adicionar funcionalidades fora do PRD (cupons, login, backend, múltiplas moedas, etc.).
- Não alterar as SPECs sem avisar o aluno e justificar.
- Não refatorar código fora da tarefa corrente.
- Não usar `any`, `// @ts-ignore` ou `eslint-disable` como atalho.
- Não aceitar nem aplicar decisões "às cegas": aponte riscos, alternativas e trade-offs.
- Não escrever código que o aluno não consiga explicar; se algo for complexo, simplifique ou explique passo a passo.

## 7. Padrão de commits (Conventional Commits)
Formato: `tipo: descrição curta no imperativo` (ex.: `feat: add cart reducer`).

| Tipo | Uso |
|---|---|
| `feat:` | nova funcionalidade |
| `fix:` | correção de bug |
| `docs:` | documentação (SPECs, README, AI_USAGE) |
| `test:` | testes |
| `refactor:` | refatoração sem mudar comportamento |
| `style:` | estilo/visual/formatação (sem mudar lógica) |

Um commit por tarefa (ou menos). Mensagens em inglês ou português, **de forma consistente** no repositório.

## 8. Testes e qualidade
- Toda lógica nova (reducer, pricing, schema, storage) vem com teste (casos TC-xx da TECH_SPEC §11).
- Teste **comportamento do usuário** (React Testing Library), não detalhes de implementação.
- Antes de concluir uma tarefa, execute: `npm run lint`, `npm run typecheck` e `npm run test:run`.
- Verifique manualmente os dois temas e pelo menos uma largura mobile para tarefas de UI.

## 9. Registro do uso de IA
Documente em `docs/AI_USAGE.md` (mínimo **3 interações relevantes**): **prompt**, **objetivo**, **resposta resumida**, **decisão tomada** e **evidência** (commit, print ou teste). Registre também o uso de IA no branding (ferramenta, prompt, resultado, motivo da escolha).

## 10. Prompt inicial sugerido (personalize)
> Atue como mentor de React e TypeScript neste projeto final Coffee Delivery. Leia `PRD_SPEC.md`, `TECH_SPEC.md`, `TASKS_SPEC.md`, `AGENTS.md` e o Figma. Identifique requisitos, dependências, componentes e riscos. Proponha apenas a próxima tarefa pequena, com critérios de aceite e um plano de testes. Não implemente toda a aplicação de uma vez. Explique as decisões e peça que eu valide o resultado antes de avançar.

## 11. Checklist rápido do agente (antes de entregar uma tarefa)
- [ ] Li as SPECs e a tarefa corresponde ao `TASKS_SPEC.md`.
- [ ] Citei os IDs RF/RN atendidos.
- [ ] Sem `any`, sem mutação de estado, valores em centavos.
- [ ] Lint, typecheck e testes executados (resultado informado).
- [ ] Acessibilidade e tema verificados quando for UI.
- [ ] Expliquei as decisões e sugeri o commit semântico.
- [ ] Pedi validação do aluno antes de avançar.
