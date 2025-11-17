import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { leads } from '../../../lib/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, answers } = body;

    // Salva o lead no banco de dados Neon
    const newLead = await db.insert(leads).values({
      name,
      phone,
      answers,
    }).returning();

    console.log('Lead salvo no banco de dados:', newLead);

    return NextResponse.json({ message: 'Lead recebido com sucesso!', lead: newLead[0] }, { status: 201 });
  } catch (error) {
    console.error('Erro ao processar o lead:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}