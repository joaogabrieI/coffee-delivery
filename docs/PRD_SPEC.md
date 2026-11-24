# PRD_SPEC — Product Requirements Document

> **Projeto Final 05 — Coffee Delivery (React + TypeScript + IA)**
> Disciplina: Single Page Application (SPA)
> Versão: 1.0 · Status: rascunho para validação · Documento vivo: atualizar durante a implementação.

Documentos relacionados: [`TECH_SPEC.md`](./TECH_SPEC.md) · [`TASKS_SPEC.md`](./TASKS_SPEC.md) · [`../AGENTS.md`](../AGENTS.md)

---

## 1. Visão geral, problema, objetivos e público-alvo

### 1.1 Visão geral
O **Coffee Delivery** é uma SPA de e-commerce de cafeteria. O cliente consulta o catálogo de cafés, escolhe quantidades, monta um carrinho, informa o endereço de entrega, seleciona a forma de pagamento e recebe a confirmação de um **pedido fictício**. Não há backend, autenticação, banco de dados nem pagamento real.

### 1.2 Problema
Quem quer pedir café por delivery precisa de um fluxo curto e sem fricção: ver o que existe, decidir quanto quer, saber o total (com entrega) antes de confirmar e ter certeza de que o pedido foi registrado. Um catálogo bonito sem fluxo funcional (carrinho, endereço, total e confirmação coerentes) não resolve o problema.

### 1.3 Objetivos
**De produto**
- Permitir concluir um pedido completo (Home → Checkout → Confirmação) em poucos passos, em desktop e celular.
- Mostrar valores corretos e consistentes (subtotal, entrega e total).
- Preservar o carrinho e a preferência de tema entre visitas (refresh).
- Ter identidade visual própria (logo criada com IA), em tema claro e escuro.

**De aprendizagem (disciplina)**
- Planejar antes de implementar (SPECs antes do código).
- Modelar estado e regras de negócio com Context API + `useReducer`, imutabilidade e métodos de array.
- Construir fluxo completo de SPA com React Router, formulários (React Hook Form + Zod) e persistência local.
- Usar IA de forma crítica e documentada; testar, versionar e demonstrar.

### 1.4 Público-alvo
- **Cliente final da cafeteria (persona):** pessoa que pede café/lanche por celular ou computador, quer rapidez, clareza de preço e confirmação do pedido. Nível técnico básico.
- **Avaliador/professor:** verifica o fluxo funcional, a qualidade do código, as SPECs, os testes e o uso da IA.

---

## 2. Escopo, funcionalidades e exclusões

### 2.1 Dentro do escopo
- Catálogo local de cafés (imagem, nome, descrição, preço, tags/categoria).
- Seleção de quantidade e adição ao carrinho; contador de unidades no Header.
- Carrinho editável (aumentar, diminuir, remover) com persistência em `localStorage`.
- Checkout com endereço (consulta de CEP em API pública), forma de pagamento e resumo de valores.
- Tela de sucesso com snapshot do pedido (endereço + pagamento).
- Tema claro/escuro persistido; layout responsivo (mobile first).
- Logo original criada com IA, integrada ao Header e favicon.
- Testes de lógica/validação e demonstração dos fluxos principais.

### 2.2 Fora do escopo (o que **não** será feito)
- Backend próprio, API própria, banco de dados.
- Autenticação, contas de usuário, histórico de pedidos de vários usuários.
- Pagamento real, gateway, cupons, cálculo de frete por distância.
- Painel administrativo / cadastro de produtos.
- Internacionalização (apenas pt-BR) e múltiplas moedas (apenas BRL).
- Rastreamento de pedido em tempo real, notificações, e-mail/SMS.
- Chatbot de IA dentro da aplicação (a IA é usada no **processo de desenvolvimento**).

---

## 3. Fluxos de usuário

### 3.1 Fluxo principal (caminho feliz)
```
Home (/) ──► Checkout (/checkout) ──► Confirmação (/success)
```
1. **Home:** o usuário vê o catálogo, ajusta a quantidade de um café e clica em *Adicionar ao carrinho*. O contador do Header soma as unidades.
2. **Carrinho/Checkout:** ao clicar no ícone do carrinho, vai para `/checkout`. Revisa itens (altera quantidades ou remove), informa o CEP (campos de endereço são preenchidos pela API), completa número/complemento, escolhe o pagamento e vê subtotal + entrega + total.
3. **Confirmação:** ao confirmar, o sistema grava o snapshot do pedido, limpa o carrinho e navega para `/success`, que exibe endereço e forma de pagamento.

