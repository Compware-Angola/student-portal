Portal do Estudante — Sistema web desenvolvido com **React + TypeScript**, organizado por **arquitetura em slices por feature**, com foco, padronização e reutilização de código.

---

## 🚀 Tecnologias Principais

| Tecnologia                       | Função                                                     |
| -------------------------------- | ---------------------------------------------------------- |
| **React (Vite ou Next.js)**      | Framework principal da interface (UI)                      |
| **TypeScript**                   | Tipagem estática e segurança no código                     |
| **shadcn/ui**                    | Componentes visuais padronizados (Radix + TailwindCSS)     |
| **React Query (TanStack Query)** | Gerenciamento de cache e estado de dados assíncronos       |
| **Zod**                          | Validação e tipagem de formulários                         |
| **Fetch API**                    | Comunicação com o backend via HTTP                         |

---

## 🏗️ Estrutura de Pastas

```

src/
│
├── components/                # Componentes globais reutilizáveis
│   ├── ui/                    # Componentes do shadcn/ui (botões, inputs, etc)
│   ├── forms/                 # Campos e inputs de formulário reutilizáveis
│   └── layout/                # Layouts globais (Header, Sidebar, etc)
│
├── hooks/                     # Hooks globais (ex: useAuth, useToast)
│
├── providers/                 # Providers e contextos globais (Theme, QueryClient)
│
├── services/                  # Camada de integração com APIs
│   ├── api.ts                 # Configuração base (Fetch / Axios)
│   ├── user.service.ts        # Service de usuários
│   └── dashboard.service.ts   # Service do dashboard
│
├── lib/                       # Utilitários e helpers genéricos
│
├── routes/                    # Definição das rotas do projeto
│   ├── index.tsx              # Arquivo principal que importa todas as rotas
│   ├── dashboard.routes.tsx   # Rotas da feature Dashboard
│   └── users.routes.tsx       # Rotas da feature Users
│
├── pages/                     # Features organizadas por pasta (arquitetura slice)
│   ├── dashboard/
│   │   ├── index.tsx          # Página principal da feature
│   │   ├── components/        # Componentes específicos do dashboard
│   │   ├── hooks/             # Hooks específicos do dashboard
│   │   └── validations.ts     # Schemas Zod dessa feature
│   │
│   └── users/
│       ├── index.tsx
│       ├── components/
│       ├── hooks/
│       └── validations.ts
│
└── main.tsx / app.tsx         # Ponto de entrada da aplicação



---

## ⚙️ Convenções do Projeto

### 1️⃣ Componentes

- **Globais** → `src/components/`
- **De feature** → `src/pages/[feature]/components/`
- **Nomeclatura:**  
  - Componentes: `PascalCase` → `SummaryCard.tsx`
  - Props: `camelCase`
  - Exemplo:

```tsx
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardContent>{value}</CardContent>
    </Card>
  );
}
````

---

### 2️⃣ Hooks

* **Globais** → `src/hooks/`
* **De feature** → dentro de `src/pages/[feature]/hooks/`
* **Nomeclatura:** sempre iniciar com `use`
* Exemplo:

```tsx
// src/pages/dashboard/hooks/useDashboardData.ts
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: dashboardService.getSummary,
  });
}
```

---

### 3️⃣ Services (Camada de API)

* **Sem lógica de React.**
* Apenas funções puras que fazem requisições HTTP.
* Utilizam `fetch` ou `axios`.

```ts
// src/services/dashboard.service.ts
import { api } from "./api";

export const dashboardService = {
  getSummary: async () => {
    const response = await api.get("/dashboard/summary");
    return response.data;
  },
};
```

---

### 4️⃣ React Query — Data Fetching

```ts
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
  });
}
```

---

### 5️⃣ Zod — Validação e Tipagem

```ts
// src/pages/users/validations.ts
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3, "O nome é obrigatório"),
  email: z.string().email("Email inválido"),
});

export type CreateUserForm = z.infer<typeof createUserSchema>;
```

---

### 6️⃣ shadcn/ui — UI Padronizada

Todos os componentes visuais devem ser baseados no **shadcn/ui**.

```tsx
import { Button } from "@/components/ui/button";

export function SaveButton() {
  return <Button variant="outline">Salvar</Button>;
}
```

---

### 7️⃣ Providers Globais

* **React Query** → `QueryProvider.tsx`
* **Tema (Dark/Light)** → `ThemeProvider.tsx`

```tsx
// src/providers/QueryProvider.tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
```

---

## 🧠 Boas Práticas

✅ **Separar responsabilidades**
→ React apenas renderiza, services apenas fazem requisições, Zod apenas valida.

✅ **Evitar lógica de negócio em componentes**
→ Use hooks ou serviços para isolar.

✅ **Usar tipagem em tudo**
→ Sempre definir `types` e `interfaces`.

✅ **Nomes consistentes**
→ Componentes (`PascalCase`), hooks (`camelCase`), pastas (`kebab-case`).

✅ **Reutilização antes de duplicação**
→ Componentes compartilhados devem estar em `src/components/`.

---

## 🧭 Fluxo de Dados

```
UI (React + shadcn/ui)
   ↓
Hook (React Query)
   ↓
Service (Fetch/Axios)
   ↓
API Backend
```

---

## 🌐 Rotas

As rotas são **divididas por feature** e depois importadas no arquivo principal:

```
src/routes/
├── index.tsx               # importa e combina todas as rotas
├── dashboard.routes.tsx    # rotas do dashboard
└── users.routes.tsx        # rotas dos usuários
```

Exemplo de rota de feature:

```tsx
// src/routes/dashboard.routes.tsx
import { RouteObject } from "react-router-dom";
import DashboardPage from "@/pages/dashboard";

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
];
```

E no arquivo principal:

```tsx
// src/routes/index.tsx
import { useRoutes } from "react-router-dom";
import { dashboardRoutes } from "./dashboard.routes";
import { usersRoutes } from "./users.routes";

export function AppRoutes() {
  return useRoutes([...dashboardRoutes, ...usersRoutes]);
}
```

---

## 🧰 Setup do Projeto

### Instalação

```bash
# Instalar dependências
npm install

# Rodar o projeto
npm run dev
```

### Estrutura esperada

```
.env
src/
  ├── components/
  ├── hooks/
  ├── providers/
  ├── services/
  ├── pages/
  ├── routes/
  └── lib/
```

---

## 👨‍💻 Exemplo de Fluxo Completo — Dashboard

1. **Service:** `dashboard.service.ts` → faz o fetch dos dados.
2. **Hook:** `useDashboardData.ts` → usa React Query para cachear.
3. **Componente:** `SummaryCard.tsx` → exibe os dados.
4. **Página:** `index.tsx` → organiza o layout e renderiza tudo.

---

## 🧱 Padrões de Nomeação

| Tipo de elemento        | Padrão        | Exemplo                     |
| ----------------------- | ------------- | --------------------------- |
| **Pastas**              | `kebab-case`  | `user-profile/`             |
| **Arquivos**            | `kebab-cas`   | `user-service.ts`            |
| **Variáveis**           | `camelCase`   | `userList`, `dashboardData` |
| **Componentes/Classes** | `PascalCase`  | `UserCard`, `DashboardPage` |
| **Constantes**          | `UPPER_SNAKE` | `DEFAULT_THEME`             |

