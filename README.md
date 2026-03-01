<div align="center">

<h1>🍅 PomoCube — Frontend</h1>
<h3>Interface Web do Ecossistema PomoCube</h3>

<p>Interface web responsiva e intuitiva para visualização de métricas, configuração de dispositivos e acompanhamento em tempo real do <strong>PomoCube IoT</strong></p>

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

<br/>

> 📊 Interface web responsiva e intuitiva para visualização de métricas, configuração de dispositivos e acompanhamento em tempo real do PomoCube.

</div>

---

## 📋 Sumário

- [Sobre](#-sobre)
- [Tecnologias](#-tecnologias)
- [Configuração do Ambiente](#-configuração-do-ambiente)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)

---

## 🎯 Sobre

O frontend do **PomoCube** é uma aplicação web construída com **Next.js** e **TypeScript**, projetada para ser a central de controle e visualização do ecossistema PomoCube IoT. Por meio dela, o usuário acompanha em tempo real suas sessões de estudo, analisa métricas de produtividade através de gráficos interativos e monitora o desempenho ao longo do tempo com um heatmap de atividades estilo GitHub.

---

## 🛠 Tecnologias

- [Next.js](https://nextjs.org/) — Framework React com SSR e roteamento integrado
- [TypeScript](https://www.typescriptlang.org/) — Tipagem estática
- [React](https://reactjs.org/) — Biblioteca de interfaces de usuário
- [Tailwind CSS](https://tailwindcss.com/) — Estilização utilitária

---

## ⚙️ Configuração do Ambiente

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- `npm`, `yarn`, `pnpm` ou `bun`

### 1. Clone o repositório

```bash
git clone https://github.com/ClarkAshida/pomodoro-web
cd pomodoro-web
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_FRONTEND_API_KEY=pomodoro-frontend-secret-key-2025
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em: **[http://localhost:3000](http://localhost:3000)**

---

## 🔧 Variáveis de Ambiente

Todas as variáveis expostas ao browser **devem** ser prefixadas com `NEXT_PUBLIC_`.

| Variável                      | Descrição                                          |
|-------------------------------|----------------------------------------------------|
| `NEXT_PUBLIC_API_BASE_URL`    | URL base da API (ex: `http://localhost:8080`)      |
| `NEXT_PUBLIC_FRONTEND_API_KEY`| Chave de autenticação para consumo da API          |

> ⚠️ Reinicie o servidor de desenvolvimento sempre que alterar o arquivo `.env.local`.

---

## 🚀 Build e Deploy

### Build para produção

```bash
npm run build
```

### Executar em modo produção localmente

```bash
npm run start
```

<div align="center">

Parte do ecossistema **PomoCube IoT** 🍅

</div>