### 3.2 Fluxos alternativos e de erro
| Situação | Comportamento esperado |
|---|---|
| Carrinho vazio ao abrir `/checkout` | Mostra `EmptyCart` com link para a Home; confirmar fica desabilitado (RN-09, RN-10). |
| CEP com formato inválido | Mensagem de erro no campo; sem chamada à API. |
| CEP não encontrado | Mensagem "CEP não encontrado"; campos liberados para edição manual. |
| Falha/indisponibilidade da API de CEP | Mensagem de falha + opção de tentar novamente ou preencher manualmente. |
| Formulário inválido ao confirmar | Foco no primeiro campo inválido; erros anunciados de forma acessível (RF-11). |
| Acesso direto a `/success` sem pedido | Estado vazio "Nenhum pedido encontrado" com link para a Home (RN-09). |
| Refresh em qualquer tela | Carrinho e tema são recuperados do `localStorage` (RF-06, RF-14). |

---

## 4. Requisitos funcionais (RF-01 a RF-16)

> Cada requisito tem um **critério de aceite verificável** e um **método de verificação** (T = teste automatizado, M = verificação manual/demonstração).

| ID | Requisito funcional | Critério de aceite | Verif. |
|---|---|---|---|
| RF-01 | Exibir catálogo de cafés com imagem, nome, descrição, preço e categoria/tag | Todos os cafés do catálogo aparecem na Home com os 5 campos; nenhuma imagem quebrada | M / T |
| RF-02 | Selecionar a quantidade de cada café antes de adicioná-lo | Quantidade é inteiro positivo (mín. 1); botões −/+ funcionam; valor inválido é rejeitado/corrigido | T |
| RF-03 | Adicionar café ao carrinho e acumular quantidade de produto repetido | Adicionar o mesmo café soma à linha existente; carrinho mostra itens e quantidades corretos | T |
| RF-04 | Exibir contador de unidades no Header | Contador = **soma das quantidades**, não o número de tipos; oculto/zero com carrinho vazio | T |
| RF-05 | Aumentar, diminuir e remover individualmente itens do carrinho | Totais e contador atualizam imediatamente após cada ação | T |
| RF-06 | Persistir carrinho com `localStorage` | Após atualizar a página, itens e quantidades são recuperados; dado corrompido não quebra a app | T / M |
| RF-07 | Navegar entre Home, Checkout e Confirmação com React Router | Rotas `/`, `/checkout`, `/success` trocam de tela sem recarregamento completo | M |
| RF-08 | Preencher e validar endereço (CEP, rua, número, complemento opcional, bairro, cidade, UF) consultando API pública de CEP | CEP válido preenche rua, bairro, cidade e UF; número e complemento ficam manuais; erros para CEP inválido, não encontrado e falha da consulta | T / M |
| RF-09 | Selecionar forma de pagamento: crédito, débito ou dinheiro | Exatamente uma das 3 opções é exigida para confirmar | T |
| RF-10 | Exibir subtotal, taxa de entrega e total geral | Valores calculados em centavos e consistentes entre Checkout e Sucesso | T |
| RF-11 | Impedir finalização com carrinho vazio ou formulário inválido | Botão confirmar bloqueado/erro exibido; feedback acessível (`aria-live`, foco, `aria-invalid`) | T / M |
| RF-12 | Confirmar pedido fictício e mostrar endereço e forma de pagamento | Tela de sucesso exibe resumo idêntico ao informado no checkout | T / M |
| RF-13 | Limpar o carrinho após confirmar, preservando os dados do pedido concluído | Carrinho fica vazio (e Header zera); a tela de sucesso continua correta | T |
| RF-14 | Alternar entre light mode e dark mode | Tema aplicado em todas as telas e persistido; fallback para `prefers-color-scheme` | M / T |
| RF-15 | Adaptar layout, componentes, formulário e carrinho para dispositivos móveis | Fluxo completo utilizável em 320/375/390 px, 768 px e 1280/1440 px sem rolagem horizontal | M |
| RF-16 | Aplicar logo original desenvolvida com auxílio de IA | Logo no Header, favicon e documentação da marca (seção "Branding com IA") | M |

---

## 5. Regras de negócio (RN-01 a RN-10)

