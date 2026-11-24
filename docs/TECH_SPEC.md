# TECH_SPEC — Technical Specification

> **Projeto Final 05 — Coffee Delivery (React + TypeScript + IA)**
> Versão: 1.1 · Status: **implementada** (24/11/2026) · Documento vivo. Desvios em relação à v1.0 estão na §15.
> Requisitos de origem: [`PRD_SPEC.md`](./PRD_SPEC.md) (IDs **RF-xx** / **RN-xx**).

---

## 1. Stack e justificativa das bibliotecas

| Tecnologia | Uso | Justificativa | Req. |
|---|---|---|---|
| **React + Vite + TypeScript** | SPA, componentes TSX, tipagem | Build rápido, HMR, tipagem estática; `strict` evita classes inteiras de bugs. *(Usar a major do Vite compatível com os computadores da faculdade — confirmar versão no `package.json`.)* | todos |
| **React Router** | Rotas `/`, `/checkout`, `/success` | Navegação sem recarregar a página; `navigate` após confirmação | RF-07 |
| **Context API + `useReducer`** | Estado global do carrinho (e tema) | Transições previsíveis e testáveis (reducer puro); sem dependência extra | RF-03/04/05/13 |
| **`useState`, `useEffect`, custom hooks** | Estado local, persistência, tema, CEP | Isola lógica reutilizável (`useLocalStorage`, `useCep`, `useTheme`) | RF-06/08/14 |
| **localStorage** | Carrinho, tema, último pedido | Persistência sem backend | RF-06, RF-14, RN-06 |
| **React Hook Form + Zod** (`@hookform/resolvers`) | Formulário de endereço/pagamento | Poucos re-renders; schema único tipado (`z.infer`) valida e gera tipos | RF-08/09/11 |
| **styled-components** | Estilização com tema | Alinhado ao desafio de origem; `ThemeProvider` casa com tokens claro/escuro; estilos co-localizados. *Tailwind seria alternativa; mantida a escolha por styled-components pela referência do desafio e pelo uso nativo de tokens via tema (se mudar, registrar o motivo aqui).* | RF-14/15 |
| **ViaCEP (fetch nativo)** | Consulta de CEP | API pública, gratuita, sem chave, CORS liberado; evita biblioteca extra | RF-08, RN-07 |
| **Vitest + React Testing Library + jsdom** | Testes de lógica e de fluxo | Integra com Vite (mesma config); foco em comportamento do usuário | RF-* |
| **Playwright** *(opcional, E2E)* | Demonstração do fluxo completo | Cobre Home → Checkout → Sucesso, 2 temas e viewport mobile | RF-07/12/15 |
| **ESLint + Prettier** | Qualidade e padronização | Regras de hooks e TS; formatação consistente | qualidade |
| **Git/GitHub + Conventional Commits** | Versionamento | Histórico de implementação exigido pelo desafio | entrega |
| **Fontes: Baloo 2 + Roboto** | Tipografia | Referência do Figma (personalizável) | PRD §7 |

**Dependências previstas:** `react`, `react-dom`, `react-router-dom`, `styled-components`, `react-hook-form`, `zod`, `@hookform/resolvers`. **Dev:** `typescript`, `vite`, `@vitejs/plugin-react`, `vitest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom`, `eslint` (+ plugins), `prettier`, `@types/*`, `@playwright/test` (opcional).

---

## 2. Arquitetura da SPA e responsabilidades

Princípio: **separar dados, tipos, regras, estado e UI**. Nenhuma regra de negócio no `App.tsx`.

```
┌──────────────────────────── main.tsx ────────────────────────────┐
│ ThemeProvider (tema) → CartProvider (carrinho) → BrowserRouter   │
│                         └── App.tsx (rotas + PageLayout)         │
└───────────────────────────────────────────────────────────────────┘
   pages/ (Home, Checkout, Success)  ── compõem ──►  components/ (UI)
        │                                                  │
        └──── hooks/ (useCart, useTheme, useCep, ...) ◄────┘
                      │
        contexts/ + reducers/  ──►  utils/ (pricing, format, storage)
                      │
              data/ (catálogo)  ·  types/  ·  schemas/ (Zod)
```

