# Guia Detalhado: Implementando Backup de Leads no Google Sheets com Next.js

Este guia descreve o caminho completo para criar um sistema de backup automático de leads, onde cada novo registro salvo no seu banco de dados principal também é adicionado a uma planilha do Google Sheets.

A lógica central reside em uma API Route do Next.js, que, após salvar o lead no banco de dados, chama a API do Google Sheets para registrar a mesma informação.

---

### **Passo 1: Configuração no Google Cloud (Pré-requisitos)**

Antes de escrever qualquer código, você precisa de credenciais para que sua aplicação possa se autenticar e obter permissão para escrever na sua planilha.

1.  **Crie um Projeto no Google Cloud:** Se ainda não tiver um, acesse o [Console do Google Cloud](https://console.cloud.google.com/) e crie um novo projeto.
2.  **Ative a API do Google Sheets:** No painel do seu projeto, vá para "APIs e Serviços" > "Biblioteca". Procure por **"Google Sheets API"** e clique em **"Ativar"**.
3.  **Crie uma Conta de Serviço (Service Account):** Esta é uma "identidade robô" para sua aplicação.
    *   Vá para "IAM e Administrador" > "Contas de Serviço".
    *   Clique em **"+ CRIAR CONTA DE SERVIÇO"**.
    *   Dê um nome (ex: `sheets-backup-service`) e clique em "CRIAR E CONTINUAR".
    *   Você pode pular a etapa de "Conceder acesso" e clicar em "CONCLUÍDO".
4.  **Gere uma Chave JSON:** É assim que sua aplicação fará o login.
    *   Na lista de contas de serviço, clique na que você acabou de criar.
    *   Vá para a aba **"CHAVES"**.
    *   Clique em "ADICIONAR CHAVE" > "Criar nova chave".
    *   Selecione o tipo **JSON** e clique em "CRIAR".
    *   Um arquivo `.json` será baixado. **Guarde-o em segurança.** Ele contém as duas informações mais importantes:
        *   `client_email`: O e-mail da sua conta de serviço.
        *   `private_key`: A chave secreta para autenticação.

---

### **Passo 2: Configuração da Planilha (Google Sheet)**

1.  **Crie uma Nova Planilha:** Acesse o [Google Sheets](https://sheets.new) e crie uma planilha em branco.
2.  **Compartilhe com a Conta de Serviço:**
    *   Clique no botão **"Partilhar"**.
    *   No campo de adicionar pessoas, cole o `client_email` que você copiou do arquivo JSON.
    *   Garanta que a permissão seja de **"Editor"**.
    *   Clique em "Enviar".
3.  **Copie o ID da Planilha:** Na URL da planilha, copie o ID.
    *   `https://docs.google.com/spreadsheets/d/`**`[ESTE_É_O_ID_DA_PLANILHA]`**`/edit`

---

### **Passo 3: Instalação e Variáveis de Ambiente**

1.  **Instale a Biblioteca do Google:** No terminal do seu projeto, rode:
    ```bash
    npm install googleapis
    ```
2.  **Configure as Variáveis de Ambiente:** Crie um arquivo `.env.local` na raiz do seu projeto e adicione as credenciais. É crucial para a segurança que essas chaves não fiquem expostas no código.

    ```.env.local
    # URL do seu banco de dados principal (se houver)
    DATABASE_URL="sua_url_do_banco_de_dados"

    # Credenciais para o Backup no Google Sheets
    GOOGLE_SHEET_ID="o_id_que_voce_copiou_da_url"
    GOOGLE_CLIENT_EMAIL="o_client_email_do_arquivo_json"
    GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nsua_chave_privada_aqui\n-----END PRIVATE KEY-----\n"
    ```
    **Atenção:** Cole a `private_key` exatamente como está no arquivo JSON, dentro das aspas duplas. O código que implementamos cuidará da formatação correta das quebras de linha.

---

### **Passo 4: O Código - A Lógica na API Route**

O coração da implementação está no arquivo `src/app/api/leads/route.ts`. Abaixo, o código está comentado para explicar cada parte.

```typescript
// src/app/api/leads/route.ts

import { NextResponse } from 'next/server';
import { db } from '../../../lib/db'; // Seu helper do banco de dados
import { leads } from '../../../lib/schema'; // Seu schema da tabela
import { google } from 'googleapis';

// Função para garantir que o cabeçalho exista na planilha
async function ensureHeader(sheets: any, spreadsheetId: string) {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'A1:E1', // Verifica a primeira linha
    });

    // Se a primeira linha estiver vazia, escreve o cabeçalho
    if (!res.data.values || res.data.values.length === 0) {
      const header = [['id', 'name', 'phone', 'answers', 'createdAt']];
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'A1',
        valueInputOption: 'RAW',
        requestBody: { values: header },
      });
    }
  } catch (error) {
    // Se a planilha estiver completamente vazia, a leitura pode falhar.
    // Nesse caso, assumimos que o cabeçalho não existe e o criamos.
    const header = [['id', 'name', 'phone', 'answers', 'createdAt']];
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'RAW',
      requestBody: { values: header },
    });
  }
}

// Função principal que envia os dados para a planilha
async function appendToSheet(lead: any) {
  try {
    // 1. Autenticação: Usa as credenciais do .env para se autenticar
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // O .replace é crucial para formatar a chave privada corretamente
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Define a permissão
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // 2. Garante que o cabeçalho exista antes de adicionar dados
    await ensureHeader(sheets, spreadsheetId!);

    // 3. Prepara os dados na ordem correta das colunas
    const values = [
      [
        lead.id,
        lead.name,
        lead.phone,
        JSON.stringify(lead.answers), // Converte o objeto de respostas em texto
        lead.createdAt,
      ],
    ];

    // 4. Envia os dados para a planilha
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A1', // Ao usar 'append', ele adiciona na próxima linha vazia
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });
  } catch (error) {
    console.error('Erro ao salvar lead no Google Sheets:', error);
    // Opcional: Adicionar um sistema de notificação de falha aqui
  }
}

// Função POST principal da API Route
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, answers } = body;

    // ETAPA PRINCIPAL: Salva o lead no banco de dados Neon
    const newLead = await db.insert(leads).values({
      name,
      phone,
      answers,
    }).returning();

    console.log('Lead salvo no banco de dados:', newLead[0]);

    // ETAPA DE BACKUP: Se o salvamento principal deu certo, envia para o Google Sheets
    if (newLead && newLead[0]) {
      await appendToSheet(newLead[0]);
    }

    return NextResponse.json({ message: 'Lead recebido com sucesso!', lead: newLead[0] }, { status: 201 });
  } catch (error) {
    console.error('Erro ao processar o lead:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
```

---

### **Passo 5: Deploy (Vercel)**

Para que isso funcione em produção, você precisa adicionar as mesmas variáveis de ambiente (`GOOGLE_SHEET_ID`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`) nas configurações do seu projeto no Vercel.

1.  Vá para o painel do seu projeto no Vercel.
2.  Clique em "Settings" > "Environment Variables".
3.  Adicione as três variáveis com os mesmos valores do seu arquivo `.env.local`.
