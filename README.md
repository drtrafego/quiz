# Funil de Quiz Interativo para Qualificação de Leads

## 1. Visão e Objetivo do Projeto

Este projeto tem como objetivo principal desenvolver um **funil de quiz interativo** de alta performance, inspirado na abordagem e no design da plataforma `inlead.digital`. O foco não é apenas criar um quiz, mas sim uma ferramenta estratégica de marketing para **qualificar leads**, guiando o usuário por uma jornada envolvente que culmina na captura de seus dados de contato.

Nossa meta é transformar o tráfego em leads qualificados, oferecendo uma experiência de usuário fluida, visualmente rica e otimizada para a conversão.

## 2. Inspiração de Layout: inlead.digital

Nossa referência de design e experiência do usuário é o `inlead.digital`. Isso se traduz nos seguintes princípios de layout:

-   **Design Limpo e Moderno:** Uma interface sem distrações, com foco total na pergunta e nas opções de resposta.
-   **Layout em Cartão Centrado:** O quiz será apresentado em um componente de cartão no centro da tela, criando um ponto focal claro.
-   **Visualmente Rico:** Cada pergunta será acompanhada por uma imagem de alta qualidade que adiciona contexto e apelo visual.
-   **Experiência Fluida:** Transições suaves entre as perguntas e uma barra de progresso clara para manter o usuário engajado e ciente de sua posição no funil.

## 3. Plano de Desenvolvimento

O projeto será executado em fases claras e sequenciais para garantir organização e foco.

-   **Fase 1: Documentação e Visão (Concluída)**
    -   Reescrita do `README.md` para servir como a documentação central do projeto, detalhando a visão, o plano e a inspiração.

-   **Fase 2: Estrutura de Dados e Interface (UI/UX)**
    -   **Estrutura de Dados:** Redefinir a estrutura de dados em `src/lib/placeholder-data.mjs` para suportar um quiz visual, com campos para `id`, `text`, `image_url` e `answers`.
    -   **Desenvolvimento da Interface:** Construir a interface do quiz (`page.tsx`) com base nos princípios de design do `inlead.digital`.

-   **Fase 3: Captura de Leads**
    -   **Formulário de Captura:** Implementar um formulário ao final do quiz para capturar o nome e o telefone do usuário.
    -   **API de Leads:** Criar um endpoint de API (`/api/leads`) para receber e, futuramente, armazenar os dados do formulário.

-   **Fase 4: Banco de Dados e Finalização**
    -   **Script de Banco de Dados:** Atualizar o `seed.mjs` para popular o banco de dados com as perguntas do quiz.
    -   **Integração:** Conectar a API do quiz ao banco de dados para buscar as perguntas dinamicamente.

## 4. Estrutura do Projeto e Tecnologias

-   **Next.js:** Framework React para renderização no lado do servidor.
-   **TypeScript:** Para um código mais robusto e seguro.
-   **Tailwind CSS:** Para estilização rápida e customizável.
-   **Vercel/Postgres:** Para o banco de dados.

## 5. Como Executar Localmente

1.  **Clone o repositório.**
2.  **Instale as dependências:** `npm install`
3.  **Configure as variáveis de ambiente:** Crie um arquivo `.env.local` e adicione sua `DATABASE_URL`.
4.  **Popule o banco de dados (quando aplicável):** `node seed.mjs`
5.  **Inicie o servidor:** `npm run dev`