| Camada | Responsabilidade | Não deve |
|---|---|---|
| `data/` | Catálogo tipado de cafés (`Coffee[]`) | conter lógica |
| `types/` | Interfaces/tipos de domínio | importar de UI |
| `utils/` | Funções **puras**: preço em centavos, formatação BRL, totais, serialização | acessar React |
| `reducers/` | Transições **puras** e imutáveis do carrinho | efeitos colaterais, `localStorage` |
| `contexts/` | Provider do carrinho e do tema; expõe estado + ações | conter regras de cálculo (delegar a `utils`) |
| `hooks/` | `useCart`, `useTheme`, `useLocalStorage`, `useCep` | JSX |
| `schemas/` | Validação Zod do checkout | UI |
| `components/` | UI reutilizável e apresentacional (props) | conhecer rotas/localStorage |
| `pages/` | Composição de componentes por rota e orquestração | regras de negócio |
| `styles/` | Tokens, temas claro/escuro, estilos globais | — |
| `tests/` | Testes automatizados | — |

---

## 3. Estrutura de diretórios e componentes

Estrutura **implementada** (v1.1):

```
coffee-delivery/
├── public/                  # favicon.svg, hero.svg, delivery.svg, coffees/*.svg, _redirects
├── scripts/                 # generate-coffee-images.mjs, screenshots.mjs
├── e2e/                     # Playwright: flow.spec.ts, a11y.spec.ts, fixtures.ts
├── src/
│   ├── assets/              # logo-light.svg, logo-dark.svg, logo-icon.svg
│   ├── components/
│   │   ├── Header/  Logo/  ThemeToggle/  CartBadge/  PageLayout/
│   │   ├── Hero/  CoffeeCatalog/  CoffeeCard/  QuantityInput/
│   │   ├── CartItem/  CartSummary/  EmptyCart/
│   │   ├── DeliveryAddressForm/ (index, Field, styles)  PaymentMethodSelector/
│   │   └── OrderSuccess/
│   ├── pages/               # Home.tsx, Checkout.tsx (+ .styles.ts), Success.tsx (+ .styles.ts), NotFound.tsx
│   ├── contexts/            # context.ts (objetos de contexto), CartContext.tsx, ThemeContext.tsx
│   ├── reducers/            # cartReducer.ts
│   ├── hooks/               # useCart.ts, useTheme.ts, useLocalStorage.ts, useCep.ts
│   ├── data/                # coffees.ts, paymentMethods.ts
│   ├── types/               # coffee.ts, cart.ts, address.ts, order.ts, theme.ts
│   ├── schemas/             # checkoutSchema.ts, orderSchema.ts
│   ├── utils/               # pricing.ts, format.ts, storage.ts, cep.ts, order.ts
│   ├── styles/              # tokens.ts, themes.ts, GlobalStyle.ts, styled.d.ts
│   ├── tests/               # *.test.ts(x), setup.ts, renderWithProviders.tsx, flowHelpers.ts
│   ├── App.tsx              # só o mapa de rotas
│   └── main.tsx             # ThemeProvider → CartProvider → BrowserRouter → App
├── docs/                    # PRD_SPEC, TECH_SPEC, TASKS_SPEC, AI_USAGE, screenshots/
├── AGENTS.md
├── README.md
└── vercel.json
```

### 3.1 Componentes (responsabilidade e props principais)
| Componente | Responsabilidade | Props principais | Req. |
|---|---|---|---|
| `PageLayout` | Skip link + Header + `<main>`; rola ao topo e foca o `<h1>` a cada rota | — (rota-pai com `<Outlet>`) | RF-07 |
| `Header` | Logo (link Home), `ThemeToggle`, `CartBadge` | — | RF-04/14/16 |
| `Logo` | Logo SVG inline com cores do tema | — | RF-16 |
| `ThemeToggle` | Alterna tema (`aria-pressed`) | — (usa `useTheme`) | RF-14 |
| `CartBadge` | Link p/ `/checkout` + contador de unidades + região `aria-live` | — (usa `useCart`) | RF-04 |
| `Hero` | Título, benefícios e ilustração da Home | — | RF-01 |
| `CoffeeCatalog` | Grid 1/2/3/4 colunas | `coffees: Coffee[]` | RF-01 |
| `CoffeeCard` | Imagem, tags, nome, descrição, preço, quantidade local, adicionar | `coffee: Coffee` (usa `useCart().addItem`) | RF-01/02/03 |
| `QuantityInput` | −/+ controlado com limites | `value`, `onChange`, `min`, `max`, `label`, `size?` | RF-02, RN-01 |
| `CartItem` | Linha do carrinho: qtd, total da linha, remover | `item: CartLine`, `onIncrement`, `onDecrement`, `onRemove` | RF-05 |
| `CartSummary` | Subtotal, entrega, total, botão confirmar (`form=`) | `totals`, `disabled`, `formId`, `disabledReason?` | RF-10/11 |
| `EmptyCart` | Estado vazio + link Home | — | RN-09 |
| `DeliveryAddressForm` | Campos de endereço + feedback do CEP | `register`, `errors`, `cepStatus`, `onCepChange`, `onRetryCep` | RF-08 |
| `PaymentMethodSelector` | Rádios crédito/débito/dinheiro | `value`, `onChange`, `error?`, `inputRef?` | RF-09 |
| `OrderSuccess` | Resumo do pedido concluído (endereço, previsão, pagamento, itens, totais) | `order: Order` | RF-12 |

