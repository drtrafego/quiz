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

## 3. Plano de Desenvolvimento e Funcionalidades Implementadas

O projeto foi executado em fases, resultando nas seguintes funcionalidades:

-   **Fase 1: Documentação e Visão (Concluída)**
    -   Criação do `README.md` para servir como a documentação central do projeto.

-   **Fase 2: Estrutura de Dados e Interface (Concluída)**
    -   **Estrutura de Dados:** Definição da estrutura de dados em `src/lib/placeholder-data.mjs` para suportar um quiz visual, com campos para `id`, `text`, `image_url` e `answers`.
    -   **Desenvolvimento da Interface:** Construção da interface do quiz (`page.tsx`) com base nos princípios de design do `inlead.digital`.
    -   **Ajustes de Layout e Imagens:** O conteúdo visual do quiz foi refinado para alinhar com o documento de referência `Quiz - Modelo`, garantindo que as imagens e textos corretos fossem exibidos em cada etapa.

-   **Fase 3: Captura de Leads e Armazenamento (Concluída)**
    -   **Formulário de Captura:** Implementação de um formulário ao final do quiz para capturar o nome e o telefone do usuário.
    -   **API de Leads:** Criação de um endpoint de API (`/api/leads/route.ts`) para receber os dados do formulário.
    -   **Banco de Dados Principal:** Integração com um banco de dados **Neon (Postgres)** para armazenamento primário dos leads. Os dados são salvos na tabela `leads` com as colunas: `id`, `name`, `phone`, `answers`, e `createdAt`.

-   **Fase 4: Sistema de Backup de Leads (Concluída)**
    -   **Integração com Google Sheets:** Para garantir a redundância e a segurança dos dados, foi implementado um sistema de backup automático.
    -   **Funcionamento:** Após um lead ser salvo com sucesso no banco de dados Neon, a aplicação envia uma cópia dos mesmos dados para uma planilha pré-configurada no Google Sheets. O caminho da implementação está em `src/app/api/leads/route.ts`.
    -   **Estrutura:** A planilha é automaticamente organizada com os cabeçalhos `id`, `name`, `phone`, `answers`, `createdAt` para manter a consistência com o banco de dados.

## 4. Estrutura do Projeto e Tecnologias

-   **Next.js:** Framework React para renderização no lado do servidor.
-   **TypeScript:** Para um código mais robusto e seguro.
-   **Tailwind CSS:** Para estilização rápida e customizável.
-   **Neon / Vercel Postgres:** Para o banco de dados principal.
-   **Google Sheets API:** Para o sistema de backup de leads.

## 5. Como Executar Localmente

1.  **Clone o repositório.**
2.  **Instale as dependências:** `npm install`
3.  **Configure as variáveis de ambiente:** Crie um arquivo `.env.local` na raiz do projeto e adicione as seguintes variáveis:

    ```
    # URL de conexão com o banco de dados Neon/Postgres
    DATABASE_URL="sua_url_do_banco_de_dados"

    # Credenciais para o Backup no Google Sheets
    GOOGLE_SHEET_ID="id_da_sua_planilha"
    GOOGLE_CLIENT_EMAIL="email_da_sua_conta_de_serviço_google"
    GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nsua_chave_privada\n-----END PRIVATE KEY-----\n"
    ```

4.  **Popule o banco de dados (se necessário):** `npm run seed` (Este comando pode variar dependendo da configuração do projeto).
5.  **Inicie o servidor:** `npm run dev`
