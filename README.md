# 📝 Quiz sobre Jejum Intermitente

Este projeto é uma aplicação web interativa em formato de quiz, desenvolvida para testar e educar os usuários sobre o tema do jejum intermitente. A aplicação foi construída com as mais modernas tecnologias web, focando em performance, escalabilidade e uma excelente experiência de usuário.

## ✨ Funcionalidades

- **Quiz Interativo:** Os usuários podem responder a uma série de perguntas de múltipla escolha com uma interface limpa e intuitiva.
- **Feedback Imediato:** O sistema valida a resposta do usuário em tempo real.
- **Pontuação Final:** Ao final do quiz, a pontuação total é exibida de forma clara.
- **Design Moderno e Responsivo:** A interface se adapta a qualquer tamanho de tela, construída com Tailwind CSS e shadcn/ui.
- **Emojis Visuais:** Cada pergunta é acompanhada de um emoji para tornar a experiência mais dinâmica e divertida.

## 🚀 Tecnologias em Detalhe

Este projeto utiliza um stack de tecnologias moderno e robusto para garantir a melhor performance e manutenibilidade.

- **Next.js:** Framework React escolhido por sua capacidade de renderização no lado do servidor (SSR) e geração de sites estáticos (SSG), o que garante um carregamento inicial rápido e ótimo SEO.
- **TypeScript:** Adiciona segurança e robustez ao código JavaScript através da tipagem estática, prevenindo erros comuns em tempo de desenvolvimento.
- **Neon:** Uma plataforma de banco de dados PostgreSQL *serverless* que oferece escalabilidade automática, custos otimizados e um generoso plano gratuito, ideal para projetos modernos.
- **Tailwind CSS:** Um framework CSS *utility-first* que permite a construção de designs customizados de forma rápida e eficiente, sem sair do HTML.
- **shadcn/ui:** Uma coleção de componentes de UI acessíveis e reutilizáveis que aceleram o desenvolvimento da interface, garantindo consistência visual e qualidade.
- **Vercel:** A plataforma de deploy oficial do Next.js, oferecendo uma integração perfeita, deploys automáticos via Git e uma infraestrutura global de alta performance.

## ⚙️ Como Funciona

A aplicação segue um fluxo de dados claro e eficiente:

1.  **Carregamento da Página:** Quando o usuário acessa a página, o componente principal em `src/app/page.tsx` é renderizado.
2.  **Busca de Dados:** O componente utiliza o hook `useEffect` para fazer uma requisição à API interna no endpoint `/api/quiz`.
3.  **API Endpoint:** A rota da API, localizada em `src/app/api/quiz/route.ts`, recebe a requisição, se conecta ao banco de dados Neon e busca todas as perguntas e suas respectivas respostas.
4.  **Renderização do Quiz:** Os dados retornados pela API são armazenados no estado do componente React usando `useState`. A aplicação então renderiza a primeira pergunta e suas opções de resposta.
5.  **Interação do Usuário:** O usuário seleciona uma resposta. A aplicação armazena a resposta selecionada e, ao clicar em "Responder", calcula a pontuação, avança para a próxima pergunta ou finaliza o quiz.
6.  **Fim do Quiz:** Ao responder todas as perguntas, a pontuação final é exibida e o usuário tem a opção de reiniciar o quiz.

## 📂 Estrutura do Projeto

A estrutura de pastas foi organizada para garantir a separação de responsabilidades e facilitar a manutenção.

```
/
├── .env.local          # Arquivo para variáveis de ambiente (não versionado)
├── next.config.mjs     # Configurações do Next.js
├── package.json        # Dependências e scripts do projeto
├── seed.mjs            # Script para popular o banco de dados com perguntas e respostas
├── src/
│   ├── app/
│   │   ├── api/quiz/
│   │   │   └── route.ts    # Rota da API que busca os dados do quiz no banco de dados
│   │   ├── globals.css   # Estilos globais da aplicação
│   │   ├── layout.tsx    # Layout principal que envolve todas as páginas
│   │   └── page.tsx      # Componente da página inicial que contém toda a lógica do quiz
│   ├── components/ui/    # Componentes de UI reutilizáveis (gerados pelo shadcn/ui)
│   └── lib/
│       ├── db.ts         # Configuração da conexão com o banco de dados Neon
│       ├── placeholder-data.mjs # Dados brutos (perguntas/respostas) para o script de seed
│       └── utils.ts      # Funções utilitárias (ex: cn para classes do Tailwind)
└── tsconfig.json       # Configurações do TypeScript
```

## 🛠️ Executando Localmente

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DO_DIRETORIO>
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure o Banco de Dados:**
    - Crie uma conta gratuita no [Neon](https://neon.tech/).
    - Crie um novo projeto e obtenha a string de conexão do seu banco de dados PostgreSQL.
    - Crie um arquivo `.env.local` na raiz do projeto e adicione sua string de conexão:
      ```
      DATABASE_URL="<SUA_STRING_DE_CONEXAO_DO_NEON>"
      ```

4.  **Popule o Banco de Dados:**
    Execute o script de *seed* para criar as tabelas e inserir as perguntas e respostas iniciais.
    ```bash
    node seed.mjs
    ```
    *Nota: Este comando usa `node` diretamente. Se preferir, adicione `"db:seed": "node seed.mjs"` aos scripts do seu `package.json`.*

5.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

6.  Abra [http://localhost:3000](http://localhost:3000) (ou a porta indicada no terminal) em seu navegador para ver o resultado.

## 📜 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento em modo de observação.
- `npm run build`: Gera a build de produção otimizada da aplicação.
- `npm run start`: Inicia um servidor de produção a partir da build gerada.
- `npm run lint`: Executa o linter (ESLint) para analisar o código em busca de problemas.

## 🤝 Contribuição

Contribuições são bem-vindas! Se você tem alguma ideia para melhorar o projeto, siga os passos:

1.  Faça um *fork* do projeto.
2.  Crie uma nova *branch* (`git checkout -b feature/nova-funcionalidade`).
3.  Faça suas alterações e *commits* (`git commit -m 'Adiciona nova funcionalidade'`).
4.  Faça o *push* para a *branch* (`git push origin feature/nova-funcionalidade`).
5.  Abra um *Pull Request*.

## 📄 Licença

Este projeto está sob a licença MIT.