---

## 4. Tipos e interfaces (domínio)

```ts
// src/types/coffee.ts
export type CoffeeTag =
  | 'tradicional' | 'gelado' | 'com leite' | 'especial' | 'alcoólico';

export interface Coffee {
  id: string;
  name: string;
  description: string;
  priceCents: number;      // inteiro em centavos (RN-04)
  imageUrl: string;
  tags: CoffeeTag[];
}

// src/types/cart.ts
export interface CartItem {
  coffeeId: string;        // referência ao catálogo
  quantity: number;        // inteiro 1..99
}

export interface CartState {
  items: CartItem[];
}

// src/types/address.ts
export type UF =
  | 'AC'|'AL'|'AP'|'AM'|'BA'|'CE'|'DF'|'ES'|'GO'|'MA'|'MT'|'MS'|'MG'|'PA'
  | 'PB'|'PR'|'PE'|'PI'|'RJ'|'RN'|'RS'|'RO'|'RR'|'SC'|'SP'|'SE'|'TO';

export interface DeliveryAddress {
  cep: string;             // somente dígitos, 8 chars
  street: string;
  number: string;
  complement?: string;     // opcional
  neighborhood: string;
  city: string;
  uf: UF;
}

// src/types/order.ts
export type PaymentMethod = 'credit' | 'debit' | 'cash';

export interface OrderItemSnapshot {
  coffeeId: string;
  name: string;            // cópia: independente do catálogo/carrinho (RN-06)
  unitPriceCents: number;
  quantity: number;
}

export interface Order {
  id: string;              // crypto.randomUUID()
  createdAt: string;       // ISO 8601
  items: OrderItemSnapshot[];
  address: DeliveryAddress;
  paymentMethod: PaymentMethod;
  subtotalCents: number;
  deliveryFeeCents: number;
  totalCents: number;
}
```

**Tipos auxiliares:** `CartLine = CartItem & { coffee: Coffee; lineTotalCents: number }` (derivado, não persistido); `Totals = { subtotalCents; deliveryFeeCents; totalCents; totalUnits }`; `ThemeMode = 'light' | 'dark'`; `CepStatus = 'idle' | 'loading' | 'success' | 'not-found' | 'error'`.

---

## 5. Context API e `useReducer` (carrinho)

### 5.1 Ações
```ts
export type CartAction =
  | { type: 'ADD_ITEM';   payload: { coffeeId: string; quantity: number } } // RF-03, RN-01/02
  | { type: 'INCREMENT';  payload: { coffeeId: string } }                    // RF-05
  | { type: 'DECREMENT';  payload: { coffeeId: string } }                    // RF-05, RN-01
  | { type: 'REMOVE_ITEM';payload: { coffeeId: string } }                    // RF-05
  | { type: 'CLEAR_CART' }                                                   // RF-13
  | { type: 'HYDRATE';    payload: { items: CartItem[] } };                  // RF-06
```

### 5.2 Regras do reducer (puro e imutável)
- `ADD_ITEM`: ignora `quantity < 1` (RN-01). Se o `coffeeId` existe → `map` somando e **limitando a 99** (RN-02); senão → `[...items, novo]`.
- `INCREMENT`: `map` somando 1 (máx. 99).
- `DECREMENT`: se `quantity > 1` → subtrai 1; se `quantity === 1` → **retorna o mesmo estado** (decisão D-02).
- `REMOVE_ITEM`: `filter` por `coffeeId`.
- `CLEAR_CART`: `{ items: [] }`.
- `HYDRATE`: substitui `items` por lista **sanitizada** (descarta quantidade inválida e `coffeeId` fora do catálogo — RN-10).
- Proibido: `push`, `splice`, atribuição direta ao estado ou aos itens.