| ID | Regra | Decisão / definição neste projeto |
|---|---|---|
| RN-01 | **Quantidades.** Não permitir quantidade ≤ 0 ao adicionar. No carrinho, diminuir de 1 para 0 remove ou impede. | **Decisão:** em adição, mínimo 1 e máximo 99. No carrinho, o botão **−** fica **desabilitado em 1** (impede a redução); a remoção só ocorre pelo botão **Remover**. |
| RN-02 | **Produto único.** Adicionar o mesmo café atualiza a linha existente. | Reducer localiza por `coffeeId`; nunca cria linha duplicada. Limite de 99 por linha (satura em 99). |
| RN-03 | **Cálculo.** subtotal = Σ(preço × qtd); total = subtotal + entrega. | **Taxa de entrega fixa fictícia: R$ 3,50** (`DELIVERY_FEE_CENTS = 350`), definida em **um único lugar** (`src/utils/pricing.ts`). Entrega = 0 se carrinho vazio. |
| RN-04 | **Valores monetários.** BRL com 2 casas; evitar erro de precisão. | Preços e totais são **inteiros em centavos**; formatação via `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })` apenas na exibição. |
| RN-05 | **Pagamento** é informativo, sem transação real. | Opções: `credit`, `debit`, `cash`. Nenhum dado de cartão é coletado. |
| RN-06 | **Persistência.** Carrinho sobrevive a refresh; pedido concluído é snapshot independente. | Carrinho em `coffee-delivery:cart`; pedido em `coffee-delivery:last-order` com cópia dos itens (nome, preço unitário, qtd) e valores. Limpar o carrinho **não** altera o pedido. |
| RN-07 | **Endereço.** Complemento opcional; demais campos validados; **API de CEP obrigatória** (ViaCEP). | Preenche logradouro, bairro, cidade e UF; número e complemento são do usuário. Tratar: CEP inválido, não encontrado, carregando e API indisponível, sempre permitindo corrigir/editar. |
| RN-08 | **Dados.** Catálogo pode vir de arquivo local tipado; backend não é obrigatório; API de CEP é obrigatória. | Catálogo em `src/data/coffees.ts` com tipo `Coffee`. |
| RN-09 | **Estados vazios.** Mensagens para carrinho sem itens e para confirmação sem pedido válido. | `EmptyCart` no checkout; estado vazio em `/success` quando não há `last-order` válido. |
| RN-10 | **Navegação.** Não confirmar com erros de validação ou itens inexistentes. | Confirmação exige: carrinho com ≥ 1 item válido (existente no catálogo), formulário válido e pagamento selecionado. Itens com `coffeeId` inexistente são descartados na hidratação. |

---

## 6. Requisitos não funcionais

### 6.1 Acessibilidade (referência: WCAG 2.2 AA)
- Navegação completa por teclado; ordem de foco lógica; **foco visível** em todos os controles.
- Todo campo com `<label>` associado; erros ligados ao campo (`aria-describedby`, `aria-invalid`) e anunciados (`role="alert"`/`aria-live`).
- Botões só com ícone têm `aria-label` (ex.: carrinho, tema, +/−, remover).
- Contraste mínimo 4,5:1 (texto) e 3:1 (componentes/estados) nos **dois** temas.
- Não depender só de cor para indicar erro, seleção ou foco.
- Alvos de toque ≥ 44×44 px em telas pequenas. Imagens com `alt` descritivo.

### 6.2 Responsividade (mobile first)
- Larguras de teste: **320** (quando possível), **375/390**, **768** e **1280/1440** px.
- Grid de cafés em 1 → 2 → 3/4 colunas conforme a largura; endereço e resumo empilhados no celular.
- Sem rolagem horizontal involuntária, sobreposição de texto ou imagens deformadas.

### 6.3 Desempenho
- Imagens otimizadas (formato moderno, dimensões adequadas, `loading="lazy"` abaixo da dobra, `width/height` definidos).
- Rotas carregadas com `React.lazy`/`Suspense` se o bundle crescer; evitar re-renders desnecessários (contexto separado para tema e carrinho).
- Consulta de CEP somente com 8 dígitos válidos; cancelar requisição anterior (`AbortController`).
- Meta orientativa: Lighthouse ≥ 90 em Performance e Acessibilidade na Home.

### 6.4 Persistência e robustez
- `localStorage` com chaves versionadas (`coffee-delivery:cart:v1`, `:theme`, `:last-order:v1`).
- Leitura defensiva (`try/catch` + validação de formato); dado inválido é ignorado e a app volta ao estado inicial.

### 6.5 Compatibilidade
- Últimas 2 versões de Chrome, Edge, Firefox e Safari (desktop e mobile).
- Funciona sem JavaScript de terceiros além das dependências do build.

### 6.6 Qualidade
- TypeScript em modo `strict`; **proibido `any`** como atalho.
- ESLint + Prettier sem erros; commits semânticos; testes passando antes do deploy.

