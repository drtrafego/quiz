import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { leads } from '../../../lib/schema';
import { google } from 'googleapis';

// Função para garantir que o cabeçalho exista na planilha
async function ensureHeader(sheets: any, spreadsheetId: string) {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'A1:E1',
    });

    if (!res.data.values || res.data.values.length === 0) {
      // Se não houver cabeçalho, adiciona um
      const header = [['id', 'name', 'phone', 'answers', 'createdAt']];
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'A1',
        valueInputOption: 'RAW',
        requestBody: {
          values: header,
        },
      });
    }
  } catch (error) {
    // Se a planilha estiver vazia, um erro pode ser lançado. Podemos ignorar e prosseguir para adicionar o cabeçalho.
    const header = [['id', 'name', 'phone', 'answers', 'createdAt']];
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'A1',
        valueInputOption: 'RAW',
        requestBody: {
          values: header,
        },
      });
  }
}

async function appendToSheet(lead: any) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Garante que o cabeçalho exista
    await ensureHeader(sheets, spreadsheetId!);

    const range = 'A1'; // Sempre apenda na próxima linha vazia

    const values = [
      [
        lead.id,
        lead.name,
        lead.phone,
        JSON.stringify(lead.answers),
        lead.createdAt,
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });
  } catch (error) {
    console.error('Erro ao salvar lead no Google Sheets:', error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, answers } = body;

    // 1. Salva o lead no banco de dados Neon (principal)
    const newLead = await db.insert(leads).values({
      name,
      phone,
      answers,
    }).returning();

    console.log('Lead salvo no banco de dados:', newLead[0]);

    // 2. Salva o lead no Google Sheets (backup)
    if (newLead && newLead[0]) {
      await appendToSheet(newLead[0]);
    }

    return NextResponse.json({ message: 'Lead recebido com sucesso!', lead: newLead[0] }, { status: 201 });
  } catch (error) {
    console.error('Erro ao processar o lead:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}