### 5.3 Contexto
```ts
interface CartContextValue {
  items: CartItem[];
  lines: CartLine[];          // derivado: items + catálogo
  totals: Totals;             // derivado: via utils/pricing
  addItem(coffeeId: string, quantity: number): void;
  increment(coffeeId: string): void;
  decrement(coffeeId: string): void;
  removeItem(coffeeId: string): void;
  clearCart(): void;
}
```
- `CartProvider` usa `useReducer(cartReducer, initialState, init)` onde `init` lê o `localStorage` (leitura defensiva).
- `lines` e `totals` são calculados com `useMemo` (derivados; **não** guardados no estado).
- Hook de consumo: `useCart()` lança erro claro se usado fora do provider.
- O **pedido concluído** não vive no `CartContext`: é salvo por `utils/storage` em `last-order` e lido pela página de sucesso (RN-06).

---

## 6. Hooks, eventos, efeitos e persistência

| Hook / efeito | Função | Detalhes |
|---|---|---|
| `useLocalStorage<T>(key, initial, validate?)` | Estado sincronizado com `localStorage` | Leitura com `try/catch` + `validate`; escrita em `useEffect`; fallback ao `initial` se inválido |
| Efeito do carrinho (em `CartProvider`) | Persistir `items` | `useEffect(() => save('coffee-delivery:cart:v1', items), [items])` — RF-06 |
| `useTheme` / `ThemeProvider` | Tema claro/escuro | Estado inicial: valor salvo → senão `matchMedia('(prefers-color-scheme: dark)')`; efeito grava `coffee-delivery:theme` e define `data-theme` no `<html>` — RF-14 |
| `useCep(cep)` | Consulta ViaCEP | Dispara só com 8 dígitos válidos; `AbortController` cancela a anterior; retorna `{ status, data }` — RF-08 |
| Evento `onSubmit` (Checkout) | Confirmar pedido | Valida → monta `Order` (snapshot) → salva `last-order` → `clearCart()` → `navigate('/success')` — RF-12/13 |
| Evento `onBlur`/`onChange` do CEP | Disparar consulta e preencher campos | `setValue` (RHF) em rua/bairro/cidade/UF; foco no campo **número** — RF-08 |

### 6.1 Chaves de armazenamento
| Chave | Conteúdo | Observação |
|---|---|---|
| `coffee-delivery:cart:v1` | `CartItem[]` | hidratado e sanitizado |
| `coffee-delivery:theme` | `'light' \| 'dark'` | ausente → preferência do sistema |
| `coffee-delivery:last-order:v1` | `Order` | snapshot; validado com Zod na leitura |

### 6.2 Fluxo do estado global (para explicação oral)
`CoffeeCard` → `addItem` (contexto) → `dispatch(ADD_ITEM)` → `cartReducer` retorna **novo** estado → `useEffect` persiste → `CartBadge`/`CartSummary` re-renderizam com `totals` derivado.

---

## 7. Rotas

| Rota | Página | Observações |
|---|---|---|
| `/` | `Home` | Catálogo |
| `/checkout` | `Checkout` | Carrinho + endereço + pagamento + resumo; vazio → `EmptyCart` |
| `/success` | `Success` | Lê `last-order`; sem pedido válido → estado vazio |
| `*` | `NotFound` *(opcional)* | Link para Home |

Navegação com `<Link>`/`useNavigate` (sem `<a href>` que recarregue). Ao navegar, mover o foco para o `<h1>` da página (acessibilidade) e rolar ao topo.

---

## 8. Validação de formulário com Zod