---

## 7. Marca/logo gerada com IA e modos light/dark

### 7.1 Requisitos da marca
- Nome comercial: **Coffee Delivery** (ou marca autoral de cafeteria — registrar a escolha aqui).
- Criar **pelo menos uma proposta de logo original** com ferramenta de IA de imagem/identidade.
- Definir: **conceito**, **paleta**, **tipografia** e **variações** para fundo claro e escuro.
- Aplicar a logo no **Header**, **favicon** e documentação; salvar em `src/assets/` (e `public/` para favicon).
- Verificar **legibilidade em tamanho reduzido** (ex.: 32 px) e **direitos de uso** do material gerado.
- Documentar a seção **"Branding com IA"** (README ou este documento): ferramenta, prompt, resultado e motivo da escolha.
- A logo/marca do protótipo original **não** precisa ser usada; o aluno responde pela curadoria e coerência.

### 7.2 Referência de identidade (ponto de partida, personalizável)
- Cores da referência: amarelo e roxo. Tipografia: **Baloo 2** (títulos) e **Roboto** (texto).
- A identidade final deve permanecer coerente nos dois temas.

### 7.3 Tema claro/escuro
- Botão de alternância acessível no Header (`ThemeToggle`, com `aria-pressed`/rótulo claro).
- **Tokens semânticos** para: fundo, superfície, texto (primário/secundário), borda, botões, feedback (sucesso/erro/aviso) e estados (hover/focus/disabled/selecionado).
- Persistir a escolha em `localStorage`; sem escolha salva, usar `prefers-color-scheme`.
- Cards, formulário, carrinho e página de sucesso respeitam o tema — não apenas o fundo.

### 7.4 Quadro de marca (preencher durante a tarefa de branding)
| Item | Definição |
|---|---|
| Nome | _a definir_ |
| Conceito | _a definir_ |
| Ferramenta de IA / prompt | _a registrar_ |
| Paleta (claro / escuro) | _a definir (tokens)_ |
| Tipografia | Baloo 2 + Roboto (ou alternativa justificada) |
| Arquivos | `src/assets/logo-light.*`, `src/assets/logo-dark.*`, `public/favicon.*` |
| Direitos de uso | _verificar termos da ferramenta_ |

---

## 8. Critérios de aceite gerais e decisões de produto

### 8.1 Critérios de aceite gerais (Definition of Done do produto)
- [ ] RF-01 a RF-16 atendidos conforme os critérios da seção 4.
- [ ] RN-01 a RN-10 respeitadas e testadas onde há lógica (cálculo, reducer, validação, persistência).
- [ ] Fluxo completo Home → Checkout → Sucesso funciona em desktop e celular, nos dois temas.
- [ ] Refresh preserva carrinho e tema; `/success` sem pedido mostra estado vazio.
- [ ] Sem `any`, sem erros de TypeScript/ESLint; testes automatizados passando.
- [ ] Aplicação publicada (deploy), repositório GitHub com histórico de commits semânticos.
- [ ] SPECs atualizadas; ≥ 3 interações com IA registradas (`docs/AI_USAGE.md`); seção "Branding com IA" preenchida.
- [ ] O aluno consegue explicar oralmente o fluxo do estado global e os principais trechos de código.

### 8.2 Decisões de produto (registro)
| # | Decisão | Motivo |
|---|---|---|
| D-01 | Frete fixo de R$ 3,50 | Simples, previsível e centralizado (RN-03) |
| D-02 | Diminuir em 1 é bloqueado; remoção só pelo botão | Evita remoção acidental (RN-01) |
| D-03 | Máx. 99 unidades por café | Evita valores absurdos e overflow de layout |
| D-04 | Preços em centavos (inteiros) | Evita erro de ponto flutuante (RN-04) |
| D-05 | API de CEP: **ViaCEP** | Pública, gratuita, sem chave, CORS liberado |
| D-06 | Pedido concluído em `last-order` (snapshot) | Independência do carrinho (RN-06, RF-13) |
| D-07 | Estilização com **styled-components** | Alinhado ao desafio de origem; ver TECH_SPEC |
| D-08 | Tema padrão = preferência do sistema | Respeita o usuário na 1ª visita (RF-14) |

---

## 9. Rastreabilidade
Os IDs **RF-xx** e **RN-xx** deste documento são referenciados em [`TECH_SPEC.md`](./TECH_SPEC.md) (seção 14, matriz de rastreabilidade) e em cada tarefa de [`TASKS_SPEC.md`](./TASKS_SPEC.md).