```ts
// src/schemas/checkoutSchema.ts
import { z } from 'zod';

const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA',
             'PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'] as const;

export const addressSchema = z.object({
  cep: z.string()
    .transform((v) => v.replace(/\D/g, ''))
    .refine((v) => v.length === 8, 'Informe um CEP válido (8 dígitos)'),
  street: z.string().trim().min(1, 'Informe a rua'),
  number: z.string().trim().min(1, 'Informe o número').max(10),
  complement: z.string().trim().max(60).optional(),
  neighborhood: z.string().trim().min(1, 'Informe o bairro'),
  city: z.string().trim().min(1, 'Informe a cidade'),
  uf: z.enum(UFS, { error: 'Selecione a UF' }), // Zod 4: `error` substitui `errorMap`
});

export const checkoutSchema = z.object({
  address: addressSchema,
  paymentMethod: z.enum(['credit', 'debit', 'cash'], {
    error: 'Selecione a forma de pagamento',
  }),
});

export type CheckoutFormInput = z.input<typeof checkoutSchema>;  // valores do formulário
export type CheckoutFormData = z.output<typeof checkoutSchema>; // dados validados
```
- Integração: `useForm<CheckoutFormInput, unknown, CheckoutFormData>({ resolver: zodResolver(checkoutSchema), mode: 'onBlur' })`.
- Máscara de CEP (`00000-000`) na exibição; valor normalizado para 8 dígitos no envio.
- Erros: `aria-invalid`, mensagem ligada por `aria-describedby`; no submit inválido, foco no primeiro erro.
- O mesmo schema valida a leitura do `last-order` (via `orderSchema`) para recusar dados corrompidos.

### 8.1 Consulta de CEP (ViaCEP)
- Endpoint: `GET https://viacep.com.br/ws/{cep}/json/`.
- Resposta com `{ "erro": true }` → `not-found`. Falha de rede/HTTP/timeout → `error`.
- Mapeamento: `logradouro→street`, `bairro→neighborhood`, `localidade→city`, `uf→uf`. `numero` e `complemento` **nunca** são sobrescritos.
- Estados de UI: `loading` (campo/indicador com `aria-busy`), `success`, `not-found` e `error` (com botão "Tentar novamente" e campos editáveis — RN-07).
- Se a API devolver campo vazio (ex.: CEP genérico sem logradouro), manter o campo editável.

---

## 9. Regras de cálculo (`src/utils/pricing.ts`)

```ts
export const DELIVERY_FEE_CENTS = 350;   // RN-03: único ponto de definição
export const MIN_QTY = 1;
export const MAX_QTY = 99;

export const subtotalCents = (lines: { unitPriceCents: number; quantity: number }[]) =>
  lines.reduce((acc, l) => acc + l.unitPriceCents * l.quantity, 0);

export const deliveryFeeCents = (subtotal: number) => (subtotal > 0 ? DELIVERY_FEE_CENTS : 0);

export const totalUnits = (items: { quantity: number }[]) =>
  items.reduce((acc, i) => acc + i.quantity, 0);                         // RF-04

export const calcTotals = (lines) => {
  const subtotal = subtotalCents(lines);
  const fee = deliveryFeeCents(subtotal);
  return { subtotalCents: subtotal, deliveryFeeCents: fee, totalCents: subtotal + fee };
};
```
```ts
// src/utils/format.ts — apenas apresentação (RN-04)
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const formatBRL = (cents: number) => brl.format(cents / 100);
```
Regras: tudo em **inteiros (centavos)**; nunca somar `number` decimal; nenhuma constante de frete fora de `pricing.ts`.

---

## 10. Estratégia de tema, tokens, breakpoints e acessibilidade

### 10.1 Tema e tokens
- `ThemeProvider` (styled-components) recebe `lightTheme` ou `darkTheme`; ambos implementam a **mesma interface** `AppTheme` (tipada em `styled.d.ts`).
- Tokens **semânticos** (não nomeados por cor): `bg`, `surface`, `surfaceAlt`, `text`, `textMuted`, `border`, `primary`, `primaryText`, `accent`, `focusRing`, `success`, `error`, `warning`, `overlay`, mais escalas de `space`, `radius`, `fontSize`, `shadow`.
- Paleta de referência: amarelo e roxo; valores finais definidos na tarefa de branding e validados quanto a contraste nos dois temas.
- Fontes carregadas com `font-display: swap`.

### 10.2 Breakpoints (mobile first, `min-width`)
| Nome | Valor | Uso |
|---|---|---|
| base | 0–479 px | 1 coluna; testar 320/375/390 |
| `sm` | ≥ 480 px | ajustes de espaçamento |
| `md` | ≥ 768 px | catálogo 2 colunas; checkout em 2 colunas |
| `lg` | ≥ 1024 px | catálogo 3 colunas |
| `xl` | ≥ 1280 px | catálogo 4 colunas; largura máxima do container |

### 10.3 Acessibilidade (WCAG 2.2 AA)
- Landmarks (`header`, `main`, `nav`), `<h1>` único por página, ordem de headings lógica.
- `:focus-visible` com anel de alto contraste em ambos os temas; link "Pular para o conteúdo".
- Botões só com ícone: `aria-label`; `ThemeToggle` com `aria-pressed`/rótulo dinâmico.
- Contador do carrinho com texto acessível ("3 itens no carrinho") e `aria-live="polite"` ao mudar.
- Erros de formulário perceptíveis (texto + ícone, não só cor) e anunciados.
- Respeitar `prefers-reduced-motion`.
- Alvos de toque ≥ 44×44 px.

---

## 11. Casos de teste, qualidade e execução

### 11.1 Ferramentas
Vitest + React Testing Library + `user-event` + jest-dom (unitários/integração); Playwright (E2E, opcional); ESLint + Prettier; `tsc --noEmit`.

### 11.2 Casos de teste

**Unitários (lógica pura)**
| ID | Alvo | Caso | Req. |
|---|---|---|---|
| TC-01 | `cartReducer` | `ADD_ITEM` novo café cria linha | RF-03 |
| TC-02 | `cartReducer` | `ADD_ITEM` repetido soma, sem duplicar linha | RF-03, RN-02 |
| TC-03 | `cartReducer` | `ADD_ITEM` com qtd 0/negativa é ignorado | RN-01 |
| TC-04 | `cartReducer` | `INCREMENT` e limite de 99 | RF-05 |
| TC-05 | `cartReducer` | `DECREMENT` de 2→1 ok; de 1 permanece 1 | RF-05, RN-01 |
| TC-06 | `cartReducer` | `REMOVE_ITEM` remove só a linha alvo | RF-05 |
| TC-07 | `cartReducer` | `CLEAR_CART` esvazia | RF-13 |
| TC-08 | `cartReducer` | Não muta o estado anterior (igualdade referencial do original) | imutabilidade |
| TC-09 | `pricing` | subtotal/total/entrega corretos (ex.: 3×R$ 9,90 + frete) | RF-10, RN-03 |
| TC-10 | `pricing` | sem erro de ponto flutuante (somas em centavos) | RN-04 |
| TC-11 | `pricing` | entrega = 0 com carrinho vazio | RN-03 |
| TC-12 | `totalUnits` | soma de quantidades ≠ nº de tipos | RF-04 |
| TC-13 | `formatBRL` | `1990 → "R$ 19,90"` | RN-04 |
| TC-14 | `checkoutSchema` | CEP inválido, UF inválida, campos obrigatórios vazios, complemento opcional | RF-08, RN-07 |
| TC-15 | `checkoutSchema` | pagamento ausente é rejeitado; 3 opções válidas aceitas | RF-09 |
| TC-16 | `storage` | JSON corrompido/valor inválido → estado inicial sem erro | RF-06 |
| TC-17 | `HYDRATE` | descarta `coffeeId` inexistente e qtd inválida | RN-10 |

**Integração (componentes)**
| ID | Caso | Req. |
|---|---|---|
| TC-20 | Home renderiza todos os cafés com nome, preço, tag, imagem | RF-01 |
| TC-21 | Adicionar ao carrinho atualiza o contador do Header (soma de unidades) | RF-03/04 |
| TC-22 | Alterar quantidades no checkout atualiza totais imediatamente | RF-05 |
| TC-23 | Recarregar (re-montar com `localStorage`) mantém o carrinho | RF-06 |
| TC-24 | CEP válido (fetch mockado) preenche rua/bairro/cidade/UF; número fica vazio | RF-08 |
| TC-25 | CEP não encontrado e falha de rede exibem mensagens e liberam edição | RF-08, RN-07 |
| TC-26 | Confirmar com formulário inválido/carrinho vazio é bloqueado e mostra erro acessível | RF-11, RN-10 |
| TC-27 | Confirmar válido: vai a `/success`, mostra endereço e pagamento, carrinho zerado | RF-12/13 |
| TC-28 | `/success` sem pedido mostra estado vazio | RN-09 |
| TC-29 | Alternar tema muda `data-theme` e persiste; sem escolha usa `prefers-color-scheme` | RF-14 |

**E2E / manuais (demonstração)**
| ID | Caso | Req. |
|---|---|---|
| TC-30 | Fluxo completo Home → Checkout → Sucesso em 390 px e 1280 px | RF-07/15 |
| TC-31 | Navegação 100% por teclado e foco visível em ambos os temas | acessibilidade |
| TC-32 | Sem rolagem horizontal em 320 px | RF-15 |
| TC-33 | Logo visível no Header (2 temas), favicon carregando, sem imagem quebrada | RF-16 |
| TC-34 | Lighthouse (Performance/Acessibilidade ≥ 90) | RNF |

### 11.3 Instruções de execução
```bash
# instalar dependências
npm install

# desenvolvimento
npm run dev

# qualidade
npm run lint
npm run typecheck      # tsc --noEmit
npm run test           # vitest (modo watch)
npm run test:run       # vitest --run (CI)
npm run test:e2e       # playwright (opcional)

# build e preview de produção
npm run build
npm run preview
```
Scripts no `package.json`: `dev`, `build`, `preview`, `lint`, `typecheck`, `format`, `format:check`, `test`, `test:run`, `test:e2e`, `generate:images`. O E2E sobe sozinho `build + preview` na porta 4173 e usa o Google Chrome instalado (`channel: 'chrome'`).

**Deploy:** Vercel, Netlify ou GitHub Pages. Com rotas do React Router, configurar *fallback* para `index.html` (ex.: `vercel.json` com rewrite `/(.*) → /index.html`, ou `_redirects` no Netlify).

---

## 12. Convenções de código
- TypeScript `strict: true`; **sem `any`** (usar `unknown` + validação quando necessário).
- Componentes funcionais, props tipadas, um componente por arquivo; arquivos de componente em PascalCase.
- Estado imutável; usar `map`/`filter`/`find`/`reduce`.
- Regras de negócio fora de componentes (em `utils/`/`reducers/`).
- Commits semânticos: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `style:`.

## 13. Riscos e mitigação
| Risco | Mitigação |
|---|---|
| ViaCEP fora do ar / lento | Estados `error`/`loading`, tentar novamente e preenchimento manual (RN-07) |
| `localStorage` corrompido ou indisponível | Leitura defensiva + fallback ao estado inicial (RF-06) |
| Contraste ruim em um dos temas | Tokens validados com checagem de contraste antes de aplicar |
| Rotas quebram no deploy (404 em refresh) | Fallback de SPA para `index.html` |
| Imagem/logo gerada por IA com baixa legibilidade em 32 px | Testar em tamanho reduzido e manter versão simplificada para favicon |
| Código gerado por IA sem compreensão | Implementar em tarefas pequenas e explicar o fluxo oralmente (AGENTS.md) |

---

## 14. Matriz de rastreabilidade (PRD → Técnica)

| Requisito | Implementação | Testes |
|---|---|---|
| RF-01 | `data/coffees.ts`, `CoffeeCatalog`, `CoffeeCard` | TC-20 |
| RF-02 | `QuantityInput` (min 1, max 99) | TC-03, TC-04 |
| RF-03 | `ADD_ITEM`, `useCart.addItem` | TC-01, TC-02, TC-21 |
| RF-04 | `CartBadge`, `totalUnits` | TC-12, TC-21 |
| RF-05 | `INCREMENT`/`DECREMENT`/`REMOVE_ITEM`, `CartItem` | TC-04..06, TC-22 |
| RF-06 | `useLocalStorage`, efeito do `CartProvider`, `HYDRATE` | TC-16, TC-17, TC-23 |
| RF-07 | React Router (`App.tsx`), `Link`/`useNavigate` | TC-30 |
| RF-08 | `DeliveryAddressForm`, `useCep`, `addressSchema` | TC-14, TC-24, TC-25 |
| RF-09 | `PaymentMethodSelector`, `checkoutSchema` | TC-15 |
| RF-10 | `pricing.calcTotals`, `CartSummary` | TC-09..11 |
| RF-11 | RHF + Zod, `aria-*`, botão desabilitado | TC-26 |
| RF-12 | `OrderSuccess`, `Order` snapshot | TC-27 |
| RF-13 | `CLEAR_CART` + `last-order` | TC-07, TC-27 |
| RF-14 | `ThemeProvider`, `ThemeToggle`, tokens | TC-29, TC-31 |
| RF-15 | breakpoints, layout mobile first | TC-30, TC-32 |
| RF-16 | `assets/`, `Header`, favicon | TC-33 |
| RN-01 | `QuantityInput`, `cartReducer` | TC-03, TC-05 |
| RN-02 | `ADD_ITEM` por `coffeeId` | TC-02 |
| RN-03 | `pricing.ts` (`DELIVERY_FEE_CENTS`) | TC-09, TC-11 |
| RN-04 | centavos + `formatBRL` | TC-10, TC-13 |
| RN-05 | `PaymentMethod` apenas informativo | TC-15 |
| RN-06 | `last-order` snapshot + `cart` | TC-23, TC-27 |
| RN-07 | `useCep`, estados de UI | TC-24, TC-25 |
| RN-08 | catálogo local tipado + ViaCEP | TC-20 |
| RN-09 | `EmptyCart`, estado vazio em `/success` | TC-28 |
| RN-10 | validação + guarda no submit, `HYDRATE` | TC-17, TC-26 |

---

## 15. Registro de implementação (v1.1): desvios e decisões

| # | Onde | Previsto (v1.0) | Implementado | Motivo |
|---|---|---|---|---|
| I-01 | Stack | "major do Vite compatível" | Vite 8, React 19, TypeScript **6.0**, Zod **4**, React Router 7, Vitest 5, ESLint 10 | O template trouxe TS 7, que o `typescript-eslint` ainda não suporta (< 6.1). **Confirmar Node ≥ 20.19 nos computadores da faculdade.** |
| I-02 | Dependências extras | — | `@phosphor-icons/react` (ícones do desafio original), `@axe-core/playwright` (auditoria WCAG nos E2E) | Ícones acessíveis em SVG; prova automatizada de acessibilidade |
| I-03 | Zod | `errorMap` | `error` | API do Zod 4 |
| I-04 | `useCep` | `useCep(cep)` com efeito | `useCep()` → `{ status, lookup, retry }` disparado no `onChange` do CEP | Evita `setState` em efeito (regra do ESLint React Hooks 7); fluxo linear; ganhou timeout de 8 s e "Tentar novamente" |
| I-05 | Persistência do carrinho | `useLocalStorage` | Inicializador do `useReducer` lê o storage e aplica `HYDRATE`; `useEffect` grava; evento `storage` sincroniza abas | Reaproveita a sanitização do reducer. `useLocalStorage` é usado pelo tema |
| I-06 | Tema | efeito grava sempre | Só grava quando o usuário escolhe; acompanha mudança do sistema enquanto não houver escolha | D-08 continua valendo após a 1ª visita |
| I-07 | Contextos | — | Objetos `createContext` em `contexts/context.ts`; Providers em `.tsx` | Fast Refresh do Vite exige arquivos de componente só com componentes |
| I-08 | Tokens | `bg, surface, text…` | Mesma ideia, com mais papéis: `inputBg`, `hover`, `title`, `subtitle`, `primaryStrong/Soft/Ink/Text`, `accentStrong/Soft/Ink/Text`, `errorSoft` | Necessários para reproduzir o Figma com contraste AA nos 2 temas |
| I-09 | `CartLine` | `CartItem & { coffee; lineTotalCents }` | + `unitPriceCents` | `subtotalCents()` recebe `{ unitPriceCents, quantity }` |
| I-10 | `HYDRATE` | `payload: { items: CartItem[] }` | `payload: { items: unknown }` | Dado vindo do storage é desconhecido até ser sanitizado |
| I-11 | Pagamento | — | `Controller` do RHF + rádios nativos estilizados | Teclado (setas) e leitores de tela funcionam sem ARIA extra |
| I-12 | Formulário | placeholders do Figma | Rótulos visíveis + placeholder só no CEP | PRD D-09 |
| I-13 | Fora do PRD | — | Filtro por categoria **removido** | `AGENTS.md` §6: não adicionar funcionalidades fora do PRD |

### 15.1 Resultado dos testes (24/11/2026)

| Suite | Comando | Resultado |
|---|---|---|
| Unitários + integração (TC-01..TC-29, contraste, rotas) | `npm run test:run` | **131 passaram** (18 arquivos) |
| E2E + acessibilidade (TC-30..TC-33, axe ×12) | `npm run test:e2e` | **23 passaram**, 1 pulado (TC-31 teclado só no desktop) |
| Lint / tipos | `npm run lint` · `npm run typecheck` | 0 erros, 0 avisos |
| E2E contra a produção | `PLAYWRIGHT_BASE_URL=https://coffee-delivery-delta-sage.vercel.app npm run test:e2e` | **23 passaram**, 1 pulado |
| TC-34 Lighthouse | Chrome DevTools | **Pendente**: rodar manualmente |
